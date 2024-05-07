<?php

namespace Skills17;

use Skills17\Controller\ExampleController;
use Skills17\Lib\Router;

// Instantiate example controller instance
$exampleController = new ExampleController();

$router = new Router();

// Register all routes
// Variables can be added with the :name notation and will be available in the Skills17\Lib\Http\Request object
// which is passed to the controller method.
// The example below can be called via GET http://localhost:4000/api/example/blubb
$router->get('/api/example/:var1', [$exampleController, 'example']); // <- calls the 'example' method on the $exampleController

return $router;
