<?php

require('config.php');
require('display_functions.php');

function displayReports()
{
  
	echo "<a class=\"btn btn-default\" href=\"edit_report.php\">Toevoegen...</a>";

  $reports = R::findAll($GLOBALS['report_table'], ' ORDER BY name ');

  foreach ($reports as $key => $report) {
    displayReport($report);
  }
}



include('header.php');
displayReports();
include('footer.php');



