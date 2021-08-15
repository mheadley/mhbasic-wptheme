<?php

/**
 * functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

/**
 * Table of Contents:
 * Theme Support
 * Required Files
 * Register Styles
 * Register Scripts
 * Register Menus
 * Custom Logo
 * WP Body Open
 * Register Sidebars
 * Enqueue Block Editor Assets
 * Enqueue Classic Editor Styles
 * Block Editor Settings
 */

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function mhbasictheme_theme_support() {

    // Add default posts and comments RSS feed links to head.
    add_theme_support( 'automatic-feed-links' );

    // Custom background color.
    add_theme_support(
        'custom-background',
        array(
            'default-color' => 'ffffff',
        )
    );

    add_theme_support( 'admin-bar', array( 'callback' => '__return_false' ) );
    // Set content-width.
    global $content_width;
    if ( ! isset( $content_width ) ) {
        $content_width = 580;
    }

    /*
     * Enable support for Post Thumbnails on posts and pages.
     *
     * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
     */
    add_theme_support( 'post-thumbnails' );

    // Set post thumbnail size.
    set_post_thumbnail_size( 800, 600, array('center', 'center') );
    add_image_size( 'mini-image', 400, 300,  array('center', 'center') );

    // Add custom image size used in Cover Template.
    add_image_size( 'large-format', 1200, 3000 );
    add_image_size( 'mhbasictheme-//descreen', 2048, 9999 );
    //add_image_size( 'hd-image', 3000, 3000 );

    // remove_image_size( 'large' );
    // remove_image_size( 'medium' );
    // remove_image_size( 'thumbnail' );
    // add_image_size( 'thumbnail', 600, 600, array('center', 'center') );


    // Custom logo.
    $logo_width  = 120;
    $logo_height = 90;

    // If the retina setting is active, double the recommended width and height.
    if ( get_theme_mod( 'retina_logo', false ) ) {
        $logo_width  = floor( $logo_width * 2 );
        $logo_height = floor( $logo_height * 2 );
    }

    add_theme_support(
        'custom-logo',
        array(
            'height'      => $logo_height,
            'width'       => $logo_width,
            'flex-height' => true,
            'flex-width'  => true,
        )
    );

    add_theme_support( 'woocommerce', array(
        'thumbnail_image_width' => 400,
        'gallery_thumbnail_image_width' => 400,
        'single_image_width' => 800,
    ) );


    add_filter( 'image_size_names_choose', 'mhbasictheme_custom_image_sizes' );

    function mhbasictheme_custom_image_sizes( $sizes ) {
        return array_merge( $sizes, array(
            'large-format' => __( 'Large Format Image' ),
            'mhbasictheme-fullscreen' => __( 'Full Screen Cover' ),
            'thumbnail' => __( 'Thumbnail Image' ),
        ) );
    }

    /*
     * Let WordPress manage the document title.
     * By adding theme support, we declare that this theme does not use a
     * hard-coded <title> tag in the document head, and expect WordPress to
     * provide it for us.
     */
    add_theme_support( 'title-tag' );

    /*
     * Switch default core markup for search form, comment form, and comments
     * to output valid HTML5.
     */
    add_theme_support(
        'html5',
        array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'script',
            'style',
        )
    );

    /*
     * Make theme available for translation.
     * Translations can be filed in the /languages/ directory.
     * If you're building a theme based on Mheadley Basic, use a find and replace
     * to change 'mhbasictheme' to the name of your theme in all the template files.
     */
    load_theme_textdomain( 'mhbasictheme' );

    // Add support for full and wide align images.
    add_theme_support( 'align-wide' );

    /*
     * Adds starter content to highlight the theme on fresh sites.
     * This is done conditionally to avoid loading the starter content on every
     * page load, as it is a one-off operation only needed once in the customizer.
   * 
     * NOT SURE IF NEEDED
   * 
    if ( is_customize_preview() ) {
        require get_template_directory() . '/inc/starter-content.php';
        add_theme_support( 'starter-content', mhbasictheme_get_starter_content() );
  }
  
  */

    // Add theme support for selective refresh for widgets.
    add_theme_support( 'customize-selective-refresh-widgets' );

    /*
     * Adds `async` and `defer` support for scripts registered or enqueued
     * by the theme.
     */
    $loader = new mhbasictheme_Script_Loader();
    add_filter( 'script_loader_tag', array( $loader, 'filter_script_loader_tag' ), 10, 2 );

}

add_action( 'after_setup_theme', 'mhbasictheme_theme_support' );

/**
 * REQUIRED FILES
 * Include required files.
 */
require get_template_directory() . '/inc/template-tags.php';

// Handle SVG icons.
require get_template_directory() . '/classes/class-mhbasictheme-svg-icons.php';
require get_template_directory() . '/inc/svg-icons.php';

// Handle Customizer settings.
require get_template_directory() . '/classes/class-mhbasictheme-customize.php';

// Custom comment walker.
require get_template_directory() . '/classes/class-mhbasictheme-walker-comment.php';

// Custom page walker.
require get_template_directory() . '/classes/class-mhbasictheme-walker-page.php';

// Custom script loader class.
require get_template_directory() . '/classes/class-mhbasictheme-script-loader.php';

// Non-latin language handling.
require get_template_directory() . '/classes/class-mhbasictheme-non-latin-languages.php';

// Custom CSS.
require get_template_directory() . '/inc/custom-css.php';

//customizer settings
require get_template_directory() . '/inc/theme-settings.php';

//newsletter to add more settings
require get_template_directory() . '/inc/newsletter-settings.php';

/**
 * Register and Enqueue Styles.
 */
