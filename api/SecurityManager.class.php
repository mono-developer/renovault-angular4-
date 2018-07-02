<?php

class SecurityManager
{
    public static function registerRoutes($apiName)
	{
        Flight::route("GET /${apiName}", function() {
            $all = self::getSecurityRecords();
            foreach ($all as $bean) 
            {
                $array[] = CrudBeanHandler::exportBean($bean);
            }            
            Flight::json(HttpHandler::createResponse(200, $array));
        });

        Flight::route("GET /${apiName}/@id", function($id) {
            $array = self::getSecurity($id);
            CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("GET /${apiName}/@referencetable/@referenceid", function($referencetable, $referenceid) {
            $all = self::getSecurityForTable($referencetable, $referenceid);
            foreach ($all as $bean) 
            {
                $array[] = CrudBeanHandler::exportBean($bean);
            }
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("POST /$apiName", function() {
            $posted = HttpHandler::handleRequest();
            $bean = CrudBeanHandler::dispenseBean('security');
            CrudBeanHandler::updateBean($bean, $posted);
            CrudBeanHandler::storeBean($bean);
            self::sendEmailForNewSecurity($bean);
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(201, $array));
        }
        );

        Flight::route("POST /${apiName}/@id", function($id) {
            $posted = HttpHandler::handleRequest();
            $bean = CrudBeanHandler::findBean('security', $id);
            CrudBeanHandler::updateBean($bean, $posted);
            CrudBeanHandler::storeBean($bean);
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("POST /${apiName}/transfer/@from/@to", function($from, $to) {
            $posted = HttpHandler::handleRequest();
            $result = self::adminTransfer($from, $to);
            Flight::json(HttpHandler::createResponse(200, $result));
        }
        );

        Flight::route("DELETE /${apiName}/@id", function($id) {
            $bean = CrudBeanHandler::findBean('security', $id);
            CrudBeanHandler::trashBean($bean);
            Flight::json(HttpHandler::createResponse(200, TRUE));
        }
        );

    }

    private static function sendEmailForNewSecurity($bean)
    {
        if ($bean->referencetable == 'object') 
        {
            $protocol = 'https://'; 
            $objectlink = $protocol . $_SERVER['HTTP_HOST'] . '/objects/' . $bean->referenceid;
            $registrationlink = $protocol . $_SERVER['HTTP_HOST'] . '/partyaccountlogin/register/' . $bean->granteelogin;
            
            $message = ContentItemManager::getAllCurrentLanguageContentItem('email.share.message');
		    $message = str_replace('[%objectlink%]', $objectlink, $message);
		    $message = str_replace('[%registrationlink%]', $registrationlink, $message);
            
            $currentlogin = PartyAccountManager::getSignedInPartyAccountLogin();
            $subject = ContentItemManager::getAllCurrentLanguageContentItem('email.share.subject');
            EmailManager::adminSendEmail($bean->granteelogin, $subject, $message, NULL);

            // send info to self
            $from = SettingsManager::getSetting('email.fromaddress');
		    EmailManager::adminSendEmail($from, "TER INFO - Gebruiker heeft {$bean->referencetable} gedeeld: {$currentlogin}", "<automatisch gegenereerd bericht>Gebruiker: {$currentlogin} heeft {$bean->referencetable} {$bean->referenceid} gedeeld met gebruiker: {$bean->granteelogin}", NULL);
        }
    }

    private static function getSecurityRecords() 
    {
        $array = R::find('security');
        return $array;
    }

    private static function getSecurityForTable($referencetable, $referenceid) 
    {
        $array = R::find('security', ' referencetable = ? AND referenceid = ? ', [ $referencetable, $referenceid ]);
        return $array;
    }

    public static function adminDeleteAllSecurityForTable($referencetable, $referenceid)
    {
        $array = self::getSecurityForTable($referencetable, $referenceid);
        self::adminSetAdminVariable();
        foreach ($array as $security) {
            CrudBeanHandler::trashBean($security);
        }
        self::adminUnSetAdminVariable();
    }

    public static function adminAddOwnerForTable($referencetable, $referenceid)
    {
        $security = CrudBeanHandler::dispenseBean('security');
        $security->referencetable = $referencetable;
        $security->referenceid = $referenceid;
        $security->granteelogin = PartyAccountManager::getSignedInPartyAccountLogin();
        $security->granteerole = 'owner';
        $security->securityid = PartyAccountManager::getSignedInPartyAccountId();
        $security->securitylogin = PartyAccountManager::getSignedInPartyAccountLogin();
        self::adminSetAdminVariable();
        CrudBeanHandler::storeBean($security);
        self::adminUnSetAdminVariable();
    }
    
    public static function adminTransfer($fromid, $toid)
    {
        $fromBean = CrudBeanHandler::findBean('security', $fromid);
        $toBean = CrudBeanHandler::findBean('security', $toid);
        
        // $array[0] = CrudBeanHandler::exportBean($fromBean);
        // $array[1] = CrudBeanHandler::exportBean($toBean);

        // security checks
        if ($fromBean->referencetable != $toBean->referencetable || $toBean->referenceid != $toBean->referenceid )
        {
            throw new Exception("Transfer must be about a single record.");
        }

        $result = R::exec("call checkgranteerole(:referencetable, :referenceid, 'update');", [':referencetable' => $fromBean->referencetable, ':referenceid' => $fromBean->referenceid]);
        
        // transfer ownership of records
        $fromBean->securityid = NULL;
        $fromBean->securitylogin = $toBean->granteelogin;
        $toBean->securityid = NULL;
        $toBean->securitylogin = $toBean->granteelogin;
        
        // switch roles
        $fromRole = $fromBean->granteerole;
        $toRole = $toBean->granteerole;
        $fromBean->granteerole = $toRole;
        $toBean->granteerole = $fromRole;

        // store in admin mode
        self::adminSetAdminVariable();
        CrudBeanHandler::storeBean($fromBean);
        CrudBeanHandler::storeBean($toBean);
        self::adminUnSetAdminVariable();

        // send email
        $protocol = 'https://' . 
        $objectlink = $protocol . $_SERVER['HTTP_HOST'] . '/objects/' . $toBean->referenceid;
        $registrationlink = $protocol . $_SERVER['HTTP_HOST'] . 'partyaccountlogin/register/' . $toBean->granteelogin;
        
        $message = ContentItemManager::getAllCurrentLanguageContentItem('email.transfer.message');
        $message = str_replace('[%objectlink%]', $objectlink, $message);
        $message = str_replace('[%registrationlink%]', $registrationlink, $message);
        
        $currentlogin = PartyAccountManager::getSignedInPartyAccountLogin();
        $subject = ContentItemManager::getAllCurrentLanguageContentItem('email.transfer.subject');
        EmailManager::adminSendEmail($toBean->granteelogin, $subject, $message, NULL);
        
        $from = SettingsManager::getSetting('email.fromaddress');
        EmailManager::adminSendEmail($from, "TER INFO - Gebruiker heeft {$toBean->referencetable} overgedragen: {$currentlogin}", "<automatisch gegenereerd bericht>Gebruiker: {$currentlogin} heeft {$toBean->referencetable} {$toBean->referenceid} overgedragen aan gebruiker: {$toBean->granteelogin}", NULL);



        return TRUE;
    }

    public static function adminSetAdminVariable() 
    {
        Connection::setVariable('securityadminmode', 'Y');
    }

    public static function adminUnSetAdminVariable() 
    {
        Connection::unSetVariable('securityadminmode');
    }


    private static function getSecurity($id) 
    {
        $bean = R::findOne('security', " id = ? ", [ $id ] );
        return $bean;
    }

    // private static function getSecurityForTable
}