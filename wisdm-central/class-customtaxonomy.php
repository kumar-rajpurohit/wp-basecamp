<?php
/**
 * WRITE SOMETHING ABOUT THIS CLASS
 *
 * @package admin
 */
/**
 * Class to handle ___
 */
class CustomTaxonomy
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
        add_action( 'init', array( $this, 'register_custom_taxonomy' ) );

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
    * This callback function will register {} as a taxonomy.
    */
    public function register_custom_taxonomy() {
    $args = array(
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_nav_menus' => true,
            'show_tagcloud' => true,
            'show_in_quick_edit' => true,
            'hierarchical' => true,
            'show_in_rest' => true,
            'show_admin_column' => true,
            'labels' => array(
                'name' => __('ToDo Category', 'wisdm-central'),
            ),
            'rewrite' => array( 'slug' => 'todo-lists')
        );

    register_taxonomy( 'wisdm-central-todo-category', array('wdm-central-to-do', ), $args );

    $args = array(
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud' => true,
        'show_in_quick_edit' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'labels' => array(
            'name' => __('Message Category', 'wisdm-central'),
        ),
        'rewrite' => array( 'slug' => 'message-category')
    );

    register_taxonomy( 'wisdm-central-message-category', array('wdm-central-message', ), $args );
}

}
CustomTaxonomy::get_instance();
