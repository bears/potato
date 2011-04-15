<?php
define('BASE_PATH', dirname(dirname(__FILE__)));

list($unused, $request) = explode('/ajaj/', $_SERVER['REQUEST_URI']);
$arguments = explode('/', $request);

$action = array_shift($arguments);
switch ($action){
	case 'list':
		$type = array_shift($arguments);
		$data = array(
			'indices'=>array(1,2,3),
			't'=>time(),
		);
		echo json_encode($data);
	break;
	
	case 'item':
		$categories = array('wait', 'work', 'done', 'dead');
		$type = array_shift($arguments);
		$id = array_shift($arguments);
		$data = array(
			'id' => $id,
			'category' => $categories[$id % count($categories)],
			'summary' => "Content for {$type}#{$id}",
			't'=>time(),
		);
		echo json_encode($data);
	break;
}
