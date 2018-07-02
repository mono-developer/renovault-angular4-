<?php
require_once('lib/flight/Flight.php');
require_once('lib/redbean/rb.php');
require_once('Connection.php');
require_once('security.php');
require_once('lib/FirePHPCore/fb.php');
require_once('lib/php-jwt-master/src/JWT.php');
require_once('lib/firebase-php-master/src/firebaseLib.php');
require_once('HttpHandler.class.php');
require_once('CrudBeanHandler.class.php');
require_once('RedbeanSessionHandler.class.php');
require_once('FilterHandler.class.php');


require_once('ContentItemManager.class.php');
require_once('CrudManager.class.php');
require_once('DebugManager.class.php');
require_once('ExternalDatasetManager.class.php');
require_once('EmailManager.class.php');
require_once('ImageManager.class.php');
require_once('ObjectManager.class.php');
require_once('HoaManager.class.php');
require_once('PartyAccountManager.class.php');
require_once('PartyManager.class.php');
require_once('ProjectManager.class.php');
require_once('QuestionManager.class.php');
require_once('ReportManager.class.php');
require_once('SettingsManager.class.php');
require_once('SecurityManager.class.php');
require_once('SiteManager.class.php');

// header("Access-Control-Allow-Methods: GET, POST");
// header("Access-Control-Allow-Credentials: true");
// header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Credentials");

Flight::route("OPTIONS /*", function() {
    exit();	
});

ContentItemManager::registerRoutes('contentitem');
CrudManager::registerRoutes('crud');
DebugManager::registerRoutes('debug');
ExternalDatasetManager::registerRoutes('externaldataset');
ImageManager::registerRoutes('image');
ObjectManager::registerRoutes('object');
HoaManager::registerRoutes('hoa');
PartyAccountManager::registerRoutes('partyaccount');
PartyManager::registerRoutes('party');
QuestionManager::registerRoutes('questions');
ReportManager::registerRoutes('report');
SettingsManager::registerRoutes('settings');
SecurityManager::registerRoutes('security');

Connection::connectAsUser();
Connection::setUserSchema();

$handler = new RedbeanSessionHandler('sessions');
session_set_save_handler($handler, true);
session_start();

$partyAccountId = PartyAccountManager::getSignedInPartyAccountId();
$partyAccountLogin = PartyAccountManager::getSignedInPartyAccountLogin();

if ($partyAccountId == -1) {
    $partyAccountId = NULL;
    $partyAccountLogin = NULL;
}

Connection::setVariable('securityid', $partyAccountId);
Connection::setVariable('securitylogin', $partyAccountLogin);

Flight::map('error', function(Exception $e) {
    
    $message = "<h1>" . $e->getMessage() . "</h1>";

    if (getenv('DEV_OR_DIST') == 'DEV') {
        $message .= "\n\n<pre>" . $e->getTraceAsString() . "</pre>";
    }

    Flight::halt(500, $message);
});

Flight::start();

