<?php

require('config.php');
require('display_functions.php');

// HANDLE POST 
if (isset($_POST['name']) && isset($_POST['value']))
{
	$setting = R::load($GLOBALS['settings_table'], $_POST['id']);

	$setting->name = $_POST['name'];
	$setting->description = $_POST['description'];
	$setting->value = $_POST['value'];
	$setting->type = $_POST['type'];
	
	R::store($setting);

	header("Location: show_settings.php");
	exit();
}
// EDIT
else if (isset($_GET['id'])) 
{
	$setting = R::load($GLOBALS['settings_table'], $_GET['id']);

	$checkedType[$setting->type] = "checked";
}
// ADD NEW
else
{
	$setting = R::dispense($GLOBALS['settings_table']);

	$checkedType['VALUE'] = "checked";
}

include('header.php');

// showSelectedSite();

echo <<<EOL

<div class="row">
  <div class="col-md-4"></div>
  <div class="col-md-4">

	<form action="edit_setting.php" method="POST">
	  <div class="form-group">
	  	<input type="hidden" name="id" value="{$setting->id}">
	    <label for="name">Name</label>
	    <input type="text" class="form-control" id="name" name="name" value="{$setting->name}">
	  </div>
	  <div class="form-group">
	    <label for="description">Beschrijving</label>
	    <input type="text" class="form-control" id="description" name="description" value="{$setting->description}">
		</div>
		
		<div id="type_container">
		<div class="form-group">
			<label for="type">Type</label>
			<div class="radio">
				<label><input type="radio" name="type" value="VALUE" {$checkedType['VALUE']}>VALUE</label>
				</div>	     	
				<div class="radio">
				<label><input type="radio" name="type" value="VALUEFROMCONTENTITEM" {$checkedType['VALUEFROMCONTENTITEM']}>VALUEFROMCONTENTITEM</label>
			</div>
		</div>
		</div>

	  <div class="form-group">
	    <label for="value">Waarde</label>
	    <input type="text" class="form-control" id="value" name="value" value="{$setting->value}">
	  </div>
	  <button type="submit" class="btn btn-default">Opslaan</button>
	</form>


  </div>
  <div class="col-md-4"></div>
</div>
EOL;


include('footer.php');


