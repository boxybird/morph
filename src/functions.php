<?php

use BoxyBird\Morph\MorphComponent;

if (!function_exists('morph_component')) {
    function morph_component(string $component_name, array $initial_data = [], array $attributes = []): void
    {
        $component = new MorphComponent($component_name, $initial_data, $attributes);

        $morph_request = $component->request;
        $morph_files = $component->request->files->all();
        $morph_post = $component->request->request->all();
        $morph_event = $component->event;

        $attributes_output = [];

        foreach ($attributes as $key => $value) {
            $attributes_output[] = esc_attr($key) . '="' . esc_attr($value) . '"';
        }
        ?>
        <div
            <?= implode(' ', $attributes_output); ?>
            data-wpmorph-component-hash="<?= $component->hash; ?>"
            data-wpmorph-component-name="<?= $component->name; ?>">
            <?php require $component->path; ?>
        </div>
        <?php
    }
}
