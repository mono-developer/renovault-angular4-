<?php

function displayIndex()
{

echo <<<EOL
	<div
	<div class="panel-body">
  <h1>drome admin</h1>
  
  <ul>
  <li>
    Questions
  <ul>
    <li><a href="show_tree.php">Tree</a></li>
    <li><a href="show_questions.php">Questions</a></li>
    <li><a href="show_reports.php">Reports</a></li>
  </ul>
  </li>
  <li>
    Sites
  <ul>
    <li><a href="show_sites.php">Sites</a></li>
    <li><a href="show_contentitems.php">Content Items</a></li>
  </ul>
</li>
<li>
    System
  <ul>
    <li><a href="show_settings.php">Settings</a></li>
    <li><a href="show_parties.php">Users</a></li>
    <li><a href="show_debug.php">Debug</a></li>
    <li><a href="show_code.php">Code</a></li>
    <li><a href="/back/flyspray/">Flyspray Issuetracker</a></li>
    <li><a href="/back/documentation/">Documentation</a></li>
  </ul>
  </li>
  </ul>


	</div>
EOL;

}


function displayQuestion($question)
{

echo <<<EOL
<div class="panel panel-success">
  <div class="panel-heading">
  	<a class="btn btn-default" href="edit_question.php?id={$question->id}"><span class="glyphicon glyphicon-edit"></span></a>
  	{$question->id} : {$question->text}
  </div>
  <div class="panel-body">
    TYPE: {$question->type}<br/>
    OPTIONS: {$question->options}<br/>
    UNIT: {$question->unit}<br/>
  </div>
  <div class="panel-footer"></div>
</div>

EOL;

}

function displaySetting($setting)
{

echo <<<EOL
<div class="panel panel-info">
  <div class="panel-heading">
  	<a class="btn btn-default" href="edit_setting.php?id={$setting->id}"><span class="glyphicon glyphicon-edit"></span></a>
  	<a data-toggle="collapse" href="#collapse_setting_{$setting->id}">{$setting->name}</a> :: {$setting->value} 
  </div>
  <div class="panel-body collapse" id="collapse_setting_{$setting->id}">
    {$setting->description}
  </div>
  <div class="panel-footer"></div>
</div>

EOL;

}

function displaySite($site)
{

echo <<<EOL
<div class="panel panel-info">
  <div class="panel-heading">
  	<a class="btn btn-default" href="edit_site.php?id={$site->id}"><span class="glyphicon glyphicon-edit"></span></a>
    <form style="display:inline;" action="edit_site.php" method="post"> 
    <button type="submit" class="btn btn-default"><span class="glyphicon glyphicon-ok"></span></button>
    <input type="hidden" value="{$site->id}" name="id"> 
    <input type="hidden" value="{$site->name}" name="name"> 
    <input type="hidden" value="SELECTSITE" name="action">
    </form>
  	{$site->id} :: {$site->name} :: {$site->description} 
  </div>
</div>

EOL;

}

function showSelectedSite()
{

  if (getSelectedSite() != 0)
  {
    echo <<<EOL
    <div class="panel panel-success">
      <div class="panel-heading">
      {$_SESSION['selectedsitename']}
      <form style="display:inline;" action="edit_site.php" method="post"> 
      <button type="submit" class="btn btn-default">Remove selection</button>
      <input type="hidden" value="{getSelectedSite()}" name="id"> 
      <input type="hidden" value="{$_SESSION['selectedsitename']}" name="name"> 
      <input type="hidden" value="DESELECTSITE" name="action">
      </form>
      </div>
    </div> 
EOL;

  }
  else
  {

    echo <<<EOL
    <div class="panel panel-danger">
      <div class="panel-heading">
        Warning: no site selected. Any changes made will apply to all sites. (<a href="show_sites.php">change</a>)
      </div>
    </div> 
EOL;

  }

}

function getSelectedSite()
{
  if (isset($_SESSION['selectedsite']) && $_SESSION['selectedsite'] != "")
  {
    $selectedsite = $_SESSION['selectedsite'];
  }
  else
  {
    $selectedsite = 0;
  }
  return $selectedsite;
}

