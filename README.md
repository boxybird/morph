# Morph

A WordPress theme package for building Laravel Livewire inspired WordPress components with Alpine.js.

## Installation

Install the package via composer.

```
cd wp-content/themes/your-theme
```

```
composer require boxybird/morph
```
> Location: /wp-config.php

```php
define('BB_MORPH_HASH_KEY', 'SOME_RANDOM_16_CHARACTER_STRING');
```

> Location: /themes/your-theme/functions.php

```php
require_once __DIR__ . '/vendor/autoload.php';
```

> Location: /wp-admin/options-permalink.php

Visit and refresh permalinks by clicking **"Save Changes"** button

## Important

By default, this plugin pre-bundles Alpine. If you site already has Alpine installed, you should dequeue this plugins version to avoid conflicts.

**Note:** A minimum version of Alpine 3.10.0 is required. 

> Location: /themes/your-theme/functions.php

```php
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_script('bb-alpine');
});
```

## Live Examples

https://wp-morph.andrewrhyand.com/

## Hooks

```php
$wpMorph({ ... },  {
    onStart: () => {},
    onResponse: res => {},
    onSuccess: data => {},
    onError: error => {},
    onFinish: () => {},
})
```

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
    <button x-on:click="$wpMorph('increment')">Increment</button>
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

$images = array_map(function ($image) {
    $image->move(wp_upload_dir()['path'], $image->getClientOriginalName());
    
    return wp_upload_dir()['url'] . '/' . $image->getClientOriginalName();
}, $morph_files['images'] ?? []);
?>

<div x-data="{ images: [] }">
    <input type="file" multiple x-on:change="images = $el.files">        
    <button x-on:click="$wpMorph({ images })">Upload</button>

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
        x-on:keydown.enter="$wpMorph({ todo }, {
            onSuccess: () => todo = '',
        })">
        
    <button 
        x-on:click="$wpMorph({ todo }, {
            onSuccess: () => todo = '',
        })"
    >Add</button>

    <ul>
        <?php foreach ($todos as $todo) : ?>
            <li><?= esc_html($todo); ?></li>
        <?php endforeach; ?>
    </ul>
</div>
```

## Example Event/Listener

> Location: /themes/your-theme/index.php

```php
<?php get_header(); ?>

    <?php morph_component('event'); ?>

    <?php morph_component('listener'); ?>

<?php get_footer(); ?>
```

> Location: /themes/your-theme/morph/components/event.php

```php
<div x-data>
    <button x-on:click="$dispatch('notify', 'A notification from the event.php component.')"
    >Dispatch Event</button>
</div>
```

> Location: /themes/your-theme/morph/components/listener.php

```php
<?php

$notification = $morph_post['notification'] ?? null;
?>

<div x-data x-on:notify.window="$wpMorph({ notification: $event.detail })">
    <p><?= $notification; ?></p>
</div>
```

## Example Global Listener

> Location: /themes/your-theme/some-js-file.js

```js
document.addEventListener('notify', function ({ detail }) {
    console.log(detail) // A notification from the event.php component.
});
```