function mhbasictheme_register_styles() {

    $theme_version = wp_get_theme()->get( 'Version' );




    // Add print CSS.
    wp_enqueue_style( 'mhbasictheme-print-style', get_template_directory_uri() . '/assets/css/print.css', array('layout', 'responsive', 'screen' ) , $theme_version, 'print' );

    wp_enqueue_style('screen', get_template_directory_uri() .'/assets/css/app.css' );


    if( current_user_can('edit_others_pages') ){
        wp_enqueue_style('admin-logged-in', get_template_directory_uri() .'/assets/css/admin.css' );
      }

  

///DEV //////////
  //wp_enqueue_style('dev', get_template_directory_uri() .'/assets/styling/comments.css' );

    wp_enqueue_style('responsive', get_template_directory_uri() .'/assets/css/responsive.css', array('layout', 'mhbasictheme-style', 'screen' ), $theme_version );
      if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
          wp_enqueue_script( 'comment-reply' );
    }
    if ( is_front_page() ) {
      wp_enqueue_style('homepage', get_template_directory_uri() .'/assets/css/homepage.css' );
    }
    
  
  wp_enqueue_style('layout', get_template_directory_uri() .'/assets/css/layout.css' );



    wp_enqueue_style( 'mhbasictheme-style', get_stylesheet_uri(), array(), $theme_version );
    //wp_style_add_data( 'mhbasictheme-style', 'rtl', 'replace' );


    // Add output of Customizer settings as inline style.
    wp_add_inline_style( 'mhbasictheme-style', mhbasictheme_get_customizer_css( 'front-end' ), array('layout', 'responsive', 'mhbasictheme-style' ) );

}

add_action( 'wp_enqueue_scripts', 'mhbasictheme_register_styles' );

/**
 * Register and Enqueue Scripts.
 */
function mhbasictheme_register_scripts() {

    $theme_version = wp_get_theme()->get( 'Version' );

    if ( ( ! is_admin() ) && is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }

    wp_enqueue_script( 'mhbasictheme-js', get_template_directory_uri() . '/assets/js/index.js', array(), $theme_version, false );
    wp_script_add_data( 'mhbasictheme-js', 'async', true );

}

add_action( 'wp_enqueue_scripts', 'mhbasictheme_register_scripts' );

/**
 * Fix skip link focus in IE11.
 *
 * This does not enqueue the script because it is tiny and because it is only for IE11,
 * thus it does not warrant having an entire dedicated blocking script being loaded.
 *
 * @link https://git.io/vWdr2
 */
function mhbasictheme_skip_link_focus_fix() {
    // The following is minified via `terser --compress --mangle -- assets/js/skip-link-focus-fix.js`.
    ?>
    <script>
    /(trident|msie)/i.test(navigator.userAgent)&&document.getElementById&&window.addEventListener&&window.addEventListener("hashchange",function(){var t,e=location.hash.substring(1);/^[A-z0-9_-]+$/.test(e)&&(t=document.getElementById(e))&&(/^(?:a|select|input|button|textarea)$/i.test(t.tagName)||(t.tabIndex=-1),t.focus())},!1);
    </script>
    <?php
}
add_action( 'wp_print_footer_scripts', 'mhbasictheme_skip_link_focus_fix' );

/** Enqueue non-latin language styles
 *
 * @since 1.0.0
 *
 * @return void
 */
function mhbasictheme_non_latin_languages() {
    $custom_css = mhbasictheme_Non_Latin_Languages::get_non_latin_css( 'front-end' );

    if ( $custom_css ) {
        wp_add_inline_style( 'mhbasictheme-style', $custom_css );
    }
}

add_action( 'wp_enqueue_scripts', 'mhbasictheme_non_latin_languages' );

/**
 * Register navigation menus uses wp_nav_menu in five places.
 */
function mhbasictheme_menus() {

    $locations = array(
        'primary'  => __( 'Desktop Left Menu', 'mhbasictheme' ),
        'right' => __( 'Desktop Right Menu', 'mhbasictheme' ),
        'footer'   => __( 'Footer Menu', 'mhbasictheme' ),
        'social'   => __( 'Social Menu', 'mhbasictheme' ),
    );

    register_nav_menus( $locations );
}

add_action( 'init', 'mhbasictheme_menus' );

/**
 * Get the information about the logo.
 *
 * @param string $html The HTML output from get_custom_logo (core function).
 *
 * @return string $html
 */
function mhbasictheme_get_custom_logo( $html ) {

    $logo_id = get_theme_mod( 'custom_logo' );

    if ( ! $logo_id ) {
        return $html;
    }

    $logo = wp_get_attachment_image_src( $logo_id, 'full' );

    if ( $logo ) {
        // For clarity.
        $logo_width  = esc_attr( $logo[1] );
        $logo_height = esc_attr( $logo[2] );

        // If the retina logo setting is active, reduce the width/height by half.
        if ( get_theme_mod( 'retina_logo', false ) ) {
            $logo_width  = floor( $logo_width / 2 );
            $logo_height = floor( $logo_height / 2 );

            $search = array(
                '/width=\"\d+\"/iU',
                '/height=\"\d+\"/iU',
            );

            $replace = array(
                "width=\"{$logo_width}\"",
                "height=\"{$logo_height}\"",
            );

            // Add a style attribute with the height, or append the height to the style attribute if the style attribute already exists.
            //TBD: should i use when CSS is better since it can override easier?
            // if ( strpos( $html, ' style=' ) === false ) {
            //     $search[]  = '/(src=)/';
            //     $replace[] = "style=\"height: {$logo_height}px; width: auto;\" src=";
            // } else {
            //     $search[]  = '/(style="[^"]*)/';
            //     $replace[] = "$1 height: {$logo_height}px; width: auto;";
            // }

            $html = preg_replace( $search, $replace, $html );

        }
    }

    return $html;

}

add_filter( 'get_custom_logo', 'mhbasictheme_get_custom_logo' );

if ( ! function_exists( 'wp_body_open' ) ) {

    /**
     * Shim for wp_body_open, ensuring backwards compatibility with versions of WordPress older than 5.2.
     */
    function wp_body_open() {
        do_action( 'wp_body_open' );
    }
}

/**
 * Include a skip to content link at the top of the page so that users can bypass the menu.
 */
function mhbasictheme_skip_link() {
    echo '<a class="skip-link screen-reader-text" href="#contentWrapper">' . __( 'Skip to the content', 'mhbasictheme' ) . '</a>';
}

add_action( 'wp_body_open', 'mhbasictheme_skip_link', 5 );

