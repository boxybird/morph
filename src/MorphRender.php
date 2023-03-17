<?php

namespace BoxyBird\Morph;

use ReflectionClass;
use ReflectionMethod;
use ReflectionProperty;
use Symfony\Component\HttpFoundation\Request;

class MorphRender
{
    public array $lifecycle_methods = [];

    public array $request_methods = [];

    public array $properties = [];

    public Request $request;
    
    protected array $allowed_lifecycle_methods = ['mount'];

    protected array $methods = [];

    protected ReflectionClass $reflection;

    public function __construct(object $class)
    {
        $this->reflection = new ReflectionClass($class);

        $this->request = Request::createFromGlobals();

        $this->setProperties();

        $this->setMethods();

        $this->setRequestMethods();

        $this->setLifecycleMethods();
    }

    protected function setProperties(): void
    {
        $this->properties = $this->reflection->getProperties(ReflectionProperty::IS_PUBLIC);
    }

    protected function setMethods(): void
    {
        $this->methods = $this->reflection->getMethods(ReflectionMethod::IS_PUBLIC);
    }

    protected function setRequestMethods(): void
    {
        $this->request_methods = array_filter($this->methods, function ($method) {
            return strpos($method->name, '__') !== 0
                && !in_array($method->name, $this->lifecycle_methods)
                && ($this->request->request->has($method->name) || $this->request->files->has($method->name));
        });
    }

    protected function setLifecycleMethods(): void
    {
        $this->lifecycle_methods = array_filter($this->methods, function ($method) {
            return in_array($method->name, $this->allowed_lifecycle_methods);
        });
    }
}
