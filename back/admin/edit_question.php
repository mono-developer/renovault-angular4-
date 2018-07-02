<?php

require('config.php');

// HANDLE POST 
if (isset($_POST['text']) && isset($_POST['type']))
{
	// print_r($_POST);
	// exit();

	$question = R::load($GLOBALS['question_table'], $_POST['id']);

	$question->text = $_POST['text'];
	$question->type = $_POST['type'];
	$question->unit = $_POST['unit'];
	$question->extrainfo = $_POST['extrainfo'];
	$question->notes = $_POST['notes'];

	if (isset($_POST['options']))
	{
		$options = $_POST['options'];
		
		$options = trim($options);
		$options = str_replace(array("\t", "\r"), '', $options);
		$options_array = explode("\n", $options);

		$options_json = json_encode($options_array);	
		$question->options = $options_json;
	}	

	if (isset($_POST['logic']))
	{
		$logic = $_POST['logic'];
		
		$logic = trim($logic);
		$logic = str_replace(array("\t", "\r"), '', $logic);
		$logic_array = explode("\n", $logic);

		$logic_json = json_encode($logic_array);	
		$question->logic = $logic_json;
	}

	R::store($question);

	header("Location: show_questions.php");
	exit();
}
// EDIT
else if (isset($_GET['id'])) 
{
	$question = R::load($GLOBALS['question_table'], $_GET['id']);

	$checked[$question->type] = "checked";
	$unit_selected[$question->unit] = "selected";

	$options_array = json_decode($question->options);
	if (!empty($options_array))
	{
		$options_string = implode("\n", $options_array);
	}

	$logic_array = json_decode($question->logic);
	if (!empty($logic_array))
	{
		$logic_string = implode("\n", $logic_array);
	}
}
// ADD NEW
else
{
	$question = R::dispense($GLOBALS['question_table']);
}

include('header.php');

echo <<<EOL


<form action="edit_question.php" method="POST">
	<input type="hidden" name="id" value="{$question->id}">
	<div class="row">
		<div class="col-md-1"></div>
		<div class="col-md-5">

			<div class="form-group">
				<label for="text">Text</label>
				<input type="text" class="form-control" id="text" name="text" value="{$question->text}">
			</div>
			<div class="form-group">
				<label for="type">Type</label>
				<div class="row">
					<div class="col-md-6">
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('RADIO')" value="RADIO" {$checked['RADIO']} >RADIO</label></div>	     	
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('DROPDOWN')" value="DROPDOWN" {$checked['DROPDOWN']} >DROPDOWN</label></div>	     	
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('CHECKBOX')" value="CHECKBOX" {$checked['CHECKBOX']} >CHECKBOX</label></div>
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('TEXT')" value="TEXT" {$checked['TEXT']} >TEXT</label></div>
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('TEXTAREA')" value="TEXTAREA" {$checked['TEXTAREA']} >TEXTAREA</label></div>
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('MULTITEXT')" value="MULTITEXT" {$checked['MULTITEXT']} >MULTITEXT</label></div>
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('NUMBER')" value="NUMBER" {$checked['NUMBER']} >NUMBER</label></div>
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('NUMBER_WITH_UNIT')" value="NUMBER_WITH_UNIT" {$checked['NUMBER_WITH_UNIT']} >NUMBER_WITH_UNIT</label></div>
					</div>
					<div class="col-md-6">
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('YEAR')" value="YEAR" {$checked['YEAR']} >YEAR</label></div>	     	
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('DATE')" value="DATE" {$checked['DATE']} >DATE</label></div>
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('UPLOAD_DOCUMENT')" value="UPLOAD_DOCUMENT" {$checked['UPLOAD_DOCUMENT']} >UPLOAD_DOCUMENT</label></div>			
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('PARTY')" value="PARTY" {$checked['PARTY']}>PARTY</label></div>
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('CONTENTITEM')" value="CONTENTITEM" {$checked['CONTENTITEM']} disabled>CONTENTITEM</label></div>
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('HEADING')" value="HEADING" {$checked['HEADING']}>HEADING</label></div>			
						<div class="radio"><label><input type="radio" name="type" onclick="onClick('SEPARATOR')" value="SEPARATOR" {$checked['SEPARATOR']}>SEPARATOR</label></div>			
					</div>
				</div>
			</div>	  
			<div class="form-group" id="options_container">
				<label for="options">Options</label>
				<textarea class="form-control custom-control" rows="6" id="options" name="options">{$options_string}</textarea>
			</div>
			<div class="form-group" id="unit_container">
				<label for="unit">Eenheid</label>
				<select class="form-control" id="unit" name="unit">
	  			<option value='mm' {$unit_selected['mm']}>mm | millimeter</option>
	  			<option value='cm' {$unit_selected['cm']}>cm | centimeter</option>
	  			<option value='m' {$unit_selected['m']}>m | meter</option>
	  			<option value='mm2' {$unit_selected['mm2']}>mm2 | vierkante millimeter</option>
	  			<option value='cm2' {$unit_selected['cm2']}>cm2 | vierkante centimeter</option>
	  			<option value='m2' {$unit_selected['m2']}>m2 | vierkante meter</option>
	  			<option value='mm3' {$unit_selected['mm3']}>mm3 | kubieke millimeter</option>
	  			<option value='cm3' {$unit_selected['cm3']}>cm3 | kubieke centimeter</option>
	  			<option value='m3' {$unit_selected['m3']}>m3 | kubieke meter</option>
	  			<option value='sec' {$unit_selected['sec']}>sec | seconde</option>
	  			<option value='min' {$unit_selected['min']}>min | minuut</option>
	  			<option value='uur' {$unit_selected['uur']}>uur | uur</option>
	  			<option value='dag' {$unit_selected['dag']}>dag | dag</option>
	  			<option value='l/s' {$unit_selected['l/s']}>l/s | liter per seconde</option>
				</select>
			</div>
			<!-- <div class="form-group" id="logic_container">
				<label for="logic">Logic</label>
				<textarea class="form-control custom-control" rows="6" id="logic" name="logic">{$logic_string}</textarea>
			</div> -->
		</div>
		<div class="col-md-5">
			<div class="form-group">
				<label for="extrainfo">Extra informatie voor gebruiker (zichtbaar)</label>
				<textarea class="form-control custom-control" rows="6" id="extrainfo" name="extrainfo">{$question->extrainfo}</textarea>
			</div>
			<div class="form-group">
				<label for="notes">Notities bij vraag (drome&trade; only)</label>
				<textarea class="form-control custom-control" rows="6" id="notes" name="notes">{$question->notes}</textarea>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-1"></div>
		<div class="col-md-10">
			<button type="submit" class="btn btn-default pull-right">Opslaan</button>
		</div>
	</div>
</form>


<script>

function onClick(radioElement) 
{
	if (radioElement == "RADIO" || radioElement == "CHECKBOX" || radioElement == "DROPDOWN" || radioElement == "MULTITEXT")
	{
    	document.getElementById('options_container').style.display = "inline";
    }
    else
    {
    	document.getElementById('options_container').style.display = "none";
    }		

    if (radioElement == "NUMBER_WITH_UNIT")
		{
    	document.getElementById('unit_container').style.display = "inline";
    }
    else
    {
    	document.getElementById('unit_container').style.display = "none";
    }
}

window.onload = function () { onClick("{$question->type}") }

</script>

EOL;


include('footer.php');


