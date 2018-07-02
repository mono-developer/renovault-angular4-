<?php

class QuestionManager 
{
	public static function registerRoutes($apiName)
	{
		Flight::route("GET /${apiName}/reset", function() {
			QuestionManager::resetSessionQuestions();
			Flight::json(HttpHandler::createResponse(200, 'Reset OK'));
		}
		);


		Flight::route("GET /${apiName}/next", function() {
			$q = QuestionManager::getNextQuestion();
			Flight::json(HttpHandler::createResponse(200, $q));
		}
		);

		Flight::route("GET /${apiName}/root/@treename/@reference_table/@reference_id/@reference_string", function($treename, $reference_table, $reference_id, $reference_string) {
			$q = QuestionManager::getRootQuestion($treename, $reference_table, $reference_id, $reference_string);
			Flight::json(HttpHandler::createResponse(200, $q));
		}
		);

		Flight::route("GET /${apiName}/tagged/@tagname", function($tagname) {
			$q = QuestionManager::getQuestionsWithTag($tagname);
			Flight::json(HttpHandler::createResponse(200, $q));
		}
		);

		Flight::route("GET /${apiName}/after/@question/@answer/@reference_table/@reference_id/@reference_string", function($question, $answer, $reference_table, $reference_id, $reference_string) {
			$q = QuestionManager::getQuestionAfterAnswer($question, $answer, $reference_table, $reference_id, $reference_string);
			Flight::json(HttpHandler::createResponse(200, $q));
		}
		);
		
		Flight::route("GET /${apiName}/questioninstance/@reference_table/@reference_id/@reference_string/@question_id", function($reference_table, $reference_id, $reference_string, $question_id) {
			$instance = QuestionManager::getQuestionInstance($reference_table, $reference_id, $reference_string, $question_id);
			Flight::json(HttpHandler::createResponse(200, $instance));
		}
		);

		Flight::route("GET /${apiName}/@question_id", function($question_id) {
			$result = QuestionManager::getQuestion($question_id);
			$b = CrudBeanHandler::exportBean($result);
			Flight::json(HttpHandler::createResponse(200, $b));
		}
		);

		Flight::route("POST /${apiName}/answer/@question/@answer", function($question, $answer) {
			$q = QuestionManager::answerQuestion($question, $answer);
			Flight::json(HttpHandler::createResponse(200, $q));
		}
	);

		Flight::route("POST /${apiName}/questioninstance/multiple", function() {
			$posted = HttpHandler::handleRequest();
			$instancesarray = $posted;

			$toReturn = [];
			foreach ($instancesarray as $instance)
			{
				$bean = self::updateQuestionInstance($instance);
				$toReturn[] = CrudBeanHandler::exportBean($bean);
			}

			Flight::json(HttpHandler::createResponse(200, $toReturn));
		}
		);
		
		Flight::route("POST /${apiName}/questioninstance/@id", function($id) {
			$posted = HttpHandler::handleRequest();

			$bean = self::updateQuestionInstance($posted);
			$array = CrudBeanHandler::exportBean($bean);
			Flight::json(HttpHandler::createResponse(200, $array));
		}
		);
		
	}

	private static function updateQuestionInstance($posted)
	{
		$bean = R::load('questioninstance',$posted['id']);
			
		foreach ($posted as $key => $value) 
		{
			if ($key == 'answer')
			{
				$bean->answer = $value;
			}
		}
		
		R::store($bean);

		return $bean;
	}


