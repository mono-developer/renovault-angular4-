<?php

require('config.php');
require('display_functions.php');

function displayParties()
{
  
	// echo "<a class=\"btn btn-default\" href=\"edit_party.php\">Toevoegen...</a>";

echo <<<EOL
<div class="row">
  <div class="col-md-2"></div>
  <div class="col-md-8 well">
		Registratiestappen zijn: CREATED - CONFIRMED - ACCEPTED of REFUSED<br/>
		Accountstatus is: OPEN of LOCKED
	</div>
</div>
EOL;

  $parties = R::findAll($GLOBALS['party_table'], ' ORDER BY login ');

  foreach ($parties as $key => $party) {
    displayParty($party);
  }
}



include('header.php');
displayParties();
include('footer.php');



