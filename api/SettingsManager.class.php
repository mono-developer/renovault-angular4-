<?php

class SettingsManager
{
    public static function registerRoutes($apiName)
	{
        Flight::route("GET /${apiName}", function() {
            $array = self::getSettings();
            Flight::json(HttpHandler::createResponse(200, $array));
        });
    }

    public static function getSettings()
    {
        $array = array();

        $all = R::findAll('settings');   
        
        // turn into array
        foreach ($all as $bean) 
        {
            $setting = CrudBeanHandler::exportBean($bean);

            // replace content items
            if ($setting['type'] == 'VALUEFROMCONTENTITEM')
            {
                $contentitemname = $setting['value'];
                $setting['value'] = ContentItemManager::getCurrentLanguageContentItem($contentitemname);
            }

            $array[] = $setting;
        }
        
        // optionally override setting value based on logged on user
        $partyaccount = PartyAccountManager::getSignedInPartyAccount();

        if ($partyaccount != null)
        {
            $settings_array = json_decode($partyaccount->settings);
            
            if ($settings_array != null) 
            {
                foreach($settings_array as $key => $value)
                {
                    $a = explode('=', $value);
                    if (count($a) == 2)
                    {
                        $name = $a[0];
                        $setting = $a[1];
                        
                        $array = self::overrideSetting($array, $name, $setting);
                    }
                }
            }
        }
        return $array;
    }

    public static function getSetting($settingKey)
    {
        $settings = self::getSettings();

        $settingValue = self::findSetting($settings, $settingKey);
        
        return $settingValue;
    }

    private static function findSetting($settings, $name)
    {
        foreach($settings as $key => $value)
        {
            if ($value['name'] == $name)
            {
                return $value['value'];
            }
        }
        return $settings;
    }

    private static function overrideSetting($settings, $name, $setting)
    {
        foreach($settings as $key => $value)
        {
            if ($value['name'] == $name)
            {
                $settings[$key]['value'] = $setting;
                $settings[$key]['override'] = TRUE;
            }
        }
        return $settings;
    }
}