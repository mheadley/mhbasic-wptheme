<?php
/**
 * Displays the next and previous post navigation in single posts.
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

$next_post = get_next_post();
$prev_post = get_previous_post();

if ( ($next_post || $prev_post)  && (bool) get_theme_mod( 'show_page_navigation', true ) ) {

	$pagination_classes = '';

	if ( ! $next_post ) {
		$pagination_classes = ' only-one only-prev';
	} elseif ( ! $prev_post ) {
		$pagination_classes = ' only-one only-next';
	}

	?>

	<nav class="pagination-single section-inner<?php echo esc_attr( $pagination_classes ); ?>" aria-label="<?php esc_attr_e( 'Post', 'mhbasictheme' ); ?>" role="navigation">

		<div class="pagination-single-inner content-wrap">
			<div class="lyt">
<div class="txb">
			<?php
			if ( $prev_post ) {
				?>

				<a class="previous-post" href="<?php echo esc_url( get_permalink( $prev_post->ID ) ); ?>">
					<span class="arrow" aria-hidden="true">&larr;</span>
					<span class="title"><span class="title-inner"><?php echo wp_kses_post( get_the_title( $prev_post->ID ) ); ?></span></span>
				</a>

				<?php
			} ?>
</div>
    </div>
    <div class="lyt">
<div class="txb">


<?php

			if ( $next_post ) {
				?>

				<a class="next-post" href="<?php echo esc_url( get_permalink( $next_post->ID ) ); ?>">
					<span class="arrow" aria-hidden="true">&rarr;</span>
						<span class="title"><span class="title-inner"><?php echo wp_kses_post( get_the_title( $next_post->ID ) ); ?></span></span>
				</a>
				<?php
			}
			?>

</div>
		</div>
		</div>

	</nav>

	<?php
}
