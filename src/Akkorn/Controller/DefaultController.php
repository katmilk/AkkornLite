<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


$app->get('{locale}/menu/{page}', function (Request $request) use ($app) {

	$app['locale'] = $request->get('locale');

    return $app['twig']->render('site/_menu.twig');
})
->bind('menu')
->value('page', 'homepage');