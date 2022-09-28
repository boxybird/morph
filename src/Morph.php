<?php

namespace BoxyBird\Morph;

class Morph
{
    public function __construct()
    {
        add_action('init', [$this, 'registerApiEndpoint']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('template_redirect', [$this, 'handleAjaxComponentRequest']);
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

        wp_enqueue_script('morph', get_stylesheet_directory_uri() . '/vendor/boxybird/morph/dist/morph.js', [], $version, true);

        wp_localize_script('morph', 'MORPH', [
            'base_url' => '/morph/api/v1/component/',
            'nonce'    => wp_create_nonce('morph_ajax_nonce'),
        ]);
    }

    public function handleAjaxComponentRequest()
    {
        // Check if the request is for a Morph component
        if (empty($_SERVER['HTTP_X_MORPH_REQUEST'])) {
            return;
        }
    
        // Check if the request is for a valid component
        $component_name = get_query_var('morph_component_name');

        if (empty($component_name)) {
            header('HTTP/1.1 500 Morph component error'); // BBTODO - can I send headers this late?
            exit;
        }

        // Check if the request is for a valid nonce
        if (!wp_verify_nonce($_SERVER['HTTP_X_MORPH_NONCE'] ?? null, 'morph_ajax_nonce')) {
            header('HTTP/1.1 500 Morph component error');
            exit;
        }

        morph_component($component_name);
        exit;
    }
}

new Morph;
