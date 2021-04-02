<?php
/**
 * Displays the post header
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

$entry_header_classes = '';

if ( is_singular() ) {
	$entry_header_classes .= ' header-footer-group';
}

?>

<header class="entry-header has-text-align-center<?php echo esc_attr( $entry_header_classes ); ?>">

	<div class="entry-header-inner content-wrap">
	
	<?php if ( !has_post_thumbnail() ||  post_password_required()) {  ?>

    <meta itemprop="image" content="<?php echo wp_get_attachment_image_src( get_theme_mod('custom_logo'), 'full' )[0] ?>">
   
   <?php 
   
   $postSubtitle = get_post_meta( get_the_ID(), 'mh_mhbasictheme_post_subtitle', true ); 

   if(get_the_title() != "" || $postSubtitle) {
     
     ?>
		<div class="lyt"><div class="txb">
		<?php 
			if ( is_singular() ) {
			the_title( '<h1 class="entry-title" itemprop="name">', '</h1>' );
			} else {
			the_title( '<h3 class="entry-title heading-size-1" itemprop="name"><a href="' . esc_url( get_permalink() ) . '" itemprop="url">', '</a></h3>' );
      }
    ?>
    <?php 
     
      if($postSubtitle){
        ?>
  <div class="subtitle"><?php 		echo $postSubtitle; ?></div>
        <?php
      }
	

      ?>
    </div></div>
    
    <?php } ?>
		  




<?php if(mhbasictheme_the_post_meta( get_the_ID(), 'single-top' )) { ?>
  
  <div class="lyt">
		<div class="cxb">
      <?php 
        // Default to displaying the post meta.
        mhbasictheme_the_post_meta( get_the_ID(), 'single-top' );
      ?>
      </div>
    </div>
  </div>

  <?php
}
?>
	<?php }  else{

    ?>
    <meta itemprop="name" content="<?php echo the_title(); ?>">
    <meta itemprop="image" content="<?php echo wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID), 'full' )[0] ?>">
    <?php
    }
    ?>
 
<?php
    if(false){
		//if ( has_excerpt() && is_singular() ) {

      $intro_text_width = '';

      if ( is_singular() ) {
        $intro_text_width = ' small';
      } else {
        $intro_text_width = ' thin';
      }

			?>

			<div class="lyt">
				<div class="txb">
					<div class="intro-text <?php echo $intro_text_width; //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static output ?>">
					  <?php the_excerpt(); ?>
				  </div>
				</div>
			</div>

			<?php
		}

		
		?>


<?php

$show_categories = apply_filters( 'mhbasictheme_show_categories_in_entry_header', true );

if ( true === $show_categories && has_category()) {
	?>
<div class="lyt">
<div class="txb">
  <div class="entry-categories">
	<span class="screen-reader-text"><?php _e( 'Categories', 'mhbasictheme' ); ?></span>
	<div class="entry-categories-inner">
	  <?php the_category( ' ' ); ?>
	</div>
  </div>
</div>
</div>
	<?php
}
?>
</div>

<?php /*-- schema for all */ ?>
<div class="schema-meta-header">
<meta itemprop="description" content="<?php echo wp_trim_words(  get_the_content(), 125);?>">
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


  
</header>

