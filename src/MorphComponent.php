<?php

namespace BoxyBird\Morph;

use Exception;
use Illuminate\Encryption\Encrypter;
use Symfony\Component\HttpFoundation\Request;

class MorphComponent
{
    public $name;
    
    public $path;
    
    public $hash;
    
    public $attributes;
    
    public $initial_data;
    
    public function __construct(string $name, array $attributes = [], array $initial_data = [])
    {
        $this->name = $name;
        $this->attributes = $attributes;
        $this->initial_data = $initial_data;

        $this->setPath();
        $this->setHash();
    }

    protected function setPath(): void
    {
        $base_path = apply_filters('morph/component/path', get_template_directory() . '/morph/components/');
        
        $path = $base_path . $this->name . '.php';

        if (!file_exists($path)) {
            throw new Exception('Morph component not found: ' . $path);
        }

        $this->path = $path;
    }

    private function setHash(): void
    {
        $this->hash = (new Encrypter(BB_MORPH_HASH_KEY))->encrypt([
            'attributes'   => $this->attributes,
            'initial_data' => $this->initial_data,
            'morph_data'   => [
                'current_post_id' => get_the_ID(),
                'component_name'  => $this->name,
                'nonce'           => wp_create_nonce('morph_ajax_nonce'),
            ]
        ]);
    }
}
