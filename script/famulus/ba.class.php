<?php
namespace famulus;

/**
 * Translate an abbreviation to its intactness form.
 */
class ba extends ab {

	/**
	 * Change current subject.
	 * @param string $label
	 * @return string
	 */
	public function focus( $label ) {
		if ( isset( self::$map_pool[$this->path][$label] ) ) {
			$this->map = self::$map_pool[$this->path][$label];
			$this->subject = $this->map[parent::UUID_KEY];
			return $this->subject;
		}
	}

	/**
	 * Load the whole map.
	 */
	public static function load() {
		self::$map_pool = require 'setting/ba.php';
	}

	protected function __construct( $path ) {
		$this->map = array( );
		$this->path = $path;
	}

	/**
	 * Object path.
	 * @var string
	 */
	private $path;

}

// Initialize static data.
ba::load();
