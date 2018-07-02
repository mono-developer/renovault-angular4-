<?php

require('config.php');
require('display_functions.php');

$typeInUrl = $_GET['type'];
if (!isset($typeInUrl) || strlen($typeInUrl) == 0)
{
  $typeInUrl = "APP";
}

// HANDLE POST 
if ($_POST['action'] == 'EDIT')
{
	$contentitem = R::load($GLOBALS['contentitem_table'], $_POST['id']);

	// has no parent
	if ($contentitem->parentid == "")
	{
		$contentitem->name = $_POST['name'];
		$contentitem->type = $_POST['type'];
		$contentitem->template = trim($_POST['template']);
	}

	$contentitem->description = $_POST['description'];
	$contentitem->text = $_POST['text'];
	$contentitem->texten = $_POST['texten'];
	$contentitem->textde = $_POST['textde'];
	$contentitem->textfr = $_POST['textfr'];
	$contentitem->translation = $_POST['translation'];
	$contentitem->siteid = $_POST['siteid'];
	
	R::store($contentitem);

	header("Location: show_contentitems.php?type=${typeInUrl}");
	exit();
}
else if (isset($_POST['id']) && isset($_POST['action']) && $_POST['action'] == 'COPY')
{
	if (getSelectedSite() != 0)
	{
		$contentitem = R::load($GLOBALS['contentitem_table'], $_POST['id']);
		$duplicated = R::duplicate($contentitem);

		// values to be taken from parent
		$duplicated->name = "(see parent)";
		$duplicated->type = "(see parent)";
		$duplicated->template = "(see parent)";

		$duplicated->siteid = getSelectedSite();
		$duplicated->parentid = $_POST['id'];
		R::store($duplicated);

		header("Location: show_contentitems.php?type=${typeInUrl}");
		exit();
	}
	else
	{
		header("Location: show_sites.php");
		exit();
	}
}
// EDIT
else if (isset($_GET['id'])) 
{
	$contentitem = R::load($GLOBALS['contentitem_table'], $_GET['id']);
	
	if ($contentitem->parentid != "")
	{
		$parent = R::load($GLOBALS['contentitem_table'], $contentitem->parentid);

		$contentitem->name = $parent->name;
		$contentitem->type = $parent->type;
		$contentitem->template = $parent->template;

		$infoAboutParent = "
		<div class='row'>
		  <div class='col-md-1'>
		  </div>
		  <div class='col-md-10 well'>
		    This is a copy content item specific for {$_SESSION['selectedsitename']}.  
		  </div>
		</div>";

		$nameDisabled = " disabled ";
		$typeDisabled = " disabled ";
		$templateDisabled = " disabled ";
	}



	$checked[$contentitem->type] = "checked";
	$checkedTranslation[$contentitem->translation] = "checked";
	$styleHideTranslation['DISABLED'] = "style='display:none;'";
	$styleHideTemplateContainer['TEMPLATE'] = "style='display:none;'";
	$styleHideTranslationContainer['TEMPLATE'] = "style='display:none;'";
	$styleHideTemplateContainer['SETTING'] = "style='display:none;'";
	$styleHideTranslationContainer['SETTING'] = "style='display:none;'";

	$exampleTemplate = "Enter the name of a template content item and save. Example content will then appear here...";
	if ($contentitem->template != "")
	{
		$templatecontentitem = R::findOne($GLOBALS['contentitem_table'], ' name = ? ', [$contentitem->template]);
		if ($templatecontentitem == NULL) 
		{
			$exampleTemplate = $contentitem->template . " is not an existing Content Item.";
		}
		else if ($templatecontentitem->type != 'TEMPLATE') 
		{
			$exampleTemplate = $contentitem->template . " is an existing Content Item, but not a TEMPLATE.";
		}
		else 
		{
			$exampleTemplate = "Example:<br/>";
			$exampleTemplate .= "<pre>";
			$exampleTemplate .= ContentItemManager::getTemplateExampleFromKey($contentitem->template);
			$exampleTemplate .= "</pre>";
		}
	}
}
// ADD NEW
else
{
	$contentitem = R::dispense($GLOBALS['contentitem_table']);
	$contentitem->type = $typeInUrl;	
	$contentitem->translation = 'ENABLED';
	$contentitem->siteid = 0;
	$contentitem->parentid = "";

	$checked[$typeInUrl] = "checked";
	$checkedTranslation['ENABLED'] = "checked";
}

include('header.php');

echo <<<EOL

<script>
function hide(elementId) {
	document.getElementById(elementId).style.display = 'none';
}

function show(elementId) {
	document.getElementById(elementId).style.display = 'inline';
}

function disableTranslation() {
	var elem = document.getElementById("translation_radio_disabled");
	elem.checked = true;
	/* simulate click */
	if (typeof elem.onclick == "function") {
		elem.onclick.apply(elem);
	}
}

