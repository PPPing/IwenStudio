<!DOCTYPE html>
<html lang="en" ng-app="iwenStudio">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta id="viewport" name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no;">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style” content=black">
		<meta content="black" name="apple-mobile-web-app-status-bar-style">
		<meta content="telephone=no" name="format-detection">
		<meta name="keywords" content="IWEN Studio Photography Cinematography">
		<meta name="description" content="IWEN Studio Photography Cinematography">
		<meta name="author" content="Zhong Ping" />
		<title>IWEN Studio Photography and Cinematography</title>
		<link rel="stylesheet" type="text/css" href="<?php echo $templateUrl;?>/css/normalize.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo $templateUrl;?>/css/bootstrap.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo $templateUrl;?>/css/style.css" />
	</head>
	<body>
		<div class="loading" style="display:block">
			<div class="landing-up">
				<div class="logo"><img width=200 src="./images/logo.png"></div>
				<div class="loading-bar">
					<div class="loading-bar-progress"></div>
					<div class="loading-bar-num">0%</div>
				</div>
			</div>
			<div class="landing-down">
			<div class="loading-footer">
				<div class="copyright">Website Design by Ping | ©iwenphotography.com All rights reserved.</div>
			</div>
			</div>			
		</div>
		<div class="header">			
			<ul class="top-menu" ng-class="mobileMenuEnable?'top-menu-enable':''" ng-controller="TopMenuController as top">
				<li class="mobile-menu-trigger" ng-class="!isActive('home')?'mobile-menu-trigger-dark':''"  ng-click="toggleMenu()"><span class="glyphicon glyphicon-menu-hamburger"></span></li>
				<li class=" top-menu-item" ng-class="isActive('home')?'active-home':''" ng-click="changeComponents('home')">
					<div class="top-menu-item-text">HOME</div>
					<div class="top-menu-item-mobile-logo"><a href="http://localhost/GitHub/IwenStudio/Development/html/"><img src="./images/logo_white.png"></a></div>
					<div class="top-menu-item-underline"></div>
				</li>
				<li class="top-menu-item-vline">
				</li>
				<li class=" top-menu-item"  ng-class="isActive('gallery-wedding')?'active':''" ng-click="changeComponents('gallery-wedding')">
					<div class="top-menu-item-text">WEDDING</div>
					<div class="top-menu-item-underline"></div>
				</li>
				<li class="top-menu-item-vline">
				</li>
				<li class=" top-menu-item" ng-class="isActive('gallery-pre-wedding')?'active':''" ng-click="changeComponents('gallery-pre-wedding')">
					<div class="top-menu-item-text">PRE-WEDDING</div>
					<div class="top-menu-item-underline"></div>
				</li>
				<li class="top-menu-item-vline">
				</li>
				<li class=" top-menu-item" ng-class="isActive('gallery-create-art')?'active':''" ng-click="changeComponents('gallery-create-art')">
					<div class="top-menu-item-text">CREATE-ART</div>
					<div class="top-menu-item-underline"></div>
				</li>
				<li class="top-menu-item destop-only">
					<a href="http://localhost/GitHub/IwenStudio/Development/html/"><img class="top-menu-item-logo" src="./images/logo.png"></a>
					<!-- <div class="top-menu-item-logo"><a>LOGO</a></div> -->
				</li>
				<li class=" top-menu-item" ng-class="isActive('cinematography')?'active':''" ng-click="changeComponents('cinematography')">
					<div class="top-menu-item-text">CINEMATOGRAPHY</div>
					<div class="top-menu-item-underline"></div>
				</li>
				<li class="top-menu-item-vline">
				</li>
				<li class=" top-menu-item" ng-class="isActive('about')?'active':''" ng-click="changeComponents('about')">
					<div class="top-menu-item-text">ABOUT</div>
					<div class="top-menu-item-underline"></div>
				</li>
				<li class="top-menu-item-vline">
				</li>
				<li class=" top-menu-item" ng-class="isActive('contact')?'active':''" ng-click="changeComponents('contact')">
					<div class="top-menu-item-text">CONTACT</div>
					<div class="top-menu-item-underline"></div>
				</li>
				<li class="top-menu-item-vline">
				</li>
				<li class=" top-menu-item">
					<a href="http://weibo.com/iwenvision" target="_self" class="top-menu-item-text">BLOG</a>
					<div class="top-menu-item-underline"></div>
				</li>
			</ul>
		</div>
		<com-container ></com-container> 			
	</body>
	<style>
	</style>
	<script type="text/javascript" src="<?php echo $templateUrl;?>js/jquery-2.1.1.min.js"></script>
	<script type="text/javascript" src="<?php echo $templateUrl;?>js/soundmanager2-jsmin.js"></script>
	<script type="text/javascript" src="<?php echo $templateUrl;?>js/angular.min.js"></script>
	<script type="text/javascript" src="<?php echo $templateUrl;?>js/app.js"></script>
	<script>		
	</script>
</html>



















