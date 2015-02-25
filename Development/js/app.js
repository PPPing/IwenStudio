(function(){
	var app = angular.module('iwenStudio', [ ]);	

	
	app.factory('MenuService',function(){
		var curComponentIndex = 'home';
		var MenuService = {
			getComponentIndex:function(){
				return curComponentIndex;
			},
			changeComponents:function(index){
				curComponentIndex = index;
			},
			isActive:function(index){
				return index==curComponentIndex;
			}
		}
		return MenuService;
	});
	app.controller('TopMenuController',['$scope','MenuService',function($scope,MenuService){
		$scope.changeComponents = MenuService.changeComponents;
		$scope.isActive = MenuService.isActive;
	}]);
	
	app.directive('comContainer',function($compile) {
		return {
			restrict: 'E',
			template: '<div class="container"></div>',
			scope: {},
			controller:function($scope,$element,MenuService) {
				$scope.getComponentIndex = MenuService.getComponentIndex;
				$scope.$watch(
                    function( $scope ) {
                        return $scope.getComponentIndex();
                    },
                    function( newValue ) {
						var html="";
						if(/^gallery-/i.test(newValue)){
							console.log(newValue);
							var galleryId=newValue.substring(8,newValue.length);
							console.log(galleryId);
							html="<com-gallery  data-gallery-id='"+galleryId+"'></com-gallery>";
						}else{
							html="<com-"+newValue+"></com-"+newValue+">";
						}
						var el = $compile( html )( $scope );
						$element.html( el );
                    }
                );				
			}
		};
	});
	
	app.directive('comHome',function(){
		return{
			restrict: 'E',
			templateUrl:'directives/comHome.html',
			controller: function($scope,$element,$http,$interval) {
				var fullScreen=function(element) {
							if(element.requestFullScreen) {
								element.requestFullScreen();
							} else if(element.mozRequestFullScreen) {
								element.mozRequestFullScreen();
							} else if(element.webkitRequestFullScreen) {
							element.webkitRequestFullScreen();
							}
				};
				$scope.launchFullScreen=function(){
					fullScreen(document.documentElement);
				};
			}
		};
	});
	app.directive('comGallery',function(){
		return{
			restrict: 'E',
			scope: {
				galleryId:'@galleryId'
			},
			controller: function($scope,$element,$http,$interval) {
				console.log($scope.galleryId);
				$scope.galleryId="test";
				$scope.gallery=[];
				$http.get('images/gallery_'+$scope.galleryId+'.json?'+new Date())
				.then(function(result) {
					console.log(result);
					$scope.gallery=result.data;
				});
				var timer = 0;
				var updateTimeInterval=null;
				var swithImageTimeOut=null;
				$scope.curImageIndex=0;
				$scope.slideShowEnable=false;
				$scope.slideShow=function(index){
					timer=0;
					$scope.slideShowEnable=true;
					$scope.changeFullImage(index);
					updateTimeInterval=setInterval(updateTimer, 1000);
				}
				$scope.autoSlide=true;
				$scope.slideHide=function(){
					timer=0;
					$scope.slideShowEnable=false;
					if(updateTimeInterval){
						clearInterval(updateTimeInterval);
					}
					if(swithImageTimeOut){
						clearTimeout(swithImageTimeOut);
					}
					$element.find(".gallery-slideShow-fullImage.in").attr("src","");
					$element.find(".gallery-slideShow-fullImage.out").attr("src","");
				}
				$scope.changeFullImage=function(index){
					console.log(index);
					console.log($element.find(".gallery-slideShow-loading"));
					$element.find(".gallery-slideShow-loading").removeClass("hide");
					if(index>=$scope.gallery.length){
						index=0;
					}else if(index<0){
						index = $scope.gallery.length-1;
					}
					$scope.curImageIndex = index;
					$scope.fullImageCur=$scope.gallery[index].fullImage;
					var image = $( new Image() ).load(function( event ) {
									console.log(event);
									console.log(image);
									$element.find(".gallery-slideShow-loading").addClass("hide");
									switchFullImage();
									
									if($scope.autoSlide){
										autoSlideNext(++index);
									} 
								}).error(function( event ) {
									console.log(event);
								}).prop( "src", $scope.fullImageCur );
				}
				
				var updateTimer=function(){
					timer++;
					console.log(timer);
				};
				var autoSlideInterval=5;
				
				 var autoSlideNext=function(index){
					 console.log();
					if(index>=$scope.gallery.length){
						index=0;
					}else if(index<0){
						index = $scope.gallery.length-1;
					}
					$scope.curImageIndex = index;
					$scope.fullImageCur=$scope.gallery[index].fullImage;
					var image = $( new Image() ).load(function( event ) {
									if($scope.autoSlide){
										if(timer>=autoSlideInterval){
											switchFullImage();
											autoSlideNext(++index);
										}else{
											swithImageTimeOut=setTimeout(function(){
												console.log("TimeOut");
												switchFullImage();
												autoSlideNext(++index);
											},1000*(autoSlideInterval - timer))
										}
									}
								}).error(function( event ) {
									console.log(event);
								}).prop( "src", $scope.fullImageCur );
				} 
				
				var switchFullImage=function(){
					var imageIn=$element.find(".gallery-slideShow-fullImage.in")
					var imageOut=$element.find(".gallery-slideShow-fullImage.out");
									
					imageOut.attr("src",$scope.fullImageCur);
					imageOut.attr("src",$scope.fullImageCur).removeClass("out").addClass("in");
					imageIn.removeClass("in").addClass("out");
					timer=0;
				}
				
				$scope.toggleAutoSlide=function(){
					$scope.autoSlide=!$scope.autoSlide;
					if(swithImageTimeOut){
						clearTimeout(swithImageTimeOut);
					}
					
					if($scope.autoSlide){
						autoSlideNext(($scope.curImageIndex+1));
					}else{
						
					}
				}
				
				$scope.nextFullImage=function(){
					$scope.changeFullImage($scope.curImageIndex+1);
				}
				$scope.preFullImage=function(){
					$scope.changeFullImage($scope.curImageIndex-1);
				}
			},
			templateUrl:'directives/comGallery.html',
		};
	});
	app.directive('comAbout',function(){
		return{
			restrict: 'E',
			templateUrl:'directives/comAbout.html',
		};
	});
	app.directive('comContact',function(){
		return{
			restrict: 'E',
			templateUrl:'directives/comContact.html',
		};
	});
	app.directive('comCinematography',function(){
		return{
			restrict: 'E',
			templateUrl:'directives/comCinematography.html',
		};
	});
})();