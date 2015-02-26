<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link http://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'iwen_wp');

/** MySQL database username */
define('DB_USER', 'iwen');

/** MySQL database password */
define('DB_PASSWORD', 'iwen!@#');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '}I%E.CL|WV*lIOQmNDlqiof0WL_gZHB.Lk+|}SYGl(jEK1ks{vFG:Rt?2M y},L4');
define('SECURE_AUTH_KEY',  'D.]-Z]|Ifg{leg}P*#@YFh,ypdyqb<cQn`m_zc^KXb!Hes{nn_9uF6Fl~7fQ-HwU');
define('LOGGED_IN_KEY',    '---1;!:$qsM?[OXMZ3~=c);aM*)_t:y~Anl(`_6.,p+UB(a4*Kxen3;~KR:;HI~+');
define('NONCE_KEY',        '2hA9|DG8nBY_5[$+,j<61bFGns{y7wADc_rm=NF $O4l9GaoVB=4E0hA[};H&|p5');
define('AUTH_SALT',        'V./s29^-,x`l`6PZ~P!VF^FXJXk^k+JB-P)ym6=py&_8toz(WPE,.6Ew|H!XPp-4');
define('SECURE_AUTH_SALT', '139ZkFV&;)lU~w4Nf)Kzs4!U`8EC0^R2K(u8lPzhQ=IF4r(D^#+#;!|A90F(VWdn');
define('LOGGED_IN_SALT',   ']c<!O=>*FS*lv|OZ%lr;ztL7^FxD]%gt(QHR+nZ#&#T*#j-uEj=|bl@Q_TJ3i`I:');
define('NONCE_SALT',       '(}%WH p)E^zagW^ls/+8/JX`Rwsek$?3CxFWj8^uC,24jdh7Fm$IWgt;Uv)v#V- ');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