/**
 * Register widget areas.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function mhbasictheme_sidebar_registration() {

    // Arguments used in all register_sidebar() calls.
    $shared_args = array(
        'before_title'  => '<h4 class="widget-title subheading heading-size-4">',
        'after_title'   => '</h4>',
        'before_widget' => '<div class="widget %2$s"><div class="widget-content">',
        'after_widget'  => '</div></div>',
    );

    // Footer #1.
    register_sidebar(
        array_merge(
            $shared_args,
            array(
                'name'        => __( 'Footer #1', 'mhbasictheme' ),
                'id'          => 'sidebar-1',
                'description' => __( 'Widgets in this area will be displayed in the first column in the footer.', 'mhbasictheme' ),
            )
        )
    );

    // Footer #2.
    register_sidebar(
        array_merge(
            $shared_args,
            array(
                'name'        => __( 'Footer #2', 'mhbasictheme' ),
                'id'          => 'sidebar-2',
                'description' => __( 'Widgets in this area will be displayed in the second column in the footer.', 'mhbasictheme' ),
            )
        )
    );	
    // Contact #1.
    register_sidebar(
        array_merge(
            $shared_args,
            array(
                'name'        => __( 'Contact Drawer', 'mhbasictheme' ),
                'id'          => 'contact-1',
                'description' => __( 'Widgets in this area will be displayed in the contact area of theme', 'mhbasictheme' ),
            )
        )
    );

}

add_action( 'widgets_init', 'mhbasictheme_sidebar_registration' );

/**
 * Enqueue supplemental block editor styles.
 */
function mhbasictheme_block_editor_styles() {

    $css_dependencies = array();

    // Enqueue the editor styles.
    wp_enqueue_style( 'mhbasictheme-block-editor-styles', get_theme_file_uri( '/assets/css/editor-style-block.css' ), $css_dependencies, wp_get_theme()->get( 'Version' ), 'all' );
    //wp_style_add_data( 'mhbasictheme-block-editor-styles', 'rtl', 'replace' );

    // Add inline style from the Customizer.
    wp_add_inline_style( 'mhbasictheme-block-editor-styles', mhbasictheme_get_customizer_css( 'block-editor' ) );

    // Add inline style for non-latin fonts.
    wp_add_inline_style( 'mhbasictheme-block-editor-styles', mhbasictheme_Non_Latin_Languages::get_non_latin_css( 'block-editor' ) );

    // Enqueue the editor script.
    wp_enqueue_script( 'mhbasictheme-block-editor-script', get_theme_file_uri( '/assets/js/editor-script-block.js' ), array( 'wp-blocks', 'wp-dom' ), wp_get_theme()->get( 'Version' ), true );
}

add_action( 'enqueue_block_editor_assets', 'mhbasictheme_block_editor_styles', 1, 1 );

/**
 * Enqueue classic editor styles.
 */
function mhbasictheme_classic_editor_styles() {

    $classic_editor_styles = array(
        '/assets/css/editor-style-classic.css',
    );

    add_editor_style( $classic_editor_styles );

}

add_action( 'init', 'mhbasictheme_classic_editor_styles' );

/**
 * Output Customizer settings in the classic editor.
 * Adds styles to the head of the TinyMCE iframe. Kudos to @Otto42 for the original solution.
 *
 * @param array $mce_init TinyMCE styles.
 *
 * @return array $mce_init TinyMCE styles.
 */
function mhbasictheme_add_classic_editor_customizer_styles( $mce_init ) {

    $styles = mhbasictheme_get_customizer_css( 'classic-editor' );

    if ( ! isset( $mce_init['content_style'] ) ) {
        $mce_init['content_style'] = $styles . ' ';
    } else {
        $mce_init['content_style'] .= ' ' . $styles . ' ';
    }

    return $mce_init;

}

add_filter( 'tiny_mce_before_init', 'mhbasictheme_add_classic_editor_customizer_styles' );

/**
 * Output non-latin font styles in the classic editor.
 * Adds styles to the head of the TinyMCE iframe. Kudos to @Otto42 for the original solution.
 *
 * @param array $mce_init TinyMCE styles.
 *
 * @return array $mce_init TinyMCE styles.
 */
function mhbasictheme_add_classic_editor_non_latin_styles( $mce_init ) {

    $styles = mhbasictheme_Non_Latin_Languages::get_non_latin_css( 'classic-editor' );

    // Return if there are no styles to add.
    if ( ! $styles ) {
        return $mce_init;
    }

    if ( ! isset( $mce_init['content_style'] ) ) {
        $mce_init['content_style'] = $styles . ' ';
    } else {
        $mce_init['content_style'] .= ' ' . $styles . ' ';
    }

    return $mce_init;

}

add_filter( 'tiny_mce_before_init', 'mhbasictheme_add_classic_editor_non_latin_styles' );

/**
 * Block Editor Settings.
 * Add custom colors and font sizes to the block editor.
 */
function mhbasictheme_block_editor_settings() {

    // Block Editor Palette.
    $editor_color_palette = array(
        array(
            'name'  => __( 'Accent Color', 'mhbasictheme' ),
            'slug'  => 'accent',
            'color' => mhbasictheme_get_color_for_area( 'content', 'accent' ),
        ),
        array(
            'name'  => __( 'Primary', 'mhbasictheme' ),
            'slug'  => 'primary',
            'color' => mhbasictheme_get_color_for_area( 'content', 'text' ),
        ),
        array(
            'name'  => __( 'Secondary', 'mhbasictheme' ),
            'slug'  => 'secondary',
            'color' => mhbasictheme_get_color_for_area( 'content', 'secondary' ),
        ),
        array(
            'name'  => __( 'Subtle Background', 'mhbasictheme' ),
            'slug'  => 'subtle-background',
            'color' => mhbasictheme_get_color_for_area( 'content', 'borders' ),
        ),
    );

    // Add the background option.
    $background_color = get_theme_mod( 'background_color' );
    if ( ! $background_color ) {
        $background_color_arr = get_theme_support( 'custom-background' );
        $background_color     = $background_color_arr[0]['default-color'];
    }
    $editor_color_palette[] = array(
        'name'  => __( 'Background Color', 'mhbasictheme' ),
        'slug'  => 'background',
        'color' => '#' . $background_color,
    );

    // If we have accent colors, add them to the block editor palette.
    if ( $editor_color_palette ) {
        add_theme_support( 'editor-color-palette', $editor_color_palette );
    }

    // Block Editor Font Sizes.
    add_theme_support(
        'editor-font-sizes',
        array(
            array(
                'name'      => _x( 'Small', 'Name of the small font size in the block editor', 'mhbasictheme' ),
                'shortName' => _x( 'S', 'Short name of the small font size in the block editor.', 'mhbasictheme' ),
                'size'      => 18,
                'slug'      => 'small',
            ),
            array(
                'name'      => _x( 'Regular', 'Name of the regular font size in the block editor', 'mhbasictheme' ),
                'shortName' => _x( 'M', 'Short name of the regular font size in the block editor.', 'mhbasictheme' ),
                'size'      => 21,
                'slug'      => 'normal',
            ),
            array(
                'name'      => _x( 'Large', 'Name of the large font size in the block editor', 'mhbasictheme' ),
                'shortName' => _x( 'L', 'Short name of the large font size in the block editor.', 'mhbasictheme' ),
                'size'      => 26.25,
                'slug'      => 'large',
            ),
            array(
                'name'      => _x( 'Larger', 'Name of the larger font size in the block editor', 'mhbasictheme' ),
                'shortName' => _x( 'XL', 'Short name of the larger font size in the block editor.', 'mhbasictheme' ),
                'size'      => 32,
                'slug'      => 'larger',
            ),
        )
    );

    // If we have a dark background color then add support for dark editor style.
    // We can determine if the background color is dark by checking if the text-color is white.
    if ( '#ffffff' === strtolower( mhbasictheme_get_color_for_area( 'content', 'text' ) ) ) {
        add_theme_support( 'dark-editor-style' );
    }

}

