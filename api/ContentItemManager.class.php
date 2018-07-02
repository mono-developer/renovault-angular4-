<?php

require_once('SiteManager.class.php');

class ContentItemManager
{
    const SESS_ARRAY_ID = 'contentitem';

    public static function registerRoutes($apiName)
	{
        Flight::route("GET /${apiName}/setSessionLanguageAndRedirect/@language", function($language) {

            self::setSessionLanguage($language);

            header("Location: /");
            exit();	
        });

        Flight::route("GET /${apiName}/getSessionLanguage", function() {
            $posted = HttpHandler::handleRequest();

            $result = self::getSessionLanguage();

            Flight::json(HttpHandler::createResponse(200, $result));	
        });

        Flight::route("GET /${apiName}", function() {
            $array = self::getCurrentLanguageContentItems();            
            Flight::json($array);
        });


        Flight::route("GET /${apiName}/value/@name(/@contenttype)", function($name, $contenttype) {
            $text = self::getCurrentLanguageContentItem($name);
            if ($contenttype != NULL) {
                header("Content-type: " . urldecode($contenttype));
            }
            echo $text;
        });

        Flight::route("GET /${apiName}/@language", function($language) {
            $array = self::getContentItems($language);            
            Flight::json($array);
        });


        Flight::route("GET /${apiName}/@language/value/@name(/@contenttype)", function($language, $name, $contenttype) {
            $text = self::getContentItem($language, $name);
            echo $text;
        });

    }

    public static function setSessionLanguage($language) 
    {
        $_SESSION[self::SESS_ARRAY_ID]['language'] = $language;
    }
    
    public static function getSessionLanguage()
    {
        $language = 'nl';
        if (isset($_SESSION[self::SESS_ARRAY_ID]) && isset($_SESSION[self::SESS_ARRAY_ID]['language']))
        {
            $language = $_SESSION[self::SESS_ARRAY_ID]['language'];
        }
        return $language;
    }

    // get functions that query
    private static function getContentItemsQuery($where, $params)
    {
        $query = "
            SELECT 
                case when ownci.id is not null then ownci.id else parentci.id end id, 
                parentci.name, 
                parentci.type, 
                case when ownci.id is not null then ownci.description else parentci.description end description, 
                case when ownci.id is not null then ownci.translation else parentci.translation end translation, 
                case when ownci.id is not null then ownci.text else parentci.text end text,
                case when ownci.id is not null then ownci.texten else parentci.texten end texten, 
                case when ownci.id is not null then ownci.textde else parentci.textde end textde, 
                case when ownci.id is not null then ownci.textfr else parentci.textfr end textfr, 
                parentci.template, 
                case when ownci.id is not null then ownci.siteid else parentci.siteid end siteid, 
                case when ownci.id is not null then ownci.parentid else parentci.parentid end parentid
            FROM 
                contentitem parentci 
                left outer join contentitem ownci on ownci.parentid = parentci.id and ownci.siteid = :siteid
            WHERE 
                parentci.siteid = 0";
                
        $params[':siteid'] = SiteManager::getCurrentSiteId();

        $toReturn = R::getAll("SELECT * FROM ( {$query} ) s WHERE {$where} ORDER BY name", $params);
        // print_r($toReturn);
        // exit();
        return $toReturn;
    }

    public static function getContentItems($language)
    {
        $where = " type <> :type ";
        $params[':type'] = 'EMAIL';
        $all = self::getContentItemsQuery($where, $params);
        
        $array = array();
        foreach ($all as $bean) 
        {
            $array[$bean['name']] = self::getTranslationFromBean($language, $bean);
        }
        return $array;
    }

    public static function getAllContentItems($language)
    {
        $where = " 1 = 1 ";
        $params = [];
        $all = self::getContentItemsQuery($where, $params);

        $array = array();
        foreach ($all as $bean) 
        {
            $array[$bean['name']] = self::getTranslationFromBean($language, $bean);
        }
        return $array;
    }

    public static function getContentItem($language, $name)
    {
        $where = "  name = :name and type <> 'EMAIL' ";
        $params[':name'] = $name;
        $all = self::getContentItemsQuery($where, $params);
        // print_r($all);
        if (count($all == 1)) 
        {
            $bean = $all[0];
            return self::getTranslationFromBean($language, $bean);
        }
        return NULL;
    }

