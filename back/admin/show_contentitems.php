<?php

require('config.php');
require('display_functions.php');

include('header.php');
displayContentItems();
include('footer.php');


function displayContentItems()
{
  showSelectedSite();
  $siteid = getSelectedSite();

  if ($siteid == 0)
  {
    echo "<a class=\"btn btn-default\" href=\"edit_contentitem.php\">Toevoegen...</a><br/><br/>";
  }

  $types = ['APP','PAGE','EMAIL','TEMPLATE','SETTING'];

  echo <<<EOL
  <div>
  
    <!-- Nav tabs -->
    <ul class="nav nav-tabs" role="tablist">
EOL;

  $typeInUrl = $_GET['type'];
  if (!isset($typeInUrl) || strlen($typeInUrl) == 0)
  {
    $typeInUrl = "APP";
  }
  
  foreach ($types as $key => $type) 
  {
    if ($typeInUrl == $type) 
    {
      $active = " class='active' ";
    }
    echo "<li role='presentation' ${active}><a href='#{$type}' aria-controls='{$type}' role='tab' data-toggle='tab'>{$type}</a></li>";
    $active = "";
  }
    
  echo <<<EOL
    </ul>
  
    <!-- Tab panes -->
    <div class="tab-content">
EOL;

  foreach ($types as $key => $type) 
  {
    if ($typeInUrl == $type) 
    {
      $active = " active";
    }    
    echo "<div role='tabpanel' class='tab-pane {$active}' id='$type'>";
    displayContentItemsInTable($type, $siteid);
    echo "</div>";
    $active = "";
  }


  echo <<<EOL
    </div>
  
  </div>
EOL;
}

function displayContentItemsInTable($type, $siteid)
{

  // $contentitems = R::find($GLOBALS['contentitem_table'], ' type = ? ORDER BY name ', [ $type ] );
  // $query = "SELECT * FROM {$GLOBALS['contentitem_table']} WHERE type = ? ORDER BY name ";
  $query = "
  SELECT * FROM 
  (
    SELECT 
      case when ownci.id is not null then ownci.id else parentci.id end id, 
      parentci.name, 
      parentci.type, 
      case when ownci.id is not null then ownci.description else parentci.description end description, 
      case when ownci.id is not null then ownci.translation else parentci.translation end translation, 
      case when ownci.id is not null then ownci.text else parentci.text end text,
      case when ownci.id is not null then ownci.texten else parentci.texten end texten, 
      case when ownci.id is not null then ownci.textde else parentci.textde end textde, 
      case when ownci.id is not null then ownci.textfr else parentci.textfr end textfr, 
      parentci.template, 
      case when ownci.id is not null then ownci.siteid else parentci.siteid end siteid, 
      case when ownci.id is not null then ownci.parentid else parentci.parentid end parentid
    FROM 
      contentitem parentci 
      left outer join contentitem ownci on ownci.parentid = parentci.id and ownci.siteid = :siteid
    WHERE 
      parentci.siteid = 0
  ) s
  WHERE type = :type
  ORDER BY name
  ";
  
  $bindParams['type'] = $type;
  $bindParams['siteid'] = $siteid;

  $contentitems = R::getAll($query, $bindParams);
  // print_r($contentitems);
  // exit();

  echo <<<EOL
    <table class="table table-striped table-hover ">
    <thead>
      <tr>
        <th>Edit</th>
        <th>Item</th>
        <th>Type</th>
        <th>nl</th>
        <th>en</th>
        <th>de</th>
        <th>fr</th>
      </tr>
    </thead>
    <tbody>
EOL;

  foreach ($contentitems as $key => $contentitem) {
    displayContentItem($contentitem);
  }


  echo <<<EOL
  </tbody>
</table> 
EOL;

}

