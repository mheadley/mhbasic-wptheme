<?php


/*******************************************************************************
 *
 * Form custom fields
 *
 * The following functions add custom fields in subscription form
 *
 * @since: 2.4
 *
 ******************************************************************************/


/**
 * Add these custom fields to in subscription form.
 * In this sample you will add 2 fields: Company (text) and Favourite music (select).
 *
 * TO ADD THE SAMPLE FIELDS you have to uncomment the code inside the next function
 *
 * From v.2.4.13 there is automatically a newsletter placehoolder for each custom field: e.g. 'cf_country' => [USER-CF_COUNTRY].
 *
 * You have to populate an array following these rules.
 *
 * The array KEYS are the names of custom fields: they are used for database column name and variable name (so take care about variable names limitations).
 * It could be a good idea to use a 'cf_' prefix in name: e.g. cf_surname
 *
 * The array VALUES are arrays with parameters for custom fields.
 * Here you are the details:
 *
 *	humans_name			:	the "human readable" name used in blog (ugly default: the key)
 * 	sql_attr			: 	the attributes for the column in database table (default: "VARCHAR(100) DEFAULT NULL")
 * 	sql_key				:	the column in database table is an index (default: false): set up it to yes if you like to make custom queries
 * 							looking for the field. Note: if true, in subscribers list table, the column is ordinable by this field
 *  input_mandatory		:	the field must be filled/checked (default: false)
 * 	input_validation	:	the name of a php function to be invoked to check the value
 * 							when submitted by subscriber. It must return a bolean true or false.
 * 							Leave false for no validation check (default: false).
 * 							You can use:
 *							- php native functions: e.g. "is_numeric" (note: the submitted value is always a string, so "is_int" does not work as expected)
 *							- WP functions: e.g. "is_email"
 * 							- custom function: you can define it in this file (see below the "custom_easymail_cf_check_number_5_digits" function)
 *	input_type 			:	the type of the form field: "text", "textarea", "select", "checkbox" (default: "text")
 * 	input_values 		:	if the "input_type" is "select", you have to wrtie an array with option values (default: false).
 * 							E.g. for a Sex field: array( 'male' => __("Male", "alo-easymail"), 'female' => __("Female", "alo-easymail") )
 * 	input_attr			:	string with html attributes for the form field (default: ""): e.g "style=\"color: #f00\" width=\"20\" onclick=\"\""
 * Do not add these attaributes: id, name, class, value, type, onchange, onblur, onkeydown
 */

function custom_easymail_set_my_custom_fields ( $fields ) {

	/*
	// Text Custom field: Company
	$fields['cf_company'] = array(
		'humans_name'		=> __("Company", "alo-easymail"),
		'sql_attr' 			=> "VARCHAR(200) NOT NULL AFTER `name`",
		'input_type' 		=> "text",
		'input_mandatory' 	=> true,
		'input_validation' 	=> false
	);
	*/


	// Text Custom field: Company
	$fields['cf_phone_num'] = array(
		'humans_name'		=> __("Phone #", "alo-easymail"),
		'sql_attr' 			=> "VARCHAR(100) NOT NULL AFTER `name`",
		'input_type' 		=> "text",
		'input_mandatory' 	=> true,
		'input_validation' => 'custom_easymail_cf_check_number_10_digits'
	);
	

	/*
	// Select Custom field: Fovourite music
	$fields['cf_music'] = array(
		'humans_name'		=> __("Favourite music", "alo-easymail"),
		'sql_attr' 			=> "VARCHAR(100) DEFAULT NULL",
		'sql_key' 			=> true,
		'input_type' 		=> "select",
		'input_options' 	=> array(
			"" 			=> '',
			"rock" 		=> __("Rock / Metal", "alo-easymail"),
			"jazz" 		=> __("Jazz", "alo-easymail"),
			"classic" 	=> __("Classic", "alo-easymail"),
			"country" 	=> __("Country / Folk", "alo-easymail"),
			"other" 	=> __("Other", "alo-easymail")
		),
		'input_mandatory' 	=> false,
		'input_validation' 	=> false,
		'input_attr'		=> "style=\"color: #f00\""
	);
	*/

	/*
	// Checkbox Custom field: Privacy checkbox
	$fields['cf_privacy'] = array(
		'humans_name'		=> __("Privacy", "alo-easymail"),
		'sql_attr' 			=> "VARCHAR(1) NOT NULL",
		'input_type' 		=> "checkbox",
		'input_mandatory' 	=> true,
	);
	*/

	return $fields;
}
add_filter ( 'alo_easymail_newsletter_set_custom_fields', 'custom_easymail_set_my_custom_fields' );


/**
 * Sample of validation function: check if the passed data is a number 5 digits
 *
 * To apply it to a custom field, add the name as value in field array:
 * 'input_validation' => 'custom_easymail_cf_check_number_5_digits'
 *
 */
function custom_easymail_cf_check_number_10_digits ($data) {
	if ( preg_match( "/^[0-9]{10}$/", $data ) ) {
		return true;
	} else {
		return false;
	}
}



