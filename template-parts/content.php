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

<article <?php post_class(); ?> id="post-<?php the_ID(); ?>"  itemscope itemtype="http://schema.org/Article">

	

	<?php get_template_part( 'template-parts/entry-header' ); ?>

	<div class="post-content-list-container">

        <?php /*  <div class="lyt">
        <div class="cxb">*/ ?>
          <?php	the_content( __( 'Continue reading', 'mhbasictheme' ) ); ?>
     <?php /*   </div>
      </div>  */ ?>



	</div>
	<?php
			$pagesHTML = 
			wp_link_pages(
				array(
					'before'      => '<nav class="post-nav-links bg-light-background" aria-label="' . esc_attr__( 'Page', 'mhbasictheme' ) . '"><span class="label">' . __( 'Pages:', 'mhbasictheme' ) . '</span>',
					'after'       => '</nav>',
					'link_before' => '<span class="page-number">',
					'link_after'  => '</span>',
				)
			);
			$editLink = get_edit_post_link();

?>

	<div class="post-footer">
		<div class="content-wrap">
<?php if($pagesHTML && is_singular()){ ?>

		<div class="lyt">
      <div class="cxb">
	 	 <?php $pagesHTML ?>
  		</div>
		</div>

<?php } ?>

<?php if(get_edit_post_link()) { ?>
  <div class="lyt">
    <div class="cxb">
      <?php edit_post_link(); ?>
    </div>
  </div>
<?php  } ?>


<?php if ( is_single() ) {
    get_template_part( 'template-parts/entry-author-bio' );
		}
?>

      
<div class="lyt">
  <div class="cxb">
    <?php
      // Single bottom post meta.
      mhbasictheme_the_post_meta( get_the_ID(), 'single-bottom' );
      ?>
	</div>
</div>
  </div>
  </div>
	<?php

	if ( is_single() ) {
    ?>

    
    <?php

		get_template_part( 'template-parts/navigation' );

	}

	/**
	 *  Output comments wrapper if it's a post, or if comments are open,
	 * or if there's a comment number – and check for password.
	 * */
	if ( ( is_single() || is_page() ) && ( comments_open() || get_comments_number() ) && ! post_password_required() ) {
		?>

		<div class="comments-wrapper ">
        	<div class="content-wrap">
				<?php comments_template(); ?>
            </div>
		</div>

		<?php
	}
	?>

</article>
