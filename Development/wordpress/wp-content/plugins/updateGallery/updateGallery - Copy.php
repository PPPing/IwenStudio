<?php
/**
 * @package Update Gallery
 * @version 1.6
 */
/*
Plugin Name: Update Gallery
Description: Update Gallery
Author: Ping
Version: 1.0
*/
function updateGallery(){
	$posts=get_posts();
	$fulllist=array();
	try{
	 foreach ($posts as $singlepost)
	 {
	 	$type=strtolower($singlepost->post_title);
	 	$fulllist[$type]=array();
	 	$fulllist[$type]['thumnail']=array();
	 	$fulllist[$type]['fullImage']=array();
	 	$gallery=get_post_gallery($singlepost,false);
	 	$imageIDs=explode(',',  $gallery['ids']);
	 	foreach ($imageIDs as $imageID)
	 	{
	 		if($imageID==''){
	 			continue;
	 		}
	 		array_push($fulllist[$type]['thumnail'],wp_get_attachment_image_src($imageID, 'thumbnail')['0']);
	 		array_push($fulllist[$type]['fullImage'],wp_get_attachment_image_src($imageID, 'full')['0']);
	 	}

	 }
	}catch (Exception $e)
	{
		$response = json_encode( array( 'success' =>false,'error'=>$e->getMessage() ) );
	}
	$response = json_encode( array( 'success' =>true,'fulllist'=>$fulllist ) );
	header( "Content-Type: application/json" );
	echo $response;

	// IMPORTANT: don't forget to "exit"
	exit;
}
function updateImageListJS(){
	
	$file =get_template_directory().'/js/imagelist.js';
	// Append a new person to the file
	$content = "var fulllist=[];\n";
	$posts=get_posts();
	foreach ($posts as $singlepost)
	{
		$content .= "var type='".$singlepost->post_title."'\n";
		$content .= "type=type.toLowerCase();\n";
		$content .="fulllist[type]=[];\n";
		$thumnail='';
		$fullImage='';
		$gallery=get_post_gallery($singlepost,false);
		$imageIDs=explode(',',  $gallery['ids']);
			
		foreach ($imageIDs as $imageID)
		{
			if($imageID==''){
				continue;
			}
			
			$thumnail .="'".wp_get_attachment_image_src($imageID, 'thumbnail')['0']."',\n";
			$fullImage .="'".wp_get_attachment_image_src($imageID, 'full')['0']."',\n";
		}
		
		if($thumnail!=''){
			$thumnail=substr($thumnail, 0,-2);
		}
		if($fullImage!=''){
			$fullImage=substr($fullImage, 0,-2);
		}
		$thumnail='['.$thumnail.']';
		$fullImage='['.$fullImage.']';
		
		$content .="fulllist[type]['thumnail']=".$thumnail.";\n";
		$content .="fulllist[type]['fullImage']=".$fullImage.";\n";
	}
	
	// Write the contents back to the file
	file_put_contents($file, $content);
	
	//$response = json_encode( array( 'success' =>true) );
	//header( "Content-Type: application/json" );
	//echo $response;
	
	// IMPORTANT: don't forget to "exit"
	//exit;
}

add_action( 'wp_ajax_nopriv_updateGallery', 'updateImageListJS',1);
add_action( 'wp_ajax_updateGallery', 'updateImageListJS',1);


/* 
function example_add_dashboard_widgets() {

	wp_add_dashboard_widget(
	'example_dashboard_widget',         // Widget slug.
	'Example Dashboard Widget',         // Title.
	'example_dashboard_widget_function' // Display function.
	);
}
add_action( 'wp_dashboard_setup', 'example_add_dashboard_widgets' );
 */
/**
 * Create the function to output the contents of our Dashboard Widget.
*/
/* function example_dashboard_widget_function() {

	// Display whatever it is you want to show.
	echo "Hello World, I'm a great Dashboard Widget";
}
?> */