add_action( 'after_setup_theme', 'mhbasictheme_block_editor_settings' );

/**
 * Overwrite default more tag with styling and screen reader markup.
 *
 * @param string $html The default output HTML for the more tag.
 *
 * @return string $html
 */
function mhbasictheme_read_more_tag( $html ) {
    return preg_replace( '/<a(.*)>(.*)<\/a>/iU', sprintf( '<div class="read-more-button-wrap"><a$1><span class="faux-button">$2</span> <span class="screen-reader-text">"%1$s"</span></a></div>', get_the_title( get_the_ID() ) ), $html );
}

add_filter( 'the_content_more_link', 'mhbasictheme_read_more_tag' );

/**
 * Enqueues scripts for customizer controls & settings.
 *
 * @since 1.0.0
 *
 * @return void
 */
function mhbasictheme_customize_controls_enqueue_scripts() {
    $theme_version = wp_get_theme()->get( 'Version' );

    // Add main customizer js file.
    wp_enqueue_script( 'mhbasictheme-customize', get_template_directory_uri() . '/assets/js/customize.js', array( 'jquery' ), $theme_version, false );

    // Add script for color calculations.
    wp_enqueue_script( 'mhbasictheme-color-calculations', get_template_directory_uri() . '/assets/js/color-calculations.js', array( 'wp-color-picker' ), $theme_version, false );

    // Add script for controls.
    wp_enqueue_script( 'mhbasictheme-customize-controls', get_template_directory_uri() . '/assets/js/customize-controls.js', array( 'mhbasictheme-color-calculations', 'customize-controls', 'underscore', 'jquery' ), $theme_version, false );
    wp_localize_script( 'mhbasictheme-customize-controls', 'mhbasicthemeBgColors', mhbasictheme_get_customizer_color_vars() );
}

add_action( 'customize_controls_enqueue_scripts', 'mhbasictheme_customize_controls_enqueue_scripts' );

/**
 * Enqueue scripts for the customizer preview.
 *
 * @since 1.0.0
 *
 * @return void
 */
function mhbasictheme_customize_preview_init() {
    $theme_version = wp_get_theme()->get( 'Version' );

    wp_enqueue_script( 'mhbasictheme-customize-preview', get_theme_file_uri( '/assets/js/customize-preview.js' ), array( 'customize-preview', 'customize-selective-refresh', 'jquery' ), $theme_version, true );
    wp_localize_script( 'mhbasictheme-customize-preview', 'mhbasicthemeBgColors', mhbasictheme_get_customizer_color_vars() );
    wp_localize_script( 'mhbasictheme-customize-preview', 'mhbasicthemePreviewEls', mhbasictheme_get_elements_array() );

    wp_add_inline_script(
        'mhbasictheme-customize-preview',
        sprintf(
            'wp.customize.selectiveRefresh.partialConstructor[ %1$s ].prototype.attrs = %2$s;',
            wp_json_encode( 'cover_opacity' ),
            wp_json_encode( mhbasictheme_customize_opacity_range() )
        )
    );
}

add_action( 'customize_preview_init', 'mhbasictheme_customize_preview_init' );

/**
 * Get accessible color for an area.
 *
 * @since 1.0.0
 *
 * @param string $area The area we want to get the colors for.
 * @param string $context Can be 'text' or 'accent'.
 * @return string Returns a HEX color.
 */
function mhbasictheme_get_color_for_area( $area = 'content', $context = 'text' ) {

    // Get the value from the theme-mod.
    $settings = get_theme_mod(
        'accent_accessible_colors',
        array(
            'content'       => array(
                'text'      => '#000000',
                'accent'    => '#cd2653',
                'secondary' => '#414141',
                'borders'   => '#faf9f5',
            ),
            'header' => array(
                'text'      => '#000000',
                'accent'    => '#cd2653',
                'secondary' => '#414141',
                'borders'   => '#faf9f5',
            ),
            'footer' => array(
                'text'      => '#000000',
                'accent'    => '#cd2653',
                'secondary' => '#414141',
                'borders'   => '#faf9f5',
            ),
        )
    );

    // If we have a value return it.
    if ( isset( $settings[ $area ] ) && isset( $settings[ $area ][ $context ] ) ) {
        return $settings[ $area ][ $context ];
    }

    // Return false if the option doesn't exist.
    return false;
}

/**
 * Returns an array of variables for the customizer preview.
 *
 * @since 1.0.0
 *
 * @return array
 */
function mhbasictheme_get_customizer_color_vars() {
    $colors = array(
        'content'       => array(
            'setting' => 'background_color',
        ),
        'header' => array(
            'setting' => 'header_background_color',
        ),
        'footer' => array(
            'setting' => 'footer_background_color',
        ),
        'menu' => array(
            'setting' => 'menu_background_color',
        ),
    );
    return $colors;
}

/**
 * Get an array of elements.
 *
 * @since 1.0
 *
 * @return array
 */
