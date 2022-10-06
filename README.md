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

/** @var $morph_post */

$count = (int) get_option('count', 0);

if ($morph_post['increment'] ?? false) {
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

## Example Upload

> Location: /themes/your-theme/index.php

```php
<?php get_header(); ?>

    <?php morph_component('upload'); ?>

<?php get_footer(); ?>
```

> Location: /themes/your-theme/morph/components/upload.php

```php
<?php

/** @var Symfony\Component\HttpFoundation\File\UploadedFile $morph_files */

$images = [];

foreach ($morph_files['images'] ?? [] as $image) {
    $image->move(wp_upload_dir()['path'], $image->getClientOriginalName());
    $images[] = wp_upload_dir()['url'] . '/' . $image->getClientOriginalName();
}
?>

<div x-data="{ images: [] }">
    <input type="file" multiple x-on:change="images = $el.files">        
    <button x-on:click="$morph({ images })">Upload</button>

    <?php foreach ($images as $image): ?>
        <img src="<?= $image; ?>">
    <?php endforeach; ?>
</div>
```

## Example Todos

> Location: /themes/your-theme/index.php

```php
<?php get_header(); ?>

    <?php morph_component('todos'); ?>

<?php get_footer(); ?>
```

> Location: /themes/your-theme/morph/components/todos.php

```php
<?php

/** @var $morph_post */

$todos = get_option('todos', []);

if ($todo = $morph_post['todo'] ?? false) {
    $todos[] = $todo;

    update_option('todos', $todos);
}

if (count($todos) >= 5) {
   delete_option('todos');   
}
?>

<div x-data="{ todo: '' }">
    <input  
        type="text" 
        x-model="todo" 
        x-on:keydown.enter="$morph({ todo }, () => todo = '')">
        
    <button x-on:click="$morph({ todo }, () => todo = '')">Add</button>

    <ul>
        <?php foreach ($todos as $todo) : ?>
            <li><?= esc_html($todo); ?></li>
        <?php endforeach; ?>
    </ul>
</div>
```
