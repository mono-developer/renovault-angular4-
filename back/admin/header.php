<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>drome&trade; | backend</title>

    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/jsoneditor.css"/>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery.jsoneditor.min.js"></script>


  </head>
  <body>


  <nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="index.php">drome&trade;</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
      <li class="dropdown">
      <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        Questions
			</a>
      <ul class="dropdown-menu">
        <li><a href="show_tree.php">Tree</a></li>
        <li><a href="show_questions.php">Questions</a></li>
        <li><a href="show_reports.php">Reports</a></li>
      </ul>
      </li>
      <li class="dropdown">
      <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        Sites
			</a>
      <ul class="dropdown-menu">
        <li><a href="show_sites.php">Sites</a></li>
        <li><a href="show_contentitems.php">Content Items</a></li>
      </ul>
    </li>
    <li class="dropdown">
      <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        System
			</a>
      <ul class="dropdown-menu">
        <li><a href="show_settings.php">Settings</a></li>
        <li><a href="show_parties.php">Users</a></li>
        <li><a href="show_debug.php">Debug</a></li>
        <li><a href="show_code.php">Code</a></li>
        <li><a href="/back/flyspray/">Flyspray Issuetracker</a></li>
        <li><a href="/back/documentation/">Documentation</a></li>
      </ul>
      </li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>


