<?php

require('config.php');

if (isset($_POST['id']) && $_POST['action'] == 'DELETE')
{
	$questiontree = R::load($GLOBALS['hierarchy_table'], $_POST['id']);
	R::trash($questiontree);

	header("Location: show_tree.php");
	exit();
}
if (isset($_POST['id']) && $_POST['action'] == 'SETROOT')
{
	$_SESSION['treeroot'] = $_POST['id'];

	header("Location: show_tree.php");
	exit();
}
if ($_POST['action'] == 'CLEARROOT')
{
	$_SESSION['treeroot'] = '';

	header("Location: show_tree.php");
	exit();
}
if ($_GET['action'] == 'SETFILTER' && isset($_GET['tag']))
{
	$_SESSION['tagfilter'] = $_GET['tag'];

	header("Location: show_tree.php");
	exit();
}
if ($_POST['action'] == 'CLEARFILTER')
{
	$_SESSION['tagfilter'] = '';

	header("Location: show_tree.php");
	exit();
}
if (isset($_POST['id']) && $_POST['action'] == 'PROPAGATETAGS')
{
	$questiontree = R::load($GLOBALS['hierarchy_table'], $_POST['id']);
	
	propagateTagsUpInTree($questiontree);
	
	header("Location: show_tree.php");
	exit();
}
// UPDATE
else if (isset($_POST['type']) && isset($_POST['parent']))
{
	$questiontree = R::load($GLOBALS['hierarchy_table'], $_POST['id']);

	$questiontree->text = $_POST['text'];
	$questiontree->type = $_POST['type'];
	$questiontree->image = $_POST['image'];
	$questiontree->display = $_POST['display'];
	$questiontree->sort = $_POST['sort'];
	$questiontree->parent = $_POST['parent'];
	$questiontree->enabled = $_POST['enabled'];
	$questiontree->treename = $_POST['treename'];

	if (isset($_POST['question']))
	{
		$question = R::load($GLOBALS['question_table'], $_POST['question']);

		if ($question->id > 0)
		{
			$questiontree->question = $question->id;
		}	
	}

	if (isset($_POST['tags']))
	{
		$tags = $_POST['tags'];
		
		$tags = trim($tags);
		$tags = strtolower($tags);
		$tags = str_replace(array("\t", "\r", '"'), '', $tags);
		$tags_array = explode("\n", $tags);
		
		$tags_array = array_unique($tags_array);
		sort($tags_array);

		$tags_json = json_encode($tags_array);	
		$questiontree->tags = $tags_json;
	}
	
	$questiontree->flexfields = $_POST['flexfields'];

	// print_r($_POST);
	// exit();
	
	R::store($questiontree);

	header("Location: show_tree.php");
	exit();
}
// SHOW EDIT SCREEN
else if (isset($_GET['id'])) 
{
	$questiontree = R::load($GLOBALS['hierarchy_table'], $_GET['id']);
	$checked[$questiontree->display] = "checked";
	$checked2[$questiontree->enabled] = "checked";

	$tags_array = json_decode($questiontree->tags);
	if (!empty($tags_array))
	{
		$tags_string = implode("\n", $tags_array);
	}

	if ($questiontree->flexfields == "")
	{
		$questiontree->flexfields = '{}';
	}
}
// SHOW ADD NEW SCREEN
else if (isset($_GET['parent']) && isset($_GET['type']))
{
	$questiontree = R::dispense($GLOBALS['hierarchy_table']);
	$questiontree->parent = $_GET['parent'];
	$questiontree->type = $_GET['type'];	
	$questiontree->display = 'ACCORDION';	
	$questiontree->enabled = 'ENABLED';	
	$questiontree->treename = $_GET['treename'];
	$questiontree->flexfields = '{}';	
}
else
{
	header("Location: show_tree.php");
	exit();
}

function propagateTagsUpInTree($questiontree)
{
	$current = $questiontree;
	$tags = json_decode($questiontree->tags);
	if ($tags == null)
	{
		$tags = array();
	}

	while ($current->parent != "")
	{
		$current = R::load($GLOBALS['hierarchy_table'], $current->parent);

		$currentTags = json_decode($current->tags);
		if ($currentTags == null)
		{
			$currentTags = array();
		}

		$newTags = array_merge($currentTags, $tags);
		$newTags = array_unique($newTags);
		sort($newTags);

		$current->tags = json_encode($newTags);

		R::store($current);

	}
}

