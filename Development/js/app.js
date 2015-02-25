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
	
	app.factory('LoadingProgress',function(){
		var progress=0;
		var LoadingProgress={
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
		return LoadingProgress;
	});
	
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
	var comHomeScreenTimeout=null;
	app.directive('comHome',function($compile){
		return{
			restrict: 'E',
			templateUrl:'directives/comHome.html',
			controller: function($scope,$element,$http,LoadingProgress,$compile) {
				$scope.featuredImages=[];
				$http.get('images/featuredImages.json?'+new Date())
				.then(function(result){
					$scope.featuredImages=result.data;
					if($scope.featuredImages.length>0){
						loadFeaturedImage(0);
					}
				});

				var loadFeaturedImage=function(index){
					LoadingProgress.update(Math.floor(100*(index)/$scope.featuredImages.length));
					if(index>=$scope.featuredImages.length||index<0){
						LoadingProgress.hideLoading();
						//comHomeScreenTimeout=setTimeout(featuredImageLooping,5000);
						return;
					}
					var image = $( new Image() ).load(function( event ) {
									var backgroundImageStyle="background-image:url("+$scope.featuredImages[index]+")";
									var screenItem=$compile("<div ng-class=\""+"$index==featuredImageIndex?'in':'out'"+"\" class=\'com-home-screen-item\' style=\'"+backgroundImageStyle+"\'></div>");
									$element.find(".com-home-screen").append(screenItem);
									loadFeaturedImage(++index);
								}).error(function( event ) {
									console.log(event);
								}).prop( "src", $scope.featuredImages[index]);
					
				}
				$scope.featuredImageIndex=0;
				/* var featuredImageLooping=function(){
					$element.find(".com-home-screen-item").eq(featuredImageIndex).removeClass("out").addClass("in");
					featuredImageIndex++;
					if(nextIndex>=$scope.featuredImages.length){
						nextIndex=0
					}
					$element.find(".com-home-screen-item").eq(nextIndex).next().removeClass("out").addClass("in");
					comHomeScreenTimeout=setTimeout(featuredImageLooping,5000);
				} */
				
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
				$scope.updateTimeInterval=null;
				$scope.switchImageTimeOut=null;
				$scope.curImageIndex=0;
				$scope.slideShowEnable=false;
				$scope.slideShow=function(index){
					timer=0;
					$scope.slideShowEnable=true;
					$scope.changeFullImage(index);
				}
				$scope.autoSlide=true;
				$scope.slideHide=function(){
					$scope.slideShowEnable=false;
					clearTimer();
					$element.find(".gallery-slideShow-fullImage.in").css("background-image","none");
					$element.find(".gallery-slideShow-fullImage.out").css("background-image","none");
				}
				$scope.changeFullImage=function(index){
					clearTimer();
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
										$scope.updateTimeInterval=setInterval(updateTimer, 1000);
										autoSlideNext(++index);
									} 
								}).error(function( event ) {
									console.log(event);
								}).prop( "src", $scope.fullImageCur );
				}
				var clearTimer=function(){
					console.log("clearTimer");
					timer=0;
					if($scope.updateTimeInterval){
						clearInterval($scope.updateTimeInterval);
					}
					if($scope.switchImageTimeOut){
						clearTimeout($scope.switchImageTimeOut);
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
					$scope.curImageIndex = index;
					$scope.fullImageCur=$scope.gallery[index].fullImage;
					var image = $( new Image() ).load(function( event ) {
									if($scope.autoSlide){
										if(timer>=autoSlideInterval){
											switchFullImage();
											autoSlideNext(++index);
										}else{
											$scope.switchImageTimeOut=setTimeout(function(){
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
									
					imageOut.css("background-image","url('"+$scope.fullImageCur+"')").removeClass("out").addClass("in");
					imageIn.removeClass("in").addClass("out");
					timer=0;
				}
				
				$scope.toggleAutoSlide=function(){
					$scope.autoSlide=!$scope.autoSlide;
					
					clearTimer();
					if($scope.autoSlide){
						$scope.updateTimeInterval=setInterval(updateTimer, 1000);
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