<?php

class ReportManager
{
    public static function registerRoutes($apiName)
	{
        Flight::route("GET /${apiName}", function() {
            $array = self::getReports();
            Flight::json(HttpHandler::createResponse(200, $array));
        });

        Flight::route("GET /${apiName}/template", function() {
            $reports = self::getReports();

            // print_r($reports);
            echo "<div *ngIf='report && parameters && datasets'>\n\n";

            if (count($reports) > 0) {
                foreach ($reports as $report) {
                    echo "<div *ngIf='report.id == " . $report['id'] . "'>\n\n";
                    echo $report['template'];
                    echo "\n\n</div>\n";
                }
            }

            echo "\n\n</div>";

            // exit();
            // // Flight::json(HttpHandler::createResponse(200, $array));
        });

        Flight::route("GET /${apiName}/@id/data/debug/@params/@format", function($id, $params, $format) {
            $array = ReportManager::runReport($id, $params, TRUE);            
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("GET /${apiName}/@id/data/@params/@format", function($id, $params, $format) {
            $report = ReportManager::getReport($id);
            $array = ReportManager::runReport($id, $params, FALSE);
            if ($format == 'JSON') {            
                Flight::json(HttpHandler::createResponse(200, $array));
            }
            else if ($format == 'CSV') {
                $string = ReportManager::generateCSV($array);
                ReportManager::sendDownload($string, 'text/plain', $report->filename . '.csv');
                exit();
            }
            else {
                throw new Exception('File format not supported.');
            }

        }
        );

        Flight::route("GET /${apiName}/@name", function($name) {
            $array = R::getRow("SELECT id, title, name, enabled, description, template FROM report WHERE name = ? ", [ $name ] );
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );
    }

    private static function getReports() 
    {
        $array = R::getAll( "SELECT id, title, name, enabled, description, template FROM report WHERE enabled = 'ENABLED' " );
        return $array;
    }


    private static function getReport($id) 
    {
        $bean = R::findOne('report', " id = ? ", [ $id ] );
        return $bean;
    }

    private static function runReport($id, $params, $debug)
    {
        $bean = self::getReport($id);

        $toReturn = array();

        for ($i=1; $i <= 5; $i++) 
        { 
            $toReturn['dataset' . $i] = self::runDataset($bean, $i, $params, $debug);
        }

        if ($debug)
        {
            exit();
        }

        return $toReturn;
    }

    private static function runDataset($bean, $datasetNo, $params, $debug)
    {
        $field = 'sql' . $datasetNo;

        $sql = self::prepareSQL($bean, $field);

        return self::runSQL($sql, $params, $debug);
    }

    private static function prepareSQL($bean, $field)
    {
        $sql = $bean->$field;

        $vars = self::getVars($sql);

        if (count($vars) > 0)
        {
            foreach ($vars as $var) 
            {
                if ($var == $field) 
                {
                    throw new Exception("Direct recursion detected. Don't include [[$var]] in $field (and please don't try to make a circular reference ;-)).");
                }

                $toReplace = '[[' . $var . ']]';

                $replacementText = self::prepareSQL($bean, $var);
                $sql = str_replace($toReplace, $replacementText, $sql);
            }
        }
        return $sql;
    }


    private static function getVars($sqlText)
    {
        // matches [((variable.var))]
        preg_match_all('~\[\[([\w|\.]*)\]\]~', $sqlText, $vars);
        $vars = $vars[1];
        array_unique($vars);
        return $vars;
    }

    private static function getStringBetween($string, $start, $end)
    {
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

    private static function runSQL($sql, $params, $debug) 
    {
        $sql = trim($sql);

        if (strlen($sql) == 0)
        {
            return NULL;
        }

        $neededParams = self::findParams($sql);
        $noOfNeededParams = count($neededParams);
                
        if (strlen($params) > 0)
        {
            $p_array = explode ( ":", $params );
        }
        else
        {
            $p_array = array();
        }

        if (count($p_array) > 9)
        {
            throw new Exception('Invalid number of parameters for report.');
        }

        $namedParams = array();

        for($i = 0; $i < count($p_array); $i++)
        {
            $namedParams[':param' . ($i + 1)] = $p_array[$i];
        }

        $bindParams = array();

        for($i = 0; $i < $noOfNeededParams; $i++)
        {
            $paramName = $neededParams[$i]; 
            $bindParams[$paramName] = $namedParams[$paramName];
        }


        if (self::containsSecurityId($sql)) {
            $securityid = PartyAccountManager::getSignedInPartyAccountId();
            $bindParams[':securityid'] = $securityid;
        }

        if ($debug)
        {
            echo "<pre>";

            echo "\n\n-----------------------------------------\n"; 

            echo "\n\nParamstring from URL\n";
            print_r($params);
            echo "\n";

            echo "\n\nParams from URL with a name\n";
            print_r($namedParams);
            echo "\n";

            echo "\n\nParams from SQL\n";
            print_r($neededParams);
            echo "\n";
            
            echo "\n\nBind params passed to SQL\n";
            print_r($bindParams);
            echo "\n";

            print_r($sql);
            echo "\n";

            echo "</pre>";
        }

        try 
        {
            $array = R::getAll($sql, $bindParams);
        } 
        catch (Exception $e)
        {
            if ($debug)
            {
                echo "<pre>";
                echo "Caught exception: ",  $e->getMessage(), "\n";
                echo "</pre>";
            }
            else
            {
                throw $e;
            }
        }

        return $array;
    }

    private static function sendDownload($string, $contentType, $filename) {
        $sendAttachmentHeader = TRUE;
        $attachment = "";
        if ($sendAttachmentHeader)
        {
            $attachment = " attachment;";
        }

        ignore_user_abort(true);
        $fsize = strlen($string);
        header("Content-type: ".$contentType);
        header("Content-Disposition:${attachment} filename=\"".$filename."\"");
        // header("Content-length: $fsize");
        header("Cache-control: private"); 
        echo $string;
    }

    private static function generateCSV($array) {
        $stream = fopen('php://temp' . "", 'w+');
        
        if (count($array) > 0)
        {
            $row = $array[0];
            $headings = array();
            foreach($row as $key => $value)
            {
                $headings[] = $key;
            }
            fputcsv($stream, $headings);
        }
        
        foreach ($array as $val) {
            fputcsv($stream, $val);
        }
        rewind($stream);
        $string = stream_get_contents($stream);
        fclose($stream);
        return $string;
    }

    private static function findParams($sql) {
        preg_match_all('/:param[0-9]+/', $sql, $matches);
        if (count($matches[0]) > 0) {
            $unique = array_unique($matches[0]);
            sort($unique);
        }
        return $unique;
    }

    private static function containsSecurityId($sql) {
        preg_match_all('/:securityid/', $sql, $matches);
        if (count($matches[0]) > 0) {
            return TRUE;
        }
        return FALSE;
    }

    
}