function setDefaultExampleTemplate() {
	document.getElementById("template_example").innerHTML = 'You have made changes to the template. Please save this item, example content will then appear here...';
}
</script>
EOL;

showSelectedSite();

echo $infoAboutParent;

echo <<<EOL
<div class="row">
  <div class="col-md-1"></div>
  <div class="col-md-10">

	<form action="edit_contentitem.php?type=${typeInUrl}" method="POST">

		<div class="form-group">
	  	<input type="hidden" name="id" value="{$contentitem->id}">
	  	<input type="hidden" name="siteid" value="{$contentitem->siteid}">
	  	<input type="hidden" name="action" value="EDIT">
	    <label for="name">Name</label>
	    <input type="text" class="form-control" id="name" name="name" value="{$contentitem->name}" {$nameDisabled}>
		</div>

		<div class="form-group">
	    <label for="description">Description</label>
	    <input type="text" class="form-control" id="description" name="description" value="{$contentitem->description}">
		</div>
		
		<div class="form-group">
		<label for="type">Type</label>
		<div class="radio">
		<label><input type="radio" name="type" value="APP" {$checked['APP']} onClick="show('template_container'); show('translation_container');" {$typeDisabled}>APP</label>
		</div>	     	
		<div class="radio">
		<label><input type="radio" name="type" value="PAGE" {$checked['PAGE']} onClick="show('template_container'); show('translation_container');" {$typeDisabled}>PAGE</label>
		</div>	     	
		<div class="radio">
		<label><input type="radio" name="type" value="EMAIL" {$checked['EMAIL']} onClick="show('template_container'); show('translation_container');" {$typeDisabled}>EMAIL</label>
		</div>
		<div class="radio">
		<label><input type="radio" name="type" value="TEMPLATE" {$checked['TEMPLATE']} onClick="disableTranslation(); hide('template_container'); hide('translation_container');" {$typeDisabled}>TEMPLATE</label>
		</div>
		<div class="radio">
		<label><input type="radio" name="type" value="SETTING" {$checked['SETTING']} onClick="disableTranslation(); hide('template_container'); hide('translation_container');" {$typeDisabled}>SETTING</label>
		</div>
		</div>	  
		
		<div id="template_container" {$styleHideTemplateContainer[$contentitem->type]}>
		<div class="row">
			<div class="col-md-12">
				<label for="template">Template Content Item</label>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<div class="form-group">
	    		<input type="text" class="form-control" id="template" name="template" value="{$contentitem->template}" oninput="setDefaultExampleTemplate();" {$templateDisabled}>
				</div>
			</div>
			<div class="col-md-6">
				<div id="template_example">{$exampleTemplate}</div>
			</div>
		</div>
		</div>

		<div id="translation_container" {$styleHideTranslationContainer[$contentitem->type]}>
		<div class="form-group">
			<label for="translation">Translation</label>
			<div class="radio">
				<label><input type="radio" name="translation" value="ENABLED" {$checkedTranslation['ENABLED']} id="translation_radio_enabled" onClick="show('trans_en');show('trans_de');show('trans_fr');">ENABLED</label>
			</div>	     	
			<div class="radio">
				<label><input type="radio" name="translation" value="DISABLED" {$checkedTranslation['DISABLED']} id="translation_radio_disabled" onClick="hide('trans_en');hide('trans_de');hide('trans_fr');">DISABLED</label>
			</div>
		</div>
		</div>	  
		
		<div class="row">


			<div class="col-md-6">
				<div class="form-group">
				<label for="text">Content (default / nl)</label>
				<textarea class="form-control custom-control" id="text" name="text" style="height: 200px;">{$contentitem->text}</textarea>
				</div>
			</div>
			
			<div class="col-md-6" id="trans_en" {$styleHideTranslation[$contentitem->translation]} >
				<div class="form-group">
				<label for="texten">Content (en)</label>
				<textarea class="form-control custom-control" id="texten" name="texten" style="height: 200px;">{$contentitem->texten}</textarea>
				</div>
			</div>

			<div class="col-md-6" id="trans_de" {$styleHideTranslation[$contentitem->translation]} >
				<div class="form-group">
				<label for="textde">Content (de)</label>
				<textarea class="form-control custom-control" id="textde" name="textde" style="height: 200px;">{$contentitem->textde}</textarea>
				</div>
			</div>
			
			<div class="col-md-6" id="trans_fr" {$styleHideTranslation[$contentitem->translation]} >
				<div class="form-group">
				<label for="textfr">Content (fr)</label>
				<textarea class="form-control custom-control" id="textfr" name="textfr" style="height: 200px;">{$contentitem->textfr}</textarea>
				</div>
			</div>

		</div>
		<button type="submit" class="btn btn-default">Opslaan</button>
		
	</form>


  </div>
  <div class="col-md-1"></div>
</div>




EOL;


include('footer.php');


