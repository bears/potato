<?php
define('BASE_PATH', dirname(dirname(__FILE__)));

list($unused, $request) = explode('/ajaj/', $_SERVER['REQUEST_URI']);
$arguments = explode('/', $request);

$domain = array_shift($arguments);
switch ($domain){
	case 'season':
		$subject = array_shift($arguments);
		$id = array_shift($arguments);
		$list = array('t' => time());
		$icon = array('pencil'=>'', 'refresh'=>'', 'shuffle'=>'', 'note'=>'', 'document'=>'');
		for ($i=0; $i<rand(3, 7); ++$i){
			$data = array(
				'id' => "$subject#$id",
				'label' => "Content for {$subject}#{$id}",
				'icon' => array_rand($icon, 1),
				't' => time(),
			);
			$list['tubers'][] = $data;
		}
		echo json_encode($list);
	break;

	case 'seed':
	break;

	case 'profile':
		echo <<<JSON
window.POTATO_PROFILE = {
	locale : 'en_US'
};
JSON;
	break;
}