function mhbasictheme_get_elements_array() {

    // The array is formatted like this:
    // [key-in-saved-setting][sub-key-in-setting][css-property] = [elements].
    $elements = array(
        'content'       => array(
            'accent'     => array(
                'color'            => array( '.color-accent', '.color-accent-hover:hover', '.color-accent-hover:focus', ':root .has-accent-color', '.has-drop-cap:not(:focus):first-letter', '.wp-block-button.is-style-outline', 'a', '.post-list-archive .hentry .content-wrap .archive-content .txb .type',  '.post-list-archive > article .content-wrap .archive-content .txb .type', '.pagination-wrapper .nav-links .current', '.singular:not(.overlay-header) .entry-header .entry-categories a'),
                'border-color'     => array( 'blockquote', '.border-color-accent', '.border-color-accent-hover:hover', '.border-color-accent-hover:focus' ),
                'background-color' => array( '.wp-block-button__link', '.wp-block-file .wp-block-file__button', '#contentWrapper  button:not(.toggle)', '#contentWrapper  .button', '#contentWrapper  .faux-button',  '#contentWrapper  input[type="button"]', '#contentWrapper input[type="reset"]', '#contentWrapper  input[type="submit"]', '#contentWrapper .comment-reply-link', '#contentWrapper  .bg-accent', '#contentWrapper  .bg-accent-hover:hover', '#contentWrapper  .bg-accent-hover:focus', ':root .has-accent-background-color', '.woocommerce-wrapper .woocommerce #respond input#submit.alt', '.woocommerce-wrapper .woocommerce a.button.alt', '.woocommerce-wrapper .woocommerce button.button.alt','.woocommerce-wrapper .woocommerce input.button.alt' ),
                'fill'             => array( '.fill-children-accent', '.fill-children-accent *' ),


                
            ),
            'background' => array(
                'color'            => array( ':root .has-background-color', 'button', '.button', '.faux-button', '.wp-block-button__link', '.wp-block-file__button',  'input[type="submit"]', '.wp-block-button', '.comment-reply-link', '.has-background.has-primary-background-color:not(.has-text-color)', '.has-background.has-primary-background-color *:not(.has-text-color)', '.has-background.has-accent-background-color:not(.has-text-color)', '.has-background.has-accent-background-color *:not(.has-text-color)','#contentWrapper .comment-reply-link', '#contentWrapper  input[type="submit"]', '#contentWrapper  .button', '#contentWrapper  .faux-button',  '#contentWrapper  input[type="button"]', '#contentWrapper .woocommerce-wrapper button.single_add_to_cart_button' ),
                'background-color' => array( ':root .has-background-background-color' ),
            ),
            'text'       => array(
                'color'            => array( 'body', '.entry-title a', ':root .has-primary-color', '.woocommerce-wrapper .woocommerce-loop-product__title', '.woocommerce .product-name a'),
                'background-color' => array( ':root .has-primary-background-color' ),
                'fill'    => array('.post-footer .post-meta-wrapper svg *', '.ratings-container .rating-item svg *' ),
                'stroke'    => array('.ratings-container .rating-item svg *' ),
            ),
            'secondary'  => array(
                'color'            => array( 'cite', 'figcaption', '.wp-caption-text', '.post-meta', '.entry-content .wp-block-archives li', '.entry-content .wp-block-categories li', '.entry-content .wp-block-latest-posts li', '.wp-block-latest-comments__comment-date', '.wp-block-latest-posts__post-date', '.wp-block-embed figcaption', '.wp-block-image figcaption', '.wp-block-pullquote cite', '.comment-metadata', '.comment-respond .comment-notes', '.comment-respond .logged-in-as', '.pagination .dots', '.entry-content hr:not(.has-background)', 'hr.styled-separator', ':root .has-secondary-color', 'input[type="reset"]', '.woocommerce .woocommerce-breadcrumb',  '.woocommerce .woocommerce-breadcrumb a',  '.woocommerce ul.products li.product .price', '.woocommerce div.product p.price' ),
                'background-color' => array( ':root .has-secondary-background-color',  '#contentWrapper .woocommerce button[name="apply_coupon"]'),
            ),
            'borders'    => array(
                'border-color'        => array( 'pre', 'fieldset', 'input', 'textarea', 'table', 'table *', 'hr' ),
                'background-color'    => array( 'caption', 'code', 'code', 'kbd', 'samp', '.wp-block-table.is-style-stripes tbody tr:nth-child(odd)', ':root .has-subtle-background-background-color' ),
                'border-bottom-color' => array( '.wp-block-table.is-style-stripes' ),
                'border-top-color'    => array( '.wp-block-latest-posts.is-grid li' ),
                'color'               => array( ':root .has-subtle-background-color', '#contentWrapper  button:not(.toggle)', '#contentWrapper input[type="reset"]' ),
            ),
        ),
        'header' => array(
            'accent'     => array(
                'color'            => array( 'body:not(.overlay-header) .primary-menu > li > a', 'body:not(.overlay-header) .primary-menu > li > .icon', '.modal-menu a', '.wp-block-pullquote:before', '.singular:not(.overlay-header) .entry-header a', '.archive-header a', '.header-footer-group .color-accent', '.header-footer-group .color-accent-hover:hover' ),
                'background-color' => array( '.social-icons a' ),
            ),
            'background' => array(
                'color'            => array( 'body:not(.overlay-header) .primary-menu ul', '.header-footer-group button', '.header-footer-group .button', '.header-footer-group .faux-button', '.header-footer-group .wp-block-button:not(.is-style-outline) .wp-block-button__link', '.header-footer-group .wp-block-file__button', '.header-footer-group input[type="button"]', '.header-footer-group input[type="reset"]', '.header-footer-group input[type="submit"]' ),
                'background-color' => array( '#site-header ', '.menu-modal', '.menu-modal-inner', '.search-modal-inner', '.archive-header', '.singular .entry-header', '.singular .featured-media:before', '.wp-block-pullquote:before' ),
            ),
            'text'       => array(
                'color'               => array( '.header-footer-group', 'body:not(.overlay-header) #site-header .toggle', '.menu-modal .toggle', '.headerDrawer .widget-content' ),
                'background-color'    => array( 'body:not(.overlay-header) .primary-menu ul' ),
                'border-bottom-color' => array( 'body:not(.overlay-header) .primary-menu > li > ul:after' ),
                'border-left-color'   => array( 'body:not(.overlay-header) .primary-menu ul ul:after' ),
                'fill'    => array('.entry-header .post-meta svg *' ),
            ),
            'secondary'  => array(
                'color' => array( '.site-description', 'body:not(.overlay-header) .toggle-inner .toggle-text', '.widget .post-date', '.widget .rss-date', '.widget_archive li', '.widget_categories li', '.widget cite', '.widget_pages li', '.widget_meta li', '.widget_nav_menu li', '.singular .entry-header .post-meta', '.singular:not(.overlay-header) .entry-header .post-meta a' ),
            ),
            'borders'    => array(
                'border-color'     => array( '.header-footer-group pre', '.header-footer-group fieldset', '.header-footer-group input', '.header-footer-group textarea', '.header-footer-group table', '.header-footer-group table *', '.menu-modal nav *',  ),
                'background-color' => array( '.header-footer-group table caption', 'body:not(.overlay-header) .header-inner .toggle-wrapper::before' ),
            ),
        ),
        'footer' => array(
            'accent'     => array(
                'color'            => array( '.modal-menu a', '.footer-menu a, .footer-widgets a', '#siteFooter .wp-block-button.is-style-outline', '.header-footer-group .color-accent', '.header-footer-group .color-accent-hover:hover' , '#footerWrapper a'),
                'background-color' => array( '#siteFooter button:not(.toggle)', '#siteFooter .button', '#siteFooter .faux-button', '#siteFooter .wp-block-button__link', '#siteFooter .wp-block-file__button', '#siteFooter input[type="button"]', '#siteFooter input[type="reset"]', '#siteFooter input[type="submit"]' ),
            ),
            'background' => array(
                'color'            => array( '.social-icons a' ),
                'background-color' => array( '.footer-nav-widgets-wrapper', '#siteFooter', '#footerWrapper' ),
            ),
            'text'       => array(
                'color'               => array(  '.footer-nav-widgets-wrapper .widget-title', '.footer-nav-widgets-wrapper .widget-title a',  '.footer-nav-widgets-wrapper .widget-content', '#footerWrapper .footer-copyright'),
                'fill'    => array('.footer-nav-widgets-wrapper .footer-social-wrapper svg *'  ),
                'border-bottom-color' => array( ),
                'border-left-color'   => array( ),
            ),
            'secondary'  => array(
                'color' => array(  '.powered-by-wordpress', '.to-the-top'),
            ),
            'borders'    => array(
                'border-color'     => array( '.footer-nav-widgets-wrapper', '#siteFooter', '.menu-modal nav *', '.footer-widgets-outer-wrapper', '.footer-top' ),
                'background-color' => array( ),
            ),
        ),
        'menu' => array(
            'accent'     => array(
                'color'               => array('#headerWrapper',  '#headerWrapper .header-navigation-wrapper a:hover'  ),
                'background-color' => array( '' ),
                'fill'   => array( '#headerWrapper .header-right svg *:hover', '#mobileMenuToggle svg *:hover')
            ),
            'background' => array(
                'color'            => array( '' ),
                'background-color' => array( '#headerWrapper .bg-wrapper' ),
            ),
            'text'       => array(
                'color'            => array( '#headerWrapper .header-right a',  '#headerWrapper .header-navigation-wrapper a', '#mobileMenuToggle'),
                'background-color'    => array( ),
                'border-bottom-color' => array( ),
                'border-left-color'   => array( ),
                'fill'   => array( '#headerWrapper .header-right svg *', '#mobileMenuToggle svg *')
            ),
            'secondary'  => array(
                'color' => array(  '#headerWrapper .secondary','#headerWrapper .header-navigation-wrapper .current-menu-item a' ,'#headerWrapper .em'),
            ),
            'borders'    => array(
                'border-color'     => array( '#headerWrapper .header-right', '#headerWrapper .header-navigation-wrapper' ),
                'background-color' => array( ),
            ),
        ),
    );

    /**
    * Filters  theme elements
    *
    * @since 1.0.0
    *
    * @param array Array of elements
    */
    return apply_filters( 'mhbasictheme_get_elements_array', $elements );
}



  function mhbasictheme_layout_custom_register_blocks() {
 
    // automatically load dependencies and version
   // $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');
 
    if ( defined( 'UPLOADS' ) ) {
      $upload_dir_name = "/wp-content/" . UPLOADS;
    } else{
      $upload_dir_name = '/wp-content/uploads';
    }
    wp_register_script(
      'mhbasictheme-layout-revealing-blocks',
      get_template_directory_uri() .'/assets/js/reveal-blocks.js',
      array( 'wp-blocks', 'wp-components', 'wp-element', 'wp-i18n', 'wp-editor'),
      true
    );
    wp_add_inline_script( 'mhbasictheme-layout-revealing-blocks', 'const BLOGINFO = ' . json_encode( array(
        'ajaxUrl' => explode("://", admin_url( 'admin-ajax.php' ))[1],
        'blogUrl' => explode("://", get_site_url())[1],
        'templateUrl' => explode("://", get_stylesheet_directory_uri())[1],
        'uploadPath' => $upload_dir_name,
        'uploadURL' => explode("://", (get_site_url() . $upload_dir_name))[1]
    )) . '; const BLOCKCONFIG = '.  json_encode( array(
        'relativePaths' => get_theme_mod( 'relative_img_blk', 0 ). ""

    )), 'before' );

    register_block_type( 'mhbasictheme-layout/revealing-blocks', array(
      'editor_script' => 'mhbasictheme-layout-revealing-blocks',
    ) );

 
  }



  add_action( 'init', 'mhbasictheme_layout_custom_register_blocks' );
  

  


 
