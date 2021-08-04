<?php
/**
 * The template for displaying the footer
 *
 * Contains the opening of the #siteFooter div and all content after.
 *
 * 
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

?>
</div>
<div id="siteFooter">
  <div class="site-footer-wrapper">
  <div class="site-footer-container">
<?php get_template_part( 'template-parts/footer-menus-widgets' )?>

		<div class="content-wrap">
<a class="to-the-top" href="#bodyWrapper">
						<span class="to-the-top-long">
							<?php
							printf( __( 'To the top %s', 'mhbasictheme' ), '<span class="arrow" aria-hidden="true">&uarr;</span>' );
							?>
						</span> 
						<span class="to-the-top-short">
							<?php
							printf( __( 'Up %s', 'mhbasictheme' ), '<span class="arrow" aria-hidden="true">&uarr;</span>' );
							?>
						</span> 
          </a> 
</div>
      </div>
        <div id="footerWrapper" >
          <footer>
            <div class="content-wrap">
<?php  if(has_nav_menu( 'footer' )){ ?> <div class="footer-links"><?php wp_nav_menu( array( 'menu_id' => '', 'container' => 'ul', 'theme_location' => 'footer', 'items_wrap' => '<ul>%3$s</ul>') );  ?>  </div> <?php }?>
              <div class="footer-copyright">&copy; copyright <?php echo date("Y"); ?> <?php echo bloginfo("name"); ?>
               all rights reserved.<span style="opacity: 0.7; display: block; font-size: 90%; font-weight: 400; padding-top: 10px; text-decoration: none;">theme designed by <a href="https://mheadley.com" target="_blank" style="color: inherit; text-decoration: none;">mheadley inc.</a></span></div>
              
          </div>
      </footer>
        </div>
      </div>
       </div>
</div>
</div>
</div>
       <?php wp_footer() ?>
    </body>
</html>
