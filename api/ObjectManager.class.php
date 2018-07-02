<?php

class ObjectManager
{
    public static function registerRoutes($apiName)
	{
        
        Flight::route("GET /${apiName}/defaulthouseparts", function() {

            $result = self::getDefaultHouseParts(FALSE);

			Flight::json(HttpHandler::createResponse(200, $result)); 
        });


        Flight::route("GET /${apiName}", function() {
            $array = array();
            $all = CrudBeanHandler::findAllBeans('object');
            foreach ($all as $object) 
            {
                $array[] = CrudBeanHandler::exportBean($object);
            }
            
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("POST /${apiName}", function() {
            $posted = HttpHandler::handleRequest();
            $bean = self::addNewObject();
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(201, $array));
        });

        Flight::route("POST /${apiName}/@id", function($id) {
            $posted = HttpHandler::handleRequest();
            $bean = CrudBeanHandler::findBean('object', $id);
            CrudBeanHandler::updateBean($bean, $posted);
            CrudBeanHandler::storeBean($bean);
            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("DELETE /${apiName}/@id", function($id) {
            self::deleteObject($id);
            Flight::json(HttpHandler::createResponse(200, null));
        });
    }

    public static function getDefaultHouseParts($idsOnly)
    {
        $q = QuestionManager::getQuestionsWithTag('houseparts');
        
        $result = array();
        foreach ($q as $key => $value) {
            if ($idsOnly) 
            {
                $result[] = $value['id'];
            }
            else
            {
                $new['id'] = $value['id'];
                $new['text'] = $value['text'];
                $result[] = $new;
            }
        }

        return $result;
    }

    public static function deleteObject($id) {
        $bean = CrudBeanHandler::findBean('object', $id);

        if ($bean != null) {
            CrudBeanHandler::trashBean($bean);
        }
        
        SecurityManager::adminDeleteAllSecurityForTable('object', $id);
        
    }


    public static function addNewObject() {
        $bean = CrudBeanHandler::dispenseBean('object');
        $bean->houseparts = json_encode(self::getDefaultHouseParts(TRUE));
        $bean->housepartsexcluded = json_encode(array());

        CrudBeanHandler::storeBean($bean);

        SecurityManager::adminAddOwnerForTable('object',$bean->id);

        $bean->granteerole = 'owner';

        return $bean;
    }

    // public static function updateObject($object, $posted) {

    // }
}