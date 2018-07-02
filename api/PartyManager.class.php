<?php

class PartyManager
{
    public static function registerRoutes($apiName)
	{
        Flight::route("GET /${apiName}", function() {
            $array = array();
            $all = CrudBeanHandler::findAllBeans('party');
            foreach ($all as $bean) 
            {
                $array[] = CrudBeanHandler::exportBean($bean);
            }
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("GET /${apiName}/@id", function($id) {
            $result = self::getParty($id);
            $array = CrudBeanHandler::exportBean($result);
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("POST /${apiName}", function() {
            $posted = HttpHandler::handleRequest();
            $bean = CrudBeanHandler::dispenseBean('party');
            CrudBeanHandler::updateBean($bean, $posted);
            $bean->displayname = self::getPartyName($bean);
            CrudBeanHandler::storeBean($bean);
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(201, $array));
        }
        );

        Flight::route("POST /${apiName}/@id", function($id) {
            $posted = HttpHandler::handleRequest();

            // check for duplicate email
            $email = $posted['email'];
            if (strlen($email) > 0) {
                $beans = CrudBeanHandler::queryBeans('party', ' trim(lower(email)) = trim(lower(:email)) AND id <> :id ', [ ':email' => $email, ':id' => $id ]);
                if (count($beans) > 0) {
                    throw new Exception("A party with email ${email} already exists."); 
                }
            }

            $bean = CrudBeanHandler::findBean('party', $id);
            CrudBeanHandler::updateBean($bean, $posted);
            $bean->displayname = self::getPartyName($bean);
            CrudBeanHandler::storeBean($bean);
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("DELETE /${apiName}/@id", function($id) {
            $bean = CrudBeanHandler::findBean('party', $id);
            // CrudBeanHandler::trashBean($bean);
            throw new Exception('deleting parties is not allowed currenctly');
            Flight::json(HttpHandler::createResponse(200, null));
        }
        );

    }


    public static function getParty($id) {
        return CrudBeanHandler::findBean('party', $id);
    }


    public static function getPartyName($p) {
        // print_r($p);

        $name = '';

        if ($p->partytype == 'contractor' || $p->partytype == 'supplier' || $p->partytype == 'association') {
            if (strlen($p->companyname) == 0) {
                $name = "";
            }
            else {
                $name = $p->companyname;
            }
        }
        else {
            if (strlen($p->firstname) == 0 && strlen($p->lastname) == 0) {
                $name = "";
            }
            else {
                $name = $p->firstname . " " . $p->infixname . " " . $p->lastname;
            }
        }
        $name = trim($name);
        
        if (strlen($p->email) > 0) 
        {
            if (strlen($name) > 0) 
            {
                $name .= " - ";
            }
            $name .= $p->email;
        }

        $name = trim($name);
        return $name;
    }
}