function getSelectedSiteName()
{
  if (isset($_SESSION['selectedsitename']) && $_SESSION['selectedsitename'] != "")
  {
    $selectedsitename = $_SESSION['selectedsitename'];
  }
  else
  {
    $selectedsitename = "";
  }
  return $selectedsitename;
}

function setSelectedSite($siteid, $sitename)
{ 
  $_SESSION['selectedsite'] = $siteid;
  $_SESSION['selectedsitename'] = $sitename;
}

function unsetSelectedSite()
{
  unset($_SESSION['selectedsite']);
	unset($_SESSION['selectedsitename']);
}

function displayReport($report)
{

echo <<<EOL
<div class="panel panel-info">
  <div class="panel-heading">
  	<a class="btn btn-default" href="edit_report.php?id={$report->id}"><span class="glyphicon glyphicon-edit"></span></a>
  	<a data-toggle="collapse" href="#collapse_report_{$report->id}">{$report->name}</a> :: {$report->title} 
  </div>
  <div class="panel-body collapse" id="collapse_report_{$report->id}">
    <pre>{$report->sql}</pre>
  </div>
  <div class="panel-footer"></div>
</div>

EOL;

}

function displayParty($party)
{

  echo <<<EOL
<div class="panel panel-info">
  <div class="panel-heading">
  	<a class="btn btn-default" href="edit_party.php?id={$party->id}"><span class="glyphicon glyphicon-edit"></span></a>
  	{$party->id} :: {$party->login} :: {$party->registrationstep}
EOL;

  if ($party->accountopen == TRUE)
  {
    echo ':: OPEN';
  }
  else
  {
    echo ':: LOCKED';
  }

  echo <<<EOL
  </div>
</div>

EOL;

}


