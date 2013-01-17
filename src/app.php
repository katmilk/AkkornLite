<?php

use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\ValidatorServiceProvider;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
 
//$app = new Silex\Application();
 
//$app->get('/', function() {
//    return new Response('Welcome to my new Silex app');
//});
 
//return $app;


$app = new Application();

// Get the environment variable from Apache and load the correct config file
$env = 'main';

//$config_file = __DIR__."/../sites/$env.json";
$config_file = __DIR__."/../sites/main.json";

try {
	$app->register(
		new Igorw\Silex\ConfigServiceProvider(
			$config_file, array('base_path' 	=> 	realpath(__DIR__ . '/..'))
			)
		);
} catch (\InvalidArgumentException $e) {
	error_log("Could not load file $config_file, resorting to defaults");
} 

// $app->register(new Silex\Provider\DoctrineServiceProvider(), array(
//     'dbs.options' => array (
//         'mysql' => array(
//             'driver'    => 'pdo_mysql',
//             'host'      => '117.79.228.137',
//             'dbname'    => 'properties',
//             'user'      => 'rokkan',
//             'password'  => 'soho.rokkan0928',
//         ),
//     ),
// ));

$app->register(new UrlGeneratorServiceProvider());
$app->register(new ValidatorServiceProvider());
$app->register(new TwigServiceProvider(), array(
	'twig.path'    => array(__DIR__.'/../templates'),
	//'twig.options' => array('cache' => __DIR__.'/../cache'),
	));
$app['twig'] = $app->share($app->extend('twig', function($twig, $app) {

   	// add custom globals, filters, tags, ...
	
	\Akkorn\Twig::_set_app($app);
	$twig->addFunction('placeholder', new Twig_Function_Function("\Akkorn\Twig::placeholder"));

	return $twig;
}));

$app->before(function (Request $req) use ($app) {

	if (!$req->get('locale')) {
		$app['locale'] = 'en';
	} else {
		$app['locale'] = $req->get('locale');

	}

	$serverName = $_SERVER['SERVER_NAME'];

	if( isset($app['config']['project']) ) {
		$project = $app['config']['project'][$serverName];
	} else {
		$project = "sample";
	}

	//if (isset($app['config']['project'][$serverName])) {		
	//	$app['project'] = $app['config']['project'][$serverName];

	//	$config_file = __DIR__."/../sites/" . $app['project'] . "/_config." . $app['locale'] .".yml";
		$config_file = __DIR__."/../sites/" . $project . "/_config." . $app['locale'] .".yml";

		try {
			$app->register(
				new Igorw\Silex\ConfigServiceProvider(
					$config_file, array('base_path' 	=> 	realpath(__DIR__ . '/..'))
					)
				);
		} catch (\InvalidArgumentException $e) {

			echo "Could not load file $config_file";
		}
	//}

	//else {
	//	exit('no url defined!');
	//}

	require 'controllers.php';

});

return $app;