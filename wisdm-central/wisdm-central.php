<?php
/**
* Plugin Name: Wisdm Central
* Description: Basecamp on WP
* Version: 0.1
* Author: do-masters
* Text Domain: wisdm-central
**/

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Set Plugin Version
 *
 * @since 3.5.0
 */
if ( ! defined( 'WISDM_CENTRAL_PLUGIN_VERSION' ) ) {
	define( 'WISDM_CENTRAL_PLUGIN_VERSION', '0.1' );
}

/**
 * Plugin dir path Constant
 *
 * @since 3.1.0
 */
if ( ! defined( 'WISDM_CENTRAL_ABSPATH' ) ) {
	define( 'WISDM_CENTRAL_ABSPATH', plugin_dir_path( __FILE__ ) );
}

/**
 * Plugin BaseName Constant
 *
 * @since 3.1.1
 */
if ( ! defined( 'WISDM_CENTRAL_BASE' ) ) {
	define( 'WISDM_CENTRAL_BASE', plugin_basename( __FILE__ ) );
}

/**
 * Set the plugin slug as default text domain.
 *
 * @since 3.5.0
 */
if ( ! defined( 'WISDM_CENTRAL_TXT_DOMAIN' ) ) {
	define( 'WISDM_CENTRAL_TXT_DOMAIN', 'wdm_instructor_role' );
}

require_once __DIR__ .'/class-customposttype.php';
require_once __DIR__ .'/class-customtaxonomy.php';
require_once __DIR__ .'/class-customblocks.php';
