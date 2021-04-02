<?php
/**
 * The template for displaying Author info
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

if ( (bool) get_the_author_meta( 'description' ) && (bool) get_theme_mod( 'show_author_bio', true ) ) : ?>
<div class="lyt">
	<div class="cxb">
		<div class="author-bio">
			<div class="author-title-wrapper">
				<div class="author-avatar">
					<?php echo get_avatar( get_the_author_meta( 'ID' ), 160 ); ?>
				</div>
				<h2 class="author-title">
					<?php
					printf(
						/* translators: %s: Author name */
						__( 'By %s', 'mhbasictheme' ),
						esc_html( get_the_author() )
					);
					?>
				</h2>
			</div>
			<div class="author-description">
				<?php echo wp_kses_post( wpautop( get_the_author_meta( 'description' ) ) ); ?>
				<a class="author-link" href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" rel="author">
					<?php _e( 'View all by author <span aria-hidden="true">&rarr;</span>', 'mhbasictheme' ); ?>
				</a>
			</div>
		</div>
	</div>
</div>
<?php endif; ?>