function displayContentItem($contentitem)
{
  // print_r($contentitem);

  // echo <<<EOL
  // <div class="panel panel-info">
  //   <div class="panel-heading">
  //   	<a class="btn btn-default" href="edit_contentitem.php?id={$contentitem->id}">Edit</a>
  //   	<a data-toggle="collapse" href="#collapse_contentitem_{$contentitem->id}">{$contentitem->name}</a>
  //   </div>
  //   <div class="panel-body collapse" id="collapse_contentitem_{$contentitem->id}">
  //     {$contentitem->text}
  //   </div>
  //   <div class="panel-footer"></div>
  // </div>

  // EOL;
  $displayText = formatText($contentitem['text']);
  $displayTextEn = formatText($contentitem['texten']);
  $displayTextDe = formatText($contentitem['textde']);
  $displayTextFr = formatText($contentitem['textfr']);

  if ($contentitem['template'] != "")
  {
    $templatecontentitem = R::findOne($GLOBALS['contentitem_table'], ' name = ? and siteid = 0 ', [$contentitem['template']]);
		if ($templatecontentitem == NULL) 
		{
      $displayText = "<span class='label label-danger'>template does not exist: {$contentitem['template']}</span>";
		}
		else if ($templatecontentitem->type != 'TEMPLATE') 
		{
      $displayText = "<span class='label label-danger'>not a template: {$contentitem['template']}</span>";
		}
		else 
		{
      $displayText = "<span style='cursor: default;' class='label label-warning' data-toggle='tooltip' data-placement='right' title='$displayText'>{$contentitem['template']}</span>";
      // $displayText = "<button type='button' class='btn btn-default'>Right</button>";
    }
    
    $displayTextEn = $displayText;
    $displayTextDe = $displayText;
    $displayTextFr = $displayText;
  }
  else
  {
    if (strpos($displayText, "&lt;") !== FALSE) 
    {
      $displayText =   "<span style='cursor: default;' class='label label-default' data-toggle='tooltip' data-placement='right' title='$displayText'>html</span>";
      $displayTextEn = "<span style='cursor: default;' class='label label-default' data-toggle='tooltip' data-placement='right' title='$displayTextEn'>html</span>";
      $displayTextDe = "<span style='cursor: default;' class='label label-default' data-toggle='tooltip' data-placement='right' title='$displayTextDe'>html</span>";
      $displayTextFr = "<span style='cursor: default;' class='label label-default' data-toggle='tooltip' data-placement='right' title='$displayTextFr'>html</span>";
    }
    else if (strpos($displayText, "\n") !== FALSE) 
    {
      $displayText =   "<span style='cursor: default;' class='label label-default' data-toggle='tooltip' data-placement='right' title='$displayText'>multi-line</span>";
      $displayTextEn = "<span style='cursor: default;' class='label label-default' data-toggle='tooltip' data-placement='right' title='$displayTextEn'>multi-line</span>";
      $displayTextDe = "<span style='cursor: default;' class='label label-default' data-toggle='tooltip' data-placement='right' title='$displayTextDe'>multi-line</span>";
      $displayTextFr = "<span style='cursor: default;' class='label label-default' data-toggle='tooltip' data-placement='right' title='$displayTextFr'>multi-line</span>";
    }
  }

  if ($contentitem['translation'] == 'DISABLED')
  {
    // $displayTextEn = "<i>(translation disabled)</i>";
    $displayTextEn = "<span class='label label-default'>translation disabled</span>";
    $displayTextDe = $displayTextEn;
    $displayTextFr = $displayTextEn;
  }

  $displayTypeText = "<span class='label label-info'>{$contentitem['type']}</span>";

  $selectedsite = getSelectedSite();

  if ($selectedsite == $contentitem['siteid'])
  {
    $buttonsText = "<a class='btn btn-default' href='edit_contentitem.php?id={$contentitem['id']}&type={$contentitem['type']}'>Edit</a>";
    $editableRow = " class='info' ";
    $editableCell = "";
  }
  else if ($selectedsite != 0 && $contentitem['siteid'] == 0)
  {
    $buttonsText = " 
    <form style='display:inline;' action='edit_contentitem.php?type={$contentitem['type']}' method='post'> 
    <button type='submit' class='btn btn-default'>Copy</button>
    <input type='hidden' value='{$contentitem['id']}' name='id'> 
    <input type='hidden' value='COPY' name='action'>
    </form>";
    
    $editableRow = "";
    $editableCell = " class='text-muted' ";
    // $buttonsText = "<a class='btn btn-default' href='edit_contentitem.php?id={$contentitem['id']}'>Copy</a>";    
  }  


  echo <<<EOL
    <tr {$editableRow} >
    <td>{$buttonsText}</td>
    <td {$editableCell} >{$contentitem['name']}</td>
    <td {$editableCell} >{$displayTypeText}</td>
    <td {$editableCell} >{$displayText}</td>
    <td {$editableCell} >{$displayTextEn}</td>
    <td {$editableCell} >{$displayTextDe}</td>
    <td {$editableCell} >{$displayTextFr}</td>
    </tr>
EOL;



}

function formatText($input)
{
  if (strlen($input) > 150) {
    $displayText = substr($input, 0, 150) . "...";
  }
  else {
    $displayText = $input;
  }

  $displayText = htmlentities($displayText, ENT_QUOTES);

  return $displayText;
}



