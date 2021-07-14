<?php
/**
 * The default template for displaying content
 *
 * Used for both singular and index.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

?>

<?php
global $MHBASICTHEME_post_idx;
$MHBASICTHEME_post_class = ($MHBASICTHEME_post_idx%2 == 0) ? 'even' : 'odd';
$blockScrollEffect = "";
if(get_theme_mod( 'post_archive_scroll_effect', "none" ) == "alternating"){
	$blockScrollEffect = ($MHBASICTHEME_post_idx%2 == 0) ? "rightInOut" : "linRout";
} else{
	$blockScrollEffect  = get_theme_mod( 'post_archive_scroll_effect', "none" );
}
?>

<article <?php post_class($MHBASICTHEME_post_class); ?> id="post-<?php the_ID(); ?>"  itemscope itemtype="http://schema.org/Article" itemid="<?php echo  esc_url( get_permalink() ) ?>">

	<div class="post-content-list-container">

	<div class="post-inner content-wrap">
		<div class="lyt archive-image  <?php if(get_theme_mod( 'enable_scroll_effects', true ) === true ){ echo 'bxTr '. $blockScrollEffect;}?>" <?php if(get_theme_mod( 'enable_scroll_effects', true ) === true ){ echo 'data-box-transition="'. $blockScrollEffect . '"';}?> itemscope itemprop="image" itemtype="https://schema.org/ImageObject">
		<div class="mgb">
    <a href="<?php echo  esc_url( get_permalink() ) ?>" itemprop="url">
			<?php 
      if ( has_post_thumbnail() ){?>
     
        <?php  the_post_thumbnail(); ?>
       
        <?php
			} else{
				?>
				<span class="no-image"><span>media missing</span></span>
				<?php
      }
      
			
	?> </a>
				</div>
				<meta itemprop="width" content="<?php echo wp_get_attachment_image_src( get_post_thumbnail_id())[1] ?>">
				<meta itemprop="height" content="<?php echo wp_get_attachment_image_src( get_post_thumbnail_id())[2] ?>">
    			<meta itemprop="url" content="<?php echo wp_get_attachment_image_src( get_post_thumbnail_id())[0] ?>">
				</div>
			<div class="lyt archive-content <?php if(get_theme_mod( 'enable_scroll_effects', true ) === true ){ echo 'bxTr '. $blockScrollEffect;}?>" <?php if(get_theme_mod( 'enable_scroll_effects', true ) === true ){ echo 'data-box-transition="'. $blockScrollEffect . '"';}?>>
			<div class="txb">
		<span class="type">
			
			<?php //the_category( ' ' ); ?>
		<?php
		if(get_post_type() != "post"){
			echo get_post_type(); 
		} else{
			$postLabel = get_post_meta( get_the_ID(), 'mh_mhbasictheme_post_label', true ); 
			echo $postLabel;
		}
		
		?></span>
			<?php  the_title( '<h3 class="entry-title heading-size-3" itemprop="name"><a href="' . esc_url( get_permalink() ) . '">', '</a></h3>' ); ?>
      <div class="post-excerpt">
      <?php
      if(has_excerpt()){
        echo "<p>" . the_excerpt() .  '<a href="' . esc_url( get_permalink() ) . '" class="read-more-link"> <span>Read more </span> </a>' . "</p>";
      } else{
        ?>
        <p><?php echo wp_trim_words( get_content_without_special_blocks(), 42, '...' ); ?>
        <?php
        echo '<a href="' . esc_url( get_permalink() ) . '" class="read-more-link"> <span>Read more </span> </a>'; ?>
        </p>
        <?php
      }
       
       
       ?>
		</div>
			</div>
				</div>
	</div>
	<div class="schema-meta-header">
		<meta itemprop="description" content="<?php echo wp_trim_words(  get_content_without_special_blocks(), 125);?>">
		<meta itemprop="url" content="<?php echo get_bloginfo('url') ?>">
		<meta itemprop="headline" content="<?php echo get_the_title() ?>">
		<time datetime="<?php echo get_the_date('c'); ?>" itemprop="datePublished"></time>
		<span itemprop="author" itemscope itemtype="https://schema.org/Person" class="schmema-info">
		<meta itemprop="name" content="<?php echo get_the_author_meta('first_name') . " ". get_the_author_meta('last_name'); ?> ">
		</span>

		<span itemprop="publisher" itemscope itemtype="http://schema.org/Organization"  class="schmema-info">
		<meta  itemprop="name" content="<?php echo get_bloginfo('name') ?>">
		<meta itemprop="url" content="<?php echo get_bloginfo('url') ?>">
		<span itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
			<meta itemprop="url" content="<?php echo wp_get_attachment_image_src( get_theme_mod('custom_logo'), 'full' )[0] ?>">
			<meta itemprop="width" content="70">
			<meta itemprop="height" content="250">
		</span>  
		</span>
	</div>
   
	</div>

</article>
