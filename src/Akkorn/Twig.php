<?php

namespace Akkorn;

class Twig {

	protected static $app;


	public static function _set_app($app) {
		self::$app = $app;
	}


	public static function placeholder($content){

		$app = self::$app;

		ksort($content);

		foreach ($content as $module) {

			$class = $app['config']['module'][$module['type']]['class'];
			if (isset($module['class'])) {
				$class .= " " . $module['class'];
			}

			if (isset($module['css_id'])) {
				$id = ' id="' . $module['css_id'].'"';
			} else {
				$id = '';
			}

			echo "<div" . $id . ' class="' .$class.'">';
			echo $app['twig']->render('site/module/' . $app['config']['module'][$module['type']]['template'] . '.twig', array('module' => $module));
			echo "</div>\n\r";
		}
	}

}