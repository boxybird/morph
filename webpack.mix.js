let mix = require('laravel-mix')

mix
  .js('resources/js/alpine.js', 'dist')
  .js('resources/js/init.js', 'dist')
  .css('resources/css/editor.css', '')
  .setPublicPath('dist')
  .version()
