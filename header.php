<?php
/**
 * Header file for the Carib Theme WordPress Site.
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */


 
?><!DOCTYPE html>

<html class="no-js" <?php language_attributes(); ?>>


<?php

  // Check whether the header search is activated in the customizer.
  $enable_header_search = get_theme_mod( 'enable_header_search', true );

?>
          

	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php wp_head(); ?>
	</head>

  <body <?php body_class(); ?>>
    <script type="text/javascript"> document.body.classList.add("body-enter"); </script>
		<?php
		wp_body_open();
		?>
    <input id="interfaceToggle" name="interfaceToggle" type="checkbox" /> 
    <input id="contactToggle" name="contactToggle" type="checkbox" /> 
    <div id="windowContainer">
      <div id="headerWrapper" <?php if(has_custom_logo() ){ echo "class='logo-present-header'"; } ?>>
          <div class="bg-wrapper"></div>
          <div class="content-wrap">
          <?php  if(has_nav_menu( 'primary' )){ ?>
          <label for="interfaceToggle" id="mobileMenuToggle" title="menu" >
              <!--<button class="toggle nav-toggle mobile-nav-toggle" data-toggle-body-class="showing-menu-modal" aria-expanded="false" data-set-focus=".close-nav-toggle">-->
              <span class="toggle-inner">
                <span class="toggle-icon">
                  <?php mhbasictheme_the_theme_svg( 'ellipsis' ); ?>
                </span>
                <span class="toggle-text"><?php _e( 'Menu', 'mhbasictheme' ); ?></span>
                <span class="toggle-text-active"><?php _e( 'Close', 'mhbasictheme' ); ?></span>
              </span>
            <!--</button>  -->
            </label>
          <?php  } ?>


				

            <?php
  // Site title or logo.
  mhbasictheme_site_logo();
?>
					<?php
					if ( has_nav_menu( 'primary' ) ) {
            ?>
				<div class="header-navigation-wrapper">


            <div class="menu-container cxb">

							<nav class="primary-menu-wrapper" aria-label="<?php esc_attr_e( 'Horizontal', 'mhbasictheme' ); ?>" role="navigation">

							
            <ul class="menu main-menu">
								<?php
								if ( has_nav_menu( 'primary' ) ) {

									wp_nav_menu(
										array(
											'container'  => 'primary-menu',
											'items_wrap' => '%3$s',
											'theme_location' => 'primary',
										)
									);

                }
                ?>
                </ul>
							</nav>
              </div>

</div>
						<?php
					}
?>

      

<?php


					if ( $enable_header_search === true || is_woocommerce_activated() === true ) {
						?>

<div class="header-right">
  <div class="cxb">

  <?php 
              if ( $enable_header_search ) {
                ?>
							<div class="toggle-wrapper search-toggle-wrapper">

								<button class="toggle search-toggle desktop-search-toggle" data-toggle-target=".search-modal" data-toggle-body-class="showing-search-modal" data-set-focus=".search-modal .search-field" aria-expanded="false"  title="Search site">
									<span class="toggle-inner">
										<?php mhbasictheme_the_theme_svg( 'search' ); ?>
										<span class="toggle-text"><?php _e( 'Search', 'mhbasictheme' ); ?></span>
									</span>
								</button>
              </div>
              <?php } ?>

              <?php 
              if ( is_woocommerce_activated() ) {
                // Put your plugin code here
                ?>
                     <div class="cart-container">Cart Icon
                    <a href="<?php echo get_permalink( wc_get_page_id( 'cart' ) ); ?>" title="Shopping Cart"><span class="icon">
                    <svg version="1.1" id="Layer_3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="23px" height="23px" viewBox="-2.5 -4.25 23 23" enable-background="new -2.5 -4.25 23 23" xml:space="preserve">
<path d="M16.761,1.542c2.363,0,2.781,2.688,2.781,2.688s0,9.562,0,11.781s-2.625,2.562-2.625,2.562s-12.25,0-14.625,0
	s-2.625-2.562-2.625-2.562s0-9.094,0-11.688s2.531-2.781,2.531-2.781h2.719c0,0-1.281-4.5,4.688-4.5s5.531,4.5,5.531,4.5H16.761z
	 M2.531,16.531h13.75c0,0,1.011-0.01,1.011-1.052s0-11.083,0-11.083s-0.103-0.875-0.999-0.875s-1.292,0-1.292,0l0.021,2.104v0.458
	h-1.604V3.521H6.313L6.33,6.084H4.688V3.521H2.531c0,0-1.051-0.062-1.051,0.917s0,11.25,0,11.25S1.541,16.531,2.531,16.531z
	 M6.458,1.5h7.125c0,0,0.276-3.292-3.979-3.292C5.349-1.792,6.458,1.5,6.458,1.5z"/>
</svg>
                    </span></a>
                  </div> 
                <?php
            }
            ?>
     

         <!-- <div class="user"><a href="#" class="user-link"><?php //mhbasictheme_the_theme_svg( 'user' ); ?>
          <span class="toggle-text">account</span></a></div> -->
        
					</div>
      </div>
      <?php
					}
          ?>
    </div>

    <?php 
    
    if(is_active_sidebar( 'contact-1' )) {?>
    <div class="headerDrawer">
      <div class="headerDrawerWrapper">
      <div class="content-wrap">
          <div class="lyt"><div class="cxb">
            <?php dynamic_sidebar( 'contact-1' ); ?>
          </div></div>
        
        </div>
        </div>
        </div>

    <?php }?>

    </div>

  <?php
  // Output the search modal (if it is activated in the customizer).
  if ( true === $enable_header_search ) {
    get_template_part( 'template-parts/modal-search' );
  }
  ?>

  <div id="bodyWrapper" <?php if(has_custom_logo() ){ echo "class='logo-present-header'"; } ?>>
  <?php /* if settings.announcement ?>
    <div id="announcementBar"  {% if settings.announcement_bar.background %}
      style="background-color:{{settings.announcement_bar.background}};" 
    {% endif %} >
    sdlfkajsldfkj
    </div>
    <?php endif */ ?>
        
    <div id="contentWrapper" class="rel-window  has-section-padding-<?php echo get_theme_mod( 'section_row_padding', 'none' ); ?> <?php 
      if(get_theme_mod( 'enable_scroll_effects', true ) === true ){ echo 'block-transitions-enabled ';}  
      if(get_theme_mod( 'enable_sticky_scroll', true ) === true ){ echo 'sticky-scrolling-enabled ';}  
      if(get_theme_mod( 'bleed_image_block', true ) != true ){ echo 'constrain-image-blocks ';}
      
      ?>">
         

		<?php
		