include('header.php');

echo <<<EOL

<div class="row">
  <div class="col-md-4"></div>
  <div class="col-md-4">

	<form action="edit_questiontree.php" method="POST" id="qtform">
	  <input type="hidden" name="id" value="{$questiontree->id}">
	  <input type="hidden" name="treename" value="{$questiontree->treename}">
EOL;

if ($questiontree->type != "QUESTION")
{

echo <<<EOL
	  <div class="form-group">
	    <label for="text">Text</label>
	    <input type="text" class="form-control" id="text" name="text" value="{$questiontree->text}">
	  </div>
EOL;

}

echo <<<EOL
	  <div class="form-group">
	    <input type="hidden" class="form-control" id="type" name="type" value="{$questiontree->type}">
	  </div>
	  <div class="form-group">
	    <label for="disabled_parent">Parent</label>
	    <input type="hidden" class="form-control" id="parent" name="parent" value="{$questiontree->parent}">
	    <input type="text" class="form-control" id="disabled_parent" name="disabled_parent" value="{$questiontree->parent}" disabled>
	  </div>
EOL;

if ($questiontree->type == "QUESTION")
{

echo <<<EOL

	  <div class="form-group">
	    <label for="question">Question</label>
	    <input type="text" class="form-control" id="question" name="question" value="{$questiontree->question}">
	  </div>
EOL;

}

if ($questiontree->type == "NAVIGATION_ANSWER")
{

echo <<<EOL

	  <div class="form-group">
	    <label for="image">Image</label>
	    <input type="text" class="form-control" id="image" name="image" value="{$questiontree->image}">
	  </div>
EOL;

}

if ($questiontree->type == "NAVIGATION")
{

echo <<<EOL

	  <div class="form-group">
	    <label for="display">Display</label>
			<div class="radio">
			  <label><input type="radio" name="display" value="ACCORDION" {$checked['ACCORDION']} >ACCORDION</label>
			</div>	     	
			<div class="radio">
				<label><input type="radio" name="display" value="MULTIPAGE" {$checked['MULTIPAGE']} >MULTIPAGE</label>
			</div>
	  </div>	  
EOL;

}


echo <<<EOL
	  <div class="form-group">
	    <label for="sort">Sortering</label>
	    <input type="text" class="form-control" id="sort" name="sort" value="{$questiontree->sort}">
	  </div>
EOL;

echo <<<EOL

	  <div class="form-group">
	    <label for="enabled">Enabled</label>
			<div class="radio">
			  <label><input type="radio" name="enabled" value="ENABLED" {$checked2['ENABLED']} >ENABLED</label>
			</div>	     	
			<div class="radio">
				<label><input type="radio" name="enabled" value="DISABLED" {$checked2['DISABLED']} >DISABLED</label>
			</div>
	  </div>	  
EOL;

echo <<<EOL
			<div class="form-group" id="tags_container">
				<label for="tags">Tags</label>
				<textarea class="form-control custom-control" rows="6" id="tags" name="tags">{$tags_string}</textarea>
			</div>
EOL;

echo <<<EOL
			<div class="form-group" id="flexfields_container">
				<label>Flexfields</label>
				<div id="mydiv" class="json-editor"></div>
				<script>
					var myjson = {$questiontree->flexfields};
					var jsondata = myjson;
					var opt = { 
						change: function(data) { jsondata = data },
						propertyclick: function(path) { /* called when a property is clicked with the JS path to that property */ }
					};
					/* opt.propertyElement = '<textarea>'; */ // element of the property field, <input> is default
					/* opt.valueElement = '<textarea>'; */ // element of the value field, <input> is default
					$('#mydiv').jsonEditor(myjson, opt);

					$("#qtform").submit( function(eventObj) {
						$('<input />').attr('type', 'hidden')
							.attr('name', "flexfields")
							.attr('value', JSON.stringify(jsondata))
							.appendTo('#qtform');
						return true;
					});
				</script>
			</div>
EOL;



echo <<<EOL
	  <button type="submit" class="btn btn-default">Opslaan</button>
	</form>

  </div>
  <div class="col-md-4"></div>
</div>
EOL;


include('footer.php');


