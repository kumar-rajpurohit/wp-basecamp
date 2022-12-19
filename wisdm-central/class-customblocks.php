<?php
/**
 * WRITE SOMETHING ABOUT THIS CLASS
 *
 * @package admin
 */
/**
 * Class to handle ___
 */
class CustomBlocks
{
    /**
     * Instance of this class.
     *
     * @since    1.0.0
     *
     * @var object
     */
    protected static $instance = null;

    /**
     * Initialization.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_blocks' ) );
        add_filter( 'rest_user_query', array( $this, 'remove_has_published_posts_from_api_user_query' ), 10, 2);

    }

    /**
     * Returns an instance of this class.
     *
     * @since     1.0.0
     *
     * @return object A single instance of this class.
     */
    public static function get_instance() {
        // If the single instance hasn't been set, set it now.
        if (null == self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function register_blocks() {
        // Todo Single Template Block.
        register_block_type( WISDM_CENTRAL_ABSPATH . '/blocks/todo/build' );

        // Project Single Template Block.
        register_block_type( WISDM_CENTRAL_ABSPATH . '/blocks/project/build' );

        // Message Single Template Block.
        register_block_type( WISDM_CENTRAL_ABSPATH . '/blocks/message/build' );

        // Home ( Project Archive ) Template Block.
        register_block_type( WISDM_CENTRAL_ABSPATH . '/blocks/home/build' );

        // Message Board ( Project specific Messages Archive ) Template Block.
        register_block_type( WISDM_CENTRAL_ABSPATH . '/blocks/board/build' );
    }

    public function remove_has_published_posts_from_api_user_query($prepared_args, $request)
    {
        unset($prepared_args['has_published_posts']);

        return $prepared_args;
    }

}
CustomBlocks::get_instance();
