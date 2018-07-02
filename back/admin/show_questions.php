<?php

require('config.php');
require('display_functions.php');

function displayQuestions()
{
  
	echo "<a class=\"btn btn-default\" href=\"edit_question.php\">Vraag toevoegen...</a>";

  $questions = R::findAll($GLOBALS['question_table']);

  foreach ($questions as $key => $question) {
    displayQuestion($question);
  }
}



include('header.php');
displayQuestions();
include('footer.php');



