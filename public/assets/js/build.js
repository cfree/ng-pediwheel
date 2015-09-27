(function() {
	'use strict';

	angular.module('pwApp', ['ui.router', 'WheelService']);
})();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB3Lm1vZHVsZS5qcyIsInB3LnJvdXRlLmpzIiwiYWdlL2FnZS5jb250cm9sbGVyLmpzIiwic2VydmljZXMvYWdlLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBLFNBQUEsQ0FBQSxhQUFBOzs7QUNIQSxDQUFBLFdBQUE7Q0FDQTs7O0NBR0EsUUFBQSxPQUFBLFNBQUEsQ0FBQTtHQUNBLE9BQUEsQ0FBQSxrQkFBQSxzQkFBQTs7Q0FFQSxTQUFBLFVBQUEsZ0JBQUEsb0JBQUE7O0VBRUEsbUJBQUEsVUFBQTs7O0VBR0E7SUFDQSxNQUFBLFdBQUE7SUFDQSxLQUFBO0lBQ0EsYUFBQTtJQUNBLFlBQUE7O0lBRUEsTUFBQSxjQUFBO0lBQ0EsS0FBQTtJQUNBLGFBQUE7Ozs7QUNwQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxpQkFBQSxDQUFBLFVBQUEsVUFBQSxnQkFBQTs7Q0FFQSxTQUFBLFFBQUEsUUFBQSxRQUFBLFVBQUE7RUFDQSxJQUFBLEtBQUE7O0VBRUEsU0FBQTtJQUNBLEtBQUEsU0FBQSxNQUFBO0lBQ0EsUUFBQSxJQUFBOzs7RUFHQSxHQUFBLFFBQUE7R0FDQSxTQUFBO0dBQ0EsU0FBQTtHQUNBLFNBQUE7O0VBRUEsR0FBQSxRQUFBLENBQUEsR0FBQSxHQUFBOzs7QUNuQkEsQ0FBQSxXQUFBO0NBQ0E7O0NBRUEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxnQkFBQSxDQUFBLFNBQUEsTUFBQTs7Q0FFQSxTQUFBLFNBQUEsT0FBQSxJQUFBO0VBQ0EsSUFBQSxNQUFBO0dBQ0EsYUFBQTs7RUFFQSxJQUFBLGVBQUEsU0FBQSxNQUFBO0dBQ0EsYUFBQTs7O0VBR0EsSUFBQSxlQUFBLFdBQUE7R0FDQSxPQUFBOzs7Ozs7Ozs7RUFTQSxJQUFBLG9CQUFBLFdBQUE7R0FDQSxJQUFBLFdBQUEsR0FBQTs7R0FFQSxNQUFBO0lBQ0EsUUFBQTtJQUNBLEtBQUE7O0lBRUEsUUFBQSxTQUFBLE1BQUE7SUFDQSxJQUFBLGFBQUE7SUFDQSxTQUFBLFFBQUE7O0lBRUEsTUFBQSxXQUFBO0lBQ0EsU0FBQSxPQUFBOzs7R0FHQSxPQUFBLFNBQUE7OztLQUdBIiwiZmlsZSI6ImJ1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ3B3QXBwJywgWyd1aS5yb3V0ZXInLCAnV2hlZWxTZXJ2aWNlJ10pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIFJvdXRlciBjb25maWdcblx0YW5ndWxhci5tb2R1bGUoJ3B3QXBwJywgWyd1aS5yb3V0ZXInXSlcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgYXBwQ29uZmlnXSk7XG5cblx0ZnVuY3Rpb24gYXBwQ29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblx0XHQvLyBEZWZhdWx0IHJvdXRlXG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FnZScpO1xuXG5cdFx0Ly8gTm93IHNldCB1cCB0aGUgc3RhdGVzXG5cdFx0JHN0YXRlUHJvdmlkZXJcblx0XHRcdC5zdGF0ZSgndGFiLWFnZScsIHtcblx0XHRcdFx0dXJsOiAnL2FnZScsXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnLi4vYXNzZXRzL3ZpZXdzL2FnZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0FnZUNvbnRyb2xsZXIgYXMgdm0nXG5cdFx0XHR9KVxuXHRcdFx0LnN0YXRlKCd0YWItd2VpZ2h0Jywge1xuXHRcdFx0XHR1cmw6ICcvd2VpZ2h0Jyxcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9zdGF0ZTIuaHRtbCdcblx0XHRcdH0pO1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdwd0FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ0FnZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICckc3RhdGUnLCAnV2hlZWxTZXJ2aWNlJywgQWdlQ3RybF0pO1xuXG5cdGZ1bmN0aW9uIEFnZUN0cmwoJHNjb3BlLCAkc3RhdGUsIFdoZWVsU3ZjKSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblxuXHRcdFdoZWVsU3ZjLnJldHJpZXZlV2hlZWxEYXRhKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0XHR9KTtcdFxuXG5cdFx0dm0uc2V0dXAgPSB7XG5cdFx0XHQnbmFtZTEnOiAndmFsdWUxJyxcblx0XHRcdCduYW1lMic6ICd2YWx1ZTInLFxuXHRcdFx0J25hbWUzJzogJ3ZhbHVlMycsXG5cdFx0fTtcblx0XHR2bS50aWxlcyA9IFsxLCAyLCAzXTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgncHdBcHAnKVxuXHRcdC5zZXJ2aWNlKCdXaGVlbFNlcnZpY2UnLCBbJyRodHRwJywgJyRxJywgV2hlZWxTdmNdKTtcblxuXHRmdW5jdGlvbiBXaGVlbFN2YygkaHR0cCwgJHEpIHtcblx0XHR2YXIgc3ZjID0gdGhpcyxcblx0XHRcdF93aGVlbERhdGEgPSAnJztcblxuXHRcdHN2Yy5zZXRXaGVlbERhdGEgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRfd2hlZWxEYXRhID0gZGF0YTtcblx0XHR9O1xuXG5cdFx0c3ZjLmdldFdoZWVsRGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIF93aGVlbERhdGEoKTtcblx0XHR9O1xuXG5cdFx0Ly8gR2V0IHNldHVwIGluZm9cblxuXHRcdC8vIEdldCBhZ2UgdGlsZXNcblxuXHRcdC8vIEdldCB3ZWlnaHQgdGlsZXNcblxuXHRcdHN2Yy5yZXRyaWV2ZVdoZWVsRGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuXHRcdFx0JGh0dHAoe1xuXHRcdFx0XHRtZXRob2Q6ICdKU09OJyxcblx0XHRcdFx0dXJsOiAncGVkaXdoZWVsLmpzb24nXG5cdFx0XHR9KVxuXHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRzdmMuc2V0V2hlZWxEYXRhKGRhdGEpO1xuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuXHRcdFx0fSlcblx0XHRcdC5lcnJvcihmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KCdDb3VsZCBub3QgcmV0cmlldmUgd2hlZWwgZGF0YScpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuXHRcdH07XG5cdH1cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9