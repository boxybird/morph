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
    
    public $request;
    
    public $initial_data;

    public $attributes;
    
    public function __construct(string $name, array $initial_data = [], array $attributes = [])
    {
        $this->name = $name;
        $this->initial_data = $initial_data;
        $this->attributes = $attributes;

        $this->setPath();
        $this->setHash();
        $this->setRequest();
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

    protected function setRequest(): void
    {
        $this->request = Request::createFromGlobals();
    }

    private function setHash(): void
    {
        $this->hash = (new Encrypter(BB_MORPH_HASH_KEY))->encrypt([
            'attributes'   => $this->attributes,
            'initial_data' => $this->initial_data,
            'morph_data'   => [
                'current_post_id' => get_the_ID(),
                'nonce'           => wp_create_nonce('morph_ajax_nonce'),
            ]
        ]);
    }
}
