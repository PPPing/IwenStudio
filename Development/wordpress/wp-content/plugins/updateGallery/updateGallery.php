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

	file_put_contents($file, $content);
}
function startsWith($haystack, $needle)
{
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}
function updateImageListJSON(){
	
	$posts=get_posts();
	foreach ($posts as $singlepost)
	{
		
		$title = $singlepost->post_title;
		$filePath = get_template_directory().'/jsonData/'.$title.'.json';
		
		$gallery=get_post_gallery($singlepost,false);
		$imageIDs=explode(',',  $gallery['ids']);
		
		$dataArray=Array();
		if(startsWith($title, 'gallery')){
			
			foreach ($imageIDs as $imageID)
			{
				$imageNode =  new stdClass();
				if($imageID==''){
					continue;
				}
			
				$imageNode->thumnail=wp_get_attachment_image_src($imageID, 'thumbnail')[0];
				$imageNode->fullImage=wp_get_attachment_image_src($imageID, 'large')[0];
				array_push($dataArray, $imageNode);
			}
		}else if($title=='home'){
			
			foreach ($imageIDs as $imageID)
			{
				$imageNode =  new stdClass();
				if($imageID==''){
					continue;
				}
			
				$imageNode = wp_get_attachment_image_src($imageID, 'large')[0];
				array_push($dataArray, $imageNode);
			}	
			
		}else if($title=='certList'){
			foreach ($imageIDs as $imageID)
			{
				$imageNode =  new stdClass();
				if($imageID==''){
					continue;
				}
				$imageMeta = get_post( $imageID);
				$imageNode->image= wp_get_attachment_image_src($imageID, 'large')[0];
				$imageNode->url = $imageMeta->post_content;
				array_push($dataArray, $imageNode);
			}
		
		}else if($title=='cinema'){
			foreach ($imageIDs as $imageID)
			{
				$imageNode =  new stdClass();
				if($imageID==''){
					continue;
				}
				$imageMeta = get_post( $imageID);
				$imageNode->image= wp_get_attachment_image_src($imageID, 'large')[0];
				$imageNode->url = $imageMeta->post_content;
				array_push($dataArray, $imageNode);
			}
			
		}else{
			continue;
		}
		//var_dump($dataArray);
		$content = json_encode($dataArray);
		//echo"<br><br>";
		file_put_contents($filePath, $content);
	}
}
//updateImageListJSON();
add_action( 'wp_ajax_nopriv_updateGallery', 'updateImageListJSON',1);
add_action( 'wp_ajax_updateGallery', 'updateImageListJSON',1);

