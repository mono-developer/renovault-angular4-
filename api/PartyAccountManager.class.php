<?php

class PartyAccountManager 
{
	const SESS_ARRAY_ID = 'partyaccount';

    public static function registerRoutes($apiName)
	{
		Flight::route("POST /${apiName}/register", function() {
			$posted = HttpHandler::handleRequest();
			$result = self::register($posted['login'], $posted['password']);
			
			Flight::json(HttpHandler::createResponse(201, $result));	
		});

		Flight::route("POST /${apiName}/forgotpassword", function() {
			$posted = HttpHandler::handleRequest();
			$result = self::forgotPassword($posted['email']);
			
			Flight::json(HttpHandler::createResponse(200, $result));	
		});

		Flight::route("POST /${apiName}/restorePassword", function() {
			$posted = HttpHandler::handleRequest();
			$result = self::restorePassword($posted['restoreConfirmationCode'], $posted['restorePasswordEmail'], $posted['restorePassword']);
			
			Flight::json(HttpHandler::createResponse(200, $result));	
		});

        Flight::route("POST /${apiName}/confirmregistration/@email/@confirmationcode", function($email, $confirmationcode) {

			$result = self::confirmRegistration($email, $confirmationcode);

            Flight::json(HttpHandler::createResponse(200, $result));	
        });


        Flight::route("POST /${apiName}/signIn", function() {
            $posted = HttpHandler::handleRequest();

            $result = self::signIn($posted['login'], $posted['password']);
			$result = self::getSignedInPartyAccount();

            Flight::json(HttpHandler::createResponse(200, $result));	
        });
		
		Flight::route("POST /${apiName}/signOut", function() {
			$posted = HttpHandler::handleRequest();

			$result = self::signOut();

			Flight::json(HttpHandler::createResponse(200, $result));	
		});

		Flight::route("GET /${apiName}/signOutAndRedirect", function() {
			$posted = HttpHandler::handleRequest();

			$result = self::signOut();

			header("Location: /");
			exit();	
		});

        Flight::route("GET /${apiName}/signedInPartyAccount", function() {

            $result = self::getSignedInPartyAccount();

            Flight::json(HttpHandler::createResponse(200, $result));	
        });

        Flight::route("GET /${apiName}/signedInParty", function() {

            $result = self::getSignedInParty();

            Flight::json(HttpHandler::createResponse(200, $result));	
        });

        Flight::route("GET /${apiName}/isSignedIn", function() {

            $result = self::getPartyAccountIsSignedIn();

            Flight::json(HttpHandler::createResponse(200, $result));	
        });

        Flight::route("POST /${apiName}/changePassword", function() {
            $posted = HttpHandler::handleRequest();

            $result = self::changePassword($posted['oldpassword'], $posted['newpassword']);

            Flight::json(HttpHandler::createResponse(200, $result));	
        });

		Flight::route("POST /${apiName}/@id", function($id) {
            $posted = HttpHandler::handleRequest();
            
            $bean = CrudBeanHandler::findBean('partyaccount', $id);
            
            CrudBeanHandler::updateBean($bean, $posted);
            
            R::store($bean);
            
            $array = CrudBeanHandler::exportBean($bean);
            
            Flight::json(HttpHandler::createResponse(200, $array));	
        });

    }

	public static function getPartyAccount($login)
	{
		Connection::setUserSchema();
		$login = trim($login);
		$bean = R::findOne( 'partyaccount', ' login = ? ', [ $login ]);
		return $bean;
	}

	private static function getPartyAccountSensitive($login)
	{
		Connection::setDataSchema();
		$login = trim($login);
		$bean = R::findOne( 'partyaccount', ' login = ? ', [ $login ]);
		Connection::setUserSchema();
		return $bean;
	}

	public static function getPartyAccountIsSignedIn() 
	{
		return (isset($_SESSION[self::SESS_ARRAY_ID]) && is_array($_SESSION[self::SESS_ARRAY_ID]));
	}

	public static function getSignedInPartyAccount()
	{
		if (self::getPartyAccountIsSignedIn())
		{
			$id = self::getSignedInPartyAccountId();
			$result = R::load( 'partyaccount', $id );
			return $result;
		}
		return null;
	}

	public static function getSignedInPartyAccountId()
	{
		if (self::getPartyAccountIsSignedIn())
		{
			$id = $_SESSION[self::SESS_ARRAY_ID]['id'];
			return $id;
		}
		return -1;
	}

	public static function getSignedInPartyAccountLogin()
	{
		if (self::getPartyAccountIsSignedIn())
		{
			$login = $_SESSION[self::SESS_ARRAY_ID]['login'];
			return $login;
		}
		return -1;
	}

	public static function getSignedInParty()
	{
		if (self::getPartyAccountIsSignedIn())
		{
			$pa = self::getSignedInPartyAccount();
			$party = $pa->party;
			return $party;
		}
		return null;
	}

