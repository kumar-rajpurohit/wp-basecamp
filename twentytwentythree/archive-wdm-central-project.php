<?php
/**
 * Project Archive Template
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
	<!-- <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet"> -->
	<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap" rel="stylesheet">
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
        <?php echo do_blocks(
            '<!-- wp:wisdm-central/home -->
            <div class="wp-block-wisdm-central-home" data-post-id="'.get_the_ID().'"><div class="wisdm-central-container-home"></div></div>
            <!-- /wp:wisdm-central/home -->
            <!-- wp:pattern {"slug":"twentytwentythree/hidden-comments"} /-->'
        );
        ?>
    <?php endif; ?>
    <?php get_footer(); ?>
</body>
</html>