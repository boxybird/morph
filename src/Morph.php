<?php

namespace BoxyBird\Morph;

class Morph
{
    public function __construct()
    {
        add_action('init', [$this, 'registerApiEndpoint']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        
        if ($this->isMorphRequest()) {
            add_action('send_headers', [$this, 'handleHeaders']);
            add_action('template_redirect', [$this, 'handleAjaxComponentRequest']);
        }
    }

    public function handleHeaders($wp)
    {
        // BBTODO: Are the below checks enough security?

        // Check if the request is for a valid component
        $component_name = $wp->query_vars['morph_component_name'] ?? null;
        if (empty($component_name) || !is_string($component_name)) {
            header('HTTP/1.1 500 Morph component error');
            exit;
        }

        // Check if the request has a valid nonce
        if (!wp_verify_nonce($_SERVER['HTTP_X_MORPH_NONCE'] ?? null, 'morph_ajax_nonce')) {
            header('HTTP/1.1 500 Morph component error');
            exit;
        }
    }

    public function registerApiEndpoint(): void
    {
        // BBTODO - Find best way to flush rewrite rules on composer install
        add_rewrite_tag('%morph_component_name%', '([a-zA-Z-]+)');
        add_rewrite_rule('morph/api/v1/component/([a-zA-Z-]+)$', 'index.php?morph_component_name=$matches[1]', 'top');
    }

    public function enqueueScripts()
    {
        $version = md5(file_get_contents(__DIR__ . '/../dist/mix-manifest.json'));
       
        // Working locally...// BBTODO - Find best way to handle this
        // wp_enqueue_script('bb-morph', get_stylesheet_directory_uri() . '/packages/BoxyBird/Morph/dist/morph.js', [], $version, true);
        // wp_enqueue_script('bb-alpine', get_stylesheet_directory_uri() . '/packages/BoxyBird/Morph/dist/alpine.js', ['bb-morph'], $version, true);

        // Pushing to production...
        wp_enqueue_script('bb-morph', get_stylesheet_directory_uri() . '/vendor/boxybird/morph/dist/morph.js', [], $version, true);
        wp_enqueue_script('bb-alpine', get_stylesheet_directory_uri() . '/vendor/boxybird/morph/dist/alpine.js', ['bb-morph'], $version, true);

        wp_localize_script('bb-morph', 'BB_MORPH', [
            'base_url' => '/morph/api/v1/component/',
            'nonce'    => wp_create_nonce('morph_ajax_nonce'),
        ]);
    }

    public function handleAjaxComponentRequest()
    {
        morph_component(get_query_var('morph_component_name'));
        exit;
    }

    protected function isMorphRequest()
    {
        return !empty($_SERVER['HTTP_X_MORPH_REQUEST']);
    }
}

new Morph;
