<?php
/**
 * Displays the featured image
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

if ( has_post_thumbnail() && ! post_password_required() ) {

	$featured_media_inner_classes = '';

	// Make the featured media thinner on archive pages.
	if ( ! is_singular() ) {
		$featured_media_inner_classes .= ' medium';
  }
  

	?>
<div class="masthead  <?php if(get_theme_mod( 'stretch_cover_width', true )){echo ' fill-screen-width';}; if(get_theme_mod( 'stretch_cover_height', true )){echo ' fill-screen-height';}?>">

   
  <div class="featured-media-inner section-inner<?php echo $featured_media_inner_classes; //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static output ?>">
  <figure class="featured-media">

			<?php
			the_post_thumbnail('mhbasictheme-fullscreen');

			$caption = get_the_post_thumbnail_caption();

			if ( $caption ) {
				?>

				<figcaption class="wp-caption-text"><?php echo esc_html( $caption ); ?></figcaption>

				<?php
			}
			?>
	</figure> 
    </div>

  <div class="feature-overlay">
    <div class="content-position-normal">&nbsp;</div>
    <div class="content-position-bottom">
    <div class="content-wrap">
      <div class="lyt"><div class="txb">
      <?php 
        if ( is_singular() ) {
          the_title( '<h1 class="entry-title">', '</h1>' );
        } else {
          the_title( '<h3 class="entry-title heading-size-1"><a href="' . esc_url( get_permalink() ) . '">', '</a></h3>' );
        }
      ?>
      <?php 
      $postSubtitle = get_post_meta( get_the_ID(), 'mh_mhbasictheme_post_subtitle', true ); 
      if($postSubtitle){
        ?>
  <div class="subtitle"><?php 		echo $postSubtitle; ?></div>
        <?php
      }
	

      ?>
      
      </div></div>

              
        <?php 
        $hadStringMeta = mhbasictheme_get_post_meta( get_the_ID(), 'single-top' );
        if($hadStringMeta) { ?>
          <div class="lyt">
            <div class="cxb">
              <?php 
                // Default to displaying the post meta.
                mhbasictheme_the_post_meta( get_the_ID(), 'single-top' );
              ?>
              </div>
            </div>
          <?php
        }
        ?>
    

    </div>
  </div>
  </div>
</div>
	<?php
}
