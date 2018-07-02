<?php

require('config.php');
require('display_functions.php');

function displaySettings()
{
  // showSelectedSite();

	echo "<a class=\"btn btn-default\" href=\"edit_setting.php\">Toevoegen...</a><br/><br/>";

  $settings = R::findAll($GLOBALS['settings_table'], ' ORDER BY name ');

  foreach ($settings as $key => $setting) {
    displaySetting($setting);
  }
}



include('header.php');
displaySettings();
include('footer.php');



