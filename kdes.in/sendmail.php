<?php
/**
 * K D Engineering Solutions - Enquiry & Quote Email Handler
 * Dynamic Mapped Recipient: shiven.k@aol.in
 * Handles:
 * 1. "Send Message Now" (contact.html)
 * 2. "Submit Request" (index.html#quote)
 * 3. "Submit Specification & Request Quote" (product-details*.html)
 */

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method Not Allowed. This endpoint only accepts POST form submissions.";
    exit;
}

// 1. Anti-Bot Honeypot Defense
if (!empty($_POST['_kdes_security_hp']) || !empty($_POST['website_url_hp'])) {
    // Automated bot detected: return simulated success and drop payload
    $isJson = (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) ||
              (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
    if ($isJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array(
            'status' => 'success',
            'message' => 'Thank you! Your details have been forwarded.',
            'recipient' => 'shiven.k@aol.in'
        ));
    } else {
        header('Location: contact.html?status=success');
    }
    exit;
}

// 2. IP Rate Limiting (Flood & Mail-Bombing Prevention)
$clientIp = !empty($_SERVER['HTTP_X_FORWARDED_FOR']) ? explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0] : (!empty($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1');
$clientIp = trim(filter_var($clientIp, FILTER_VALIDATE_IP) ? $clientIp : '127.0.0.1');
$rateLimitFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'kdes_rate_' . md5($clientIp) . '.json';
$now = time();
$ipHistory = array();

if (file_exists($rateLimitFile)) {
    $rawHistory = @file_get_contents($rateLimitFile);
    if ($rawHistory) {
        $decoded = @json_decode($rawHistory, true);
        if (is_array($decoded)) {
            // Keep entries within last 180 seconds (3 minutes)
            foreach ($decoded as $ts) {
                if ($now - $ts < 180) {
                    $ipHistory[] = $ts;
                }
            }
        }
    }
}

// Max 6 requests per 3 minutes per IP
if (count($ipHistory) >= 6) {
    http_response_code(429);
    $isJson = (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) ||
              (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
    if ($isJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array(
            'status' => 'error',
            'message' => 'Too many requests. Please wait a few minutes before submitting another inquiry.'
        ));
    } else {
        echo "Too many requests. Please wait a few minutes before trying again.";
    }
    exit;
}

$ipHistory[] = $now;
@file_put_contents($rateLimitFile, json_encode($ipHistory), LOCK_EX);

// Helper to sanitize and clamp single-line text
function clean_input($data, $maxLen = 120) {
    if (is_null($data)) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    // Remove header injection line breaks and null bytes
    $data = str_replace(array("\r", "\n", "\0", "%0a", "%0d"), ' ', $data);
    return mb_substr($data, 0, $maxLen, 'UTF-8');
}

// Helper to sanitize and clamp multi-line text
function clean_textarea($data, $maxLen = 3000) {
    if (is_null($data)) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return mb_substr($data, 0, $maxLen, 'UTF-8');
}

// 1. Determine Mapped Recipient Email dynamically from POST
$defaultMappedEmail = 'shiven.k@aol.in';
$recipient = $defaultMappedEmail;
if (!empty($_POST['to_email']) && filter_var(trim($_POST['to_email']), FILTER_VALIDATE_EMAIL)) {
    $recipient = trim($_POST['to_email']);
} elseif (!empty($_POST['recipient']) && filter_var(trim($_POST['recipient']), FILTER_VALIDATE_EMAIL)) {
    $recipient = trim($_POST['recipient']);
} elseif (!empty($_POST['mapped_email']) && filter_var(trim($_POST['mapped_email']), FILTER_VALIDATE_EMAIL)) {
    $recipient = trim($_POST['mapped_email']);
}

// 2. Extract Customer and Inquiry Details
$fname = '';
if (!empty($_POST['fname'])) {
    $fname = clean_input($_POST['fname']);
} elseif (!empty($_POST['first_name'])) {
    $fname = clean_input($_POST['first_name']);
}

$lname = '';
if (!empty($_POST['lname'])) {
    $lname = clean_input($_POST['lname']);
} elseif (!empty($_POST['last_name'])) {
    $lname = clean_input($_POST['last_name']);
}

$fullName = trim($fname . ' ' . $lname);
if (empty($fullName) && !empty($_POST['name'])) {
    $fullName = clean_input($_POST['name']);
}
if (empty($fullName)) {
    $fullName = 'Valued Customer';
}

$email = '';
if (!empty($_POST['email'])) {
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
}

$phone = 'Not provided';
if (!empty($_POST['phone'])) {
    $phone = clean_input($_POST['phone']);
} elseif (!empty($_POST['mobile'])) {
    $phone = clean_input($_POST['mobile']);
} elseif (!empty($_POST['tel'])) {
    $phone = clean_input($_POST['tel']);
}

$product = 'General Equipment / Not Selected';
if (!empty($_POST['product'])) {
    $product = clean_input($_POST['product']);
} elseif (!empty($_POST['model'])) {
    $product = clean_input($_POST['model']);
} elseif (!empty($_POST['equipment'])) {
    $product = clean_input($_POST['equipment']);
}

$subject = 'Equipment Specification & Quote Request';
if (!empty($_POST['subject'])) {
    $subject = clean_input($_POST['subject']);
} elseif (!empty($_POST['req_subject'])) {
    $subject = clean_input($_POST['req_subject']);
}

$comment = 'No specific message details provided.';
if (!empty($_POST['c_comment'])) {
    $comment = clean_textarea($_POST['c_comment']);
} elseif (!empty($_POST['comment'])) {
    $comment = clean_textarea($_POST['comment']);
} elseif (!empty($_POST['message'])) {
    $comment = clean_textarea($_POST['message']);
} elseif (!empty($_POST['specifications'])) {
    $comment = clean_textarea($_POST['specifications']);
}

$formType = 'Website Enquiry';
if (!empty($_POST['form_type'])) {
    $formType = clean_input($_POST['form_type']);
} elseif (!empty($_POST['form_name'])) {
    $formType = clean_input($_POST['form_name']);
}

// Capture any additional submitted fields
$standardKeys = array('fname', 'lname', 'first_name', 'last_name', 'name', 'email', 'phone', 'mobile', 'tel', 'product', 'model', 'equipment', 'subject', 'c_comment', 'comment', 'message', 'specifications', 'form_type', 'form_name', 'to_email', 'recipient', 'mapped_email', 'E_submit', 'sub_submit');
$extraDetails = array();
foreach ($_POST as $k => $v) {
    if (!in_array($k, $standardKeys) && is_string($v) && trim($v) !== '') {
        $extraDetails[clean_input($k)] = clean_input($v);
    }
}

$referrer = !empty($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'kdes.in';
$userIP   = !empty($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'Unknown IP';
$dateStr  = date('d M Y, h:i A (T)');

// 3. Compose Subject Line
$mailSubject = "[KDES Website Enquiry] " . $formType . " - " . $product . " (" . $fullName . ")";

// 4. Compose Plain-Text Email Version
$plainTextMessage = "====================================================\n";
$plainTextMessage .= "NEW CUSTOMER ENQUIRY - K D ENGINEERING SOLUTIONS\n";
$plainTextMessage .= "Mapped Recipient: " . $recipient . "\n";
$plainTextMessage .= "====================================================\n\n";
$plainTextMessage .= "Form Origin:      " . $formType . "\n";
$plainTextMessage .= "Customer Name:    " . $fullName . "\n";
$plainTextMessage .= "Work Email:       " . $email . "\n";
$plainTextMessage .= "Phone Number:     " . $phone . "\n";
$plainTextMessage .= "Product / Model:  " . $product . "\n";
$plainTextMessage .= "Subject:          " . $subject . "\n\n";
$plainTextMessage .= "Specifications / Technical Scope:\n";
$plainTextMessage .= str_replace(array("\r\n", "\r"), "\n", $comment) . "\n\n";

if (!empty($extraDetails)) {
    $plainTextMessage .= "Additional Details:\n";
    foreach ($extraDetails as $ek => $ev) {
        $plainTextMessage .= " - " . $ek . ": " . $ev . "\n";
    }
    $plainTextMessage .= "\n";
}

$plainTextMessage .= "Submission Metadata:\n";
$plainTextMessage .= "Time: " . $dateStr . "\n";
$plainTextMessage .= "Page: " . $referrer . "\n";
$plainTextMessage .= "IP:   " . $userIP . "\n";
$plainTextMessage .= "====================================================\n";

// 5. Compose HTML Email Version
$extraHtml = '';
if (!empty($extraDetails)) {
    foreach ($extraDetails as $ek => $ev) {
        $extraHtml .= '<tr style="border-bottom:1px solid #f1f5f9;"><td style="font-weight:700;color:#475569;">' . htmlspecialchars($ek) . '</td><td style="color:#0f172a;">' . htmlspecialchars($ev) . '</td></tr>';
    }
}

$htmlMessage = '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Website Enquiry</title>
</head>
<body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;background-color:#f4f7f5;color:#1e293b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <tr style="background:#0e2618;">
            <td style="padding:28px 32px;border-bottom:3px solid #70e000;">
                <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">K D ENGINEERING SOLUTIONS</div>
                <div style="font-size:13px;color:#a3e635;margin-top:4px;font-weight:600;">NEW CUSTOMER ENQUIRY &bull; ' . htmlspecialchars($formType) . '</div>
            </td>
        </tr>
        <tr>
            <td style="padding:20px 32px;background:#f0fdf4;border-bottom:1px solid #bbf7d0;">
                <p style="margin:0;font-size:14px;color:#166534;line-height:1.5;">
                    New customer enquiry details submitted on <strong>kdes.in</strong> targeting <strong>' . htmlspecialchars($recipient) . '</strong>.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding:24px 32px;">
                <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                    <tr style="border-bottom:1px solid #f1f5f9;background:#fafafa;">
                        <td width="30%" style="font-weight:700;color:#475569;">Form Action</td>
                        <td style="color:#0f172a;font-weight:600;">' . htmlspecialchars($formType) . '</td>
                    </tr>
                    <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="font-weight:700;color:#475569;">Customer Name</td>
                        <td style="color:#0f172a;font-weight:600;">' . htmlspecialchars($fullName) . '</td>
                    </tr>
                    <tr style="border-bottom:1px solid #f1f5f9;background:#fafafa;">
                        <td style="font-weight:700;color:#475569;">Work Email</td>
                        <td><a href="mailto:' . htmlspecialchars($email) . '" style="color:#15803d;font-weight:600;text-decoration:none;">' . htmlspecialchars($email) . '</a></td>
                    </tr>
                    <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="font-weight:700;color:#475569;">Phone Number</td>
                        <td><a href="tel:' . htmlspecialchars($phone) . '" style="color:#15803d;font-weight:600;text-decoration:none;">' . htmlspecialchars($phone) . '</a></td>
                    </tr>
                    <tr style="border-bottom:1px solid #f1f5f9;background:#fafafa;">
                        <td style="font-weight:700;color:#475569;">Product / Model</td>
                        <td style="color:#0f172a;font-weight:700;font-size:15px;">' . htmlspecialchars($product) . '</td>
                    </tr>
                    <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="font-weight:700;color:#475569;">Requirement Subject</td>
                        <td style="color:#0f172a;">' . htmlspecialchars($subject) . '</td>
                    </tr>
                    <tr style="background:#fafafa;">
                        <td style="font-weight:700;color:#475569;vertical-align:top;padding-top:14px;">Specifications &amp; Scope</td>
                        <td style="color:#1e293b;line-height:1.6;padding-top:14px;white-space:pre-wrap;">' . nl2br($comment) . '</td>
                    </tr>
                    ' . $extraHtml . '
                </table>
                <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:8px;font-size:12px;color:#64748b;">
                    <strong>Submission Metadata:</strong><br>
                    Time: ' . $dateStr . '<br>
                    Page: ' . htmlspecialchars($referrer) . '<br>
                    IP: ' . htmlspecialchars($userIP) . '
                </div>
            </td>
        </tr>
        <tr style="background:#0e2618;color:#94a3b8;font-size:12px;">
            <td style="padding:16px 32px;text-align:center;">
                &copy; ' . date('Y') . ' K D Engineering Solutions &bull; kdes.in &bull; Forwarded to ' . htmlspecialchars($recipient) . '
            </td>
        </tr>
    </table>
</body>
</html>';

// 6. Build RFC Multipart/Alternative Email Body and Headers
$serverHost = !empty($_SERVER['SERVER_NAME']) ? preg_replace('/^www\./', '', $_SERVER['SERVER_NAME']) : 'kdes.in';
$fromEmail = 'no-reply@' . $serverHost;

$boundary = "==_Multipart_Boundary_x" . md5(uniqid(time())) . "x";

$headers = array();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'From: K D Engineering Solutions <' . $fromEmail . '>';
if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . $fullName . ' <' . $email . '>';
}
$headers[] = 'Return-Path: <' . $fromEmail . '>';
$headers[] = 'Date: ' . date('r');
$headers[] = 'Message-ID: <' . md5(uniqid(time())) . '@' . $serverHost . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

$body = "--" . $boundary . "\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $plainTextMessage . "\r\n\r\n";

$body .= "--" . $boundary . "\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $htmlMessage . "\r\n\r\n";

$body .= "--" . $boundary . "--\r\n";

// 7. Dispatch Email with Envelope Sender & Fallback
$mailSent = false;
$headersStr = implode("\r\n", $headers);
$envelopeSender = "-f" . $fromEmail;

if (function_exists('mail')) {
    // Attempt 1: Standard mail() with -f envelope parameter
    $mailSent = @mail($recipient, $mailSubject, $body, $headersStr, $envelopeSender);

    // Attempt 2: Fallback without -f if server disallows additional parameters
    if (!$mailSent) {
        $mailSent = @mail($recipient, $mailSubject, $body, $headersStr);
    }
}

// 8. Always Persist Backup Log on Server (ensures no lead is ever lost)
$backupEntry = array(
    'timestamp' => date('Y-m-d H:i:s'),
    'recipient' => $recipient,
    'form_type' => $formType,
    'customer_name' => $fullName,
    'email' => $email,
    'phone' => $phone,
    'product' => $product,
    'subject' => $subject,
    'specifications' => $comment,
    'extra' => $extraDetails,
    'mail_sent' => $mailSent,
    'ip' => $userIP,
    'referrer' => $referrer
);

$logFile = __DIR__ . '/inquiries_backup.json';
$existingLogs = array();
if (file_exists($logFile)) {
    $raw = @file_get_contents($logFile);
    if (!empty($raw)) {
        $decoded = @json_decode($raw, true);
        if (is_array($decoded)) {
            $existingLogs = $decoded;
        }
    }
}
$existingLogs[] = $backupEntry;
@file_put_contents($logFile, json_encode($existingLogs, JSON_PRETTY_PRINT));

// 9. Handle Response (AJAX vs Browser POST)
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

if ($isAjax) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(array(
        'status' => 'success',
        'message' => 'Thank you! Your details have been successfully forwarded to ' . $recipient . '. Our engineering team will review and contact you promptly.',
        'recipient' => $recipient,
        'product' => $product,
        'mail_sent' => $mailSent,
        'backup_saved' => true
    ));
    exit;
}

// Browser POST confirmation screen
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Details Forwarded Successfully - K D Engineering Solutions</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="fontawesome/css/all.min.css">
    <link rel="stylesheet" href="css/modern-revamp.css">
    <style>
        body {
            margin: 0;
            background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            font-family: 'Inter', sans-serif;
            color: #0e2618;
        }
        .confirm-card {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 45px rgba(14, 38, 24, 0.12);
            border: 1px solid rgba(112, 224, 0, 0.25);
            max-width: 640px;
            width: 100%;
            padding: 40px;
            text-align: center;
        }
        .confirm-icon {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            background: linear-gradient(135deg, #70e000, #38b000);
            color: #0e2618;
            font-size: 36px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 10px 24px rgba(112, 224, 0, 0.35);
        }
        .confirm-title {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 26px;
            font-weight: 800;
            color: #0e2618;
            margin: 0 0 10px 0;
        }
        .confirm-desc {
            font-size: 15px;
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .confirm-details {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 18px 24px;
            text-align: left;
            margin-bottom: 28px;
            font-size: 14px;
        }
        .confirm-details dl {
            margin: 0;
            display: grid;
            grid-template-columns: 140px 1fr;
            gap: 10px;
        }
        .confirm-details dt {
            font-weight: 700;
            color: #64748b;
        }
        .confirm-details dd {
            margin: 0;
            color: #0f172a;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="confirm-card">
        <div class="confirm-icon"><i class="fas fa-check"></i></div>
        <h1 class="confirm-title">Details Forwarded Successfully!</h1>
        <p class="confirm-desc">
            Thank you, <strong><?php echo htmlspecialchars($fullName); ?></strong>. Your equipment details and technical specifications have been forwarded to <strong><?php echo htmlspecialchars($recipient); ?></strong>. Our application engineering team will review your requirement and connect with you promptly.
        </p>

        <div class="confirm-details">
            <dl>
                <dt>Form Action:</dt>
                <dd><?php echo htmlspecialchars($formType); ?></dd>
                <dt>Mapped Recipient:</dt>
                <dd style="color:#15803d;font-weight:700"><?php echo htmlspecialchars($recipient); ?></dd>
                <dt>Equipment / Model:</dt>
                <dd><?php echo htmlspecialchars($product); ?></dd>
                <dt>Contact Email:</dt>
                <dd><?php echo htmlspecialchars($email); ?></dd>
                <dt>Contact Phone:</dt>
                <dd><?php echo htmlspecialchars($phone); ?></dd>
            </dl>
        </div>

        <a href="<?php echo htmlspecialchars($referrer); ?>" class="aeline-btn-lime" style="display:inline-flex;padding:14px 28px;text-decoration:none">
            <span>Return to Website</span>
            <i class="fas fa-arrow-right"></i>
        </a>
    </div>
</body>
</html>
