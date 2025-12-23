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