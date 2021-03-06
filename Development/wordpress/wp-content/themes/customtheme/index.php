<?php
$baseUrl=get_template_directory_uri();
?>
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
		<link rel="stylesheet" type="text/css" href="<?php echo $baseUrl;?>/css/normalize.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo $baseUrl;?>/css/bootstrap.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo $baseUrl;?>/css/style.css" />
	</head>
	<script type="text/javascript">
	var baseUrl='<?php echo $baseUrl;?>';	
	</script>
	<body>
		<div class="loading" style="display:block">
			<div class="landing-up">
				<div class="logo"><img width=200 src="<?php echo $baseUrl;?>/images/logo.png"></div>
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
					<div class="top-menu-item-mobile-logo"><a href="http://iwenphotography.com/"><img src="<?php echo $baseUrl;?>/images/logo_white.png"></a></div>
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
					<a href="http://iwenphotography.com/"><img class="top-menu-item-logo" src="<?php echo $baseUrl;?>/images/logo.png"></a>
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
					<a href="http://blog.sina.com.cn/iwenvision" target="_bank" class="top-menu-item-text">BLOG</a>
					<div class="top-menu-item-underline"></div>
				</li>
			</ul>
		</div>
		<com-container ></com-container> 			
	</body>
	
	<script type="text/javascript" src="<?php echo $baseUrl;?>/js/jquery-2.1.1.min.js"></script>
	<script type="text/javascript" src="<?php echo $baseUrl;?>/js/soundmanager2-jsmin.js"></script>
	<script type="text/javascript" src="<?php echo $baseUrl;?>/js/angular.min.js"></script>
	<script type="text/javascript" src="<?php echo $baseUrl;?>/js/app.js"></script>
	
</html>



















