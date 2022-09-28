<?php

/**
 * Plugin Name:       Morph
 * Plugin URI:        #
 * Description:       A plugin for building WordPress components with Alpine.js.
 * Version:           0.0.1
 * Author:            Andrew Rhyand
 * Author URI:        andrewrhyand.com
 * License:           MIT
 * Text Domain:       morph
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

/**
 * Define constants.
 */
define('BB_MORPH_VERSION', '0.0.1');

/**
 * Setup plugin.
 */
require_once __DIR__ . '/src/setup.php';
