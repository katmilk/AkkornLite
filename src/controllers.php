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


/* PAGE CONTROLLER 
-------------------------------------------------- */
$app->get('/{page}', function (Request $request) use ($app) {

	if( isset($app['project']) ) {
    	$project = $app['project'];
    } else {
    	$project = 'sample';
    }

    //$page = __DIR__."/../sites/" . $app['project'] . "/" . $app['request']->get('page')  ."." . $app['locale'] .".yml";
    $page = __DIR__."/../sites/" . $project . "/" . $app['request']->get('page')  ."." . $app['locale'] .".yml";
    
    try {
        $app->register(
            new Igorw\Silex\ConfigServiceProvider(
                $page, array('base_path'    =>  realpath(__DIR__ . '/..'))
            )
        );
    } catch (\InvalidArgumentException $e) {
      $app->abort('404', "page not found");
    //    echo "Could not load file $page";
    }

    $app['current_url'] = $request->get('page');
    $template = isset($app['page']['template']) ? $app['page']['template'] : 'index';

    return $app['twig']->render('site/' . $template. '.twig');
})
->bind($app['locale'] == 'en' ? 'page' : 'other_page')
->value('page', 'homepage')
->value('locale', 'en');


/* HANDLING THE FORM
-------------------------------------------------- */
$app->post('/{locale}/form', function (Request $request) use ($app) {

    $app['locale'] = $request->get('locale');

    $app['db']->insert('galaxy_registration', array('name' => $request->get('name'), 'email' => $request->get('email')));

    return $app->redirect($app['url_generator']->generate('page', array('page' => 'form', 'locale' => $app['locale'])));

})
->bind('form_post')
->value('page', 'homepage')
->value('locale', '');


$app->error(function (\Exception $e, $code) use ($app) {
    if ($app['debug']) {
        return;
    }

    $page = 404 == $code ? '404.html' : '500.html';

    return new Response($app['twig']->render($page, array('code' => $code)), $code);
});

/* Handling the Commune Registration Form
-------------------------------------------------- */
$app->post('/{locale}/commune-registration', function (Request $request) use ($app) {

    $url = "https://www.chinaonline.net.cn/index.aspx";

    $chaincode = "?ChainCode=COL";
    $hotelcode = "&HotelCode=CGWBJ";
    $language = "&Language=" . (($app["locale"] == "zh") ? "C" : "E");
    $homepage = "&HomePage=http://commune.sohochina.com/";
    $arrival = "&Arrival=" . $request->get("from");
    $departure = "&Departure=" . $request->get("to");
    $rooms = "&Rooms=" . $request->get("rooms");
    $adults = "&Adults=" . $request->get("adults");
    $children = "&Children=" . $request->get("children");
    return $app->redirect($url.$chaincode.$hotelcode.$language.$homepage.$arrival.$departure.$rooms.$adults.$children);
die;


    $app['locale'] = $request->get('locale');

    //$app['db']->insert('galaxy_registration', array('name' => $request->get('name'), 'email' => $request->get('email')));
    $headers = "From: no-reply@sohochina.com.cn" . "\r\n" .
        "Reply-To: no-reply@sohochina.com.cn" . "\r\n" .
        "X-Mailer: PHP/" . phpversion() . "\r\n" .
        "Content-type: text/html; charset=utf-8" . "\r\n" .
        "Accept-Language: zh-CN" . "\r\n" .
        "Content-Language: zh-CN";
    $to = "reservation@commune.com.cn, rokkan@commune.com.cn";
    $subject = "Commune Registration";
    $message = "
    <html>
    <head>
       <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />
       <title>Commune Registration</title>
    </head>
    <body>".
            "入住时间: " . $request->get("from") . "<br/>" .
            "退房时间: " . $request->get("to"). "<br/>" .
            "需要几间房: " . $request->get("rooms"). "<br/>" .
            "每房间入住人数: " . $request->get("occupancy"). "<br/>" .
            "房间类型: " . $request->get("type"). "<br/>" .
            "性别名姓: " . $request->get("prefix") . " " . $request->get("firstname") . " " . $request->get("lastname"). "<br/>" .
            "联系地址: " . $request->get("address"). "<br/>" .
            "市: " . $request->get("city"). "<br/>" .
            "省: " . $request->get("province"). "<br/>" .
            "邮编: " . $request->get("zip"). "<br/>" .
            "国家: " . $request->get("country"). "<br/>" .
            "联系电话: " . $request->get("phone"). "<br/>" .
            "Email: " . $request->get("email"). "<br/>" .
            "需求描述: " . $request->get("description"). "<br/>" .
    "</body>
    </html>";

    mail($to, $subject, $message, $headers);

    return $app->redirect($app['url_generator']->generate('page', array('page' => 'thank-you', 'locale' => $app['locale'])));
})
->bind('form_post')
->value('page', 'homepage')
->value('locale', '');

