<?php
/**
 * Project Single Template
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
			<p><?php esc_html_e( 'Please login to manage your projects.', 'wdm_instructor_role' ); ?></p>
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
		<h2><?php echo get_post_type_archive_link('wdm-central-project.php'); ?></h2>
        <?php echo do_blocks(
            '<!-- wp:wisdm-central/project -->
            <div class="wp-block-wisdm-central-project" data-post-id="'.get_the_ID().'"><div class="wisdm-central-container-project"></div></div>
            <!-- /wp:wisdm-central/project -->
            <!-- wp:pattern {"slug":"twentytwentythree/hidden-comments"} /-->'
        );
        ?>
    <?php endif; ?>
    <?php get_footer(); ?>
</body>
</html>