function displayTree($id)
{
  $node = R::load($GLOBALS['hierarchy_table'], $id);

  $whereClause = " parent = $id ";

  if ($_SESSION['tagfilter'] != '')
  {
  	$whereClause .= " and tags like '%\"" . $_SESSION['tagfilter'] . "\"%' ";
  }

  $whereClause .= " ORDER BY sort ";

  $children = R::find($GLOBALS['hierarchy_table'], $whereClause);

  $nodeHasChild = FALSE;
  $nodeHasQuestionChild = FALSE;
  $nodeHasNavigationChild = FALSE;
  $nodeHasNavigationAnswerChild = FALSE;
  $nodeIsEnabled = ($node->enabled == 'ENABLED');

  $nodePanelClass = 'panel-default';
  if (!$nodeIsEnabled)
  {
    $nodePanelClass = 'panel-danger';
  }

  foreach ($children as $key => $child) {
    $nodeHasChild = TRUE;
    $nodeHasQuestionChild = ($nodeHasQuestionChild || $child->type == 'QUESTION');
    $nodeHasNavigationChild = ($nodeHasNavigationChild || $child->type == 'NAVIGATION');
    $nodeHasNavigationAnswerChild = ($nodeHasNavigationAnswerChild || $child->type == 'NAVIGATION_ANSWER');
  }
  
  if ($node->type == 'QUESTION')
  {
    $question = R::load($GLOBALS['question_table'], $node->question);
  }


// DISPLAY
echo "<div class='panel {$nodePanelClass}'>";
echo "  <div class='panel-heading'>"; 

    echo "<form style=\"display:inline;\" action=\"edit_questiontree.php\" method=\"post\"> 
        <button type=\"submit\" class=\"btn btn-default\"><span class='glyphicon glyphicon-pushpin'></span></button>
        <input type=\"hidden\" value=\"{$node->id}\" name=\"id\"> 
        <input type=\"hidden\" value=\"SETROOT\" name=\"action\">
        </form>";

echo <<<EOL
	<form style="display:inline;" action="edit_questiontree.php" method="post">
		<button type="submit" class="btn btn-default"><span class='glyphicon glyphicon-tags'></span><span class='glyphicon glyphicon-arrow-up'></span></button>
	  <input type="hidden" name="id" value="{$node->id}">
	  <input type="hidden" name="action" value="PROPAGATETAGS">
	</form>
EOL;

echo <<<EOL
    <a class="btn btn-default" href="edit_questiontree.php?id={$node->id}"><span class='glyphicon glyphicon-edit'></span></a>
EOL;
	if (!$nodeHasChild)
	{
		echo "<form style=\"display:inline;\" action=\"edit_questiontree.php\" method=\"post\"> 
			  <button type=\"submit\" class=\"btn btn-default\"><span class='glyphicon glyphicon-trash'></span></button>
			  <input type=\"hidden\" value=\"{$node->id}\" name=\"id\">	
			  <input type=\"hidden\" value=\"DELETE\" name=\"action\">
			  </form>";	
		// echo " <a class=\"btn btn-default\" href=\"edit_questiontree.php?id={$node->id}\">Verwijderen</a>";	
	}

  echo " <i>( " . $node->sort . " )</i> : ";

  if ($node->type == 'NAVIGATION')
  {
      echo " Navigatievraag : <a data-toggle=\"collapse\" href=\"#collapse_{$node->id}\">{$node->text}</a>";
  }
  else if ($node->type == 'NAVIGATION_ANSWER')
  {
      echo " Navigatieantwoord : <a data-toggle=\"collapse\" href=\"#collapse_{$node->id}\">{$node->text}</a>";
  }  
  else if ($node->type == 'QUESTION')
  {
      echo " Link naar vraag : --&gt; {$question->id} : <a data-toggle=\"collapse\" href=\"#collapse_{$node->id}\">{$question->text}</a>";
  }

  $tags = json_decode($node->tags);

  if ($tags == null)
  {
    $tags = array();
  }

  rsort($tags);

  foreach ($tags as $tag)
  {
    echo "<a href='edit_questiontree.php?action=SETFILTER&tag=$tag'>";
    echo "<span class='label label-default pull-right' style='background-color: #" . stringToColorCode($tag) . ";'>$tag</span>";
    echo "</a>";
  }

echo <<<EOL
  </div>
  <div class="panel-body collapse" id="collapse_{$node->id}">
EOL;

  if ($node->type == 'NAVIGATION' || $node->type == 'NAVIGATION_ANSWER')
  {
    foreach ($children as $key => $child) 
    {
      displayTree($child->id);
    }
  }
  else if ($node->type == 'QUESTION')
  {
    displayQuestion($question);
  }

// NEW BUTTONS
	if ($node->type == 'NAVIGATION')
	{
			echo "<a class=\"btn btn-default\" href=\"edit_questiontree.php?parent={$node->id}&type=NAVIGATION_ANSWER&treename={$node->treename}\">Navigatieantwoord toevoegen...</a>";
	}
	else if ($node->type == 'NAVIGATION_ANSWER')
	{
		if (!$nodeHasQuestionChild && !$nodeHasNavigationChild)
		{
			echo "<a class=\"btn btn-default\" href=\"edit_questiontree.php?parent={$node->id}&type=NAVIGATION&treename={$node->treename}\">Navigatievraag toevoegen...</a>";
		}
		
		if (!$nodeHasNavigationChild)
		{
			echo "<a class=\"btn btn-default\" href=\"edit_questiontree.php?parent={$node->id}&type=QUESTION&treename={$node->treename}\">Link naar vraag toevoegen...</a>";
		}
	} 

echo <<<EOL
  </div>

</div>
EOL;

}


function stringToColorCode($str) {
  $code = dechex(crc32($str));
  $code = substr($code, 0, 6);
  return $code;
}


function myprint_r($my_array) {
    if (is_array($my_array)) {
        echo "<table class='table table-bordered table-condensed'>";
        foreach ($my_array as $k => $v) {
                echo '<tr><td>';
                echo '<strong>' . $k . "</strong></td><td>";
                myprint_r($v);
                echo "</td></tr>";
        }
        echo "</table>";
        return;
    }
    echo $my_array;
}
