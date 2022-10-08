let mix = require('laravel-mix')

mix
  .js('resources/js/alpine.js', 'dist')
  .js('resources/js/morph.js', 'dist')
  .setPublicPath('dist')
