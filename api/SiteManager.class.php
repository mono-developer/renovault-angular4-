<?php

class SiteManager
{
    public static function getCurrentSiteId()
    {
        $currenthost = trim($_SERVER['HTTP_HOST']);
        
        $sites = R::findAll('site');
        foreach ($sites as $site) 
        {
            $hosts = $site->hosts;
            $hosts = json_decode($hosts);

            foreach($hosts as $host)
            {
                if (trim($host) == $currenthost)
                {
                    return $site->id;
                }
            }
        }
        return 0;
    }

}
