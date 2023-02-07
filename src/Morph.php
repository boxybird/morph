<?php

namespace BoxyBird\Morph;

use Exception;
use Illuminate\Encryption\Encrypter;
use Symfony\Component\HttpFoundation\Request;

class Morph
{
    private Request $request;

    private Encrypter $encrypter;
 
    private array $hash_data = [];

    public function __construct()
    {
        $this->setRequest();
        
        add_action('init', [$this, 'registerApiEndpoint']);
        add_action('wp_enqueue_editor', [$this, 'enqueueEditor']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        
        if ($this->isMorphRequest()) {
            $this->setEncrypter();

            add_action('send_headers', [$this, 'handleHeaders']);
            add_action('template_redirect', [$this, 'handleAjaxComponentRequest']);
        }
    }

    private function setRequest(): void
    {
        $this->request = Request::createFromGlobals();
    }

    private function setEncrypter()
    {
        if (!defined('BB_MORPH_HASH_KEY')) {
            throw new Exception(
                __CLASS__ . ' cannot find constant BB_MORPH_HASH_KEY. Must be set in wp-config.php as 16 character random string.'
            );
        }

        $this->encrypter = new Encrypter(BB_MORPH_HASH_KEY);
    }

    private function isMorphRequest()
    {
        return !empty($this->request->headers->get('x-morph-request'));
    }

    public function handleHeaders($wp)
    {
        // Attempt to decrypt hash
        try {
            $this->hash_data = $this->encrypter->decrypt($this->request->headers->get('x-morph-hash') ?? null);
        } catch (Exception $e) {
            header('HTTP/1.1 403 Morph component error');
            exit;
        }

        // Check if the request has a valid nonce.
        $nonce = 'morph_ajax_nonce_' . $this->hash_data['morph_data']['current_post_id'];
        if (!wp_verify_nonce($this->hash_data['morph_data']['nonce'] ?? null, $nonce)) {
            header('HTTP/1.1 403 Morph component error');
            exit;
        }

        // All good, send the OK header.
        header('HTTP/1.1 200 OK');
    }

    public function registerApiEndpoint(): void
    {
        // BBTODO - Find best way to flush rewrite rules on composer install
        add_rewrite_rule('morph/api/v1/morph$', 'index.php', 'top');
    }

    public function enqueueEditor(): void
    {
        $version = md5(file_get_contents(__DIR__ . '/../dist/mix-manifest.json'));

        // BBTODO - Find best way to handle this
        if (defined('BB_MORPH_DEV') && BB_MORPH_DEV) {
            // Working locally...
            wp_enqueue_style('bb-morph-editor', get_stylesheet_directory_uri() . '/packages/BoxyBird/Morph/dist/editor.css', [], $version);
        } else {
            // Pushing to production...
            wp_enqueue_style('bb-morph-editor', get_stylesheet_directory_uri() . '/vendor/boxybird/morph/dist/editor.css', [], $version);
        }
    }

    public function enqueueScripts()
    {
        $version = md5(file_get_contents(__DIR__ . '/../dist/mix-manifest.json'));

        // BBTODO - Find best way to handle this
        if (defined('BB_MORPH_DEV') && BB_MORPH_DEV) {
            // Working locally...
            wp_enqueue_script('bb-morph-init', get_stylesheet_directory_uri() . '/packages/BoxyBird/Morph/dist/init.js', [], $version, true);
            wp_enqueue_script('bb-alpine', get_stylesheet_directory_uri() . '/packages/BoxyBird/Morph/dist/alpine.js', ['bb-morph-init'], $version, true);
        } else {
            // Pushing to production...
            wp_enqueue_script('bb-morph-init', get_stylesheet_directory_uri() . '/vendor/boxybird/morph/dist/init.js', [], $version, true);
            wp_enqueue_script('bb-alpine', get_stylesheet_directory_uri() . '/vendor/boxybird/morph/dist/alpine.js', ['bb-morph-init'], $version, true);
        }
    }

    public function handleAjaxComponentRequest()
    {
        global $post;

        // Set the global $post to the $post that the component is being loaded on.
        // Normally this info in lost when the component is rendered via AJAX.
        $post = get_post((int) $this->hash_data['morph_data']['current_post_id']);

        // Same as above, but for $wp_query->setup_postdata( $post )
        setup_postdata($post);

        morph_component(
            $this->hash_data['morph_data']['component_name'],
            $this->hash_data['attributes'],
            $this->hash_data['initial_data'],
        );

        // Reset the global $post and $wp_query
        wp_reset_postdata();
        exit;
    }
}

new Morph;
