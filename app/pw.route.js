(function() {
	'use strict';

	// Router config
	angular.module('pwApp', ['ui.router'])
		.config(['$stateProvider', '$urlRouterProvider', appConfig]);

	function appConfig($stateProvider, $urlRouterProvider) {
		// Default route
		$urlRouterProvider.otherwise('/age');

		// Now set up the states
		$stateProvider
			.state('tab-age', {
				url: '/age',
				templateUrl: '../assets/views/age.html',
				controller: 'AgeController as vm'
			})
			.state('tab-weight', {
				url: '/weight',
				templateUrl: 'partials/state2.html'
			});
	}
})();