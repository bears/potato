<?php
if (preg_match('#/ajaj/(?P<category>\w+)/(?P<type>\w+)(?:/(?P<id>\d+))?#', $_SERVER['REQUEST_URI'], $match)){
	switch ($match['category']){
		case 'list':
			$data = array(1, 2, 3);
		break;
		case 'item':
			$data = array(
				'id' => $match['id'],
				'summary' => "Content for {$match['type']}#{$match['id']}",
			);
		break;
	}
	echo json_encode($data);
}