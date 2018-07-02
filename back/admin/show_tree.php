<?php

require('config.php');
require('display_functions.php');



function displayRoots()
{

  $where_clause = " parent is null or parent = '' ";
  if ($_SESSION['treeroot'] != '')
  {
  	$where_clause = ' id = ' . $_SESSION['treeroot'] . ' ';
  }
  if ($_SESSION['tagfilter'] != '')
  {
  	$where_clause .= " and tags like '%\"" . $_SESSION['tagfilter'] . "\"%' ";
  }
  
  // echo $where_clause;
  // exit();

  $roots = R::find($GLOBALS['hierarchy_table'], $where_clause);

  // print_r($roots);
  if ($_SESSION['treeroot'] != '')
  {

echo <<<EOL
<div class="panel panel-default">
  <div class="panel-heading">
  Vastgezet op {$_SESSION['treeroot']} 
EOL;

    echo "<form style=\"display:inline;\" action=\"edit_questiontree.php\" method=\"post\"> 
        <button type=\"submit\" class=\"btn btn-default\">Niet meer vastzetten</button>
        <input type=\"hidden\" value=\"CLEARROOT\" name=\"action\">
        </form>";

echo <<<EOL
  </div>
</div> 
EOL;

  }

  if ($_SESSION['tagfilter'] != '')
  {

echo <<<EOL
<div class="panel panel-default">
  <div class="panel-heading">
  Gefilterd op tag 
EOL;
echo "<span class='label label-default' style='background-color: #" . stringToColorCode($_SESSION['tagfilter']) . ";'>{$_SESSION['tagfilter']}</span>";

    echo "<form style=\"display:inline;\" action=\"edit_questiontree.php\" method=\"post\"> 
        <button type=\"submit\" class=\"btn btn-default\">Niet meer filteren</button>
        <input type=\"hidden\" value=\"CLEARFILTER\" name=\"action\">
        </form>";

echo <<<EOL
  </div>
</div> 
EOL;

  }
  

  foreach ($roots as $key => $root) {
    displayTree($root->id);
  }
}



include('header.php');
displayRoots();
include('footer.php');



