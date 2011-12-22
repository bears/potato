<?php
namespace renovation;

/**
 * The base class for renovating \database\individual object.
 */
abstract class chaos extends individual {

	/**
	 * Default/common way to walk through the update.
	 * @return array
	 */
	protected function trivial() {
		$type = get_called_class();
		$prefix = substr( $type, 0, strrpos( $type, '\\' ) );
		$format = substr( $prefix, strpos( $prefix, '\\' ) );

		$data = array( );
		foreach ( $this->update as $label => $values ) {
			$subject = \famulus\ba::entry( $format, $label );
			if ( $subject ) {
				$deriver = "\\$prefix\\$subject";
				$renovator = new $deriver( $this->object, new \ArrayIterator( $values ) );
				$data[] = $renovator->process();
			}
		}
		return $data;
	}

}
