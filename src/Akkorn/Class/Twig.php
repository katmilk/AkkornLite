<?php

namespace Akkorn;

class Twig {

	protected static $app;


	public static function _set_app($app) {
		self::$app = $app;
	}


	public static function placeholder($content){

		$app = self::$app;

		
	}

}