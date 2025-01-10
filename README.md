# Morph

A WordPress theme package for building Laravel Livewire inspired WordPress components with Alpine.js.

## Demos

https://wp-morph.andrewrhyand.com/

## Demos Theme

https://github.com/boxybird/morph-example-theme

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

> Location: /your-theme/functions.php

```php
require_once __DIR__ . '/vendor/autoload.php';
```

> Location: /wp-admin/options-permalink.php

Visit and refresh permalinks by clicking **"Save Changes"** button

## Important

By default, this package pre-bundles Alpine. If you site already has Alpine installed, you should dequeue this packages version to avoid conflicts.

**Note:** A minimum version of Alpine 3.11.0 is required. 

> Location: /your-theme/functions.php

```php
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_script('bb-alpine');
});
```

## Hooks

```JS
$wpMorph({ ... },  {
    onStart: () => {},
    onResponse: res => {},
    onSuccess: data => {},
    onError: error => {},
    onFinish: () => {},
})
```

By default, the `morph_component('example');` function will look for a matching file of name you passed in. E.g. `/your-theme/morph/components/example.php`.

You can override this root folder path by using the `morph/component/path` filter.

```php
add_filter('morph/component/path', function ($path) {
    $path = get_template_directory() . '/custom-folder/';
    
    return $path;
});
```

## Example Counters

> Location: /your-theme/index.php

```php
<?php get_header(); ?>

    <?php morph_component('counter.class'); ?>

    <?php morph_component('counter.procedural'); ?>

<?php get_footer(); ?>
```

> Location: /your-theme/morph/components/counter/class.php

```php
<?php

// Class

[$count] = morph_render(new class {
    public $count;

    public function __construct()
    {
        $this->count = (int) get_option('count', 0);
    }

    public function increment()
    {
        update_option('count', ++$this->count);
    }
});
?>

<div x-data>
    <span><?= $count; ?></span>
    <button x-on:click="$wpMorph('increment')">Increment</button>
</div>
```

> Location: /your-theme/morph/components/counter/procedural.php

```php
<?php

// Procedural

$count = (int) get_option('count', 0);

if ($_POST['increment'] ?? false) {
    update_option('count', ++$count);
}
?>

<div x-data>
    <span><?= $count; ?></span>
    <button x-on:click="$wpMorph('increment')">Increment</button>
</div>
```

## Example Event/Listener

> Location: /your-theme/index.php

```php
<?php get_header(); ?>

    <?php morph_component('event'); ?>

    <?php morph_component('listener'); ?>

<?php get_footer(); ?>
```

> Location: /your-theme/morph/components/event.php

```php
<div x-data>
    <button x-on:click="$dispatch('notify', 'A notification from the event.php component.')"
    >Dispatch Event</button>
</div>
```

> Location: /your-theme/morph/components/listener.php

```php
<?php

$notification = $_POST['notification'] ?? null;
?>

<div x-data x-on:notify.window="$wpMorph({ notification: $event.detail })">
    <p><?= $notification; ?></p>
</div>
```

## Example Global Listener

> Location: /your-theme/some-js-file.js

```js
document.addEventListener('notify', function ({ detail }) {
    console.log(detail) // A notification from the event.php component.
});
```

## More Examples

https://github.com/boxybird/morph-example-theme/tree/master/resources/components
