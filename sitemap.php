<?php
require('api/lib/redbean/rb.php');
require('api/Connection.php'); 
require('api/RedbeanSessionHandler.class.php');
require('api/ContentItemManager.class.php'); 

Connection::connectAsUser();
Connection::setUserSchema();

$handler = new RedbeanSessionHandler('sessions');
session_set_save_handler($handler, true);
session_start();

header("Content-type: application/xml");
echo ContentItemManager::getCurrentLanguageContentItem('site.sitemap');

?>