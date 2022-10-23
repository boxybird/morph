<?php

use Illuminate\Encryption\Encrypter;
use Symfony\Component\HttpFoundation\Request;

if (!function_exists('morph_component')) {
    function morph_component(string $component_name, array $initial_data = []): void
    {
        $base_path = apply_filters('morph/component/path', get_template_directory() . '/morph/components/');
        
        $component_path = $base_path . $component_name . '.php';

        if (!file_exists($component_path)) {
            throw new Exception('Morph component not found: ' . $component_path);
        }

        $hash = (new Encrypter(BB_MORPH_HASH_KEY))->encrypt([
            'initial_data'    => $initial_data,
            'morph_data'      => [
                'current_post_id' => get_the_ID(),
                'nonce'           => wp_create_nonce('morph_ajax_nonce'),
            ]
        ]);

        $morph_request = Request::createFromGlobals();
        $morph_files = $morph_request->files->all();
        $morph_post = $morph_request->request->all();

        // Prepare the component data if wpMorphEvent is set
        $morph_event = [];
        if (isset($morph_post['wpMorphEvent']) && $morph_post['wpMorphEvent'] === 'true') {
            $morph_event = [
                'component' => $morph_post['componentName'],
                'data'      => $morph_post['data'],
            ];

            unset($morph_post['wpMorphEvent']);
            unset($morph_post['componentName']);
            unset($morph_post['data']);
        }
        ?>
        <div 
            data-wpmorph-component-hash="<?= $hash; ?>"
            data-wpmorph-component-name="<?= $component_name; ?>">
            <?php require $component_path; ?>
        </div>
        <?php
    }
}
