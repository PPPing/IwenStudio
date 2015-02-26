(function(){
	var app = angular.module('iwenStudio', [ ]);	

	app.factory('LoadingService',function(){
		var progress=0;
		var LoadingService={
			update:function(value){
				if(value>100){
					value=100;
				}else if(value<0){
					value=0;
				}
				progress=value;
				console.log("update : "+progress);
				$(".loading-bar>.loading-bar-progress").css("width",progress+"%");
				$(".loading-bar>.loading-bar-num").html(progress+"%");
			},
			hideLoading:function(){
				$(".loading").delay( 500 ).fadeOut("fast");
			}
		}
		return LoadingService;
	});
	
	app.factory('TimerService',function($timeout,$interval){
		var timeoutStack=[];
		var intervalStack=[];
		var TimerService={
			pushTimeout:function(timeout){
				timeoutStack.push(timeout);
			},
			pushInterval:function(interval){
				intervalStack.push(interval);
				console.log(intervalStack);
			},
			clearAllTimer:function(){
				console.log("clearAllTimer");
				for(var i=0;i<timeoutStack.length;i++){
					if(timeoutStack[i]){
						$timeout.cancel(timeoutStack[i]);
					}
				}
				for(var i=0;i<intervalStack.length;i++){
					if(intervalStack[i]){
						console.log(intervalStack[i]);
						$interval.cancel(intervalStack[i]);
					}
				}
			}
		}
		return TimerService;
	});
	
	app.factory('MenuService',function(TimerService){
		var curComponentIndex = 'home';
		var MenuService = {
			getComponentIndex:function(){
				return curComponentIndex;
			},
			changeComponents:function(index){
				curComponentIndex = index;
				TimerService.clearAllTimer();
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

	app.directive('comHome',function($compile){
		return{
			restrict: 'E',
			templateUrl:'directives/comHome.html',
			controller: function($scope,$element,$http,$timeout,LoadingService) {
				$scope.loopingTimeout=null;
				$scope.featuredImages=[];
				$http.get('images/featuredImages.json?'+new Date())
				.then(function(result){
					$scope.featuredImages=result.data;
					if($scope.featuredImages.length>0){
						loadFeaturedImage(0);
					}
				});
				var loadFeaturedImage=function(index){
					LoadingService.update(Math.floor(100*(index)/$scope.featuredImages.length));
					if(index>=$scope.featuredImages.length||index<0){
						LoadingService.hideLoading();
						$scope.loopingTimeout=$timeout(featuredImageLooping,5000);
						return;
					}
					var image = $( new Image() ).load(function( event ) {
									var backgroundImageStyle="background-image:url("+$scope.featuredImages[index]+")";
									var screenItem="<div ng-class=\""+"featuredImageIndex=="+index+"?'active':''"+"\" class=\'com-home-screen-item\' style=\'"+backgroundImageStyle+"\'></div>";
									$element.find(".com-home-screen").append($compile(screenItem)( $scope ));
									loadFeaturedImage(++index);
								}).error(function( event ) {
								}).prop( "src", $scope.featuredImages[index]);
					
				}
				$scope.featuredImageIndex=0;
				 var featuredImageLooping=function(){
					console.log("featuredImageIndex : "+$scope.featuredImageIndex);
					$scope.featuredImageIndex+=1;
					if($scope.featuredImageIndex>=$scope.featuredImages.length){
						$scope.featuredImageIndex=0;
					}
					$scope.loopingTimeout=$timeout(featuredImageLooping,5000);
				}
				


				$scope.certIndex=0;
				
				$scope.nextCert=function(){
					$scope.certIndex++;
					if($scope.certIndex>=3)
					{
						$scope.certIndex=2;
					}
				}
				$scope.preCert=function(){
					$scope.certIndex--;
					if($scope.certIndex<0)
					{
						$scope.certIndex=0;
					}
				}
				
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
				
				$element.on('$destroy', function() {
					$timeout.cancel($scope.loopingTimeout);
				});
			}
		};
	});
	app.directive('comGallery',function(){
		return{
			restrict: 'E',
			scope: {
				galleryId:'@galleryId'
			},
			controller: function($scope,$element,$http,$interval,$timeout,TimerService) {
				console.log($scope.galleryId);
				$scope.galleryId="test";
				$scope.gallery=[];
				$http.get('images/gallery_'+$scope.galleryId+'.json?'+new Date())
				.then(function(result) {
					console.log(result);
					$scope.gallery=result.data;
				});
				var timer = 0;
				$scope.updateTimeInterval=null;
				$scope.switchImageTimeOut=null;
				$scope.curImageIndex=0;
				$scope.slideShowEnable=false;
				$scope.slideShow=function(index){
					timer=0;
					$scope.slideShowEnable=true;
					$scope.changeFullImage(index);
				}
				$scope.autoSlide=false;
				$scope.slideHide=function(){
					$scope.slideShowEnable=false;
					clearTimer();
					$element.find(".gallery-slideShow-fullImage.in").css("background-image","none");
					$element.find(".gallery-slideShow-fullImage.out").css("background-image","none");
				}
				$scope.changeFullImage=function(index){
					clearTimer();					
					$element.find(".gallery-slideShow-loading").removeClass("hide");
					if(index>=$scope.gallery.length){
						index=0;
					}else if(index<0){
						index = $scope.gallery.length-1;
					}
					$scope.curImageIndex = index;
					$scope.fullImageCur=$scope.gallery[index].fullImage;
					var image = $( new Image() ).load(function( event ) {
									$element.find(".gallery-slideShow-loading").addClass("hide");
									switchFullImage($scope.curImageIndex,$scope.fullImageCur);								
									if($scope.autoSlide){
										clearTimer();
										$scope.updateTimeInterval=$interval(updateTimer, 1000);
										
										autoSlideNext( ($scope.curImageIndex+1) );
									} 
								}).error(function( event ) {
									console.log(event);
								}).prop( "src", $scope.fullImageCur );
				}
				$scope.updateTimeInterval = null;
				$scope.switchImageTimeOut = null;
				var clearTimer=function(){
					console.log("clearTimer");
					timer=0;
					if($scope.updateTimeInterval){
						$interval.cancel($scope.updateTimeInterval);
					}
					if($scope.switchImageTimeOut){
						$timeout.cancel($scope.switchImageTimeOut);
					}
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
					var nextIndex = index;
					var nextfullImageCur=$scope.gallery[index].fullImage;
					var image = $( new Image() ).load(function( event ) {
									if($scope.autoSlide){
										if(timer>=autoSlideInterval){
											switchFullImage(nextIndex,nextfullImageCur);
											autoSlideNext(++index);
										}else{
											$scope.switchImageTimeOut=$timeout(function(){
												console.log("switchFullImage");
												switchFullImage(nextIndex,nextfullImageCur);
												autoSlideNext(++index);
											},1000*(autoSlideInterval - timer));
										}
									}
								}).error(function( event ) {
									console.log(event);
								}).prop( "src", nextfullImageCur );
				} 

				var switchFullImage=function(nextIndex,nextfullImageCur){
					
					var imageIn=$element.find(".gallery-slideShow-fullImage.in")
					var imageOut=$element.find(".gallery-slideShow-fullImage.out");
									
					imageOut.css("background-image","url('"+nextfullImageCur+"')").removeClass("out").addClass("in");
					imageIn.removeClass("in").addClass("out");
					timer=0;
					$scope.curImageIndex=nextIndex;
					$scope.fullImage=nextfullImageCur;	
				}
				
				$scope.toggleAutoSlide=function(){
					$scope.autoSlide=!$scope.autoSlide;
					clearTimer();
					if($scope.autoSlide){
						$scope.updateTimeInterval=$interval(updateTimer, 1000);
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
				
				$element.on('$destroy', function() {
					clearTimer();
				});
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