    public static function getAllContentItem($language, $name)
    {
        $where = " name = :name ";
        $params[':name'] = $name;
        $all = self::getContentItemsQuery($where, $params);
        // print_r($all);
        if (count($all == 1)) 
        {
            $bean = $all[0];
            return self::getTranslationFromBean($language, $bean);
        }
        return NULL;
    }

    // get functions that call others
    public static function getCurrentLanguageContentItems()
    {
        $language = self::getSessionLanguage();
        return self::getContentItems($language);
    }


    public static function getCurrentLanguageContentItem($name)
    {
        $language = self::getSessionLanguage();
        $item = self::getContentItem($language, $name);
        return $item;
    }

    public static function getAllCurrentLanguageContentItems()
    {
        $language = self::getSessionLanguage();
        return self::getAllContentItems($language);
    }


    public static function getAllCurrentLanguageContentItem($name)
    {
        $language = self::getSessionLanguage();
        $item = self::getAllContentItem($language, $name);
        return $item;
    }

    public static function getNLContentItem($name)
    {
        return self::getContentItem('nl', $name);
    }


    public static function getAllNLContentItem($name)
    {
        return self::getAllContentItem('nl', $name);
    }
    

    private static function getTranslationFromBean($language, $bean)
    {
        
        $toReturn = '';
        
        if ($bean['translation'] == 'ENABLED' && $language != 'nl')
        {
            $field = 'text' . $language;
            $toReturn = $bean[$field];
        }
        else
        {
            $toReturn = $bean['text'];
        }

        // print_r($bean);
        if ($bean['template'] != "")
        {
            $toReturn = self::processTemplate($language, $toReturn, $bean['template']);
        }

        $toReturn = self::replaceOtherContentItems($language, $toReturn);

        return $toReturn;
    }

    private static function replaceOtherContentItems($language, $input)
    {
        // matches [[contentitem.item]]
        preg_match_all('~\[\[([\w|\.]*)\]\]~', $input, $matches);
        $matches = $matches[1];
        array_unique($matches);
        if (count($matches) > 0)
        {
            foreach ($matches as $match) 
            {
                $replacement = self::getAllContentItem($language, $match);
                $input = str_replace('[[' . $match . ']]', $replacement, $input);
            }
        }
        return $input;
    }

    private static function processTemplate($language, $input, $templateKey)
    {
        $templateText = self::getAllNLContentItem($templateKey);
        $toReturn = $templateText;
        $templateVars = self::getTemplateVarsFromText($templateText);
        if (count($templateVars) > 0)
        {
            foreach ($templateVars as $templateVar) 
            {
                $varToUse = '[((' . $templateVar . '))]';
                $replacementText[$templateVar] = self::getStringBetween($input, $varToUse, $varToUse);
                // $replacement = self::getAllContentItem($language, $input);
                $toReturn = str_replace($varToUse, $replacementText[$templateVar], $toReturn);
            }
        }

        return $toReturn;
        // print_r($input);
        // print_r("\n------------\n");
        // print_r($toReturn);
        // print_r("\n------------\n");
        // print_r($templateText);
        // print_r("\n------------\n");
        // print_r($templateVars);
        // print_r("\n------------\n");
        // print_r($replacementText);
        // print_r("\n------------\n");
        // exit();
    }

    public static function getTemplateVarsFromKey($templateKey)
    {
        $templateText = self::getAllNLContentItem($templateKey);
        $templateVars = self::getTemplateVarsFromText($templateText);
        return $templateVars;
    }

    public static function getTemplateExampleFromKey($templateKey)
    {
        $exampleTemplate = "";
        $templateVars = self::getTemplateVarsFromKey($templateKey);
        foreach ($templateVars as $key => $value) {
			$exampleTemplate .= "[(($value))]Some text here...[(($value))]\n";
		}
        return $exampleTemplate;
    }

    private static function getTemplateVarsFromText($templateText)
    {
        // matches [((variable.var))]
        preg_match_all('~\[\(\(([\w|\.]*)\)\)\]~', $templateText, $templateVars);
        $templateVars = $templateVars[1];
        array_unique($templateVars);
        return $templateVars;
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
}