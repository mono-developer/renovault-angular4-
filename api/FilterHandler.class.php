<?php

require_once('SettingsManager.class.php');

class FilterHandler
{
    public static function getQuestionTreeFilterSQL($reference_table, $reference_id)
	{
        // excluded houseparts
        $sql = ' 1 = 1 ';
        if ($reference_table == 'object' || $reference_table == 'hoa') 
        {
            $b = R::load($reference_table, $reference_id);
            $housepartsexcluded = json_decode($b->housepartsexcluded);
            if ($housepartsexcluded != null && count($housepartsexcluded) > 0) 
            {
                $sql .= " AND questiontree.id NOT IN ( '-1'";
                foreach ($housepartsexcluded as $key => $value) 
                {
                    $sql .= ", '" . $value . "'";
                }
                $sql .= ")";
            }
        }

        // tagfiltertags
        $tags = null;
        if ($reference_table == 'object' || $reference_table == 'hoa') 
        {
            if (SettingsManager::getSetting("${reference_table}detail.tagfilters.overruledselection") != "")
            {
                $tags = json_decode(SettingsManager::getSetting("${reference_table}detail.tagfilters.overruledselection"));
            }

            if ($tags == null || count($tags) == 0)
            {
                $b = R::load($reference_table, $reference_id);
                $tags = json_decode($b->tagfiltertags);
            }
        }

        if ($tags != null && count($tags) > 0 && $tags[0] != '*') 
        {
            $sql .= " AND ( 1 = 2 ";
            foreach ($tags as $key => $value) 
            {
                $sql .= " OR questiontree.tags LIKE '%" . $value . "%' ";
            }
        } 
        else 
        {
            $sql .= " AND ( 1 = 1 ";
        }
        $sql .= " ) ";
        // fb($sql);
        return $sql;
    }
}