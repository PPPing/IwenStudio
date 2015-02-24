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
		};
	});
	app.directive('comGallery',function(){
		return{
			restrict: 'E',
			scope: {
				galleryId:'@galleryId'
			},
			controller: function($scope) {
				console.log($scope.galleryId);
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
	/* app.controller('SiderController',['$scope','MenuService',function($scope,MenuService){
		$scope.getModules = MenuService.getModules;
		$scope.changeModule = MenuService.changeModule;
		$scope.getModuleIndex = MenuService.getModuleIndex;
		$scope.back= MenuService.popModulesStack;
		$scope.modulesStackDepth = MenuService.getModulesStackDepth;
	}]);
	
	
	app.directive('moduleClientList',function() {
		return {
			restrict: 'E',
			scope: {},
			controller: function($scope) {
				$scope.moduleInfo={
					curSubmodule:"client-list",
					clientDetail_clientId:null
				};
			},
			templateUrl:'directives/modules/clientList.html',
			controllerAs: 'clientListModule'
		};
	});
	
	app.directive('clientListTmpl',function(){
		return {
			restrict: 'E',
			controller: function($scope,$http,MenuService,UserService) {
				$http.get('sampleData/clientList.json?timestamp='+ new Date())
				.then(function(result) {
					console.log(result);
					$scope.clientListData = result.data;
				});
				this.viewClientDetail=function(clientId){
					console.log(clientId);
					console.log($scope.moduleInfo);
					$scope.moduleInfo.curSubmodule="client-detail";
					$scope.moduleInfo.clientDetail_clientId = clientId;
				};
			},
			templateUrl:'directives/templates/clientListTmpl.html',
			controllerAs: 'clientListTmpl'
		};
	});
	
	app.directive('clientDetailTmpl',function(){
		return {
			restrict: 'E',
			controller: function($scope,$http,MenuService,UserService) {
				var clientDetailmodules=[
					{
						id:"client-detail",
						name:"Client Detail",
						isSubModule:true
					}
				];
				$scope.$watch(
                    function( $scope ) {
                        return $scope.moduleInfo.clientDetail_clientId;
                    },
                    function( newValue ) {
						newValue = "111";
						$http.get('sampleData/clientDetail-'+newValue+'.json?timestamp='+ new Date())
						.then(function(result) {
							$scope.clientDetail = result.data;
							$scope.UserService = UserService;
							$scope.postComment = function(){
							};
							MenuService.pushModulesStack(clientDetailmodules);
						});
                    }
                );	
			},
			templateUrl:'directives/templates/clientDetailTmpl.html',
			controllerAs: 'clientDetailTmpl'
		};
	});
	
 	app.directive('clientInfoSectionTmpl',function(){
		return{
			restrict: 'E',
			require: 'ngModel',
			scope: {
				clientDetail : '=ngModel',
				editMode:'=editMode'
			},
			controller: function($scope) {
				console.log($scope.editMode);
				$scope.submit=function(){
					$scope.editMode=false;
				}
				$scope.$on('setEidtMode', function (event,eidtMode) {
					console.log("on setEidtMode : "+eidtMode); // 'Data to send'
					$scope.editMode = eidtMode
				});
			},
			templateUrl:'directives/templates/clientInfoSectionTmpl.html',
			controllerAs: 'clientInfoSection'
		};
	});
	
	app.directive('jobDetailSectionTmpl',function(){
		return{
			restrict: 'E',
			require: 'ngModel',
			scope: {
				jobDetails : '=ngModel',
				editMode:'=editMode'
			},
			controller: function($scope) {
				$scope.submit=function(){
					$scope.editMode=false;
				}
				$scope.$on('setEidtMode', function (event,eidtMode) {
					console.log("on setEidtMode : "+eidtMode); // 'Data to send'
					$scope.editMode = eidtMode
				});
				this.curItemIndex=0;
				$scope.addItem=function(){
						
				};
				$scope.editItem=function(index){
						
				};
				$scope.deleteItem=function(index){
						
				};
			},
			templateUrl:'directives/templates/jobDetailSectionTmpl.html',
			controllerAs: 'jobDetailSection'
		};
	}); 
	
	app.directive('paymentSectionTmpl',function(){
		return{
			restrict: 'E',
			require: 'ngModel',
			scope: {
				clientDetail : '=ngModel',
				editMode:'@=ditMode'
			},
			controller: function($scope) {	
				$scope.submit=function(){
					$scope.editMode=false;
				}
				$scope.$on('setEidtMode', function (event,eidtMode) {
					console.log("on setEidtMode : "+eidtMode); // 'Data to send'
					$scope.editMode = eidtMode
				});
			},
			templateUrl:'directives/templates/paymentSectionTmpl.html',
			controllerAs: 'paymentSection'
		};
	});
	
	app.directive('serviceHistorySectionTmpl',function(){
		return{
			restrict: 'E',
			require: 'ngModel',
			scope: {
				clientDetail : '=ngModel',
				editMode:'@editMode'
			},
			controller: function($scope) {	
				$scope.submit=function(){
					//console.log($scope.clientDetail);
					$scope.editMode=false;
				}
			},
			templateUrl:'directives/templates/serviceHistorySectionTmpl.html',
			controllerAs: 'serviceSection'
		};
	});
	
	app.directive('commentsSectionTmpl',function($filter){
		return{
			restrict: 'E',
			require: 'ngModel',
			scope: {
				comments : '=ngModel',
			},
			controller: function($scope,UserService) {
				$scope.newComment="";
				$scope.UserService = UserService;
				$scope.postComment=function(){
					console.log($scope.newComment);
					var comment = {
									content:$scope.newComment, 
									author:UserService.name, 
									role:UserService.role, 
									createDateTime:$filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss")
								};
								
					console.log(comment);
					$scope.comments.push(comment);
				};
				$scope.deleteComment=function(index){
					//$scope.comments = $filter('orderBy')($scope.comments, '-createDateTime');
					//console.log($scope.comments);
					//console.log("index : "+index);
					//$scope.comments.splice(index,index+1);
				};
			},
			templateUrl:'directives/templates/commentsSectionTmpl.html',
			controllerAs: 'commentsSection'
		};
	});
	app.directive('moduleNewClient',function() {
		return {
			restrict: 'E',
			templateUrl:'directives/modules/createClient.html',
			controller: function($scope,$http,$location, $anchorScroll,MenuService) {
				$scope.hasSubmit = false;
				$http.get('sampleData/clientDetail-default.json?timestamp='+ new Date())
					.then(function(result) {
					$scope.clientDetail=result.data
					console.log($scope.clientDetail);
				}); 
				$scope.Create=function(){
					$scope.hasSubmit=true;
					$scope.$broadcast('setEidtMode',$scope.editMode);
					$location.hash('top');
					$anchorScroll();
					
				};
				$scope.Reset=function(){
					$http.get('sampleData/clientDetail-default.json?timestamp='+ new Date())
						.then(function(result) {
						$scope.clientDetail=result.data					
					});
				};
				$scope.Confirm=function(){
					alert("Create new client successfully.");
					MenuService.changeComponents(0);
					$location.hash('top');
					$anchorScroll();
				};
			},
			templateUrl:'directives/modules/createClient.html',
			controllerAs: 'newClientModule'
		};
	});
	app.directive('moduleStaffList',function() {
		return {
			restrict: 'E',
			template: '<div>module Staff List</div>',
			scope: {}
		};
	}); */
})();