if(!function_exists('mhbasictheme_allowed_block_types')){
    function mhbasictheme_allowed_block_types( $allowed_blocks, $post ) {

        if (  $post->post_type !== 'post' && $post->post_type !== 'page' ) {
            return $allowed_blocks;
        }
      
        $baseBlocks = array( 'core/paragraph',  'core/gallery', 'core/file',  'core/html', 'core/pullquote', 'core/button', 'core/list', 'core/heading','core/table');
        $pagesBlocksAllowed = array_merge($baseBlocks, array(
            'mhbasictheme-layout/image-part',
            'mhbasictheme-layout/post-part'
          )
        );
        return $pagesBlocksAllowed; 
        
       
    }
}

add_filter( 'allowed_block_types', 'mhbasictheme_allowed_block_types', 10, 2 );



add_filter( 'wp_check_filetype_and_ext', function($data, $file, $filename, $mimes) {

    global $wp_version;
    if ( $wp_version !== '4.7.1' ) {
       return $data;
    }
  
    $filetype = wp_check_filetype( $filename, $mimes );
  
    return [
        'ext'             => $filetype['ext'],
        'type'            => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];
  
  }, 10, 4 );
  
function mh_basictheme_mime_types( $mimes ){
    $mimes['svg'] = "image/svg+xml";
    $mimes['vtt'] = "txt/vtt";
    $mimes['vtt'] = "text/plain";
    return $mimes;
  }
