<?php
/**
 * Displays the menus and widgets at the end of the main element.
 * Visually, this output is presented as part of the footer element.
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

$has_social_menu = has_nav_menu( 'social' );
$has_sidebar_1 = is_active_sidebar( 'sidebar-1' );
$has_sidebar_2 = is_active_sidebar( 'sidebar-2' );

// Only output the container if there are elements to display.
if (  $has_social_menu || $has_sidebar_1 || $has_sidebar_2  ) {
	?>

	<div class="footer-nav-widgets-wrapper header-footer-group">
		<div class="content-wrap">
		<div class="footer-inner section-inner">

			<?php

			$footer_top_classes = '';

			$footer_top_classes .= $has_social_menu ? ' has-social-menu' : '';

			if ( $has_social_menu ) {
				?>
				<div class="footer-top<?php echo $footer_top_classes; //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static output ?>">
				
					<?php if ( $has_social_menu ) { ?>
						<div class="lyt"><div class="cxb">
						<nav aria-label="<?php esc_attr_e( 'Social links', 'mhbasictheme' ); ?>" class="footer-social-wrapper">

							<ul class="social-menu footer-social reset-list-style social-icons fill-children-current-color">

								<?php
								wp_nav_menu(
									array(
										'theme_location'  => 'social',
										'container'       => '',
										'container_class' => '',
										'items_wrap'      => '%3$s',
										'menu_id'         => '',
										'menu_class'      => '',
										'depth'           => 1,
										'link_before'     => '<span class="screen-reader-text">',
										'link_after'      => '</span>',
										'fallback_cb'     => '',
									)
								);
								?>

							</ul><!-- .footer-social -->

						</nav><!-- .footer-social-wrapper -->

						</div></div>
					<?php } ?>
				</div><!-- .footer-top -->

			<?php } ?>

			<?php if ( $has_sidebar_1 || $has_sidebar_2 ) { ?>

				<aside class="footer-widgets-outer-wrapper" role="complementary">

					<div class="footer-widgets-wrapper">
            <div class="content-wrap">
						<?php if ( $has_sidebar_1 ) { ?>
							<div class="footer-widgets column-one grid-item">
              <div class="lyt"><div class="cxb">
								<?php dynamic_sidebar( 'sidebar-1' ); ?>
                </div></div></div>

						<?php } ?>

						<?php if ( $has_sidebar_2 ) { ?>
							<div class="footer-widgets column-two grid-item">
              <div class="lyt"><div class="cxb">
								<?php dynamic_sidebar( 'sidebar-2' ); ?>
							</div></div></div>

						<?php } ?>

					</div><!-- .footer-widgets-wrapper -->
            </div>
				</aside><!-- .footer-widgets-outer-wrapper -->

			<?php } ?>

		</div><!-- .footer-inner -->

	</div><!-- .footer-nav-widgets-wrapper -->
	

<?php } ?>
