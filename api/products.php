<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// ── Helpers ─────────────────────────────────────────────────────────────────

function requireApiKey(): void {
    $key = $_SERVER['HTTP_X_API_KEY'] ?? '';
    if ($key !== API_KEY) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized.']);
        exit;
    }
}

/** Fetch images and specs for one or many product IDs. */
function attachRelations(mysqli $db, array &$products): void {
    if (empty($products)) return;

    $ids     = array_column($products, 'id');
    $inList  = implode(',', array_fill(0, count($ids), '?'));
    $types   = str_repeat('s', count($ids));

    // Images
    $stmt = $db->prepare("SELECT product_id, image_url FROM product_images WHERE product_id IN ($inList) ORDER BY sort_order ASC");
    $stmt->bind_param($types, ...$ids);
    $stmt->execute();
    $imgRows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $imageMap = [];
    foreach ($imgRows as $row) {
        $imageMap[$row['product_id']][] = $row['image_url'];
    }

    // Specs
    $stmt = $db->prepare("SELECT product_id, spec_text FROM product_specs WHERE product_id IN ($inList) ORDER BY sort_order ASC");
    $stmt->bind_param($types, ...$ids);
    $stmt->execute();
    $specRows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $specMap = [];
    foreach ($specRows as $row) {
        $specMap[$row['product_id']][] = $row['spec_text'];
    }

    foreach ($products as &$p) {
        $p['images'] = $imageMap[$p['id']] ?? [];
        $p['specs']  = $specMap[$p['id']]  ?? [];
        // Cast numeric fields
        $p['price'] = (float) $p['price'];
        if ($p['stock'] !== null) $p['stock'] = (int) $p['stock'];
    }
    unset($p);
}

function insertRelations(mysqli $db, string $productId, array $images, array $specs): void {
    // Images
    if (!empty($images)) {
        $stmt = $db->prepare("INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)");
        foreach ($images as $i => $url) {
            $order = (int) $i;
            $stmt->bind_param('ssi', $productId, $url, $order);
            $stmt->execute();
        }
        $stmt->close();
    }

    // Specs
    if (!empty($specs)) {
        $stmt = $db->prepare("INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES (?, ?, ?)");
        foreach ($specs as $i => $text) {
            $order = (int) $i;
            $stmt->bind_param('ssi', $productId, $text, $order);
            $stmt->execute();
        }
        $stmt->close();
    }
}

function deleteRelations(mysqli $db, string $productId): void {
    $db->query("DELETE FROM product_images WHERE product_id = '" . $db->real_escape_string($productId) . "'");
    $db->query("DELETE FROM product_specs  WHERE product_id = '" . $db->real_escape_string($productId) . "'");
}

// ── GET ──────────────────────────────────────────────────────────────────────

if ($method === 'GET') {
    $db = db();

    // Single product by id
    if (!empty($_GET['id'])) {
        $id   = $_GET['id'];
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ? LIMIT 1");
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$row) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Product not found.']);
            exit;
        }

        $products = [$row];
        attachRelations($db, $products);
        echo json_encode(['success' => true, 'data' => $products[0]]);
        exit;
    }

    // List by type
    $type = $_GET['type'] ?? '';
    if (!in_array($type, ['rental', 'sale'], true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Parameter "type" must be "rental" or "sale".']);
        exit;
    }

    $stmt = $db->prepare("SELECT * FROM products WHERE type = ? ORDER BY category ASC, name ASC");
    $stmt->bind_param('s', $type);
    $stmt->execute();
    $products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    attachRelations($db, $products);
    echo json_encode(['success' => true, 'data' => $products]);
    exit;
}

// ── POST (create) ────────────────────────────────────────────────────────────

if ($method === 'POST') {
    requireApiKey();
    $db   = db();
    $body = json_decode(file_get_contents('php://input'), true);

    $id          = $body['id']          ?? ('r_' . time() . rand(100, 999));
    $name        = trim($body['name']   ?? '');
    $category    = trim($body['category'] ?? '');
    $price       = (float) ($body['price'] ?? 0);
    $priceUnit   = trim($body['priceUnit'] ?? 'per day');
    $type        = in_array($body['type'] ?? '', ['rental', 'sale'], true) ? $body['type'] : 'rental';
    $description = trim($body['description'] ?? '');
    $stock       = isset($body['stock']) && $body['stock'] !== '' ? (int) $body['stock'] : null;
    $images      = is_array($body['images'] ?? null) ? $body['images'] : [];
    $specs       = is_array($body['specs']  ?? null) ? $body['specs']  : [];

    if (!$name || !$category) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'name and category are required.']);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO products (id, name, category, price, price_unit, type, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('sssdsssi', $id, $name, $category, $price, $priceUnit, $type, $description, $stock);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $stmt->error]);
        $stmt->close(); exit;
    }
    $stmt->close();

    insertRelations($db, $id, $images, $specs);
    echo json_encode(['success' => true, 'id' => $id]);
    exit;
}

// ── PUT (update) ─────────────────────────────────────────────────────────────

if ($method === 'PUT') {
    requireApiKey();
    $db   = db();
    $body = json_decode(file_get_contents('php://input'), true);

    $id          = trim($body['id'] ?? '');
    $name        = trim($body['name'] ?? '');
    $category    = trim($body['category'] ?? '');
    $price       = (float) ($body['price'] ?? 0);
    $priceUnit   = trim($body['priceUnit'] ?? 'per day');
    $description = trim($body['description'] ?? '');
    $stock       = isset($body['stock']) && $body['stock'] !== '' ? (int) $body['stock'] : null;
    $images      = is_array($body['images'] ?? null) ? $body['images'] : [];
    $specs       = is_array($body['specs']  ?? null) ? $body['specs']  : [];

    if (!$id || !$name || !$category) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'id, name and category are required.']);
        exit;
    }

    $stmt = $db->prepare("UPDATE products SET name=?, category=?, price=?, price_unit=?, description=?, stock=? WHERE id=?");
    $stmt->bind_param('ssdssis', $name, $category, $price, $priceUnit, $description, $stock, $id);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $stmt->error]);
        $stmt->close(); exit;
    }
    $stmt->close();

    // Replace relations
    deleteRelations($db, $id);
    insertRelations($db, $id, $images, $specs);

    echo json_encode(['success' => true]);
    exit;
}

// ── DELETE ───────────────────────────────────────────────────────────────────

if ($method === 'DELETE') {
    requireApiKey();
    $db = db();
    $id = $_GET['id'] ?? '';

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'id is required.']);
        exit;
    }

    // Cascade is set in schema, but deleting relations manually is also fine
    $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