add_filter( 'upload_mimes', 'mh_basictheme_mime_types' );
  
function fix_svg() {
    echo '<style type="text/css">
          .attachment-266x266, .thumbnail img {
               width: 100% !important;
               height: auto !important;
          }
          </style>';
  }
add_action( 'admin_head', 'fix_svg' );




function mh_mhbasictheme_post_meta_box()
{

        add_meta_box(
            'post_meta_information_general',           // Unique ID
            'Post Label',  // Box title
            'post_properties_box_html',  // Content callback, must be of type callable
            // $screen                   // Post type
            array('post', 'page')
        );
    //}
}
add_action('add_meta_boxes', 'mh_mhbasictheme_post_meta_box');


function mh_mhbasictheme_save_postdata($post_id)
{
  $fields = [
    'mh_mhbasictheme_post_label',
    'mh_mhbasictheme_post_subtitle'
  ];
  foreach ( $fields as $field ) {
    if ( array_key_exists( $field, $_POST ) ) {
        update_post_meta( $post_id, $field, wp_filter_post_kses( $_POST[$field] ) );
    }
  }
}
add_action('save_post', 'mh_mhbasictheme_save_postdata');
if(!function_exists('mhbasictheme_get_post_labels')){
    function mhbasictheme_get_post_labels() {
        $postLabels = array(
            array('value' => 'post', 'label' =>"Blog Post"),
            array('value' => 'story', 'label' =>"Story"),
            array('value' => 'article', 'label' =>"Article"),
           // array('label' => 'post', 'value' =>"Blog Post"),
        );
        return $postLabels;
      }
}




function post_properties_box_html($post)
{
  $fields = array(array('mh_mhbasictheme_post_label', 'Post Label:', 'select'), array('mh_mhbasictheme_post_subtitle', 'Post Subtitle:', 'text') );
  foreach ( $fields as $field ) {
    $value = get_post_meta($post->ID, $field[0], true);
    ?>
    <div style="display: block; padding: 5px;"> 
    <?php
    if($field[2] == 'select'){
    ?>
   <label for="<?php echo $field[0] ?>" style="font-size: 18px; padding-right: 10px;"><?php echo $field[1] ?></label>
        <select name="<?php echo $field[0] ?>" id="<?php echo $field[0] ?>"  style="font-size: 24px; height: 50px; display: inline-block; width: 320px; margin-right: 30px;" >
        <option value="">Choose Label</option>
        <?php  foreach ( mhbasictheme_get_post_labels() as $option ) { ?>
          <option value="<?php echo  $option['value'] ?>" <?php selected( $value, $option['value']); ?>><?php echo  $option['label'] ?></option>
        <?php } ?>
        </select></div>
    <?php
    } else{
        ?>
    <label for="<?php echo $field[0] ?>" style="font-size: 18px; padding-right: 10px;"><?php echo $field[1] ?></label>
        <textarea name="<?php echo $field[0] ?>" id="<?php echo $field[0] ?>"style="font-size: 22px; width: 100%;" ><?php echo  $value ?></textarea>
        <?php
    }
  }
  ?>
  </div>
  <?php
}



function mhbasictheme_add_image_insert_override($sizes){
    unset( $sizes['thumbnail']);
    unset( $sizes['medium']);
    unset( $sizes['medium_large']);
    unset( $sizes['large']);
    unset( $sizes['1536x1536']);
    unset( $sizes['2048x2048']);
    return $sizes;
}
add_filter('intermediate_image_sizes_advanced', 'mhbasictheme_add_image_insert_override' );



if(!function_exists('get_special_summary_exclusion_blocks')){
    function get_special_summary_exclusion_blocks(){
        return array();
      }
}

if(!function_exists('get_logo_background_classes')){
    function get_logo_background_classes(){
        return array('.no-image');
    }
}

function get_content_without_special_blocks(){
    $exclusionBlocks = parse_blocks( get_the_content() );
    $content_markup  = '';
    if(count($exclusionBlocks) > 0){
        foreach ( $exclusionBlocks as $block ) {
            if ( in_array($block['blockName'], get_special_summary_exclusion_blocks())) {	
                continue;
            }
            $content_markup .= render_block( $block );
        }
        return apply_filters( 'the_content', $content_markup );
    } else{
        return get_the_content();
    }
}

remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);

add_action('woocommerce_before_main_content', 'mh_mhbasictheme_wrapper_start', 10);
add_action('woocommerce_after_main_content', 'mh_mhbasictheme_wrapper_end', 10);

function mh_mhbasictheme_wrapper_start() {
  echo '<div class="woocommerce-wrapper"><div class="content-wrap"><div class="lyt"><div class="cxb"><section id="main">';
  //echo '<section id="main">';
}

function mh_mhbasictheme_wrapper_end() {
  echo '</section></div></div></div></div>';
  //echo '</section>';
}

if ( ! function_exists( 'is_woocommerce_activated' ) ) {
	function is_woocommerce_activated() {
		if ( class_exists( 'woocommerce' ) ) { return true; } else { return false; }
	}
}


function  mhbasictheme_unset_url_field($fields){
  if(get_theme_mod( 'disable_url_for_comment', false ) === true){
    if(isset($fields['url'])){
      unset($fields['url']);
    }
  }
  //   return $fields;
  //if(isset($fields['url']))
  //unset($fields['url']);
  return $fields;
}

add_filter('comment_form_default_fields', 'mhbasictheme_unset_url_field', 80);

add_filter('wpo_wcpdf_tmp_path', function( $tmp_base ) {
    return dirname(__FILE__).'/woocommerce-invoices/';
});


add_action( 'comment_form_logged_in_after', 'mhbasictheme_comment_rating_rating_field' );
add_action( 'comment_form_after_fields', 'mhbasictheme_comment_rating_rating_field' );

