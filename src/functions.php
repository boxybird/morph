<?php

use BoxyBird\Morph\MorphComponent;

if (!function_exists('morph_component')) {
    function morph_component(string $component_name, array $initial_data = []): void
    {
        $component = new MorphComponent($component_name, $initial_data);

        $morph_request = $component->request;
        $morph_files = $component->request->files->all();
        $morph_post = $component->request->request->all();
        $morph_event = $component->event;
        ?>
        <div 
            data-wpmorph-component-hash="<?= $component->hash; ?>"
            data-wpmorph-component-name="<?= $component->name; ?>">
            <?php require $component->path; ?>
        </div>
        <?php
    }
}
