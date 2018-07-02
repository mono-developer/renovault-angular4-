<?php

require('config.php');
require('display_functions.php');

// HANDLE POST 
if (isset($_POST['action']) && isset($_POST['id']))
{
	$action = $_POST['action'];
	$party = R::load($GLOBALS['party_table'], $_POST['id']);

	if ($action == 'save')
	{
		$party->login = $_POST['login'];
		$party->settings = $_POST['settings'];

		if (isset($_POST['settings']))
		{
			$settings = $_POST['settings'];
			
			$settings = trim($settings);
			$settings = str_replace(array("\t", "\r"), '', $settings);
			$settings_array = explode("\n", $settings);

			$settings_json = json_encode($settings_array);	
			$party->settings = $settings_json;
		}
		
		SecurityManager::adminSetAdminVariable();
		R::store($party);
		SecurityManager::adminUnSetAdminVariable();
	}
	else if ($action == 'deleteData')
	{
		// delete data here...
	}
	else if ($action == 'accept')
	{
		$party->registrationstep = 'ACCEPTED';
		$party->accountopen = TRUE;

		SecurityManager::adminSetAdminVariable();
		R::store($party);
		SecurityManager::adminUnSetAdminVariable();
		
		$message = ContentItemManager::getAllNLContentItem('email.accepted.message');
		$subject = ContentItemManager::getAllNLContentItem('email.accepted.subject');
		
		EmailManager::adminSendEmail($party->login, $subject, $message, $party->securityid);
		EmailManager::adminSendEmail(SettingsManager::getSetting('email.fromaddress'), "TER INFO - Gebruiker geaccepteerd: " . $party->login, "<automatisch gegenereerd bericht>De gebruiker is geaccepteerd.", NULL);
		
	}
	else if ($action == 'refuse')
	{
		$party->registrationstep = 'REFUSED';
		$party->accountopen = FALSE;
		SecurityManager::adminSetAdminVariable();
		R::store($party);
		SecurityManager::adminUnSetAdminVariable();
		
		$message = ContentItemManager::getAllNLContentItem('email.declined.message');
		$subject = ContentItemManager::getAllNLContentItem('email.declined.subject');
		
		EmailManager::adminSendEmail($party->login, $subject, $message, $party->securityid);
		EmailManager::adminSendEmail(SettingsManager::getSetting('email.fromaddress'), "TER INFO - Gebruiker geweigerd: " . $party->login, "<automatisch gegenereerd bericht>De gebruiker is geweigerd.", NULL);
	}
	else if ($action == 'open')
	{
		$party->accountopen = TRUE;
		SecurityManager::adminSetAdminVariable();
		R::store($party);
		SecurityManager::adminUnSetAdminVariable();
		EmailManager::adminSendEmail(SettingsManager::getSetting('email.fromaddress'), "TER INFO - Gebruiker gedeblokkeerd: " . $party->login, "<automatisch gegenereerd bericht>De gebruiker is gedeblokkeerd.", NULL);
	}
	else if ($action == 'lock')
	{
		$party->accountopen = FALSE;
		SecurityManager::adminSetAdminVariable();
		R::store($party);
		SecurityManager::adminUnSetAdminVariable();
		EmailManager::adminSendEmail(SettingsManager::getSetting('email.fromaddress'), "TER INFO - Gebruiker geblokkeerd: " . $party->login, "<automatisch gegenereerd bericht>De gebruiker is geblokkeerd.", NULL);
	}

	header("Location: show_parties.php");
	exit();
}
// EDIT
else if (isset($_GET['id'])) 
{
	$party = R::load($GLOBALS['party_table'], $_GET['id']);

	$settings_array = json_decode($party->settings);
	if (!empty($settings_array))
	{
		$settings_string = implode("\n", $settings_array);
	}

	$objects = R::find( 'object', ' securityid = ? ', [ $party->securityid ] );

}
// ADD NEW
else
{
	// $party = R::dispense($GLOBALS['party_table']);
	header("Location: show_parties.php");
	exit();
}

include('header.php');

echo <<<EOL

<div class="row">
  <div class="col-md-2"></div>
  <div class="col-md-4">


	<form action="edit_party.php" method="POST">
	  <div class="form-group">
      <label for="login">Login</label>
      <input type="text" class="form-control" id="login" name="login" value="{$party->login}">
	  <div class="form-group" id="settings_container">
	    <label for="settings">Overrule settings</label>
	    <textarea class="form-control custom-control" rows="6" id="settings" name="settings">{$settings_string}</textarea>
	  </div>
  	  <input type="hidden" name="id" value="{$party->id}">
	  <input type="hidden" name="action" value="save">
	  <button type="submit" class="btn btn-default">Opslaan</button>
	  </div>
	</form>

	<form action="edit_party.php" method="POST">
	  <div class="form-group">
  	  <input type="hidden" name="id" value="{$party->id}">
	  <input type="hidden" name="action" value="deleteData">
	  <button class="btn btn-default" disabled>Verwijder Alle Gegevens</button>
	  </div>
	</form>

EOL;

if ($party->registrationstep == 'CONFIRMED')
{
	echo <<<EOL
	<form action="edit_party.php" method="POST">
	  <div class="form-group">
	  	<input type="hidden" name="id" value="{$party->id}">
	  	<input type="hidden" name="action" value="accept">
	    <button type="submit" class="btn btn-default">Accepteer gebruiker</button>
	  </div>
	</form>
	<form action="edit_party.php" method="POST">
	  <div class="form-group">
	  	<input type="hidden" name="id" value="{$party->id}">
	  	<input type="hidden" name="action" value="refuse">
	    <button type="submit" class="btn btn-default">Weiger gebruiker</button>
	  </div>
	</form>
EOL;
}


if ($party->registrationstep == 'ACCEPTED' || $party->registrationstep == 'REFUSED')
{
	if ($party->accountopen == FALSE)
	{
		echo <<<EOL
		<form action="edit_party.php" method="POST">
			<div class="form-group">
				<input type="hidden" name="id" value="{$party->id}">
				<input type="hidden" name="action" value="open">
			    <button type="submit" class="btn btn-default">Deblokkeer gebruiker</button>
			</div>
		</form>
EOL;
	}

	if ($party->accountopen == TRUE)
	{
		echo <<<EOL
		<form action="edit_party.php" method="POST">
			<div class="form-group">
				<input type="hidden" name="id" value="{$party->id}">
				<input type="hidden" name="action" value="lock">
			</div>
			<button type="submit" class="btn btn-default">Blokkeer gebruiker</button>
		</form>
EOL;
	}
}
echo <<<EOL
  </div>
  <div class="col-md-4">
EOL;

foreach ($objects as $key => $value) {
	$arr = $value->export();
	echo "Object: " . $arr['id'] . "<br/>";
	myprint_r($arr); 
}



echo <<<EOL
    </div>
</div>
EOL;


include('footer.php');
