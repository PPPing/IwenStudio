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
function startsWith($haystack, $needle)
{
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}
function updateImageListJSON(){
	
	$args = array(
		'posts_per_page'   => -1,
		'offset'           => 0,
		'category'         => '',
		'category_name'    => '',
		'orderby'          => 'post_date',
		'order'            => 'DESC',
		'include'          => '',
		'exclude'          => '',
		'meta_key'         => '',
		'meta_value'       => '',
		'post_type'        => 'post',
		'post_mime_type'   => '',
		'post_parent'      => '',
		'post_status'      => 'publish',
		'suppress_filters' => true 
	);
	$posts=get_posts($args);
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
		//echo"<br>".$filePath."<br>";
		
		file_put_contents($filePath, $content);
	}
}
//updateImageListJSON();
add_action( 'wp_ajax_nopriv_updateGallery', 'updateImageListJSON',1);
add_action( 'wp_ajax_updateGallery', 'updateImageListJSON',1);

