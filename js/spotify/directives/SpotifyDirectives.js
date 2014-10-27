var directives = angular.module('spotify.directives',[]);

directives.directive('trackPlayer', ['$sce',function($sce) {
	// console.dir($sce);
	// var trust = 
    return {
    restrict: 'E',
    require: '?ngModel',
    replace: true,
    transclude: true,
    template: '<iframe height="100%" width="100%" frameborder="0"></iframe>',
    link: function (scope, element, attrs) {
    	console.log(attrs.iframeSrc);
        element.attr('src', attrs.iframeSrc);
    }
    };
  }]);