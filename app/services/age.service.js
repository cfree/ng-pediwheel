(function() {
	'use strict';

	angular.module('pwApp')
		.service('WheelService', ['$http', '$q', WheelSvc]);

	function WheelSvc($http, $q) {
		var svc = this,
			_wheelData = '';

		svc.setWheelData = function(data) {
			_wheelData = data;
		};

		svc.getWheelData = function() {
			return _wheelData();
		};

		// Get setup info

		// Get age tiles

		// Get weight tiles

		svc.retrieveWheelData = function() {
			var deferred = $q.defer();

			$http({
				method: 'JSON',
				url: 'pediwheel.json'
			})
			.success(function(data) {
				svc.setWheelData(data);
				deferred.resolve(data);
			})
			.error(function() {
				deferred.reject('Could not retrieve wheel data');
			});

			return deferred.promise;
		};
	}
})();