<?php


// parent class securitymodel



class SecurityModel extends RedBean_SimpleModel 
{
	public function open() 
	{
		// print_r("open ");
		// print_r($this->bean->getMeta( 'type' ) . "<br />");
		Connection::setUserSchema();
	}

	public function dispense() 
	{
		// print_r("dispense ");
		// print_r($this->bean->getMeta( 'type' ) . "<br />");
		Connection::setUserSchema();
	}
	
	public function update() 
	{
		// print_r("update ");
		// print_r($this->bean->getMeta( 'type' ) . "<br />");
		Connection::setDataSchema();
	}
	
	public function after_update() 
	{
		Connection::setUserSchema();
	}
	
	public function delete() 
	{		
		// print_r("delete ");
		// print_r($this->bean->getMeta( 'type' ) . "<br />");
		Connection::setDataSchema();
	}

	public function after_delete() 
	{		
		Connection::setUserSchema();
	}
}

// object-specific security models
class Model_Contentitem extends SecurityModel {}
class Model_Externaldatacache extends SecurityModel {}
class Model_Email extends SecurityModel {}
class Model_Image extends SecurityModel {}
class Model_Object extends SecurityModel {}
class Model_Hoa extends SecurityModel {}
class Model_Hoamember extends SecurityModel {}
class Model_Party extends SecurityModel {}
class Model_Partyaccount extends SecurityModel {}
class Model_Project extends SecurityModel {}
class Model_Questioninstance extends SecurityModel {}
class Model_Questions extends SecurityModel {}
class Model_Questiontree extends SecurityModel {}
class Model_Sessions extends SecurityModel {}
class Model_Settings extends SecurityModel {}
