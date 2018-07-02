<?php

require('config.php');
require('display_functions.php');

function displaySites()
{
  showSelectedSite();
  
  echo "<a class=\"btn btn-default\" href=\"edit_site.php\">Toevoegen...</a><br/><br/>";


  $sites = R::findAll($GLOBALS['sites_table'], ' ORDER BY id ');

  foreach ($sites as $key => $site) {
    displaySite($site);
  }
}



include('header.php');
displaySites();
include('footer.php');



