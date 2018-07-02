<?php

class ProjectManager
{
    public static function registerRoutes($apiName)
	{
        Flight::route('POST /project/createNewFromSession', function() {
            $posted = HttpHandler::handleRequest();
            $bean = R::dispense('project');

            CrudBeanHandler::updateBean($bean, $posted);

            R::store($bean);

            $questions = QuestionManager::getSessionQuestions();
            QuestionManager::storeQuestionInstances($questions, 'project', $bean->id, 'project');
            QuestionManager::resetSessionQuestions();

            $array = CrudBeanHandler::exportBean($bean);
            Flight::json(HttpHandler::createResponse(201, $array));	
        });

    }
}