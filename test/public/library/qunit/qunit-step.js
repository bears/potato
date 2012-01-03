QUnit.extend( QUnit, {

	/**
	 * Check the sequence/order
	 *
	 * @example step(1); setTimeout(function () { step(3); }, 100); step(2);
	 * @param Number expected  The excepted step within the test()
	 * @param String message (optional)
	 */
	step: function (expected, message) {
		if (typeof message == "undefined") {
			message = "step " + expected;
		}
		var actual = ++this.config.current.step; // increment internal step counter.
		QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
	}
});

/**
 * Reset the step counter for every test()
 */
QUnit.testStart(function () {
	this.config.current.step = 0;
});