add_action( 'comment_form_logged_in_after', 'mhbasictheme_comment_honeypot' );
add_action( 'comment_form_after_fields', 'mhbasictheme_comment_honeypot' );

function mhbasictheme_comment_honeypot(){
  global $post;
  if(get_theme_mod( 'activate_honeypot_tests', 0 ) > 0 && get_theme_mod( 'activate_honeypot_timetrial', 0 ) > 0 ) {
  ?>
  <input type="hidden" id="form_generated_time" name="form_generated_time" value="<?php echo  time(); ?>" tabindex="-1" /><?php
  }
  if(get_theme_mod( 'activate_honeypot_tests', 0) > 0 && get_theme_mod( 'activate_honeypot_emailField', 0 ) > 0 ){
  ?>
   <label class="important-note-a11y">
     <span class="sr-only">Please leave empty to confirm email</span>
     <input type="text" id="confirm_email" name="confirm_email" value="" tabindex="-1" /></label>
  <?php
  }
}

function mhbasictheme_comment_rating_rating_field () {
    global $post;
    if(get_theme_mod( 'comment_or_review', 0 ) > 0 ){ 
	?>
	<div class="ratings-container interactive-rating">
        <div class="rating-container-title"> <span>Rate <?php echo  $post->post_type ?> <span class="required">*</span></span></div>
        <div class="ratings-list">
          <?php for ( $i = 1; $i <= 5; $i++ ) : ?>
                <span class="rating-item"><label for="rating-<?php echo esc_attr( $i ); ?>" title="<?php echo esc_attr( $i ); ?> stars"><input type="radio" id="rating-<?php echo esc_attr( $i ); ?>" name="rating" value="<?php echo esc_attr( $i ); ?>" tabindex="0" />
                <span class="star-icon"><?php mhbasictheme_the_theme_svg( 'star-outline' ); ?></span>
                <span class="sr-only">  <?php echo esc_html( $i ); ?>	stars</span>
                </label>
                </span>
              <?php endfor; ?>
              <span class="rating-item no-rating"><label for="rating-0" title="no stars"><input type="radio" id="rating-0" class="star-cb-clear no-rating" name="rating" value="0" tabindex="-1" /><span class="sr-only"> 0 stars</span></label></span>

          </div>
    </div>
	<?php
    }
}

//Save the rating submitted by the user.
add_action( 'comment_post', 'mhbasictheme_comment_rating_save_comment_rating' );
function mhbasictheme_comment_rating_save_comment_rating( $comment_id ) {
    if(get_theme_mod( 'comment_or_review', 0 ) > 0 ){ 
        if ( ( isset( $_POST['rating'] ) ) && ( '' !== $_POST['rating'] ) )
        $rating = intval( $_POST['rating'] );
        add_comment_meta( $comment_id, 'rating', $rating );
    }
}


add_filter( 'preprocess_comment', 'mhbasictheme_comment_honeypot_process' );
function mhbasictheme_comment_honeypot_process( $commentdata ){
  if(get_theme_mod( 'activate_honeypot_tests', 0 ) === 0  || is_user_logged_in()) {
    return $commentdata;
  }
  if(get_theme_mod( 'activate_honeypot_timetrial', 0 ) > 0  ){
    $commentDelayAmt = (int)(get_theme_mod( 'comment_delay', 30 ));
    $shouldComment = ($_POST['form_generated_time'] + $commentDelayAmt) < time() ? 1 : 0;
    //$delay =  time() - $_POST['form_generated_time'];
    if(!$shouldComment){ 
      wp_die( __( 'Error: You activated an auto spam feature.  Please go back to last page, and try again. '));
    } 
  }
  if(  get_theme_mod( 'activate_honeypot_emailField', 0 ) > 0 && $_POST['confirm_email']){
    wp_die( __( 'Error: You activated an auto spam feature.  Please read all instructions and and try again. '));
  } 

  return $commentdata;
  
}

//Make the rating required.
add_filter( 'preprocess_comment', 'mhbasictheme_comment_rating_require_rating' );
function mhbasictheme_comment_rating_require_rating( $commentdata ) {
    
    if(get_theme_mod( 'comment_or_review', 0 ) > 0 ){ 
        if ( ! is_admin() && ( ! isset( $_POST['rating'] ) || 0 === intval( $_POST['rating'] ) ) )
        wp_die( __( 'Error: You did not add a rating. Hit the Back button on your Web browser and resubmit your comment with a rating.' ) );
    }
	return $commentdata;
}



function mhbasictheme_get_average_rating( $id ) {
	$comments = get_approved_comments( $id );

	if ( $comments ) {
		$i = 0;
		$total = 0;
		foreach( $comments as $comment ){
			$rate = get_comment_meta( $comment->comment_ID, 'rating', true );
			if( isset( $rate ) && '' !== $rate ) {
				$i++;
				$total += $rate;
			}
		}

		if ( 0 === $i ) {
			return false;
		} else {
			return array(round( $total / $i, 1 ) . '', $i);
		}
	} else {
		return false;
	}
}

function mhbasictheme_show_post_rating($id){
  $rating = mhbasictheme_get_average_rating($id);
  $i = 0;
  if($rating[1] === 0 || !$rating[0] ){
    return false;
  }
  ?>
  <div class="ratings-container minimal-display">
        <div class="ratings-list">
          <?php for ( $i = $rating[0]; $i > 1; $i-- ) : ?>
                <span class="rating-item"><span class="star-icon"><?php mhbasictheme_the_theme_svg( 'star-outline' ); ?></span></span>
              <?php endfor; ?>
              <?php if ($i > 0 ) : ?>
                <span class="rating-item leftover"><span class="star-icon" style="width: <?php echo 100*$i; ?>%;"><?php mhbasictheme_the_theme_svg( 'star-outline' ); ?></span></span>
              <?php endif; ?>
              <?php   if(get_theme_mod( 'rating_mini_text', 0 ) > 0 ){ ?>
              <span class="rating-text-container"> <span class="num"><?php echo $rating[0]; ?></span>
              <?php   if(get_theme_mod( 'rating_mini_text', 0 ) > 1 ){ ?>
                <span class="measure">stars</span>
                <?php } ?></span>

              <?php } ?>
          </div>
    </div>
    <?php
}