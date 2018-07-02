<?php

require('../../api/lib/redbean/rb.php');
require('../../api/Connection.php'); 
require('../../api/ContentItemManager.class.php'); 
require('../../api/SecurityManager.class.php'); 
require('../../api/SettingsManager.class.php'); 
require('../../api/CrudBeanHandler.class.php'); 
require('../../api/PartyAccountManager.class.php'); 
require('../../api/EmailManager.class.php'); 

Connection::connectAsSystem();
Connection::setSystemSchema();

session_start();

$GLOBALS['hierarchy_table'] = 'questiontree';
$GLOBALS['question_table'] = 'questions';
$GLOBALS['contentitem_table'] = 'contentitem';
$GLOBALS['party_table'] = 'partyaccount';
$GLOBALS['settings_table'] = 'settings';
$GLOBALS['sites_table'] = 'site';
$GLOBALS['report_table'] = 'report';