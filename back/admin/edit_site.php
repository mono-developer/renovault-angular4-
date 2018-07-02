<?php

require('config.php');
require('display_functions.php');

// HANDLE POST 
if (isset($_POST['name']) && $_POST['action'] == 'UPDATE')
{
	$site = R::load($GLOBALS['sites_table'], $_POST['id']);

	$site->name = $_POST['name'];
	$site->description = $_POST['description'];

	if (isset($_POST['hosts']))
	{
		$hosts = $_POST['hosts'];
		
		$hosts = trim($hosts);
		$hosts = str_replace(array("\t", "\r"), '', $hosts);
		$hosts_array = explode("\n", $hosts);

		$hosts_json = json_encode($hosts_array);	
		$site->hosts = $hosts_json;
	}

	R::store($site);

	header("Location: show_sites.php");
	exit();
}
if (isset($_POST['id']) && isset($_POST['name']) && $_POST['action'] == 'SELECTSITE')
{
	setSelectedSite($_POST['id'], $_POST['name']);
	
	header("Location: show_sites.php");
	exit();
}
if (isset($_POST['id']) && isset($_POST['name']) && $_POST['action'] == 'DESELECTSITE')
{
	unsetSelectedSite();

	header("Location: show_sites.php");
	exit();
}
// EDIT
else if (isset($_GET['id'])) 
{
	$site = R::load($GLOBALS['sites_table'], $_GET['id']);

	$hosts_array = json_decode($site->hosts);
	if (!empty($hosts_array))
	{
		$hosts_string = implode("\n", $hosts_array);
	}


}
// ADD NEW
else
{
	$site = R::dispense($GLOBALS['sites_table']);
}

include('header.php');

showSelectedSite();

echo <<<EOL

<div class="row">
  <div class="col-md-4"></div>
  <div class="col-md-4">

	<form action="edit_site.php" method="POST">
	  <div class="form-group">
	  	<input type="hidden" name="id" value="{$site->id}">
	    <label for="name">Name</label>
	    <input type="text" class="form-control" id="name" name="name" value="{$site->name}">
	  </div>
	  <div class="form-group">
	    <label for="description">Description</label>
	    <input type="text" class="form-control" id="description" name="description" value="{$site->description}">
		</div>
		<div class="form-group" id="hosts_container">
			<label for="hosts">Hosts</label>
			<textarea class="form-control custom-control" rows="6" id="hosts" name="hosts">{$hosts_string}</textarea>
		</div>
		<input type="hidden" value="UPDATE" name="action">
	  <button type="submit" class="btn btn-default">Save</button>
	</form>


  </div>
  <div class="col-md-4"></div>
</div>
EOL;


include('footer.php');


