<?php
/**
 * K D Engineering Solutions - Enquiry & Quote Email Handler
 * Recipient: kdes2017@gmail.com
 */

header('X-Content-Type-Options: nosniff');

// Target recipient
$recipient = 'kdes2017@gmail.com';

// Verify POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method Not Allowed. This endpoint only accepts POST requests.";
    exit;
}

// Helper to sanitize text
function clean_input($data) {
    if (is_null($data)) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    // Remove header injection carriage returns/line breaks
    return str_replace(array("\r", "\n"), ' ', $data);
}

// Helper for multi-line textarea input
function clean_textarea($data) {
    if (is_null($data)) return '';
    $data = trim($data);
    $data = stripslashes($data);
    return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
}

// Extract and clean submitted data
$fname     = isset($_POST['fname']) ? clean_input($_POST['fname']) : '';
$lname     = isset($_POST['lname']) ? clean_input($_POST['lname']) : '';
$fullName  = trim($fname . ' ' . $lname);
if (empty($fullName)) {
    $fullName = 'Valued Customer';
}

$email     = isset($_POST['email']) ? trim($_POST['email']) : '';
$email     = filter_var($email, FILTER_SANITIZE_EMAIL);

$phone     = isset($_POST['phone']) ? clean_input($_POST['phone']) : 'Not provided';
$product   = isset($_POST['product']) ? clean_input($_POST['product']) : 'General Equipment / Not Selected';
$subject   = isset($_POST['subject']) ? clean_input($_POST['subject']) : 'Equipment Specification & Quote Request';
$comment   = isset($_POST['c_comment']) ? clean_textarea($_POST['c_comment']) : 'No specific message details provided.';
$formType  = isset($_POST['form_type']) ? clean_input($_POST['form_type']) : 'Website Enquiry';

$referrer  = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'kdes.in';
$userIP    = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'Unknown IP';
$dateStr   = date('d M Y, h:i A (T)');

// Email Subject
$mailSubject = "[KDES Website Enquiry] " . $formType . " - " . $product . " (" . $fullName . ")";

// HTML Email Body
$htmlMessage = '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Website Enquiry</title>
</head>
<body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;background-color:#f4f7f5;color:#1e293b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr style="background:#0e2618;">
            <td style="padding:28px 32px;border-bottom:3px solid #70e000;">
                <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">K D ENGINEERING SOLUTIONS</div>
                <div style="font-size:13px;color:#a3e635;margin-top:4px;font-weight:600;">NEW CUSTOMER ENQUIRY &bull; ' . htmlspecialchars($formType) . '</div>
            </td>
        </tr>
        
        <!-- Notice -->
        <tr>
            <td style="padding:24px 32px 12px 32px;background:#f0fdf4;border-bottom:1px solid #bbf7d0;">
                <p style="margin:0;font-size:14px;color:#166534;line-height:1.5;">
                    A customer submitted equipment details on <strong>kdes.in</strong> targeting <strong>' . htmlspecialchars($recipient) . '</strong>. Complete information is itemized below:
                </p>
            </td>
        </tr>

        <!-- Table Details -->
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
                </table>

                <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:8px;font-size:12px;color:#64748b;">
                    <strong>Submission Metadata:</strong><br>
                    Time: ' . $dateStr . '<br>
                    Page: ' . htmlspecialchars($referrer) . '<br>
                    IP: ' . htmlspecialchars($userIP) . '
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr style="background:#0e2618;color:#94a3b8;font-size:12px;">
            <td style="padding:16px 32px;text-align:center;">
                &copy; ' . date('Y') . ' K D Engineering Solutions &bull; kdes.in &bull; Delivered to ' . $recipient . '
            </td>
        </tr>
    </table>
</body>
</html>';

// Email Headers
$headers = array();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: K D Engineering Solutions <no-reply@kdes.in>';
if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . $fullName . ' <' . $email . '>';
}
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Send Email
$mailSuccess = @mail($recipient, $mailSubject, $htmlMessage, implode("\r\n", $headers));

// Check if request is AJAX
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

if ($isAjax) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(array(
        'status' => 'success',
        'message' => 'Thank you! Your details have been successfully sent to ' . $recipient . '. Our engineering team will review and contact you promptly.',
        'recipient' => $recipient,
        'product' => $product
    ));
    exit;
}

// Standalone confirmation page for standard browser POST submissions
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Details Sent Successfully - K D Engineering Solutions</title>
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
            max-width: 620px;
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
        <h1 class="confirm-title">Request Received Successfully!</h1>
        <p class="confirm-desc">
            Thank you, <strong><?php echo htmlspecialchars($fullName); ?></strong>. Your equipment details and technical specifications have been forwarded to <strong><?php echo htmlspecialchars($recipient); ?></strong>. Our engineering team will review your requirement and connect with you promptly.
        </p>

        <div class="confirm-details">
            <dl>
                <dt>Form Action:</dt>
                <dd><?php echo htmlspecialchars($formType); ?></dd>
                <dt>Recipient:</dt>
                <dd><?php echo htmlspecialchars($recipient); ?></dd>
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
