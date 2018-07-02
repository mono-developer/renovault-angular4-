<?php

class CrudBeanHandler 
{
	public static $storeAsObject;

	static function init()
	{
		self::$storeAsObject['project'][] = 'phase';
		self::$storeAsObject['object'][] = 'houseparts';
		self::$storeAsObject['object'][] = 'housepartsexcluded';
		self::$storeAsObject['object'][] = 'tagfiltertags';
		self::$storeAsObject['hoa'][] = 'houseparts';
		self::$storeAsObject['hoa'][] = 'housepartsexcluded';
		self::$storeAsObject['hoa'][] = 'tagfiltertags';
		self::$storeAsObject['questions'][] = 'options';
	}

	public static function exportBean($bean)
	{
		$b = $bean->export();

		$table = $bean->getMeta('type');

		if (isset(self::$storeAsObject[$table]))
		{
			foreach (self::$storeAsObject[$table] as $key => $value) 
			{
				$b[$value] = json_decode($b[$value]);
			}
		}

		return $b;
	}

	public static function updateBean($bean, $posted)
	{
		$table = $bean->getMeta('type');

		foreach ($posted as $key => $value) 
		{
			if ($key !== 'id')
			{
				if (isset(self::$storeAsObject[$table]) && in_array($key, self::$storeAsObject[$table]))
				{
					$value = json_encode($value);
				}
				$bean->$key = $value;
			}
		}
	}
	
	public static function queryBeans($table, $condition, $variables)
	{
		$beans  = R::find( $table, $condition, $variables );
		return $beans;
	}


	public static function findBean($table, $id)
	{
		$bean = R::load($table, $id);
		return $bean;
	}

	public static function findAllBeans($table)
	{
		$all = R::find($table);
		return $all;		
	}

	public static function trashBean($bean)
	{
		R::trash($bean);
	}

	public static function storeBean($bean)
	{
		R::store($bean);
	}

	public static function dispenseBean($table)
	{
		return R::dispense($table);
	}
}


CrudBeanHandler::init();
