<?php

class ExternalDatasetManager
{
    // private static $debug;
    private static $overheidIOUrl = "https://overheid.io";
    private static $overheidIOAPIKey;
    private static $overheidIOAPIGETUrl;

    public static function init()
    {
        if (getenv('DEV_OR_DIST') == 'DEV')
        {
            ExternalDatasetManager::$overheidIOAPIKey = getenv('OVERHEID_IO_API_KEY_DEV');
        }
        else
        {
            ExternalDatasetManager::$overheidIOAPIKey = getenv('OVERHEID_IO_API_KEY_DIST');
        }
        ExternalDatasetManager::$overheidIOAPIGETUrl = "?ovio-api-key=" . ExternalDatasetManager::$overheidIOAPIKey;
    }


    public static function registerRoutes($apiName)
	{
        Flight::route("GET /${apiName}/suggestbag/@query", function($query) 
        {
            $result = ExternalDatasetManager::suggestBAG($query);
            Flight::json(HttpHandler::createResponse(200, $result));
        });

        Flight::route("GET /${apiName}/querybag/@postalcode/@housenumber", function($postalcode, $housenumber) 
        {
            $result = ExternalDatasetManager::queryBAG($postalcode, $housenumber, "");
            Flight::json(HttpHandler::createResponse(200, $result));
        });

        Flight::route("GET /${apiName}/querybag/@postalcode/@housenumber/@housenumberadd", function($postalcode, $housenumber, $housenumberadd) 
        {
            $result = ExternalDatasetManager::queryBAG($postalcode, $housenumber, $housenumberadd);
            Flight::json(HttpHandler::createResponse(200, $result));
        });
        
        Flight::route("GET /${apiName}/getbag/@id", function($id) 
        {
            $result = ExternalDatasetManager::getBAG($id);
            Flight::json(HttpHandler::createResponse(200, $result));
        });
        
    }

    private static function suggestBAG($query)
    {
        $url = ExternalDatasetManager::$overheidIOUrl . "/suggest/bag/${query}" . ExternalDatasetManager::$overheidIOAPIGETUrl;

        return ExternalDatasetManager::fetchResults($url);
    }

    private static function queryBAG($postalcode, $housenumber, $housenumberadd)
    {
        $url = ExternalDatasetManager::$overheidIOUrl . "/api/bag" . ExternalDatasetManager::$overheidIOAPIGETUrl .
            "&filters[postcode]=" . $postalcode .
            "&query=" . $housenumber . "&queryfields[]=huisnummer";

        $results = ExternalDatasetManager::fetchResults($url);

        if ($results->totalItemCount > 0)
        {
            $match = $results->_embedded->adres[0];
            $match->exact = FALSE;
            foreach($results->_embedded->adres as $adres)
            {
                if (strtolower($adres->huisletter) == strtolower(trim($housenumberadd)))
                {
                    $match = $adres;
                    $match->exact = TRUE;
                }
            }
        }

        if ($match->url != "")
        {
            $matchdetails = ExternalDatasetManager::getBAG($match->url);

            unset($matchdetails->_links);
            $matchdetails->exact = $match->exact;

            return $matchdetails;
        }
        else
        {
            return null;
        }
    }

    private static function getBAG($bagUrl)
    {
        $url = ExternalDatasetManager::$overheidIOUrl . "/api/bag" .
            "/" . $bagUrl . 
            ExternalDatasetManager::$overheidIOAPIGETUrl;

        return ExternalDatasetManager::fetchResults($url);
    }

    private static function fetchResults($url)
    {
        $urltostore = str_replace(ExternalDatasetManager::$overheidIOAPIKey, '<apikey>', $url);

        // fb($url);
        // fb($urltostore);

        $bean = R::findOne('externaldatacache', ' url = ? ', [ $urltostore ]);
        // print_r($bean);
        // exit();

		if ($bean == null)
        {
            $arrContextOptions=array(
                "ssl"=>array(
                    "verify_peer"=>false,
                    "verify_peer_name"=>false,
                ),
            );

            $jsonfile = file_get_contents($url, false, stream_context_create($arrContextOptions));

            $bean = R::dispense('externaldatacache');
            $bean->url = $urltostore;
            $bean->json = $jsonfile;

            R::store($bean);
        }
        else
        {
            $jsonfile = $bean->json;
        }
        return json_decode($jsonfile);
    }
   

}

ExternalDatasetManager::init();