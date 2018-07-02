<?php

require('config.php');
include('header.php');

echo <<<EOL

<div class="row">
  <div class="col-md-2"></div>
  <div class="col-md-8">

	<form action="show_debug.php" method="POST">
	  <div class="form-group">
	    <label for="evaluate">PHP to evaluate</label>
        <textarea class="form-control custom-control" rows="8" id="evaluate" name="evaluate">{$_POST['evaluate']}</textarea>
	  </div>
      <button type="submit" class="btn btn-default">Uitvoeren</button>
    </form>
</div>
</div>
</div>
<hr/>
<div class="row">
  <div class="col-md-2"></div>
  <div class="col-md-8">
  <label>Results</label>
<pre>
EOL;

if (isset($_POST['evaluate'])) {
    eval($_POST['evaluate']);
}

echo <<<EOL
</pre>
</div>
</div>

EOL;


include('footer.php');



