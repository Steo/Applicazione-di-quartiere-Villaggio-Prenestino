<?php
/**
 * Plugin Name: VP Quartiere - Gestione Web App Villaggio Prenestino
 * Plugin URI:  https://www.villaggioprenestino.it
 * Description: Plugin ufficiale per la gestione della Web App di quartiere: gestisce segnalazioni con foto, richieste di volontariato con contatti dei cittadini, eventi, proposte e REST API.
 * Version:     1.2.0
 * Author:      Comitato di Quartiere Villaggio Prenestino
 * Author URI:  https://www.villaggioprenestino.it
 * License:     GPL-2.0+
 * Text Domain: vp-quartiere
 */

if (!defined('ABSPATH')) {
    exit;
}

define('VPQ_VERSION', '1.2.0');
define('VPQ_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('VPQ_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Attivazione del plugin: creazione tabella personalizzata interazioni
 */
register_activation_hook(__FILE__, 'vpq_activate');
add_action('plugins_loaded', 'vpq_check_upgrade');

function vpq_check_upgrade() {
    if (get_option('vpq_db_version') !== VPQ_VERSION) {
        vpq_activate();
    }
}

function vpq_activate() {
    global $wpdb;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    $table_interazioni = $wpdb->prefix . 'vp_interazioni';
    $charset_collate   = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_interazioni (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        tipo varchar(30) NOT NULL,
        post_id bigint(20) unsigned NOT NULL,
        token varchar(64) NOT NULL,
        nome varchar(100) NOT NULL DEFAULT '',
        telefono varchar(40) NOT NULL DEFAULT '',
        note text NULL,
        creato datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY dedup_token (tipo, post_id, token),
        KEY post_idx (post_id),
        KEY tipo_idx (tipo)
    ) $charset_collate;";

    dbDelta($sql);

    // Genera chiave API se non esiste
    if (!get_option('vpq_api_key')) {
        update_option('vpq_api_key', wp_generate_password(32, false));
    }
    if (!get_option('vpq_allow_origins')) {
        update_option('vpq_allow_origins', '*');
    }
    update_option('vpq_db_version', VPQ_VERSION);

    // Registra i tipi di post e aggiorna i permalink
    vpq_register_post_types();
    flush_rewrite_rules();
}

/**
 * Registrazione Custom Post Types
 */
add_action('init', 'vpq_register_post_types');
function vpq_register_post_types() {
    // 1. Eventi del quartiere
    register_post_type('vp_evento', [
        'labels' => [
            'name'               => 'Eventi (App)',
            'singular_name'      => 'Evento',
            'menu_name'          => 'Eventi Quartiere',
            'add_new'            => 'Aggiungi Evento',
            'add_new_item'       => 'Nuovo Evento',
            'edit_item'          => 'Modifica Evento',
            'all_items'          => 'Tutti gli Eventi',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-calendar-alt',
        'supports'     => ['title', 'editor', 'thumbnail'],
    ]);

    // 2. Richieste Volontariato ("Serve una mano")
    register_post_type('vp_richiesta', [
        'labels' => [
            'name'               => 'Volontariato (App)',
            'singular_name'      => 'Azione Volontariato',
            'menu_name'          => 'Serve una Mano',
            'add_new'            => 'Nuova Richiesta',
            'add_new_item'       => 'Nuova Richiesta Volontari',
            'edit_item'          => 'Modifica Richiesta',
            'all_items'          => 'Tutte le Richieste',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-heart',
        'supports'     => ['title', 'editor'],
    ]);

    // 3. Segnalazioni Cittadine
    register_post_type('vp_segnalazione', [
        'labels' => [
            'name'               => 'Segnalazioni (App)',
            'singular_name'      => 'Segnalazione',
            'menu_name'          => 'Segnalazioni',
            'add_new'            => 'Nuova Segnalazione',
            'edit_item'          => 'Dettagli Segnalazione',
            'all_items'          => 'Tutte le Segnalazioni',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-warning',
        'supports'     => ['title', 'editor', 'thumbnail'],
    ]);

    // 4. Proposte Cittadini
    register_post_type('vp_proposta', [
        'labels' => [
            'name'               => 'Proposte (App)',
            'singular_name'      => 'Proposta',
            'menu_name'          => 'Proposte Cittadini',
            'all_items'          => 'Tutte le Proposte',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-lightbulb',
        'supports'     => ['title', 'editor'],
    ]);

    // 5. Iscrizioni Registro Volontari ("Partecipa")
    register_post_type('vp_volontario', [
        'labels' => [
            'name'               => 'Volontari Registrati',
            'singular_name'      => 'Volontario',
            'menu_name'          => 'Albo Volontari',
            'all_items'          => 'Tutti i Volontari',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-groups',
        'supports'     => ['title', 'editor'],
    ]);
}

/**
 * Meta Box nei Custom Post Types per gestione dati
 */
add_action('add_meta_boxes', 'vpq_add_meta_boxes');
function vpq_add_meta_boxes() {
    // Meta box per Eventi
    add_meta_box('vpq_evento_meta', 'Dettagli Evento', 'vpq_render_evento_meta', 'vp_evento', 'normal', 'high');
    // Meta box per Richieste Volontariato
    add_meta_box('vpq_richiesta_meta', 'Obiettivo Volontari e Luogo', 'vpq_render_richiesta_meta', 'vp_richiesta', 'normal', 'high');
    // Meta box per Segnalazioni
    add_meta_box('vpq_segnalazione_meta', 'Stato e Luogo Segnalazione', 'vpq_render_segnalazione_meta', 'vp_segnalazione', 'normal', 'high');
    // Meta box per Volontari
    add_meta_box('vpq_volontario_meta', 'Recapiti Volontario', 'vpq_render_volontario_meta', 'vp_volontario', 'normal', 'high');
}

function vpq_render_evento_meta($post) {
    wp_nonce_field('vpq_save_meta', 'vpq_meta_nonce');
    $giorno   = get_post_meta($post->ID, '_vp_giorno', true) ?: date('d');
    $mese     = get_post_meta($post->ID, '_vp_mese', true) ?: strtoupper(date('M'));
    $ora      = get_post_meta($post->ID, '_vp_ora', true) ?: '10:00';
    $luogo    = get_post_meta($post->ID, '_vp_luogo', true) ?: 'Piazza Villaggio Prenestino';
    $target   = get_post_meta($post->ID, '_vp_target', true) ?: '10';
    ?>
    <table class="form-table">
        <tr><th><label for="vp_giorno">Giorno (es. 15):</label></th><td><input type="text" id="vp_giorno" name="vp_giorno" value="<?php echo esc_attr($giorno); ?>" class="regular-text" style="width:80px;" /></td></tr>
        <tr><th><label for="vp_mese">Mese (es. OTT):</label></th><td><input type="text" id="vp_mese" name="vp_mese" value="<?php echo esc_attr($mese); ?>" class="regular-text" style="width:80px;" /></td></tr>
        <tr><th><label for="vp_ora">Orario (es. 10:30):</label></th><td><input type="text" id="vp_ora" name="vp_ora" value="<?php echo esc_attr($ora); ?>" class="regular-text" /></td></tr>
        <tr><th><label for="vp_luogo">Luogo/Indirizzo:</label></th><td><input type="text" id="vp_luogo" name="vp_luogo" value="<?php echo esc_attr($luogo); ?>" class="regular-text" /></td></tr>
        <tr><th><label for="vp_target">Numero volontari/iscritti target:</label></th><td><input type="number" id="vp_target" name="vp_target" value="<?php echo esc_attr($target); ?>" class="small-text" /></td></tr>
    </table>
    <?php
}

function vpq_render_richiesta_meta($post) {
    wp_nonce_field('vpq_save_meta', 'vpq_meta_nonce');
    $luogo     = get_post_meta($post->ID, '_vp_luogo', true) ?: 'Parco di Via Fosso dell\'Osa';
    $obiettivo = get_post_meta($post->ID, '_vp_obiettivo', true) ?: '8';
    ?>
    <table class="form-table">
        <tr><th><label for="vp_luogo">Dove (Luogo/Zona):</label></th><td><input type="text" id="vp_luogo" name="vp_luogo" value="<?php echo esc_attr($luogo); ?>" class="regular-text" /></td></tr>
        <tr><th><label for="vp_obiettivo">Volontari necessari (Target):</label></th><td><input type="number" id="vp_obiettivo" name="vp_obiettivo" value="<?php echo esc_attr($obiettivo); ?>" class="small-text" /></td></tr>
    </table>
    <?php
}

function vpq_render_segnalazione_meta($post) {
    wp_nonce_field('vpq_save_meta', 'vpq_meta_nonce');
    $luogo = get_post_meta($post->ID, '_vp_luogo', true);
    $stato = get_post_meta($post->ID, '_vp_stato', true) ?: '1';
    $nome  = get_post_meta($post->ID, '_vp_cittadino_nome', true);
    $tel   = get_post_meta($post->ID, '_vp_cittadino_tel', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="vp_stato">Stato di avanzamento:</label></th>
            <td>
                <select id="vp_stato" name="vp_stato">
                    <option value="1" <?php selected($stato, '1'); ?>>🟡 Ricevuta (Presa in carico)</option>
                    <option value="2" <?php selected($stato, '2'); ?>>🔵 Inoltrata al Municipio VI / Enti</option>
                    <option value="3" <?php selected($stato, '3'); ?>>🟢 Risolta</option>
                </select>
                <p class="description">I cittadini nell'app vedranno l'aggiornamento in tempo reale con il badge colorato.</p>
            </td>
        </tr>
        <tr><th><label for="vp_luogo">Via / Zona:</label></th><td><input type="text" id="vp_luogo" name="vp_luogo" value="<?php echo esc_attr($luogo); ?>" class="regular-text" /></td></tr>
        <?php if ($nome || $tel): ?>
        <tr><th>Recapiti cittadino:</th><td><strong>Nome:</strong> <?php echo esc_html($nome ?: 'Anonimo'); ?> | <strong>Tel:</strong> <?php echo esc_html($tel ?: 'Non fornito'); ?></td></tr>
        <?php endif; ?>
    </table>
    <?php
}

function vpq_render_volontario_meta($post) {
    wp_nonce_field('vpq_save_meta', 'vpq_meta_nonce');
    $tel = get_post_meta($post->ID, '_vp_telefono', true);
    $att = get_post_meta($post->ID, '_vp_attivita', true);
    ?>
    <table class="form-table">
        <tr><th><label for="vp_telefono">Telefono diretto:</label></th><td><input type="text" id="vp_telefono" name="vp_telefono" value="<?php echo esc_attr($tel); ?>" class="regular-text" /> <a href="tel:<?php echo esc_attr($tel); ?>" class="button">Chiama</a> <a href="https://wa.me/39<?php echo esc_attr(preg_replace('/[^0-9]/', '', $tel)); ?>" target="_blank" class="button">WhatsApp</a></td></tr>
        <tr><th>Attività scelte:</th><td><?php echo esc_html(is_array($att) ? implode(', ', $att) : $att); ?></td></tr>
    </table>
    <?php
}

add_action('save_post', 'vpq_save_meta');
function vpq_save_meta($post_id) {
    if (!isset($_POST['vpq_meta_nonce']) || !wp_verify_nonce($_POST['vpq_meta_nonce'], 'vpq_save_meta')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['vp_giorno'])) update_post_meta($post_id, '_vp_giorno', sanitize_text_field($_POST['vp_giorno']));
    if (isset($_POST['vp_mese'])) update_post_meta($post_id, '_vp_mese', sanitize_text_field($_POST['vp_mese']));
    if (isset($_POST['vp_ora'])) update_post_meta($post_id, '_vp_ora', sanitize_text_field($_POST['vp_ora']));
    if (isset($_POST['vp_luogo'])) update_post_meta($post_id, '_vp_luogo', sanitize_text_field($_POST['vp_luogo']));
    if (isset($_POST['vp_target'])) update_post_meta($post_id, '_vp_target', absint($_POST['vp_target']));
    if (isset($_POST['vp_obiettivo'])) update_post_meta($post_id, '_vp_obiettivo', absint($_POST['vp_obiettivo']));
    if (isset($_POST['vp_stato'])) update_post_meta($post_id, '_vp_stato', sanitize_text_field($_POST['vp_stato']));
    if (isset($_POST['vp_telefono'])) update_post_meta($post_id, '_vp_telefono', sanitize_text_field($_POST['vp_telefono']));
}

/**
 * Colonne Personalizzate nel Back Office
 */
// 1. Richieste Volontariato: chi si è offerto con telefono
add_filter('manage_vp_richiesta_posts_columns', function($cols) {
    $cols['vp_volontari_lista'] = 'Volontari che hanno aderito (Nome & Tel)';
    $cols['vp_progresso']       = 'Stato Aderiti';
    return $cols;
});
add_action('manage_vp_richiesta_posts_custom_column', function($col, $post_id) {
    global $wpdb;
    if ($col === 'vp_volontari_lista') {
        $table = $wpdb->prefix . 'vp_interazioni';
        $rows  = $wpdb->get_results($wpdb->prepare("SELECT nome, telefono, creato FROM $table WHERE tipo='cisono' AND post_id=%d ORDER BY creato DESC LIMIT 30", $post_id));
        if ($rows) {
            echo '<ul style="margin:0;padding-left:15px;">';
            foreach ($rows as $r) {
                $nome = $r->nome ? esc_html($r->nome) : '<em>Anonimo</em>';
                $tel  = $r->telefono ? ' (<a href="tel:' . esc_attr($r->telefono) . '">' . esc_html($r->telefono) . '</a>)' : '';
                echo '<li>' . $nome . $tel . ' <small style="color:#888;">[' . esc_html(date_i18n('d/m H:i', strtotime($r->creato))) . ']</small></li>';
            }
            echo '</ul>';
        } else {
            echo '<span style="color:#999;">Nessun volontario ancora</span>';
        }
    }
    if ($col === 'vp_progresso') {
        $table    = $wpdb->prefix . 'vp_interazioni';
        $aderiti  = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table WHERE tipo='cisono' AND post_id=%d", $post_id));
        $target   = (int) get_post_meta($post_id, '_vp_obiettivo', true) ?: 8;
        $perc     = min(100, round(($aderiti / max(1, $target)) * 100));
        echo '<strong>' . $aderiti . ' / ' . $target . '</strong> (' . $perc . '%)';
    }
}, 10, 2);

// 2. Segnalazioni: Stato e Foto
add_filter('manage_vp_segnalazione_posts_columns', function($cols) {
    $cols['vp_stato_col'] = 'Stato Segnalazione';
    $cols['vp_luogo_col'] = 'Indirizzo/Luogo';
    $cols['vp_foto_col']  = 'Foto';
    return $cols;
});
add_action('manage_vp_segnalazione_posts_custom_column', function($col, $post_id) {
    if ($col === 'vp_stato_col') {
        $s = get_post_meta($post_id, '_vp_stato', true) ?: '1';
        $map = [
            '1' => '<span style="background:#fff3cd;color:#856404;padding:3px 8px;border-radius:12px;font-weight:bold;">Ricevuta</span>',
            '2' => '<span style="background:#cce5ff;color:#004085;padding:3px 8px;border-radius:12px;font-weight:bold;">Inoltrata</span>',
            '3' => '<span style="background:#d4edda;color:#155724;padding:3px 8px;border-radius:12px;font-weight:bold;">Risolta</span>',
        ];
        echo isset($map[$s]) ? $map[$s] : $s;
    }
    if ($col === 'vp_luogo_col') {
        echo esc_html(get_post_meta($post_id, '_vp_luogo', true) ?: '—');
    }
    if ($col === 'vp_foto_col') {
        if (has_post_thumbnail($post_id)) {
            echo get_the_post_thumbnail($post_id, [50, 50], ['style' => 'border-radius:4px;object-fit:cover;']);
        } else {
            echo '<span style="color:#999;">Nessuna</span>';
        }
    }
}, 10, 2);

// 3. Volontari Registrati: Telefono e Attività
add_filter('manage_vp_volontario_posts_columns', function($cols) {
    $cols['vp_tel_col'] = 'Telefono';
    $cols['vp_att_col'] = 'Attività Offerte';
    return $cols;
});
add_action('manage_vp_volontario_posts_custom_column', function($col, $post_id) {
    if ($col === 'vp_tel_col') {
        $tel = get_post_meta($post_id, '_vp_telefono', true);
        echo $tel ? '<a href="tel:' . esc_attr($tel) . '" class="button button-small">' . esc_html($tel) . '</a>' : '—';
    }
    if ($col === 'vp_att_col') {
        $att = get_post_meta($post_id, '_vp_attivita', true);
        echo esc_html(is_array($att) ? implode(', ', $att) : ($att ?: 'Tutte'));
    }
}, 10, 2);


/**
 * Gestione CORS per Web App
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        $allowed = get_option('vpq_allow_origins', '*');
        
        if ($allowed === '*' || ($origin && in_array($origin, array_map('trim', explode(',', $allowed)))) ) {
            header('Access-Control-Allow-Origin: ' . ($origin ? $origin : '*'));
        } else {
            header('Access-Control-Allow-Origin: *');
        }
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, X-VP-Key, X-VP-Token, Authorization');
        return $value;
    });
}, 15);


/**
 * REST API Endpoints personalizzati (/wp-json/vp/v1/...)
 */
add_action('rest_api_init', function() {
    $ns = 'vp/v1';

    // 1. GET /wp-json/vp/v1/dati - Scarica tutti i dati pubblici in una chiamata sola
    register_rest_route($ns, '/dati', [
        'methods'             => 'GET',
        'callback'            => 'vpq_api_get_dati',
        'permission_callback' => '__return_true',
    ]);

    // 2. GET /wp-json/vp/v1/news - Ultimi 3 articoli WordPress del sito
    register_rest_route($ns, '/news', [
        'methods'             => 'GET',
        'callback'            => 'vpq_api_get_news',
        'permission_callback' => '__return_true',
    ]);

    // 3. POST /wp-json/vp/v1/interazione - Prenotazione evento, volontariato "Ci sono", like proposta
    register_rest_route($ns, '/interazione', [
        'methods'             => 'POST',
        'callback'            => 'vpq_api_post_interazione',
        'permission_callback' => '__return_true',
    ]);

    // 4. POST /wp-json/vp/v1/segnalazione - Invio segnalazione con foto
    register_rest_route($ns, '/segnalazione', [
        'methods'             => 'POST',
        'callback'            => 'vpq_api_post_segnalazione',
        'permission_callback' => '__return_true',
    ]);

    // 5. POST /wp-json/vp/v1/proposta - Invio nuova idea cittadino
    register_rest_route($ns, '/proposta', [
        'methods'             => 'POST',
        'callback'            => 'vpq_api_post_proposta',
        'permission_callback' => '__return_true',
    ]);

    // 6. POST /wp-json/vp/v1/volontario - Registrazione volontario dal form Partecipa
    register_rest_route($ns, '/volontario', [
        'methods'             => 'POST',
        'callback'            => 'vpq_api_post_volontario',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * 1. CALLBACK: GET /dati
 */
function vpq_api_get_dati() {
    global $wpdb;
    $table = $wpdb->prefix . 'vp_interazioni';

    // Eventi
    $eventi_query = new WP_Query([
        'post_type'      => 'vp_evento',
        'post_status'    => 'publish',
        'posts_per_page' => 20,
        'orderby'        => 'date',
        'order'          => 'ASC',
    ]);
    $eventi = [];
    foreach ($eventi_query->posts as $p) {
        $count = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table WHERE tipo='evento_vengo' AND post_id=%d", $p->ID));
        $eventi[] = [
            'id'    => $p->ID,
            't'     => $p->post_title,
            'p'     => wp_strip_all_tags($p->post_content),
            'd'     => get_post_meta($p->ID, '_vp_giorno', true) ?: date('d'),
            'm'     => get_post_meta($p->ID, '_vp_mese', true) ?: strtoupper(date('M')),
            'ora'   => get_post_meta($p->ID, '_vp_ora', true) ?: '10:00',
            'luogo' => get_post_meta($p->ID, '_vp_luogo', true) ?: 'Villaggio Prenestino',
            'n'     => $count,
            'target'=> (int) get_post_meta($p->ID, '_vp_target', true) ?: 10,
        ];
    }

    // Richieste Volontariato ("Serve una mano")
    $richieste_query = new WP_Query([
        'post_type'      => 'vp_richiesta',
        'post_status'    => 'publish',
        'posts_per_page' => 20,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ]);
    $richieste = [];
    foreach ($richieste_query->posts as $p) {
        $aderiti = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table WHERE tipo='cisono' AND post_id=%d", $p->ID));
        $richieste[] = [
            'id'   => $p->ID,
            't'    => $p->post_title,
            'w'    => get_post_meta($p->ID, '_vp_luogo', true) ?: 'Villaggio Prenestino',
            'desc' => wp_strip_all_tags($p->post_content),
            'have' => $aderiti,
            'need' => (int) get_post_meta($p->ID, '_vp_obiettivo', true) ?: 8,
        ];
    }

    // Segnalazioni pubbliche
    $segnalazioni_query = new WP_Query([
        'post_type'      => 'vp_segnalazione',
        'post_status'    => 'publish',
        'posts_per_page' => 30,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ]);
    $segnalazioni = [];
    foreach ($segnalazioni_query->posts as $p) {
        $thumb = get_the_post_thumbnail_url($p->ID, 'large');
        $altre_foto = get_post_meta($p->ID, '_vp_foto_urls', true);
        $foto_arr = [];
        if ($thumb) $foto_arr[] = $thumb;
        if (is_array($altre_foto)) {
            foreach ($altre_foto as $f) {
                if ($f && !in_array($f, $foto_arr)) $foto_arr[] = $f;
            }
        }

        $segnalazioni[] = [
            'id'    => $p->ID,
            't'     => $p->post_title,
            'w'     => get_post_meta($p->ID, '_vp_luogo', true) ?: 'Villaggio Prenestino',
            'desc'  => wp_strip_all_tags($p->post_content),
            's'     => (int) (get_post_meta($p->ID, '_vp_stato', true) ?: 1),
            'ph'    => $foto_arr,
            'data'  => get_the_date('d/m/Y', $p->ID),
        ];
    }

    // Proposte cittadinanza
    $proposte_query = new WP_Query([
        'post_type'      => 'vp_proposta',
        'post_status'    => 'publish',
        'posts_per_page' => 30,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ]);
    $proposte = [];
    foreach ($proposte_query->posts as $p) {
        $voti = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table WHERE tipo='proposta_vota' AND post_id=%d", $p->ID));
        $proposte[] = [
            'id' => $p->ID,
            't'  => $p->post_title,
            'v'  => $voti,
        ];
    }

    // News/Articoli
    $news = vpq_get_ultimi_articoli();

    return rest_ensure_response([
        'success'      => true,
        'eventi'       => $eventi,
        'richieste'    => $richieste,
        'segnalazioni' => $segnalazioni,
        'proposte'     => $proposte,
        'news'         => $news,
    ]);
}

/**
 * 2. CALLBACK: GET /news (ultimi 3 articoli dal blog WordPress)
 */
function vpq_api_get_news() {
    return rest_ensure_response(vpq_get_ultimi_articoli());
}

function vpq_get_ultimi_articoli() {
    $posts = get_posts([
        'numberposts' => 3,
        'post_status' => 'publish',
        'orderby'     => 'date',
        'order'       => 'DESC',
    ]);
    $res = [];
    foreach ($posts as $post) {
        $thumb = get_the_post_thumbnail_url($post->ID, 'medium_large');
        $res[] = [
            'id'      => $post->ID,
            'titolo'  => html_entity_decode(get_the_title($post->ID)),
            'estratto'=> wp_strip_all_tags(wp_trim_words($post->post_content, 25)),
            'data'    => get_the_date('d M Y', $post->ID),
            'link'    => get_permalink($post->ID),
            'img'     => $thumb ?: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
        ];
    }
    return $res;
}

/**
 * 3. CALLBACK: POST /interazione (Adesione evento, volontariato "Ci sono", like)
 */
function vpq_api_post_interazione(WP_REST_Request $request) {
    global $wpdb;
    $table = $wpdb->prefix . 'vp_interazioni';

    $tipo     = sanitize_key($request->get_param('tipo') ?: $request->get_param('azione'));
    $post_id  = absint($request->get_param('id') ?: $request->get_param('post_id'));
    $token    = sanitize_text_field($request->get_header('X-VP-Token') ?: $request->get_param('token') ?: 'anon_' . wp_generate_password(12, false));
    $nome     = sanitize_text_field($request->get_param('nome') ?: '');
    $telefono = sanitize_text_field($request->get_param('telefono') ?: $request->get_param('tel') ?: '');
    $annulla  = (bool) $request->get_param('annulla');

    if (!$tipo || !$post_id) {
        return new WP_Error('vpq_bad_request', 'Parametri mancanti.', ['status' => 400]);
    }

    // Modalità annullamento
    if ($annulla) {
        $wpdb->delete($table, [
            'tipo'    => $tipo,
            'post_id' => $post_id,
            'token'   => $token,
        ], ['%s', '%d', '%s']);

        $count = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table WHERE tipo=%s AND post_id=%d", $tipo, $post_id));
        return rest_ensure_response([
            'success'  => true,
            'azione'   => 'annullato',
            'conteggio'=> $count,
        ]);
    }

    // Inserimento idempotente
    $wpdb->query($wpdb->prepare(
        "INSERT INTO $table (tipo, post_id, token, nome, telefono, creato)
         VALUES (%s, %d, %s, %s, %s, NOW())
         ON DUPLICATE KEY UPDATE nome = VALUES(nome), telefono = VALUES(telefono)",
        $tipo, $post_id, $token, $nome, $telefono
    ));

    $count = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table WHERE tipo=%s AND post_id=%d", $tipo, $post_id));

    return rest_ensure_response([
        'success'   => true,
        'azione'    => 'registrato',
        'conteggio' => $count,
        'messaggio' => 'Grazie per il tuo contributo al quartiere!'
    ]);
}

/**
 * 4. CALLBACK: POST /segnalazione
 */
function vpq_api_post_segnalazione(WP_REST_Request $request) {
    $titolo      = sanitize_text_field($request->get_param('titolo') ?: 'Segnalazione dal quartiere');
    $luogo       = sanitize_text_field($request->get_param('luogo') ?: $request->get_param('dove') ?: 'Villaggio Prenestino');
    $descrizione = sanitize_textarea_field($request->get_param('descrizione') ?: '');
    $nome        = sanitize_text_field($request->get_param('nome') ?: 'Cittadino');
    $telefono    = sanitize_text_field($request->get_param('telefono') ?: '');
    $foto_base64 = $request->get_param('foto'); // Array di stringhe base64

    // Creazione della segnalazione in bozza/pending per moderazione
    $post_id = wp_insert_post([
        'post_type'    => 'vp_segnalazione',
        'post_title'   => $titolo . ' - ' . $luogo,
        'post_content' => $descrizione,
        'post_status'  => 'pending', // In attesa di approvazione dal direttivo
    ]);

    if (is_wp_error($post_id)) {
        return new WP_Error('vpq_save_error', 'Impossibile salvare la segnalazione.', ['status' => 500]);
    }

    update_post_meta($post_id, '_vp_luogo', $luogo);
    update_post_meta($post_id, '_vp_stato', '1'); // 1 = Ricevuta
    update_post_meta($post_id, '_vp_cittadino_nome', $nome);
    update_post_meta($post_id, '_vp_cittadino_tel', $telefono);

    // Caricamento foto allegate nella Media Library di WordPress
    $foto_urls = [];
    if (is_array($foto_base64)) {
        require_once ABSPATH . 'wp-admin/includes/image.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';

        $first = true;
        foreach (array_slice($foto_base64, 0, 3) as $data_uri) {
            if (preg_match('/^data:image\/(\w+);base64,/', $data_uri, $type)) {
                $raw_data = substr($data_uri, strpos($data_uri, ',') + 1);
                $decoded  = base64_decode($raw_data);
                if ($decoded) {
                    $ext = strtolower($type[1]);
                    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) $ext = 'jpg';
                    $filename = 'segnalazione-' . $post_id . '-' . wp_generate_password(6, false) . '.' . $ext;
                    $upload   = wp_upload_bits($filename, null, $decoded);
                    if (empty($upload['error'])) {
                        $attachment = [
                            'post_mime_type' => 'image/' . ($ext === 'jpg' ? 'jpeg' : $ext),
                            'post_title'     => sanitize_file_name($filename),
                            'post_content'   => '',
                            'post_status'    => 'inherit'
                        ];
                        $attach_id = wp_insert_attachment($attachment, $upload['file'], $post_id);
                        $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
                        wp_update_attachment_metadata($attach_id, $attach_data);
                        $foto_urls[] = $upload['url'];
                        if ($first) {
                            set_post_thumbnail($post_id, $attach_id);
                            $first = false;
                        }
                    }
                }
            }
        }
        update_post_meta($post_id, '_vp_foto_urls', $foto_urls);
    }

    return rest_ensure_response([
        'success'   => true,
        'post_id'   => $post_id,
        'messaggio' => 'Segnalazione ricevuta con successo! Verrà revisionata dall\'associazione e inoltrata.',
    ]);
}

/**
 * 5. CALLBACK: POST /proposta
 */
function vpq_api_post_proposta(WP_REST_Request $request) {
    $titolo = sanitize_text_field($request->get_param('titolo'));
    if (!$titolo) {
        return new WP_Error('vpq_bad_data', 'Inserisci un titolo per la proposta.', ['status' => 400]);
    }

    $post_id = wp_insert_post([
        'post_type'    => 'vp_proposta',
        'post_title'   => $titolo,
        'post_status'  => 'pending', // Approvazione prima della pubblicazione
    ]);

    return rest_ensure_response([
        'success'   => true,
        'messaggio' => 'Proposta inviata! Sarà pubblicata nell\'app dopo una rapida verifica.',
    ]);
}

/**
 * 6. CALLBACK: POST /volontario (Albo Volontari)
 */
function vpq_api_post_volontario(WP_REST_Request $request) {
    $nome      = sanitize_text_field($request->get_param('nome') ?: 'Volontario');
    $telefono  = sanitize_text_field($request->get_param('telefono') ?: $request->get_param('tel'));
    $attivita  = $request->get_param('attivita');
    $note      = sanitize_textarea_field($request->get_param('note') ?: '');

    if (empty($telefono)) {
        return new WP_Error('vpq_no_phone', 'Il recapito telefonico è obbligatorio per essere ricontattato.', ['status' => 400]);
    }

    $att_str = is_array($attivita) ? implode(', ', array_map('sanitize_text_field', $attivita)) : sanitize_text_field($attivita);

    $content = "Candidatura Volontario:\n";
    $content .= "Nome: " . $nome . "\n";
    $content .= "Telefono: " . $telefono . "\n";
    $content .= "Attività di interesse: " . $att_str . "\n";
    if ($note) $content .= "Note: " . $note . "\n";

    $post_id = wp_insert_post([
        'post_type'    => 'vp_volontario',
        'post_title'   => $nome . ' - ' . $telefono,
        'post_content' => $content,
        'post_status'  => 'private', // Privato: visibile solo all'associazione in WP
    ]);

    update_post_meta($post_id, '_vp_telefono', $telefono);
    update_post_meta($post_id, '_vp_attivita', is_array($attivita) ? $attivita : [$attivita]);

    return rest_ensure_response([
        'success'   => true,
        'messaggio' => 'Grazie ' . $nome . '! La tua candidatura è stata salvata. Ti contatteremo presto per le attività di quartiere.',
    ]);
}

/**
 * Pagina Impostazioni Plugin in wp-admin
 */
add_action('admin_menu', function() {
    add_options_page(
        'App Quartiere Villaggio Prenestino',
        'App Quartiere',
        'manage_options',
        'vp-quartiere',
        'vpq_render_admin_page'
    );
});

function vpq_render_admin_page() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['vpq_save_settings']) && check_admin_referer('vpq_settings_nonce')) {
        update_option('vpq_allow_origins', sanitize_text_field($_POST['vpq_allow_origins']));
        if (!empty($_POST['vpq_regenerate_key'])) {
            update_option('vpq_api_key', wp_generate_password(32, false));
        }
        echo '<div class="updated"><p>Impostazioni salvate con successo!</p></div>';
    }

    $api_key = get_option('vpq_api_key');
    $origins = get_option('vpq_allow_origins', '*');
    $endpoint_base = home_url('/wp-json/vp/v1/');
    ?>
    <div class="wrap">
        <h1>🏡 Gestione Web App - Villaggio Prenestino</h1>
        <p>Configurazione del ponte di comunicazione tra WordPress e l'applicazione mobile/desktop dei cittadini.</p>
        
        <div style="background:#fff;border-left:4px solid #00a32a;padding:15px;margin:20px 0;box-shadow:0 1px 1px rgba(0,0,0,.05);">
            <h3 style="margin-top:0;">⚡ Stato Integrazione API</h3>
            <p><strong>Endpoint Principale API:</strong> <code><?php echo esc_html($endpoint_base); ?>dati</code></p>
            <p><strong>Chiave di Sicurezza App:</strong> <code style="background:#f0f0f1;padding:3px 6px;"><?php echo esc_html($api_key); ?></code></p>
        </div>

        <form method="post">
            <?php wp_nonce_field('vpq_settings_nonce'); ?>
            <table class="form-table">
                <tr>
                    <th><label for="vpq_allow_origins">Domini Autorizzati (CORS):</label></th>
                    <td>
                        <input type="text" id="vpq_allow_origins" name="vpq_allow_origins" value="<?php echo esc_attr($origins); ?>" class="large-text" />
                        <p class="description">Inserisci <code>*</code> per consentire a tutti i dispositivi/app, oppure l'URL specifico dove risiede l'app (es. <code>https://www.villaggioprenestino.it</code>).</p>
                    </td>
                </tr>
                <tr>
                    <th>Sicurezza Chiave:</th>
                    <td>
                        <label>
                            <input type="checkbox" name="vpq_regenerate_key" value="1" />
                            Rigenera una nuova chiave API di sicurezza
                        </label>
                    </td>
                </tr>
            </table>
            <p class="submit">
                <input type="submit" name="vpq_save_settings" class="button button-primary" value="Salva Impostazioni" />
            </p>
        </form>
    </div>
    <?php
}
