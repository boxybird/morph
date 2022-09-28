<?php

/**
 * If composer autoloader is available, bootstrap framework.
 * Otherwise, display error messages.
 */
if (file_exists(BB_MORPH_PATH . '/vendor/autoload.php')) {
    require_once BB_MORPH_PATH . '/vendor/autoload.php';

    new BoxyBird\Morph\Morph;
} else {
    $message = 'Morph plugin requires to you run "composer install" first.';

    add_action('admin_notices', function () use ($message) {
        ?>
            <div class="notice notice-error">
                <p><?= $message; ?></p>
            </div>
        <?php
    });

    if (!is_admin()) {
        die($message);
    }
}
