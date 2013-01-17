<?php

use Symfony\Component\ClassLoader\DebugClassLoader;
use Symfony\Component\HttpKernel\Debug\ErrorHandler;
use Symfony\Component\HttpKernel\Debug\ExceptionHandler;

require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/../app/config/config_dev.php';

$app = require __DIR__.'/../src/app.php';
$app->run();