/*******************************************************************************
 * 
 * EXAMPLE 
 *
 * Do actions when a newsletter delivery is complete
 *
 * @since: 2.0 
 *
 ******************************************************************************/

/**
 * Send a notification to author and to admin when a newsletter delivery is complete
 */ 
function custom_easymail_newsletter_is_delivered ( $newsletter ) {	
	$title = apply_filters( 'alo_easymail_newsletter_title', $newsletter->post_title, $newsletter, false );
	$content = "The newsletter **" . stripslashes ( $title ) . "**  was delivered to all recipients.";
	$content .= "\r\nTo disable this notification you have to edit: alo-easymail_custom-hooks.php";
	
  	$author = get_userdata( $newsletter->post_author );
  	wp_mail( $author->user_email, "Newsletter delivered!", $content );
  	wp_mail( get_option('admin_email'), "Newsletter delivered!", $content );
}
add_action ( 'alo_easymail_newsletter_delivered',  'custom_easymail_newsletter_is_delivered' );




/*******************************************************************************
 * 
 * EXAMPLE 
 *
 * Do actions when subscribers do something: eg. subscribe, unsubscribe,
 * edit subscription
 *
 * @since: 2.0 
 *
 ******************************************************************************/

 
/**
 * Send a notification to admin when there is a new subscriber
 * @param	obj
 * @param	int		user id optional: only if subscriber is also a registered user
 */ 
function custom_easymail_new_subscriber_is_added ( $subscriber, $user_id=false ) {
	if ( $user_id ) {
		$content = "A registered user has subscribed the newsletter:";
	} else {
		$content = "There is a new public subscriber:";
	}
	$content .= "\n\nemail: " . $subscriber->email ."\nname: ". $subscriber->name . "\nactivation: ". $subscriber->active . "\nlanguage: ". $subscriber->lang . "\n";
	if ( $user_id ) $content .= "user id: " . $user_id;
	$content .= "\r\nTo disable this notification you have to edit: alo-easymail_custom-hooks.php";
	wp_mail( get_option('admin_email'), "New subscriber", $content );
}
add_action('alo_easymail_new_subscriber_added',  'custom_easymail_new_subscriber_is_added', 10, 2 );


/**
 * Automatically add a new subscriber to a mailing list
 * @since 	2.1.3 
 * @param	obj
 * @param	int		user id optional: only if subscriber is also a registered user
 */ 
function custom_easymail_auto_add_subscriber_to_list ( $subscriber, $user_id=false ) {
	/*** Uncomment the next lines to make it works ***/
	// $list_id = 1; // put the ID of mailing list
	// alo_em_add_subscriber_to_list ( $subscriber->ID, $list_id ); 
}
add_action ( 'alo_easymail_new_subscriber_added',  'custom_easymail_auto_add_subscriber_to_list', 10, 2 );


/**
 * Do something when a subscriber updates own subscription info
 * @param	obj
 * @param	str 
 */ 
function custom_easymail_subscriber_is_updated ( $subscriber, $old_email ) {
	// do something...
}
add_action ( 'alo_easymail_subscriber_updated',  'custom_easymail_subscriber_is_updated', 10, 2);


/**
 * Do something when a subscriber unsubscribes
 * @param	str
 * @param	int		user id optional: only if subscriber is also a registered user
 */ 
function custom_easymail_subscriber_is_deleted ( $email, $user_id=false ) {
	// do something...
}
add_action('alo_easymail_subscriber_deleted',  'custom_easymail_subscriber_is_deleted', 10, 2 );


/**
 * Do something when a subscriber activates the subscription
 * (e.g. after click on activation link in email)
 * @since 	2.4.9
 * @param	str 
 */


if ( !function_exists( 'mh_custom_easymail_subscriber_activated' ) ) {
	function mh_custom_easymail_subscriber_activated ( $email ) {
		// uncomment next lines to send a welcome message to just-activated subscribers
		
		$subscriber = alo_em_get_subscriber( $email );
		$subject = "Your are subscribed to the BlaccMarkt newsletter!";
		$content = "Hi ". stripslashes( $subscriber->name ) .",\r\nwe are happy that you have activated the subscription to our newsletter.\r\n";
		
		$content .= "You'll receive news very soon.\r\n\r\nRegards\r\n". wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);


		$from_name = html_entity_decode ( wp_kses_decode_entities ( get_option('alo_em_sender_name') ) );
		
		$mail_sender = ( get_option('alo_em_sender_email') ) ? get_option('alo_em_sender_email') : "noreply@". str_replace("www.","", $_SERVER['HTTP_HOST']);

		$headers = "From: ". $from_name ." <".$mail_sender.">\n";
		$headers .= "Content-Type: text/html; charset=\"" . strtolower( get_option('blog_charset') ) . "\"\n";


		ob_start();
		require get_template_directory() . '/assets/html/newsletter_intro.html';
		$html = ob_get_clean();
		//echo $html;

		wp_mail( $email, $subject, $html, $headers );
		
	}
}

add_action ( 'alo_easymail_subscriber_activated',  'mh_custom_easymail_subscriber_activated' );



/* EOF */