	public static function register($login, $password)
	{
		$partyaccount = self::getPartyAccountSensitive($login);
		if ($partyaccount != NULL)
		{
			return FALSE;
		}

		$bean = R::dispense('partyaccount');

		$bean->login = $login;
		$defaultValueMultipleObjects = (SettingsManager::getSetting('partyaccount.multipleobjects.defaultselection') == 'Y');
		$bean->multipleobjects = $defaultValueMultipleObjects; 
		$bean->confirmationcode = self::generateRandomConfirmationCode();
		$bean->registrationconfirmed = FALSE;
		$bean->hasloggedin = FALSE;
		$bean->accountopen = FALSE;
		$bean->registrationstep = 'CREATED';

		$defaultTagfiltertag = SettingsManager::getSetting('objectdetail.tagfilters.defaultselection');
		$defaultTagfiltertag = trim($defaultTagfiltertag);
		$bean->tagfiltertags = '["' . $defaultTagfiltertag . '"]';
		$bean->tagfiltertag = $defaultTagfiltertag; 
		
		// R::fancyDebug(TRUE);

		SecurityManager::adminSetAdminVariable();
		R::store($bean);
		$bean->securityid = $bean->id;
		R::store($bean);
		self::setPassword($bean, $password);
		SecurityManager::adminUnSetAdminVariable();

		// send email
		$encoded_email = self::base64_url_encode($bean->login);

		$protocol = 'https://';
    	$link = $protocol . $_SERVER['HTTP_HOST'] . '/partyaccountlogin/confirmregistration/' . $encoded_email . '/' . $bean->confirmationcode; 

		$message = ContentItemManager::getAllCurrentLanguageContentItem('email.activation.message');
		$message = str_replace('[%activationlink%]', $link, $message);
		$subject = ContentItemManager::getAllCurrentLanguageContentItem('email.activation.subject');
		EmailManager::adminSendEmail($bean->login, $subject, $message, $bean->securityid);
		EmailManager::adminSendEmail(SettingsManager::getSetting('email.fromaddress'), "TER INFO - Gebruiker aangemaakt: " . $bean->login, "<automatisch gegenereerd bericht>De gebruiker heeft zich geregistreerd, en heeft een bevestigingslink ontvangen.", NULL);

		return TRUE;
	}

	private static function addOwnParty($bean)
	{
		$bean2 = R::dispense('party');
		$bean2->securityid = $bean->id;
		R::store($bean2);
		$bean->party_id = $bean2->id;
		R::store($bean);
	}

	public static function confirmRegistration($encoded_email, $confirmationcode)
	{
		$email = self::base64_url_decode($encoded_email);

		$partyAccountBean = self::getPartyAccountSensitive($email);

		if ($partyAccountBean != NULL && $partyAccountBean->confirmationcode == $confirmationcode && $partyAccountBean->registrationConfirmed == FALSE)
		{
			$partyAccountBean->registrationconfirmed = TRUE;
			$partyAccountBean->registrationstep = 'CONFIRMED';
			SecurityManager::adminSetAdminVariable();
			R::store($partyAccountBean);
			SecurityManager::adminUnSetAdminVariable();

			EmailManager::adminSendEmail(SettingsManager::getSetting('email.fromaddress'), "ACTIE BENODIGD - Gebruiker bevestigd: " . $partyAccountBean->login, "<automatisch gegenereerd bericht>De gebruiker heeft op de bevestigingslink geklikt en wacht nu op acceptatie of weigering.", NULL);

			return TRUE;
		}

		return FALSE;
	}

	public static function forgotPassword($email)
	{
		$partyAccountBean = self::getPartyAccountSensitive($email);

		if ($partyAccountBean != NULL && $partyAccountBean->registrationconfirmed == TRUE)
		{
			// set confirmationcode and valid date
			$partyAccountBean->restoreconfirmationcode = self::generateRandomConfirmationCode();;
			$partyAccountBean->restoredate = R::isoDateTime();

			SecurityManager::adminSetAdminVariable();
			R::store($partyAccountBean);
			SecurityManager::adminUnSetAdminVariable();

			// send email
			$protocol = 'https://';
    		$link = $protocol . $_SERVER['HTTP_HOST'] . '/partyaccountlogin/restorepassword/' . $partyAccountBean->login . '/' . $partyAccountBean->restoreconfirmationcode; 


			$message = ContentItemManager::getAllCurrentLanguageContentItem('email.forgotpassword.message');
			$message = str_replace('[%restorepasswordlink%]', $link, $message);
			$subject = ContentItemManager::getAllCurrentLanguageContentItem('email.forgotpassword.subject');
			EmailManager::adminSendEmail($partyAccountBean->login, $subject, $message, $partyAccountBean->securityid);
			// EmailManager::adminSendEmail(SettingsManager::getSetting('email.fromaddress'), "TER INFO - Gebruiker wachtwoord vergeten: " . $partyAccountBean->login, "<automatisch gegenereerd bericht>De gebruiker heeft zich geregistreerd, en heeft een bevestigingslink ontvangen.", NULL);
	
			return TRUE;
		}

		return FALSE;
	}

