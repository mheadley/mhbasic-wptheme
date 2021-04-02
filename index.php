<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

get_header();

if ( have_posts() && !is_search()  && is_single() ){
	get_template_part( 'template-parts/featured-image' );
} else if(is_home() && !is_paged() && get_theme_mod( 'hmp_show_masthead', true ) === true ){
  ?>
<div class="masthead <?php if(get_theme_mod( 'hmp_stretch_cover_width', true ) === true ){ echo "fill-screen-width ";} if(get_theme_mod( 'hmp_stretch_cover_height', true ) === true ){ echo "fill-screen-height ";}?>">
    <div class="featured-media-inner section-inner">

	<figure class="featured-media">
      <?php 
    echo  wp_get_attachment_image( get_theme_mod( 'hmp_cover_image' ), 'mhbasictheme-fullscreen');
    //echo get_theme_mod( 'hmp_cover_image' );
    ?>
  </figure>
    </div>
  <div class="feature-overlay">

    <?php 
    if(get_theme_mod('hmp_cover_title_valign') !== 'center'){
      ?>
      <div class="content-position-normal"> &nbsp;</div>
    <?php  } ?>
    <div class="<?php if(get_theme_mod( 'hmp_cover_title_valign') !== 'center'){
echo "content-position-bottom"; 
      } else{
        echo "content-position-center";
      }
      ?>">
      
    <div class="content-wrap">
      <div class="lyt">
        <div class="txb text-align-<?php echo get_theme_mod( 'hmp_cover_title_align', 'left' ); ?>" style="text-align: <?php echo get_theme_mod( 'hmp_cover_title_align', 'left' ); ?>; color: <?php echo sanitize_hex_color( get_theme_mod( 'hmp_cover_title_color', '#ffffff' )) ?>">
        <h1 class="entry-title  homepage-title"><?php echo get_theme_mod( 'hmp_cover_title_text' ); ?></h1>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
<?php
}
?>

<main id="site-content" role="main">



<?php 
// instead of permalink:
if ( is_tag()) { 
	$term = get_queried_object();
	$permalink = get_tag_link( $term->term_id, 'post_tags' );
}elseif ( is_category()) { 
    $permalink = get_category_link( get_query_var( 'cat' ) );
}elseif ( is_tax()) { 
    $permalink = get_term_link( get_query_var( 'term' ), get_query_var( 'taxonomy' ) );
}
elseif( is_post_type_archive() ) {
    $permalink = get_post_type_archive_link( get_query_var('post_type') );
}
else {
    $permalink = get_permalink();
}
?>



<div class="<?php echo ( is_search() || ! is_singular() && 'summary' === get_theme_mod( 'blog_content', 'full' ) || is_home() || is_archive() ) ? 'post-list-archive' : 'post-single-list'; ?>"
<?php if(is_archive()){ echo 'itemscope itemtype="https://schema.org/Collection" itemprop="Collection" itemid="' .  esc_url( $permalink ) . '"'; } ?>
>
	<?php

	$archive_title    = '';
	$archive_subtitle = '';

	if ( is_search() ) {
		global $wp_query;

		$archive_title = sprintf(
			'%1$s %2$s',
			'<span class="color-accent">' . __( 'Search:', 'mhbasictheme' ) . '</span>',
			'&ldquo;' . get_search_query() . '&rdquo;'
		);

		if ( $wp_query->found_posts ) {
			$archive_subtitle = sprintf(
				/* translators: %s: Number of search results */
				_n(
					'We found %s result for your search.',
					'We found %s results for your search.',
					$wp_query->found_posts,
					'mhbasictheme'
				),
				number_format_i18n( $wp_query->found_posts )
			);
		} else {
			$archive_subtitle = __( 'We could not find any results for your search. You can give it another try through the search form below.', 'mhbasictheme' );
		}
	} elseif ( ! is_home() ) {
		$archive_title    = get_the_archive_title();
		$archive_subtitle = get_the_archive_description();
		
	}

	if ( $archive_title || $archive_subtitle ) {
		?>
  
		<header class="archive-header has-text-align-center header-footer-group">

			<div class="archive-header-inner section-inner medium">
        <div class="content-wrap">
        <div class="lyt"><div class="txb">
				<?php if ( $archive_title ) { ?>
					<h1 class="archive-title"><?php echo wp_kses_post( $archive_title ); ?></h1>
				<?php } ?>

				<?php if ( $archive_subtitle ) { ?>
					<div class="archive-subtitle section-inner thin max-percentage intro-text"><?php echo wp_kses_post( wpautop( $archive_subtitle ) ); ?></div>
				<?php } ?>
        </div>
        </div>
        </div>
			</div>

		</header>

		<?php
	}

	if ( have_posts() ) {

		$i = 0;

		while ( have_posts() ) {
			$i++;
			// if ( $i > 1 ) {
			// 	echo '<hr class="post-separator styled-separator is-style-wide section-inner" aria-hidden="true" />';
			// }
			the_post();
      if(( is_search() || ! is_singular() && 'summary' === get_theme_mod( 'blog_content', 'full' ) ) || is_home() || is_archive() ){
        
			  get_template_part( 'template-parts/summary', get_post_type() );
      } else{

			  get_template_part( 'template-parts/content', get_post_type() );
      }

		}
	} elseif ( is_search() ) {
		?>
		<section>
			<div class="content-wrap">
        <div class="lyt"><div class="txb">
		<div class="no-search-results-form section-inner thin">

			<?php
			get_search_form(
				array(
					'label' => __( 'search again', 'mhbasictheme' ),
				)
			);
			?>
			</div></div>
		</div><!-- .no-search-results -->
		</section>

		<?php
	}
  ?>
  </div>

	<?php get_template_part( 'template-parts/pagination' ); ?>

</main><!-- #site-content -->

<?php //get_template_part( 'template-parts/footer-menus-widgets' ); ?>

<?php
get_footer();