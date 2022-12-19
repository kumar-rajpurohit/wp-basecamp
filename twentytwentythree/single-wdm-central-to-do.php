<?php
/**
 * Todo Single Template
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

global $wp_query;
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body class="cleanpage">
    <?php if ( ! ( is_user_logged_in() ) ) : ?>
		<div class="wisdm-central-no-access">
			<p><?php esc_html_e( 'Please login to manage your todos.', 'wdm_instructor_role' ); ?></p>
			<p>
				<?php
				echo wp_kses(
					sprintf(
						'Please <a href="%s">login</a> to proceed',
						wp_login_url(
							home_url( filter_input( INPUT_SERVER, 'REQUEST_URI' ) )
						)
					),
					array( 'a' => array( 'href' => array() ) )
				);
				?>
			</p>
		</div>
	<?php else : ?>
        <?php echo do_blocks(
            '<!-- wp:wisdm-central/todo-single -->
            <div class="wp-block-wisdm-central-todo-single" data-post-id="'.get_the_ID().'"><div class="wisdm-central-container-todo"></div></div>
            <!-- /wp:wisdm-central/todo-single -->
            <!-- wp:pattern {"slug":"twentytwentythree/hidden-comments"} /-->'
        );
        ?>
        <div class="wisdm-central-post-content" style="display: none;">
            <?php echo get_the_content(); ?>
        </div>
    <?php endif; ?>
    <?php get_footer(); ?>
</body>
</html>