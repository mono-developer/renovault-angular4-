<?php
require('api/lib/redbean/rb.php');
require('api/Connection.php'); 
require('api/RedbeanSessionHandler.class.php');
require('api/ContentItemManager.class.php'); 
require('api/PartyAccountManager.class.php'); 

Connection::connectAsUser();
Connection::setUserSchema();

$handler = new RedbeanSessionHandler('sessions');
session_set_save_handler($handler, true);
session_start();


// use google\appengine\api\users\UserService;

// $user = UserService::getCurrentUser();
// $authorized = FALSE;

// if (isset($user) && UserService::isCurrentUserAdmin()) 
// {
// 	$authorized = TRUE;
// } 
// else 
// {
// 	$authorized = FALSE;
// }

// if (!$authorized)
// {
//     echo sprintf('<div style="text-align:center;"><img src="/images/renegade.jpg"/><br/><br/><a href="%s">Sign in...</a></div>',
//         UserService::createLoginUrl('/'));
//     exit;
// }

?><!DOCTYPE html>

<?php
$language = ContentItemManager::getCurrentLanguageContentItem('site.language');
echo "<html lang='$language'>";
?>

<head>

<?php 

$uri = $_SERVER['REQUEST_URI'];

// get slugs
$items = ContentItemManager::getCurrentLanguageContentItems();
$slugs = []; 

foreach ($items as $key => $value)
{
	if (strlen($value) > 0 && strpos($key, '.heading.slug') !== false) {
		$slugs[$key] = $value;
	}
}

$urislug = strtolower(substr($uri, 1));
$slugkey = array_search($urislug, $slugs);

if ($slugkey !== FALSE)
{
	$slugkey = str_replace('home.html.page.','',$slugkey);
	$slugkey = str_replace('.heading.slug','',$slugkey);
	$uri = '/home/' . $slugkey;
}
else if (substr( $uri, 0, 6 ) == "/home/")
{
	// $uri is correct, do nothing
	$uri = $uri;
}
else if ($uri == '/')
{
	$uri = '/home/1';
}
else
{
	$uri = '';
}
// print_r($slugs);
// print_r($urislug);
// print_r($uri);
// exit();


if (substr( $uri, 0, 6 ) == "/home/") 
{
	$partToRender = 'HOME';
}
else
{
	$partToRender = 'APP';
}

if ($partToRender == 'HOME')
{
    $page = substr($uri, 6);

    echo "<title>";
    echo ContentItemManager::getCurrentLanguageContentItem('home.html.page.' . $page . '.heading.title');
    echo "</title>";
    echo "<meta name='description' content='" . ContentItemManager::getCurrentLanguageContentItem('home.html.page.' . $page . '.heading.description') . "'>";
}
else
{
    echo "<title>";
    echo ContentItemManager::getCurrentLanguageContentItem('site.title');
    echo "</title>";
    echo "<meta name='description' content='" . ContentItemManager::getCurrentLanguageContentItem('site.title') . "'>";
}
?>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="/">

<?php 
echo ContentItemManager::getCurrentLanguageContentItem('site.includecss');
?>


