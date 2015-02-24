(function(){
	var app = angular.module('thatCleanGirl', [ ]);	

	app.directive('dMultiline',function() {
		return {			
			restrict: 'A',
			require: 'ngModel',
			scope: {
				bindModel : '=ngModel',
			},
			link: function ($scope, element, attrs) {
				$scope.$watch(
                    function( $scope ) {	
                        if($scope.bindModel){
							return $scope.bindModel;
						}else{
							return "";
						}
                    },
                    function( newValue ) {						
						if(newValue!=""){
							element.html(newValue.replace(/\n/g,"<br>"));
						}
                    }
                );	
			}
		};
	});
	
	app.directive('dFormControlRotationGroup',function() {
		return {			
			restrict: 'A',
			require: 'ngModel',
			scope: {
				bindModel : '=ngModel',
			},
			link: function ($scope, element, attrs) {
				$scope.$watch(
                    function( $scope ) {	
                        if($scope.bindModel){
							return $scope.bindModel;
						}else{
							return "";
						}
                    },
                    function( newValue ) {						
						if(newValue!=""){
							element.html(newValue.replace(/\n/g,"<br>"));
						}
                    }
                );	
			}
		};
	});
	
	app.factory('UserService',function(){
		var UserService = {
			account:"jessica",
			name:"Jessica",
			role:"Manger"
		}
		return UserService;
	});
	app.factory('MenuService',function(){
		var components=[
				{
					id:"topMenu1",
					name:"Client Management",
					modules:[
						{
							id:"client-list",
							name:"Client List",
							url:"",
							isSubModule:false
						},
						{
							id:"new-client",
							name:"New Client",
							isSubModule:false
						}
					]
				},
				{
					id:"topMenu2",
					name:"Staff Management",
					modules:[
						{
							id:"staff-list",
							name:"Staff List",
							url:"",
							isSubModule:false
						}
					]
				}
			];
		var subModules=[
			{
				
			}
		]
		var curComponentIndex = 0;
		var curModuleIndex = 0;
		var modulesStack=[];
		var pushModulesStack=function(selectedIndex,modules){
				var modulesInfoNode={
					curModuleIndex:0,
					modules:modules
				}
				modulesStack.push(modulesInfoNode);
				//console.log(modulesStack);
		};
		pushModulesStack(curModuleIndex,components[curComponentIndex].modules);
		var MenuService = {
			initMenuService:function(){
				console.log("initMenuService");
				pushModulesStack(0,components[curComponentIndex].modules);
			},
			getComponentIndex:function(){
				return curComponentIndex;
			},
			getModuleIndex:function(){
				return modulesStack[modulesStack.length-1].curModuleIndex;
			}, 
			getComponents:function(){
				return components;
			},
			getModules:function(){
				return modulesStack[modulesStack.length-1].modules;
			},
			getActiveModule:function(){
				var moduleStackNode = modulesStack[modulesStack.length-1];
				//console.log(moduleStackNode);
				return moduleStackNode.modules[moduleStackNode.curModuleIndex];
			},
			getModulesStackDepth:function(){
				return modulesStack.length;
			},
			changeComponents:function(index){
				curComponentIndex = index;
				curModuleIndex=0;
				modulesStack=[];
				pushModulesStack(0,components[curComponentIndex].modules);
			},
			changeModule:function(index){
				modulesStack[modulesStack.length-1].curModuleIndex = index;
			},
			pushModulesStack:function(modules){
				pushModulesStack(0,modules);
			},
			popModulesStack:function(){
				if(modulesStack.length>1){
					modulesStack.pop();
				}
			}
		}
		//MenuService.initMenuService();
		return MenuService;
	});
	app.controller('TopMenuController',['$scope','MenuService',function($scope,MenuService){
		this.components = MenuService.getComponents();
		$scope.changeComponents = MenuService.changeComponents;
		$scope.getComponentIndex = MenuService.getComponentIndex;
		//console.log(this.components);

	}]);	
	app.controller('SiderController',['$scope','MenuService',function($scope,MenuService){
		$scope.getModules = MenuService.getModules;
		$scope.changeModule = MenuService.changeModule;
		$scope.getModuleIndex = MenuService.getModuleIndex;
		$scope.back= MenuService.popModulesStack;
		$scope.modulesStackDepth = MenuService.getModulesStackDepth;
	}]);
	
	app.directive('moduleContainer',function($compile) {
		return {
			restrict: 'E',
			template: '<div></div>',
			scope: {},
			controller:function($scope,$element,MenuService) {
				$scope.getActiveModule = MenuService.getActiveModule;
				$scope.$watch(
                    function( $scope ) {
                        //console.log( "Function watched" );
                        // This becomes the value we're "watching".
						//console.log($scope.getActiveModule());
                        return $scope.getActiveModule().id;
                    },
                    function( newValue ) {
						if($scope.getActiveModule().isSubModule==false){
							var el = $compile( "<module-"+newValue+"></module-"+newValue+">" )( $scope );
							$element.html( el );
						}	
                    }
                );				
			}
		};
	});
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
	});
})();