<?php
namespace element;

/**
 * Base of assistant classes of element.
 */
abstract class assistant {

	public function __construct( \element\element $object ) {
		$this->object = $object;
	}

	/**
	 * @return JSON
	 */
	public function __toString() {
		return json_encode( $this->content() );
	}

	/**
	 * Gather content of each unit inside aggregate.
	 * Override this method to customize.
	 * @param array $vessel [IN|OUT]
	 * @return array
	 */
	public function & content( array &$vessel = array( ) ) {
		return $this->trivial( $vessel );
	}

	/**
	 * For aggregate assistant.
	 * @param array $vessel
	 * @return array
	 */
	public function & trivial( array &$vessel = array( ) ) {
		if ( $this->object instanceof \Traversable ) {
			$class = get_called_class();
			$member = substr( $class, 0, strrpos( $class, '\\' ) );
			$further = method_exists( $this, 'initialize_unit' );
			foreach ( $this->object as $unit ) {
				$assistant = new $member( $unit );
				$further && $this->initialize_unit( $assistant );
				$vessel[] = $assistant->content();
			}
		}
		return $vessel;
	}

	/**
	 * The object holds the base information.
	 * @var \element\element
	 */
	protected $object;

}
