<?php


function mhbasictheme_slug_sanitize_checkbox( $checked ) {
	return ( ( isset( $checked ) && true === $checked ) ? true : false );
}


function mhbasictheme_slug_sanitize_radio( $input, $setting ) {
	$input   = sanitize_key( $input );
	$choices = $setting->manager->get_control( $setting->id )->choices;
	return ( array_key_exists( $input, $choices ) ? $input : $setting->default );
}



function mhbasictheme_customize_register( $wp_customize ) {
  // Do stuff with $wp_customize, the WP_Customize_Manager object.

  $wp_customize->add_section( 'animationEffects' , array(
	'title'    => __( 'Scroll and Effects', 'mhbasictheme' ),
	'priority' => 10
	) );   

	$wp_customize->add_section( 'schemaOptions' , array(
		'title'    => __( 'Schema Settings', 'mhbasictheme' ),
		'priority' => 80
		) );  


		$wp_customize->add_section( 'blkOptions' , array(
			'title'    => __( 'Block Settings', 'mhbasictheme' ),
			'priority' => 35
			) );  

	$wp_customize->add_section( 'spamSettings' , array(
		'title'    => __( 'Spam Prevention', 'mhbasictheme' ),
		'priority' => 50
		) );  
	
$wp_customize->add_setting(
	'hmp_show_masthead',
	array(
		'capability'        => 'edit_theme_options',
		'default'           => true,
		'sanitize_callback' => 'mhbasictheme_slug_sanitize_checkbox' ,
		'transport' => 'refresh' // or postMessage,
	)
);

$wp_customize->add_control(
	'hmp_show_masthead',
	array(
		'type'     => 'checkbox',
		'section'  => 'static_front_page',
		'label'    => esc_html__(  'Show Homepage Feature', 'mhbasictheme' ),
	)
);





$wp_customize->add_setting(
	'relative_img_blk',
	array(
		'capability'        => 'edit_theme_options',
		'default'           => 0,
		'sanitize_callback' => 'mhbasictheme_slug_sanitize_radio' ,
		'transport' => 'refresh' // or postMessage,
	)
);

$wp_customize->add_control(
	'relative_img_blk',
	array(
		'type' => 'radio',
		'section' => 'blkOptions', // Add a default or your own section
		'label' => __( 'Relative Paths for blocks' ),
		'description' => __( 'When picking image use absolute or relative path?' ),
		'choices' => array(
			0 => __( 'Absolute' ),
			1 => __( 'Relative' ),
	))
);

$wp_customize->add_setting(
	'activate_honeypot_tests',
	array(
		'capability'        => 'edit_theme_options',
		'default'           => 0,
		'sanitize_callback' => 'mhbasictheme_slug_sanitize_radio' ,
		'transport' => 'refresh' // or postMessage,
	)
);

$wp_customize->add_control(
	'activate_honeypot_tests',
	array(
		'type' => 'radio',
		'section' => 'spamSettings', // Add a default or your own section
		'label' => __( 'Activate Honeypot?' ),
		'choices' => array(
			0 => __( 'Deactivate' ),
			1 => __( 'Activate' ),
	))
);




$wp_customize->add_setting(
	'disable_url_for_comment',
	array(
		'capability'        => 'edit_theme_options',
		'default'           => false,
		'sanitize_callback' => 'mhbasictheme_slug_sanitize_checkbox' ,
		'transport' => 'refresh' // or postMessage,
	)
);

$wp_customize->add_control(
	'disable_url_for_comment',
	array(
		'type'     => 'checkbox',
		'section'  => 'spamSettings',
		'label'    => esc_html__(  'Remove Url field?', 'mhbasictheme' ),
		'description' => __( 'This field attracts the most spammers' ),
	)
);




$wp_customize->add_setting(
	'activate_honeypot_emailField',
	array(
		'capability'        => 'edit_theme_options',
		'default'           => 0,
		'sanitize_callback' => 'mhbasictheme_slug_sanitize_radio' ,
		'transport' => 'refresh' // or postMessage,
	)
);

$wp_customize->add_control(
	'activate_honeypot_emailField',
	array(
		'type' => 'radio',
		'section' => 'spamSettings', // Add a default or your own section
		'label' => __( 'Honeypot Email Field?' ),
		'choices' => array(
			0 => __( 'No' ),
			1 => __( 'Yes' ),
	))
);



$wp_customize->add_setting(
	'comment_or_review',
	array(
		'capability'        => 'edit_theme_options',
		'default'           => 0,
		'sanitize_callback' => 'mhbasictheme_slug_sanitize_radio' ,
		'transport' => 'refresh' // or postMessage,
	)
);

$wp_customize->add_control(
	'comment_or_review',
	array(
		'type' => 'radio',
		'section' => 'schemaOptions', // Add a default or your own section
		'label' => __( 'Comment or Review' ),
		'description' => __( 'This is to decide if your comment schema is a review' ),
		'choices' => array(
			0 => __( 'Comment' ),
			1 => __( 'Review' ),
	))
);



$wp_customize->add_setting(
	'activate_honeypot_timetrial',
	array(
		'capability'        => 'edit_theme_options',
		'default'           => 0,
		'sanitize_callback' => 'mhbasictheme_slug_sanitize_radio' ,
		'transport' => 'refresh' // or postMessage,
	)
);

$wp_customize->add_control(
	'activate_honeypot_timetrial',
	array(
		'type' => 'radio',
		'section' => 'spamSettings', // Add a default or your own section
		'label' => __( 'Honeypot Time Trial?' ),
		'choices' => array(
			0 => __( 'No' ),
			1 => __( 'Yes' ),
	))
);

$wp_customize->add_setting( 'comment_delay', array(
	'type' => 'theme_mod', // or 'option'
	'capability' => 'edit_theme_options',
	'default'  => 30,
	'transport' => 'refresh' // or postMessage,
) );
$wp_customize->add_control('comment_delay', array(
	'label'   => 'Comment Delay',
	'section' => 'spamSettings',
	'type'    => 'select',
	'description' => __( 'honeypot technique: This is to prevent Spam using a time feature' ),
	'choices' => array(
		15 => '15 seconds',
		30 => '30 seconds',
		45 => '45 seconds',
		60 => '1 minute',
		120 => '2 minutes',
		180 => '3 minutes',
		240 => '4 minutes',
	)
));


$wp_customize->add_setting( 'rating_mini_text', array(
	'type' => 'theme_mod', // or 'option'
	'capability' => 'edit_theme_options',
	'default'           => 0,
	'transport' => 'refresh' // or postMessage,
  ) );

$wp_customize->add_control('rating_mini_text', array(
  'label'   => 'Ratings Text?',
   'section' => 'schemaOptions',
   'type'    => 'select',
	 'description' => __( 'Show rating text in minimal display of ratings?' ),
   'choices' => array(
       0 => 'Show Stars only',
       1 => 'Show rating value',
       2 => 'Show rating value and text',
   )
 ));

//   $wp_customize->add_setting( 'accentColor', array(
// 	'type' => 'theme_mod', // or 'option'
// 	'capability' => 'edit_theme_options',
// 	'transport' => 'refresh', // or postMessage
// 	'sanitize_callback' => 'sanitize_hex_color'
//   ) );

//   $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'accentColor', array(
// 	'section' => 'colors',
// 	'label'   => esc_html__( 'Accent Color', 'mhbasictheme' ),
//   ) ) );

  $wp_customize->add_setting( 'mhbasictheme_branding_image', array(
	'type' => 'theme_mod', // or 'option'
	'capability' => 'edit_theme_options',
	'transport' => 'refresh' // or postMessage,
  ) );

  $wp_customize->add_control( new WP_Customize_Media_Control( $wp_customize, 'mhbasictheme_branding_image', array(
	'section' => 'title_tagline',
	'label'   => esc_html__( 'Watermark Image', 'mhbasictheme' ), 
	'width' => 1000,
  'height' => 1000
)));




$wp_customize->add_setting( 'hmp_cover_image', array(
	'type' => 'theme_mod', // or 'option'
	'capability' => 'edit_theme_options',
	'transport' => 'refresh' // or postMessage,
  ) );


$wp_customize->add_control( new WP_Customize_Media_Control( $wp_customize, 'hmp_cover_image', array(
	'section' => 'static_front_page',
	'label'   => esc_html__( 'Homepage Feature Image', 'mhbasictheme' )
)));



$wp_customize->add_setting(
	'hmp_stretch_cover_width',
	array(
		'capability'        => 'edit_theme_options',
		'default'           => true,
		'sanitize_callback' => 'mhbasictheme_slug_sanitize_checkbox' ,
		'transport' => 'refresh' // or postMessage,
	)
);

$wp_customize->add_control(
	'hmp_stretch_cover_width',
	array(
		'type'     => 'checkbox',
		'section'  => 'static_front_page',
		'label'    => esc_html__(  'Homepage Cover fills screen width', 'mhbasictheme' ),
	)
);



$wp_customize->add_setting(
	'hmp_stretch_cover_height',
	array(
		'capability'        => 'edit_theme_options',
		'default'           => true,
		'sanitize_callback' => 'mhbasictheme_slug_sanitize_checkbox',
		'transport' => 'refresh' // or postMessage,
	)
);

$wp_customize->add_control(
	'hmp_stretch_cover_height',
	array(
		'type'     => 'checkbox',
		'section'  => 'static_front_page',
		'label'    => esc_html__(  'Cover image fills screen height', 'mhbasictheme' ),
	)
);





$wp_customize->add_setting( 'hmp_cover_title_text', array(
	'type' => 'theme_mod', // or 'option'
	'capability' => 'edit_theme_options',
	'transport' => 'refresh' // or postMessage,
  ) );

$wp_customize->add_control('hmp_cover_title_text', array(
  'label'   => 'Homepage Cover Title',
   'section' => 'static_front_page',
  'type'    => 'textarea',
 ));


$wp_customize->add_setting( 'hmp_cover_title_align', array(
	'type' => 'theme_mod', // or 'option'
	'capability' => 'edit_theme_options',
	'transport' => 'refresh' // or postMessage,
  ) );

$wp_customize->add_control('hmp_cover_title_align', array(
  'label'   => 'Text Align',
   'section' => 'static_front_page',
   'type'    => 'select',
   'choices' => array(
       'left' => 'Left',
       'center' => 'Center',
       'right' => 'Right',
   )
 ));



$wp_customize->add_setting( 'hmp_cover_title_valign', array(
	'type' => 'theme_mod', // or 'option'
	'capability' => 'edit_theme_options',
	'transport' => 'refresh' // or postMessage,
  ) );

$wp_customize->add_control('hmp_cover_title_valign', array(
  'label'   => 'Vertical Position',
   'section' => 'static_front_page',
   'type'    => 'select',
   'choices' => array(
       'center' => 'Center',
       'bottom' => 'Bottom'
   )
 ));


 $wp_customize->add_setting( 'hmp_cover_title_color', array(
	'type' => 'theme_mod', // or 'option'
	'capability' => 'edit_theme_options',
	'transport' => 'refresh' // or postMessage,
  ) );

 $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'hmp_cover_title_color', array(
	'section' => 'static_front_page',
	'label'   => esc_html__( 'Text Color', 'mhbasictheme' ),
  ) ) );


}
add_action( 'customize_register', 'mhbasictheme_customize_register' );