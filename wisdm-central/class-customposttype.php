<?php
/**
 * WRITE SOMETHING ABOUT THIS CLASS
 *
 * @package admin
 */

/**
 * Class to handle ___
 */
class CustomPostType
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
        add_action( 'init', array( $this, 'create_todo_post_type' ) );
        add_action( 'init', array( $this, 'create_message_post_type' ) );
        add_action( 'init', array( $this, 'create_project_post_type' ) );
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

    /**
     * This will create a custom post type with specified options
     *
     * Access tab 2 to get the data on registering custom capabilities if you have
     * specified the capability type.
     *
     * Reactivate the plugin if you are doing one of the following things:
     * 1] Specifying capability_type parameter.
     * 2] Copying this file in an existing plugin.
     */
    public function create_todo_post_type() {
        $args = array(
            'label' => __('Todo', 'wisdm-central'),
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'map_meta_cap' => true,
            'query_var' => true,
            'can_export' => true,
            'supports' => array(
                'title',
                'editor',
                'comments'
            ),
            'hierarchical' => false,
            'exclude_from_search' => false,
            'show_in_nav_menus' => false,
            'show_in_admin_bar' => false,
            'public' => false,
            'has_archive' => true,
            'rewrite' => array( 'slug' => 'todo-archive' ),
            'labels' => array(
                'name' => __('ToDo', 'wisdm-central'),
                'singular_name' => __('To Do', 'wisdm-central'),
            ),
        );

        register_post_type( 'wdm-central-to-do', $args );

        // The following function can be used to unregister a post_type.
        // Please Note: Default post_type's can not be unregistered using the function.
        // unregister_post_type( 'wdm-central-to-do' );

        // Use flush_rewrite_rules() function when you want to replace new rules with existing one's.
    }

    /**
     * This will create a custom post type with specified options
     *
     * Access tab 2 to get the data on registering custom capabilities if you have
     * specified the capability type.
     *
     * Reactivate the plugin if you are doing one of the following things:
     * 1] Specifying capability_type parameter.
     * 2] Copying this file in an existing plugin.
     */
    public function create_message_post_type() {
        $args = array(
            'label' => __('Messages', 'wisdm-central'),
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'map_meta_cap' => true,
            'query_var' => true,
            'can_export' => true,
            'supports' => array(
                'title',
                'editor',
                'comments'
            ),
            'hierarchical' => false,
            'exclude_from_search' => false,
            'show_in_nav_menus' => false,
            'show_in_admin_bar' => false,
            'public' => false,
            'has_archive' => true,
            'rewrite' => array( 'slug' => 'message-board' ),
            'labels' => array(
                'name' => __('Messages', 'wisdm-central'),
                'singular_name' => __('Message', 'wisdm-central'),
            ),
        );

        register_post_type( 'wdm-central-message', $args );

        // The following function can be used to unregister a post_type.
        // Please Note: Default post_type's can not be unregistered using the function.
        // unregister_post_type( 'wdm-central-to-do' );

        // Use flush_rewrite_rules() function when you want to replace new rules with existing one's.
    }

    /**
     * This will create a custom post type with specified options
     *
     * Access tab 2 to get the data on registering custom capabilities if you have
     * specified the capability type.
     *
     * Reactivate the plugin if you are doing one of the following things:
     * 1] Specifying capability_type parameter.
     * 2] Copying this file in an existing plugin.
     */
    public function create_project_post_type() {
        $args = array(
            'label' => __('Projects', 'wisdm-central'),
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'map_meta_cap' => true,
            'query_var' => true,
            'can_export' => true,
            'supports' => array(
                'title',
                'editor',
                'comments'
            ),
            'hierarchical' => false,
            'exclude_from_search' => false,
            'show_in_nav_menus' => false,
            'show_in_admin_bar' => false,
            'public' => false,
            'has_archive' => true,
            'rewrite' => array( 'slug' => 'projects' ),
            'labels' => array(
                'name' => __('Projects', 'wisdm-central'),
                'singular_name' => __('Project', 'wisdm-central'),
            ),
        );

        register_post_type( 'wdm-central-project', $args );

        // The following function can be used to unregister a post_type.
        // Please Note: Default post_type's can not be unregistered using the function.
        // unregister_post_type( 'wdm-central-to-do' );

        // Use flush_rewrite_rules() function when you want to replace new rules with existing one's.
    }

}
CustomPostType::get_instance();

