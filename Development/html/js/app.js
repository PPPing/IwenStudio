(function(){
	var app = angular.module('iwenStudio', [ ]);	

	app.factory('LoadingService',function(){
		var progress=0;
		var loadedCallbacks=[];
		var updateProgress=function(value){
			if(value>100){
				value=100;
			}else if(value<0){
				value=0;
			}
			progress=value;
			console.log("updateProgress : "+progress);
			if(progress>=100){
				finishLoading();
			}
			$(".loading-bar>.loading-bar-progress").css("width",progress+"%");
			$(".loading-bar>.loading-bar-num").html(progress+"%");
		}
		var finishLoading=function(){
			for(var i=0;i<loadedCallbacks.length;i++){
				if(loadedCallbacks[i]){
					loadedCallbacks[i]();
				}
			}
			$(".loading").delay( 500 ).fadeOut("fast");
		}
		var LoadingService={
			//Total: 100 FeaturedImage:80 BGM:20
			addProgress:function(value){
				updateProgress(progress+value);
			},
			getProgress:function(){
				return progress;
			},
			pushLoadedCallback:function(callback){
				loadedCallbacks.push(callback);
				console.log(loadedCallbacks);
			},
			weights:{
				FeaturedImage:80,
				Bgm:20
			}
		}
		return LoadingService;
	});
	
	app.factory('BackgroundMusicService',function(LoadingService){
		var playList=["music/more_than_words.mp3","music/love_me_tender.mp3","music/The_Fire_In_Your_Eyes.mp3"];
		var curIndex=0;
		var playSound='';
		var playNext=function(playList,index){
				if(index>=playList.length){
					index=0;
				}
				curIndex=index;
				playSound = soundManager.createSound({
					url: playList[index]
				});
				playSound.play({
					onfinish: function(){
						playNext(playList,index+1);
					}
				});
			}
		var preNext=function(playList,index){
				if(index>=playList.length){
					index=0;
				}
				curIndex=index;
				playSound = soundManager.createSound({
					url: playList[index]
				});
			}
		var BackgroundMusicService = {
			init:function(){
				soundManager.setup({
					preferFlash: false,
					onready: function() {
						preNext(playList,curIndex);
						LoadingService.addProgress(LoadingService.weights.Bgm);
					}
				});
			},
			play:function(){
				console.log("play");
				playSound.play({
					onfinish: function(){
						playNext(playList,index+1);
					}
				});
			},
			stop:function(){
				soundManager.stopAll();
				isPlaying=false;
			},
			togglePause:function(){
				soundManager.togglePause(playSound.id);
				console.log(playSound);
			},
			isPlaying:function(){
				if(!playSound||playSound==''){
					return false;
				}
				return playSound.playState==1&&!playSound.paused;
			}
		}
		return BackgroundMusicService;
	});	
	
	app.directive('modBackgroundMusic',function($compile) {
		return {
			restrict: 'E',
			scope: {},
			controller:function($scope,$element,$http,BackgroundMusicService,LoadingService) {
				$scope.togglePause=BackgroundMusicService.togglePause;
				$scope.isPlaying=BackgroundMusicService.isPlaying;
				//LoadingService.pushLoadedCallback(BackgroundMusicService.play);
				if(!BackgroundMusicService.isPlaying()){
					BackgroundMusicService.init();				
				}				
			},
			templateUrl:'directives/modBackgroundMusic.html',
		};
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
	app.controller('TopMenuController',['$scope','MenuService','$element',function($scope,MenuService){		
		$scope.mobileMenuEnable=false;
		$scope.toggleMenu=function(){
			$scope.mobileMenuEnable = !$scope.mobileMenuEnable;
		}
		$scope.isActive = MenuService.isActive;
		$scope.changeComponents = function(index){
				MenuService.changeComponents(index);
				$scope.mobileMenuEnable=false;
		}
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
					if(index>=$scope.featuredImages.length||index<0){
						$scope.loopingTimeout=$timeout(featuredImageLooping,5000);
						return;
					}
					LoadingService.addProgress(Math.ceil(LoadingService.weights.FeaturedImage/$scope.featuredImages.length));
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
					$scope.featuredImageIndex+=1;
					if($scope.featuredImageIndex>=$scope.featuredImages.length){
						$scope.featuredImageIndex=0;
					}
					$scope.loopingTimeout=$timeout(featuredImageLooping,5000);
				}

				$element.on('$destroy', function() {
					$timeout.cancel($scope.loopingTimeout);
				});
			}
		};
	});
	
	app.directive('modCertList',function($compile){
		return {
			restrict: 'E',
			scope: {},
			controller:function($scope,$element,$http) {
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
				$scope.certList=[];
				$http.get('images/certList.json?'+new Date())
				.then(function(result){
					$scope.certList=result.data;
				});										
			},
			templateUrl:'directives/modCertList.html',
		};
	});
	
	app.directive('modFooter',function($compile) {
		return {
			restrict: 'E',
			scope: {},
			replace:true,
			controller:function($scope,$element,$http,MenuService) {
				$scope.isGalleryMode
				
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
			},
			templateUrl:'directives/modFooter.html',
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
			controller: function($scope,$http,$element) {			
				$scope.cinemaList=[];
				$http.get('images/cinemaList.json?'+new Date())
				.then(function(result) {
					console.log(result);
					$scope.cinemaList=result.data;
					$element.find(".com-cinema-list").css("width",322*$scope.cinemaList.length+'%');
				});
			},
			templateUrl:'directives/comCinematography.html',
		};
	});
})();