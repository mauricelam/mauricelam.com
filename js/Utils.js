
var Utils = {};

(function () {
	'use strict';

	Utils.isTouchDevice = function () {
		return (window.ontouchstart !== undefined);
	};

}());