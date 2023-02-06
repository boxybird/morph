<?php

use BoxyBird\Morph\AcfBlockMeta;
use BoxyBird\Morph\MorphComponent;
use Symfony\Component\HttpFoundation\Request;

if (!function_exists('morph_component')) {
    function morph_component(string $component_name, array $attributes = [], array $initial_data = []): void
    {
        $morph_component = new MorphComponent(str_replace('.', '/', $component_name), $attributes, $initial_data);
        
        $morph_request = Request::createFromGlobals();
        
        $attributes_output = [];
        
        foreach ($morph_component->attributes as $key => $value) {
            $attributes_output[] = $key . '="' . $value . '"';
        }
        
        AcfBlockMeta::setup($initial_data['acf_block_id'] ?? '');
        ?>
        <div
            <?= implode(' ', $attributes_output); ?>
            data-wpmorph-component-hash="<?= $morph_component->hash; ?>"
            data-wpmorph-component-name="<?= $morph_component->name; ?>">
            <?php

            // Safety measure to prevent user from overriding variables...
            unset($initial_data['morph_component']);
            unset($initial_data['morph_request']);

            //...during the extraction of the $initial_data.
            extract($initial_data);

            $morph_files = $morph_request->files->all();
            $morph_post = $morph_request->request->all();
                                                                                    
            require $morph_component->path;

            AcfBlockMeta::reset($initial_data['acf_block_id'] ?? '');
            ?>
        </div>
        <?php
    }
}
