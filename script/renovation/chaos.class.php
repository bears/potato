<?php
namespace renovation;

/**
 * The base class for mixing several renovations.
 */
abstract class chaos extends individual {

	/**
	 * Override.
	 * @param array $vessel [IN|OUT]
	 * @return array
	 */
	public function & content( array &$vessel = array( ) ) {
		$type = get_called_class();
		$prefix = substr( $type, 0, strrpos( $type, '\\' ) );
		$format = substr( $prefix, strpos( $prefix, '\\' ) );

		foreach ( $this->update as $label => $child ) {
			$subject = \famulus\ba::entry( $format, $label );
			if ( $subject ) {
				$deriver = "\\$prefix\\$subject";
				$renovator = new $deriver( $this->object );
				$renovator->initialize( $child );
				$renovator->content( $vessel );
			}
		}
		return $vessel;
	}

}
