<?php

require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/../app/config/config_prod.php';

$app = require __DIR__.'/../src/app.php';
require __DIR__.'/../src/controllers.php';
$app->run();
