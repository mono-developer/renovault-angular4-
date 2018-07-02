<?php

require('config.php');

// HANDLE POST 
if (isset($_POST['name']))
{
	$report = R::load($GLOBALS['report_table'], $_POST['id']);

	$report->name = $_POST['name'];
	$report->title = $_POST['title'];
	$report->description = $_POST['description'];
	$report->filename = $_POST['filename'];
	$report->sql1 = $_POST['sql1'];
	$report->sql2 = $_POST['sql2'];
	$report->sql3 = $_POST['sql3'];
	$report->sql4 = $_POST['sql4'];
	$report->sql5 = $_POST['sql5'];
	$report->enabled = $_POST['enabled'];
	$report->template = $_POST['template'];

	R::store($report);

	header("Location: show_reports.php");
	exit();
}
// EDIT
else if (isset($_GET['id'])) 
{
	$report = R::load($GLOBALS['report_table'], $_GET['id']);
	$checked[$report->enabled] = "checked";
}
// ADD NEW
else
{
	$report = R::dispense($GLOBALS['report_table']);
	$report->enabled = 'ENABLED';	
}

include('header.php');

echo <<<EOL
<div class="row">
  <div class="col-md-2"></div>
  <div class="col-md-8 well">
		Variabelen:<br/>
        :securityid<br/>
				:param1 - reference_table<br/>
				:param2 - reference_id<br/>
				:param3 - reference_string<br/>
				:param4 - tag to filter for<br/>
				:param5 - comma separated questiontree ids to EXclude (tagged with 'houseparts')<br/>
	</div>
</div>
EOL;


echo <<<EOL

<div class="row">
  <div class="col-md-2"></div>
  <div class="col-md-8">

	<form action="edit_report.php" method="POST">
	  <div class="form-group">
	  	<input type="hidden" name="id" value="{$report->id}">
	    <label for="name">Name</label>
	    <input type="text" class="form-control" id="name" name="name" value="{$report->name}">
	  </div>
	  <div class="form-group">
	    <label for="title">Title</label>
	    <input type="text" class="form-control" id="title" name="title" value="{$report->title}">
	  </div>
	  <div class="form-group">
	    <label for="description">Description</label>
        <textarea class="form-control custom-control" rows="8" id="description" name="description">{$report->description}</textarea>
	  </div>
	  <div class="form-group">
	    <label for="filename">Bestandsnaam voor download</label>
	    <input type="text" class="form-control" id="filename" name="filename" value="{$report->filename}">
	  </div>

	  <div class="form-group">
	    <label for="enabled">Enabled</label>
			<div class="radio">
			  <label><input type="radio" name="enabled" value="ENABLED" {$checked['ENABLED']} >ENABLED</label>
			</div>	     	
			<div class="radio">
				<label><input type="radio" name="enabled" value="DISABLED" {$checked['DISABLED']} >DISABLED</label>
			</div>
	  </div>	  
	  <div class="form-group">

	  <div class="form-group">
	    <label for="sql1">SQL 1</label>
        <textarea class="form-control custom-control" rows="8" id="sql1" name="sql1">{$report->sql1}</textarea>
	  </div>
	  <div class="form-group">
	    <label for="sql2">SQL 2</label>
        <textarea class="form-control custom-control" rows="8" id="sql2" name="sql2">{$report->sql2}</textarea>
	  </div>
	  <div class="form-group">
	    <label for="sql3">SQL 3</label>
        <textarea class="form-control custom-control" rows="8" id="sql3" name="sql3">{$report->sql3}</textarea>
	  </div>
	  <div class="form-group">
	    <label for="sql4">SQL 4</label>
        <textarea class="form-control custom-control" rows="8" id="sql4" name="sql4">{$report->sql4}</textarea>
	  </div>
	  <div class="form-group">
	    <label for="sql5">SQL 5</label>
        <textarea class="form-control custom-control" rows="8" id="sql5" name="sql5">{$report->sql5}</textarea>
	  </div>


	  <div class="form-group">
	    <label for="sql">Template</label>
        <textarea class="form-control custom-control" rows="8" id="template" name="template">{$report->template}</textarea>
	  </div>



	  <button type="submit" class="btn btn-default">Opslaan</button>
	</form>


  </div>
  <div class="col-md-2"></div>
</div>
EOL;


include('footer.php');