<?php 
if ($partToRender == 'APP') 
{

    echo "<script src='node_modules/core-js/client/shim.min.js'></script>";
    echo "<script src='node_modules/zone.js/dist/zone.js'></script>";
    echo "<script src='node_modules/systemjs/dist/system.src.js'></script>";

	if (getenv('DEV_OR_DIST') == 'DEV') 
	{ 
?>

    <script src="js/systemjs.config.js"></script>
    <script>
        System.import('app_js/main.js').catch(function(err) {
            console.error(err);
        });
    </script>

<?php 
	}
}
?>
    <!-- dependency on jquery for bootstrap menu :( -->
    <script src="node_modules/jquery/dist/jquery.min.js"></script>
    <script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>

</head>

<body style=" padding-top: 90px; ">


<nav class="navbar navbar-inverse navbar-fixed-top">
	<div class="container">
		<div class="navbar-header">
			<!-- button -->
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false"
			 aria-controls="navbar">
				<span class="sr-only">Navigatie</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<!-- logo -->
			
			<a href="<?=ContentItemManager::getCurrentLanguageContentItem('app.menu.home1.link')?>" class="navbar-brand" title="<?=ContentItemManager::getCurrentLanguageContentItem('app.menu.home1')?>">
				<img *ngIf="contentService.contents['site.logo']" style="max-height:49px; margin-top: -15px;" src="<?=ContentItemManager::getCurrentLanguageContentItem('site.logo')?>"
				/>
			</a>
		</div>
		<div id="navbar" class="collapse navbar-collapse">
			<!-- left part -->
			<ul class="nav navbar-nav">
				<li>
					<a href='<?=ContentItemManager::getCurrentLanguageContentItem('app.menu.home2.link')?>'><?=ContentItemManager::getCurrentLanguageContentItem('app.menu.home2')?></a>
				</li>
				<li>
					<a href='<?=ContentItemManager::getCurrentLanguageContentItem('app.menu.home3.link')?>'><?=ContentItemManager::getCurrentLanguageContentItem('app.menu.home3')?></a>
				</li>
				<li>
					<a href='<?=ContentItemManager::getCurrentLanguageContentItem('app.menu.home4.link')?>'><?=ContentItemManager::getCurrentLanguageContentItem('app.menu.home4')?></a>
				</li>
            </ul>
			<!-- right part -->
<?php
if ($partToRender == 'APP')
{
	echo "<app-menu></app-menu>";
}
else
{
	// alternative appmenu
?>
	<ul class="nav navbar-nav navbar-right">
		<li>
			<a href="/objects">
<?php
	if (PartyAccountManager::getPartyAccountIsSignedIn())
	{
		echo ContentItemManager::getCurrentLanguageContentItem('app.menu.tomyaccount');
	}
	else
	{
		echo ContentItemManager::getCurrentLanguageContentItem('app.menu.partyaccount.logon');
	}
?>
			</a>
		</li>
		<!-- language dropdown -->
		<li class="dropdown">
			<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
				<span class='glyphicon glyphicon-globe'></span>
			</a>
			<ul class="dropdown-menu">
				<li>
					<a href='/api/contentitem/setSessionLanguageAndRedirect/nl'>
						<img src="/images/flags/nl.png" /> Nederlands
					</a>
				</li>
				<li>
					<a href='/api/contentitem/setSessionLanguageAndRedirect/en'>
						<img src="/images/flags/gb.png" /> English
					</a>
				</li>
			</ul>
		</li>
		<li>
			<a href="https://www.instagram.com/denationalehuispas.nl/" target="_blank">
				<span class='fab fa-instagram'></span>
			</a>
		</li>
	</ul>
<?php
}
?>
		</div>
	</div>
</nav>

<div class="container" id="homePrerender">
<?php

if ($partToRender == 'HOME')
{
    $page = substr($uri, 6);
    // echo $page;
    echo "<div class='homeComponent'>";
    echo ContentItemManager::getCurrentLanguageContentItem('home.html.page.' . $page);
    echo "<div>";
    echo ContentItemManager::getCurrentLanguageContentItem('home.html.footer');
    echo "</div>";
    echo "</div>";
}
else
{
	echo ContentItemManager::getCurrentLanguageContentItem('site.contentwhenloading');
}
?>
</div>

<?php
if ($partToRender == 'APP')
{
	echo "<my-app></my-app>";
	if (getenv('DEV_OR_DIST') == 'DIST') 
	{ 
    	echo "<script src='js/bundle.min.js'></script>";
	}
}


if (getenv('DEV_OR_DIST') == 'DIST') 
{ 
	echo ContentItemManager::getCurrentLanguageContentItem('site.googleanalytics');
}
?>
    
</body>

</html>