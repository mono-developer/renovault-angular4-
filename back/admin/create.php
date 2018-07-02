<?php

require('config.php');

function createDemoData()
{
  R::wipe($GLOBALS['hierarchy_table']);
  R::wipe($GLOBALS['question_table']);

    $q1 = R::dispense($GLOBALS['question_table']);
    $q1->type = 'TEXT'; 
    $q1->text = 'Wat is de kleur?';
    R::store($q1);

    $q2 = R::dispense($GLOBALS['question_table']);
    $q2->type = 'RADIO'; 
    $q2->text = 'Wat is het materiaal?';
    $q2->options = json_encode(array('Steen','Hout','Metaal','Overig'));
    R::store($q2);
    
    $q3 = R::dispense($GLOBALS['question_table']);
    $q3->type = 'CHECKBOX'; 
    $q3->text = 'Door wie word het uitgevoerd?';
    $q3->options = json_encode(array('Aannemer','VVE','Mijzelf'));
    R::store($q3);

    $q4 = R::dispense($GLOBALS['question_table']);
    $q4->type = 'NUMBER'; 
    $q4->text = 'Wat is de hoeveelheid?';
    R::store($q4);

    $q5 = R::dispense($GLOBALS['question_table']);
    $q5->type = 'UPLOAD_DOCUMENT'; 
    $q5->text = 'Upload een documentje?';
    R::store($q5);


    $n = R::dispense($GLOBALS['hierarchy_table']);
    $n->type = 'NAVIGATION';
    $n->text = 'Kies een optie om te navigeren';
    R::store($n);


      $a = R::dispense($GLOBALS['hierarchy_table']);
      $a->type = 'NAVIGATION_ANSWER';
      $a->text = 'Optie A';
      $a->parent = $n->id;
      R::store($a);

        $b = R::dispense($GLOBALS['hierarchy_table']);
        $b->type = 'QUESTION';
        $b->question = $q1->id;
        $b->parent = $a->id;
        R::store($b);

        $b = R::dispense($GLOBALS['hierarchy_table']);
        $b->type = 'QUESTION';
        $b->question = $q2->id;
        $b->parent = $a->id;
        R::store($b);

        $b = R::dispense($GLOBALS['hierarchy_table']);
        $b->type = 'QUESTION';
        $b->question = $q3->id;
        $b->parent = $a->id;
        R::store($b);      

        $b = R::dispense($GLOBALS['hierarchy_table']);
        $b->type = 'QUESTION';
        $b->question = $q4->id;
        $b->parent = $a->id;
        R::store($b);

        $b = R::dispense($GLOBALS['hierarchy_table']);
        $b->type = 'QUESTION';
        $b->question = $q5->id;
        $b->parent = $a->id;
        R::store($b);      



      $a = R::dispense($GLOBALS['hierarchy_table']);
      $a->type = 'NAVIGATION_ANSWER';
      $a->text = 'Optie B';
      $a->parent = $n->id;
      R::store($a);

      $a = R::dispense($GLOBALS['hierarchy_table']);
      $a->type = 'NAVIGATION_ANSWER';
      $a->text = 'Optie C';
      $a->parent = $n->id;
      R::store($a);


        $b = R::dispense($GLOBALS['hierarchy_table']);
        $b->type = 'NAVIGATION';
        $b->text = 'Kies nog een optie...';
        $b->parent = $a->id;
        R::store($b);

          $c = R::dispense($GLOBALS['hierarchy_table']);
          $c->type = 'NAVIGATION_ANSWER';
          $c->text = 'Optie 1';
          $c->parent = $b->id;
          R::store($c);

          $c = R::dispense($GLOBALS['hierarchy_table']);
          $c->type = 'NAVIGATION_ANSWER';
          $c->text = 'Optie 2';
          $c->parent = $b->id;
          R::store($c);

            $d = R::dispense($GLOBALS['hierarchy_table']);
            $d->type = 'QUESTION';
            $d->question = $q4->id;
            $d->parent = $c->id;
            R::store($d);

            $d = R::dispense($GLOBALS['hierarchy_table']);
            $d->type = 'QUESTION';
            $d->question = $q2->id;
            $d->parent = $c->id;
            R::store($d);      
}


// createDemoData();

  // R::wipe($GLOBALS['report_table']);

  // $q1 = R::dispense($GLOBALS['report_table']);
  // $q1->title = 'Overzicht van ingevulde gegevens'; 
  // $q1->sql = 'select * from questioninstance where securityid = ?';
  // $q1->template = '';

  // R::store($q1);
