<?php
/**
 * The template file for displaying the comments and comment form for the
 * Mheadley Basic theme.
 *
 * @package Mheadley
 * @subpackage MHBasic_Theme
 * @since 1.0.0
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
*/
if ( post_password_required() ) {
	return;
}



if ( comments_open() || pings_open() ) {

	$i = 0;
	$aggregateRating = " ";
	if ( $comments ) {
		$total = 0;
		foreach( $comments as $comment ){
			$rate = get_comment_meta( $comment->comment_ID, 'rating', true );
			if( isset( $rate ) && '' !== $rate ) {
				$i++;
				$total += $rate;
			}
		}
		if ( 0 === $i ) {
			//return false;
		} else {
			$aggregateRating =  round( $total / $i, 1 );?>


<?php
		}
	}
?>

	<span itemprop="interactionStatistic" itemscope itemtype="https://schema.org/InteractionCounter">
    <meta itemprop="interactionType" content="https://schema.org/CommentAction"/>
    <meta itemprop="userInteractionCount" content="<?php echo count($comments);?>" />
	</span>

		<span itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
  		<meta itemprop="ratingValue" content="<?php echo  $aggregateRating; ?>" />
  		<meta itemprop="reviewCount" content="<?php echo  $i; ?>" />
      <meta itemprop="worstRating" content = "0">
      <meta itemprop="BestRating" content = "5">
		</span>
  <div  class="lyt">
    <div class="cxb">
      <?php
      comment_form(
        array(
          'class_form'         => 'section-inner thin max-percentage',
          'title_reply_before' => '<h5 id="reply-title" class="comment-reply-title">',
          'title_reply_after'  => '</h5>',
        )
      );
    ?>
    </div>
  </div>
<?php 
} elseif ( is_single() ) {



	?>
  <div  class="lyt">
    <div  class="cxb">
      <div class="comment-respond" id="respond">

        <p class="comments-closed"><?php _e( 'Comments are closed.', 'mhbasictheme' ); ?></p>

        </div>
    </div>
  </div>
	<?php
}


if ( $comments ) {
  ?>
  
  <div  class="lyt">
<div class="cxb">
	<div class="comments" id="comments">

		<?php
		$comments_number = absint( get_comments_number() );
		?>

		<div class="comments-header">

			<h6 class="comment-reply-title">
			<?php
		/*	if ( ! have_comments() ) {
				_e( 'Leave a comment', 'mhbasictheme' );
			} elseif ( '1' === $comments_number ) {
				// translators: %s: post title 
				printf( _x( 'One reply on &ldquo;%s&rdquo;', 'comments title', 'mhbasictheme' ), esc_html( get_the_title() ) );
			} else {
				echo sprintf(
					// translators: 1: number of comments, 2: post title 
					_nx(
						'%1$s reply on &ldquo;%2$s&rdquo;',
						'%1$s replies on &ldquo;%2$s&rdquo;',
						$comments_number,
						'comments title',
						'mhbasictheme'
					),
					number_format_i18n( $comments_number ),
					esc_html( get_the_title() )
				);
			}*/
      _e( 'What others are saying', 'mhbasictheme' );
			?>
			</h6>

		</div>
		
		

		<div class="comments-inner">

			<?php
			wp_list_comments(
				array(
					'walker'      => new mhbasictheme_Walker_Comment(),
					'avatar_size' => 120,
					'style'       => 'div',
				)
			);

			$comment_pagination = paginate_comments_links(
				array(
					'echo'      => false,
					'end_size'  => 0,
					'mid_size'  => 0,
					'next_text' => __( 'Newer Comments', 'mhbasictheme' ) . ' <span aria-hidden="true">&rarr;</span>',
					'prev_text' => '<span aria-hidden="true">&larr;</span> ' . __( 'Older Comments', 'mhbasictheme' ),
				)
			);

			if ( $comment_pagination ) {
				$pagination_classes = '';

				// If we're only showing the "Next" link, add a class indicating so.
				if ( false === strpos( $comment_pagination, 'prev page-numbers' ) ) {
					$pagination_classes = ' only-next';
				}
				?>

				<nav class="comments-pagination pagination<?php echo $pagination_classes; //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static output ?>" aria-label="<?php esc_attr_e( 'Comments', 'mhbasictheme' ); ?>">
					<?php echo wp_kses_post( $comment_pagination ); ?>
				</nav>

				<?php
			}
			?>

		</div>

	</div>
    </div>
    </div>
	<?php
}