	public static function getNextQuestion() {

		if (QuestionManager::getSessionQuestionCount() == 0)
		{
			$navigation = R::getRow( "SELECT * FROM questiontree WHERE (parent is null or parent = '') AND type = 'NAVIGATION' AND enabled = 'ENABLED' LIMIT 1");
			$navigation_answers = R::getAll( "SELECT * FROM questiontree WHERE parent = ? AND type = 'NAVIGATION_ANSWER' AND enabled = 'ENABLED' ORDER BY sort ", [ $navigation['id'] ]);

			$navigation['navigation_answers'] = $navigation_answers;

			QuestionManager::addSessionQuestion($navigation);
		}
		else
		{
			$q = QuestionManager::getCurrentQuestion();
			
			if (isset($q['answer']))
			{
				$selectedAnswer = R::getRow( "SELECT * FROM questiontree WHERE parent = ? AND type = 'NAVIGATION_ANSWER' AND id = ? AND enabled = 'ENABLED' LIMIT 1", [ $q['id'], $q['answer']['id'] ]);
				$navigation = R::getRow( "SELECT * FROM questiontree WHERE parent = ? AND type = 'NAVIGATION' AND enabled = 'ENABLED' LIMIT 1", [ $selectedAnswer['id'] ]);
				$navigation_answers = R::getAll( "SELECT * FROM questiontree WHERE parent = ? AND type = 'NAVIGATION_ANSWER' AND enabled = 'ENABLED' ORDER BY sort ", [ $navigation['id'] ]);

				if (count($navigation_answers) > 0)
				{
					$navigation['navigation_answers'] = $navigation_answers;
					QuestionManager::addSessionQuestion($navigation);
				}
				else
				{
	    			// retrieve questions
					$questions = R::getAll( " SELECT q.*, qt.sort FROM questiontree qt inner join questions q on qt.question = q.id WHERE qt.parent = ? AND qt.type = 'QUESTION' AND qt.enabled = 'ENABLED' ORDER BY sort ", [ $selectedAnswer['id'] ]);

					foreach ($questions as $key => $question) {
						QuestionManager::addSessionQuestion($question);
					}

	    			// no next question
					return array();
				}
			}
		}
		return QuestionManager::getCurrentQuestion();   
	}

	public static function getSessionQuestions()
	{
		if (!isset($_SESSION['questions']) || !is_array($_SESSION['questions']))
		{
			QuestionManager::resetSessionQuestions();	
		}
		return $_SESSION['questions']; 
	}

	public static function getSessionQuestionCount()
	{
		return count(QuestionManager::getSessionQuestions());
	}

	public static function addSessionQuestion($question)
	{
		$_SESSION['questions'][] = $question;	
	}

	public static function resetSessionQuestions()
	{
		$_SESSION['questions'] = array();	
	}

	public static function getCurrentQuestion()
	{
		$q = array();
		$questions = QuestionManager::getSessionQuestions();

		foreach ($questions as $key => $question) {
			if (is_array($question) && $question['type'] == 'NAVIGATION')
			{
				$q = $question;
			}
		}

		if (is_array($q))
		{
			return $q;
		}
		else
		{
			return array();
		}    	
	}

	public static function currentQuestionHasAnswer()
	{
		$q = QuestionManager::getCurrentQuestion();

		if (is_array($q['answer']) && count($q['answer']) > 0)
		{
			return TRUE;
		}
		else
		{
			return FALSE;
		}    	
	}

	public static function currentQuestionIsFirstQuestion()
	{
		$q = QuestionManager::getCurrentQuestion();

		if (is_array($q['answer']) && count($q['answer']) > 0)
		{
			return TRUE;
		}
		else
		{
			return FALSE;
		}    	
	}




	public static function answerQuestion($question_id, $answer_id) 
	{
		$question_index = QuestionManager::findIdInArray($_SESSION['questions'], $question_id);
		$question = $_SESSION['questions'][$question_index];

		$answer_index = QuestionManager::findIdInArray($question['navigation_answers'], $answer_id);
		$answer = $question['navigation_answers'][$answer_index];

		$_SESSION['questions'][$question_index]['answer'] = $answer;

		return TRUE;
	}

	public static function findIdInArray($array, $id)
	{
		if (!is_array($array))
		{
			return -1;
		}

		foreach ($array as $key => $value) {
			if ($value['id'] == $id) {
				return $key;
			}
		}
		return -1;
	}

