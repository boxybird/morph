<?php

if (!function_exists('morph_component')) {
    function morph_component(string $component_name): void
    {
        $base_path = apply_filters('morph/component/path', get_template_directory() . '/morph/components/');
        
        $component_path = $base_path . $component_name . '.php';

        if (!file_exists($component_path)) {
            throw new Exception('Morph component not found: ' . $component_path);
        }

        $morph_data = json_decode(file_get_contents('php://input'), true);
        ?>
        <div data-component-name="<?= $component_name; ?>">
            <?php require $component_path; ?>
        </div>
        <?php
    }
}
