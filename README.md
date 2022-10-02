# Morph

A plugin for building Laravel Livewire inspired WordPress components with Alpine.js.

## Installation

Install the package via composer.

```
cd wp-content/themes/your-theme
```

```
composer require boxybird/morph
```
> Location: /themes/your-theme/functions.php

```php
require_once __DIR__ . '/vendor/autoload.php';
```
> Location: /wp-admin/options-permalink.php

Visit and refresh permalinks by clicking **"Save Changes"** button

## Live Examples

https://wp-morph.andrewrhyand.com/

## Example Counter

> Location: /themes/your-theme/index.php

```php
<?php get_header(); ?>

    <?php morph_component('counter'); ?>

<?php get_footer(); ?>
```

> Location: /themes/your-theme/morph/components/counter.php

```php
<?php

/** @var $morph_data */

$count = (int) get_option('count', 0);

if ($morph_data['increment'] ?? false) {
    $count++;

    update_option('count', $count);
}

if ($count >= 10) {
    delete_option('count');   
}
?>

<div x-data>
    <span><?= $count; ?></span>
    <button x-on:click="$morph('increment')">Increment</button>
</div>
```