	public static function getQuestionInstance($reference_table, $reference_id, $reference_string, $question_id)
	{
		$instance = R::findOne( 'questioninstance', ' reference_table = ? AND reference_id = ? AND reference_string = ? ', [ $reference_table, $reference_id, $reference_string ] );
		if ($instance == null) {
			// this should not be done this way, just return null and caller should post the instance
			$parent = CrudBeanHandler::findBean($reference_table, $reference_id);
			if ($parent != null && $parent->granteerole == 'owner') 
			{
				$instance = R::dispense('questioninstance');
				$instance->reference_table = $reference_table;
				$instance->reference_id = $reference_id;
				$instance->reference_string = $reference_string;
				$instance->question_id = $question_id;

				R::store($instance);
			}
			return $instance;
		}
		else
		{
			return $instance;
		}
	}

	public static function getQuestion($question_id)
	{
		$question = R::findOne( 'questions', ' id = ? ', [ $question_id ] );
		return $question;
	}


	public static function getRootQuestion($treename, $reference_table, $reference_id, $reference_string)
	{
		$filterSQL = FilterHandler::getQuestionTreeFilterSQL($reference_table, $reference_id);

		$sql =  "SELECT * FROM questiontree WHERE (parent is null or parent = '') AND type = 'NAVIGATION' AND enabled = 'ENABLED' AND treename = ? AND $filterSQL LIMIT 1";
		$navigation = R::getRow($sql , [ $treename ]);

		$sql = "SELECT * FROM questiontree WHERE parent = ? AND type = 'NAVIGATION_ANSWER' AND enabled = 'ENABLED' AND treename = ? AND $filterSQL ORDER BY sort ";
		$navigation_answers = R::getAll($sql , [ $navigation['id'], $treename ]);

		$navigation['navigation_answers'] = $navigation_answers;

		$a[] = $navigation;

		return $a;
	}

	public static function getQuestionsWithTag($tagname)
	{
		$questions = R::getAll( "SELECT * FROM questiontree WHERE enabled = 'ENABLED' AND tags like concat('%\"', ?, '\"%') ", [ $tagname ]);
		return $questions;
	}

	public static function getQuestionAfterAnswer($question_id, $answer_id, $reference_table, $reference_id, $reference_string)
	{
		$filterSQL = FilterHandler::getQuestionTreeFilterSQL($reference_table, $reference_id);

		$sql = "SELECT * FROM questiontree WHERE parent = ? AND type = 'NAVIGATION_ANSWER' AND id = ? AND enabled = 'ENABLED' AND $filterSQL LIMIT 1";
		$selectedAnswer = R::getRow($sql , [ $question_id, $answer_id ]);

		$sql = "SELECT * FROM questiontree WHERE parent = ? AND type = 'NAVIGATION' AND enabled = 'ENABLED' AND $filterSQL LIMIT 1";
		$navigation = R::getRow($sql , [ $selectedAnswer['id'] ]);

		$sql = "SELECT * FROM questiontree WHERE parent = ? AND type = 'NAVIGATION_ANSWER' AND enabled = 'ENABLED' AND $filterSQL ORDER BY sort ";
		$navigation_answers = R::getAll($sql, [ $navigation['id'] ]);

		if (count($navigation_answers) > 0)
		{
			$navigation['navigation_answers'] = $navigation_answers;
			$a[] = $navigation;
			return $a;
		}
		else
		{
			// retrieve questions
			$sql =  " SELECT questiontree.* FROM questiontree WHERE questiontree.parent = ? AND questiontree.type = 'QUESTION' AND questiontree.enabled = 'ENABLED' AND $filterSQL ORDER BY questiontree.sort ";
			$questions = R::getAll($sql, [ $selectedAnswer['id'] ]);
			return $questions;
		}
	}

}
