<?php

class DebugManager
{
    private static $debug;

    public static function init()
    {
        DebugManager::$debug = (getenv('DEV_OR_DIST') == 'DEV');
    }


    public static function registerRoutes($apiName)
	{
        if (DebugManager::$debug) 
        {

            Flight::route("GET /${apiName}", function() 
            {
                DebugManager::showHome();
            });

            Flight::route("GET /${apiName}/routes", function() 
            {
                DebugManager::showRoutes();
            });

            Flight::route("GET /${apiName}/session", function() 
            {
                DebugManager::showSession();
            });
        
        }
        

    }

    private static function showHome()
    {
        echo "<h1>API Debug</h1>";
        // echo "<div><a href='/api/debug'>API Debug home</a></div>";
        echo "<div><a href='/api/debug/routes'>Routes</a></div>";
        echo "<div><a href='/api/debug/session'>Session</a></div>";
        echo "<div><a href='/api/debug/databasecode'>Database Code</a></div>";
        exit();
    }

    private static function showRoutes()
    {
        $app = Flight::app();
        // print_r($app);
        // exit();

        $loader = DebugManager::getPropertyValue($app, 'loader');
        $instances = DebugManager::getPropertyValue($loader, 'instances');
        $router = $instances['router'];
        $routes = DebugManager::getPropertyValue($router, 'routes');

        foreach($routes as $route)
        {
            // echo "<pre>";
            // print_r($route);
            // echo "</pre>";
            
            $method = $route->methods[0];

            echo $method;

            if ($method == 'GET')
            {
                echo "<a href='/api" . $route->pattern . "'>" . $route->pattern . "</a>";
            }
            else
            {
                echo $route->pattern;
            }
            echo "<br/>";
        }
        exit();
    }
    
    private static function getPropertyValue($object, $propertyName)
    {
        $reflector = new ReflectionObject($object);
        $properties = $reflector->getProperties();
        foreach($properties as $property)
        {
            if ($property->getName() == $propertyName)
            {
                $property->setAccessible(true);
                $value = $property->getValue($object);
                return $value;
            }
        }

    }

    private static function showSession()
    {
        echo "<pre>";
        print_r($_SESSION);
        echo "</pre>";
        exit();
    }


}

DebugManager::init();