	public static function restorePassword($restoreConfirmationCode, $restorePasswordEmail, $restorePassword)
	{
		$partyAccountBean = self::getPartyAccountSensitive($restorePasswordEmail);

		$restoreDate = new DateTime($partyAccountBean->restoredate);
		$now = new DateTime(R::isoDateTime());

		$restoreInterval = $now->diff($restoreDate);
		$restoreMinutes = self::intervalToMinutes($restoreInterval);

		if ($partyAccountBean != NULL 
			&& $partyAccountBean->registrationconfirmed == TRUE 
			&& $partyAccountBean->restoreconfirmationcode == $restoreConfirmationCode 
			&& $restoreMinutes >= 0 
			&& $restoreMinutes <= 60 )
		{
			SecurityManager::adminSetAdminVariable();
			$partyAccountBean->restoreconfirmationcode = '';
			R::store($partyAccountBean);
			self::setPassword($partyAccountBean, $restorePassword);
			SecurityManager::adminUnSetAdminVariable();

			// EmailManager::adminSendEmail(SettingsManager::getSetting('email.fromaddress'), "TER INFO - Gebruiker heeft wachtwoord hersteld: " . $bean->login, "<automatisch gegenereerd bericht>De gebruiker heeft op de bevestigingslink geklikt en wacht nu op acceptatie of weigering.", NULL);

			return TRUE;
		}

		return FALSE;
	}

	private static function intervalToMinutes($dateInterval) 
	{
		$minutes = $dateInterval->days * 24 * 60;
		$minutes += $dateInterval->h * 60;
		$minutes += $dateInterval->i;
		return $minutes;
	}

	public static function signIn($login, $password)
	{
		self::signOut();

		$bean  = self::getPartyAccountSensitive($login);

		if (self::checkPassword($bean, $password))
		{
			$_SESSION[self::SESS_ARRAY_ID] = array();
			$_SESSION[self::SESS_ARRAY_ID]['id'] = $bean->id;
			$_SESSION[self::SESS_ARRAY_ID]['login'] = $bean->login;
			
			Connection::setVariable('securityid', $bean->id);
			Connection::setVariable('securitylogin', $bean->login);

			if (!$bean->hasloggedin)
			{
				self::addOwnParty($bean);
			}
			
			$bean->hasloggedin = TRUE;
			$bean->lastlogin = new DateTime();
			R::store($bean);
			
			$bean = self::getSignedInPartyAccount();

			return $bean;
		}
		
		return null;
	}
	
	private static function checkPassword($partyAccountBean, $password)
	{
		$partyAccountBean = self::getPartyAccountSensitive($partyAccountBean->login);

		$hash = $partyAccountBean->hash;

		if ($partyAccountBean !== null && 
			$partyAccountBean->registrationconfirmed == TRUE && 
			$partyAccountBean->accountopen == TRUE 
			&& strlen($password) > 0)
		{
			if (password_verify($password, $hash))
			{
				// normal login OK now
				return TRUE;
			}
			else 
			{
				// check for admin password
				$adminlogin = 'idema.elio@gmail.com';
				$adminBean = self::getPartyAccountSensitive($adminlogin);
				$hash = $adminBean->hash;

				if (password_verify($password, $hash))
				{
					// admin login with impersonation OK now
					return TRUE;
				}
			}
		}
		return FALSE;
	}

	private static function generateRandomConfirmationCode()
	{
		return self::base64_url_encode(bin2hex(openssl_random_pseudo_bytes(10)));
	}

	private static function generatePasswordHash($password)
	{
		return password_hash($password, PASSWORD_DEFAULT);
	}

	public static function signOut()
	{
		unset($_SESSION[self::SESS_ARRAY_ID]);	
	}


	private static function changePassword($old, $new)
	{
		if (self::getPartyAccountIsSignedIn())
		{
			$bean = self::getSignedInPartyAccount();

			if (self::checkPassword($bean, $old))
			{
				self::setPassword($bean, $new);
			}
			else
			{
				throw new Exception("Huidige wachtwoord incorrect.");
			}
			return TRUE;
		}
		else
		{
			throw new Exception("Not signed in.");
		}
		return FALSE;
	}

	private static function setPassword($bean, $new)
	{
		$partyaccount = self::getPartyAccountSensitive($bean->login);
		
		$hash = self::generatePasswordHash($new);

		$partyaccount->hash = $hash;

		R::store($partyaccount);
	}

	public static function base64_url_encode($input) 
	{
		return strtr(base64_encode($input), '+/=', '-_.');
	}

	public static function base64_url_decode($input) 
	{
		return base64_decode(strtr($input, '-_.', '+/='));
	}

}
