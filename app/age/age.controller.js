(function() {
	'use strict';

	angular.module('pwApp')
		.controller('AgeController', ['$scope', '$state', 'WheelService', AgeCtrl]);

	function AgeCtrl($scope, $state, WheelSvc) {
		var vm = this;

		WheelSvc.retrieveWheelData()
			.then(function(data) {
				console.log(data);
			});	

		vm.setup = {
			'name1': 'value1',
			'name2': 'value2',
			'name3': 'value3',
		};
		vm.tiles = [1, 2, 3];
	}
})();