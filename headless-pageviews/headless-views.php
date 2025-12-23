<?php
/**
 * Plugin Name: Headless Page Views
 * Description: Simple REST endpoint to count headless page views.
 * Version: 0.1
 * Author: Tom Hinkle
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Register REST route
 */
add_action('rest_api_init', function () {
  register_rest_route('headless/v1', '/view', [
    'methods'  => 'POST',
    'callback' => 'headless_register_view',
    'permission_callback' => '__return_true',
  ]);
});

/**
 * Register headless_views post meta
 */
add_action('init', function () {
  register_post_meta('post', 'headless_views', [
    'type'         => 'integer',
    'single'       => true,
    'show_in_rest' => true,
    'default'      => 0,
  ]);
});

/**
 * Add headless views column to posts list
 */
add_filter('manage_posts_columns', function ($columns) {
  $columns['headless_views'] = 'Headless Views';
  return $columns;
});

/**
 * Populate headless views column
 */
add_action('manage_posts_custom_column', function ($column, $post_id) {
  if ($column === 'headless_views') {
    $views = (int) get_post_meta($post_id, 'headless_views', true);
    echo $views ? $views : '0';
  }
}, 10, 2);

/**
 * Make headless views column sortable
 */
add_filter('manage_edit-post_sortable_columns', function ($columns) {
  $columns['headless_views'] = 'headless_views';
  return $columns;
});

/**
 * Handle sorting by headless views
 */
add_action('pre_get_posts', function ($query) {
  if (!is_admin()) {
    return;
  }

  $orderby = $query->get('orderby');
  if ($orderby === 'headless_views') {
    $query->set('meta_key', 'headless_views');
    $query->set('orderby', 'meta_value_num');
  }
});

/**
 * Handle view increment
 */
function headless_register_view(WP_REST_Request $request) {
  $post_id = intval($request->get_param('postId'));

  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

  $allowed_origins = [
    'https://theinnovator.org',
    'https://www.theinnovator.org',
    'http://localhost:5173',
  ];

  if (!in_array($origin, $allowed_origins, true)) {
    return new WP_REST_Response(
      ['error' => 'Invalid origin'],
      403
    );
  }

  if (!$post_id || get_post_status($post_id) === false) {
    return new WP_REST_Response(
      ['error' => 'Invalid postId'],
      400
    );
  }

  $key = 'headless_views';
  $current = (int) get_post_meta($post_id, $key, true);
  $current++;

  update_post_meta($post_id, $key, $current);

  return new WP_REST_Response([
    'postId' => $post_id,
    'views'  => $current,
  ]);
}