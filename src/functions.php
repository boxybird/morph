<?php

use BoxyBird\Morph\MorphComponent;

if (!function_exists('morph_component')) {
    function morph_component(string $component_name, array $attributes = [], array $initial_data = []): void
    {
        $morph_component = new MorphComponent(str_replace('.', '/', $component_name), $attributes, $initial_data);

        $attributes_output = [];

        foreach ($attributes as $key => $value) {
            $attributes_output[] = esc_attr($key) . '="' . esc_attr($value) . '"';
        }
        ?>
        <div
            <?= implode(' ', $attributes_output); ?>
            data-wpmorph-component-hash="<?= $morph_component->hash; ?>"
            data-wpmorph-component-name="<?= $morph_component->name; ?>">
            <?php

            unset($initial_data['morph_component']);

            extract($initial_data);

            $morph_request = $morph_component->request;
            $morph_files = $morph_component->request->files->all();
            $morph_post = $morph_component->request->request->all();
                            
            require $morph_component->path;
            ?>
        </div>
        <?php
    }
}
