<?php

class HoaManager
{
    public static function registerRoutes($apiName)
	{
        
        Flight::route("GET /${apiName}/defaulthouseparts", function() {

            $result = self::getDefaultHouseParts(FALSE);

			Flight::json(HttpHandler::createResponse(200, $result)); 
        });


        Flight::route("GET /${apiName}/member/@hoaid", function($hoaid) {
            $array = array();
            $all = self::getHoaMembers($hoaid);
            foreach ($all as $hoa) 
            {
                $array[] = CrudBeanHandler::exportBean($hoa);
            }
            
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("POST /${apiName}/member/@hoaid", function($hoaid) {
            $posted = HttpHandler::handleRequest();
            $bean = self::addHoaMember($hoaid, $posted);
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(201, $array));
        });

        Flight::route("POST /${apiName}/member/@hoaid/@id", function($hoaid, $id) {
            $posted = HttpHandler::handleRequest();
            $bean = CrudBeanHandler::findBean('hoamember', $id);
            CrudBeanHandler::updateBean($bean, $posted);
            CrudBeanHandler::storeBean($bean);
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("DELETE /${apiName}/member/@hoaid/@id", function($hoaid, $id) {
            self::deleteHoaMember($hoaid, $id);
            Flight::json(HttpHandler::createResponse(200, null));
        });

        Flight::route("GET /${apiName}", function() {
            $array = array();
            $all = CrudBeanHandler::findAllBeans('hoa');
            foreach ($all as $hoa) 
            {
                $array[] = CrudBeanHandler::exportBean($hoa);
            }
            
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("POST /${apiName}", function() {
            $posted = HttpHandler::handleRequest();
            $bean = self::addNewHoa();
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(201, $array));
        });

        Flight::route("POST /${apiName}/@id", function($id) {
            $posted = HttpHandler::handleRequest();
            $bean = CrudBeanHandler::findBean('hoa', $id);
            CrudBeanHandler::updateBean($bean, $posted);
            CrudBeanHandler::storeBean($bean);
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("DELETE /${apiName}/@id", function($id) {
            self::deleteHoa($id);
            Flight::json(HttpHandler::createResponse(200, null));
        });
    }

    public static function getDefaultHouseParts($idsOnly)
    {
        return ObjectManager::getDefaultHouseParts($idsOnly);
    }

    public static function deleteHoa($id) {
        $bean = CrudBeanHandler::findBean('hoa', $id);

        if ($bean != null) {
            CrudBeanHandler::trashBean($bean);
        }
        
        SecurityManager::adminDeleteAllSecurityForTable('hoa', $id);
        
    }


    public static function addNewHoa() {
        $bean = CrudBeanHandler::dispenseBean('hoa');
        $bean->houseparts = json_encode(self::getDefaultHouseParts(TRUE));
        $bean->housepartsexcluded = json_encode(array());

        CrudBeanHandler::storeBean($bean);

        SecurityManager::adminAddOwnerForTable('hoa',$bean->id);

        $bean->granteerole = 'owner';

        return $bean;
    }

    public static function deleteHoaMember($hoaid, $id) {
        $bean = CrudBeanHandler::findBean('hoamember', $id);

        if ($bean != null) {
            CrudBeanHandler::trashBean($bean);
        }
    }


    public static function addHoaMember($hoaid, $posted) {
        $bean = CrudBeanHandler::dispenseBean('hoamember');

        CrudBeanHandler::updateBean($bean, $posted);
        CrudBeanHandler::storeBean($bean);

        return $bean;
    }

    public static function getHoaMembers($hoaid) {
        $all = CrudBeanHandler::queryBeans('hoamember', 'hoaid = :hoaid', [ ':hoaid' => $hoaid ]);
        $toReturn = [];

        foreach ($all as $hoaMember) 
        {
            /* update display strings */

            // $owner = PartyManager::getParty($hoaMember->ownerpartyid);

            // if($owner != NULL) {
            //     $hoaMember.
            // }

            $toReturn[] = $hoaMember;
        }

        return $toReturn;
    }

}