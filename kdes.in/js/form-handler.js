/**
 * K D Engineering Solutions - Form Submission Handler
 * Target Recipient: shiven.k@aol.in
 * Handles:
 * 1. "Send Message Now" (contact.html)
 * 2. "Submit Request" (index.html#quote)
 * 3. "Submit Specification & Request Quote" (product-details*.html)
 */

(function () {
    'use strict';

    var TARGET_EMAIL = 'shiven.k@aol.in';

    document.addEventListener('DOMContentLoaded', function () {
        var forms = document.querySelectorAll('.quote-form-card, form[action*="sendmail.php"]');

        forms.forEach(function (form) {
            // Ensure hidden to_email input exists
            if (!form.querySelector('input[name="to_email"]')) {
                var hiddenEmail = document.createElement('input');
                hiddenEmail.type = 'hidden';
                hiddenEmail.name = 'to_email';
                hiddenEmail.value = TARGET_EMAIL;
                form.appendChild(hiddenEmail);
            }

            form.addEventListener('submit', function (e) {
                var submitBtn = form.querySelector('button[type="submit"]');
                var originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

                // Client-side HTML5 validation
                if (!form.checkValidity()) {
                    return;
                }

                e.preventDefault();

                var formData = new FormData(form);
                var fname = formData.get('fname') || '';
                var lname = formData.get('lname') || '';
                var fullName = (fname + ' ' + lname).trim() || 'Valued Customer';
                var product = formData.get('product') || 'Equipment';
                var email = formData.get('email') || '';
                var phone = formData.get('phone') || '';
                var subject = formData.get('subject') || 'Quote Request';
                var comment = formData.get('c_comment') || '';
                var formType = formData.get('form_type') || 'Website Enquiry';

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending to ' + TARGET_EMAIL + '...</span>';
                }

                fetch(form.getAttribute('action') || 'sendmail.php', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(function (res) {
                    if (!res.ok) {
                        throw new Error('Server response: ' + res.status);
                    }
                    return res.json().catch(function () {
                        return { status: 'success' };
                    });
                })
                .then(function (data) {
                    var mappedTo = (data && data.recipient) ? data.recipient : TARGET_EMAIL;
                    showSuccessModal(fullName, product, email, phone, mappedTo);
                    form.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHtml;
                    }
                })
                .catch(function () {
                    // Fallback: If PHP backend is unreachable (e.g. offline or static server),
                    // allow opening mailto directly to mapped target email
                    var mailtoSubject = encodeURIComponent('[' + formType + '] ' + product + ' - ' + fullName);
                    var mailtoBody = encodeURIComponent(
                        'Full Name: ' + fullName + '\n' +
                        'Email: ' + email + '\n' +
                        'Phone: ' + phone + '\n' +
                        'Product / Model: ' + product + '\n' +
                        'Subject: ' + subject + '\n\n' +
                        'Specifications & Testing Scope:\n' + comment + '\n\n' +
                        '(Submitted via kdes.in targeting ' + TARGET_EMAIL + ')'
                    );
                    var mailtoUrl = 'mailto:' + TARGET_EMAIL + '?subject=' + mailtoSubject + '&body=' + mailtoBody;

                    showFallbackModal(fullName, product, mailtoUrl, form);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHtml;
                    }
                });
            });
        });
    });

    function showSuccessModal(name, product, email, phone, targetEmail) {
        var existing = document.getElementById('kdesSuccessModal');
        if (existing) existing.remove();

        var displayRecipient = targetEmail || TARGET_EMAIL;
        var modal = document.createElement('div');
        modal.id = 'kdesSuccessModal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(8,19,13,0.85);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;animation:kdesFadeIn 0.3s ease;';

        modal.innerHTML = 
            '<div style="background:#ffffff;border-radius:20px;max-width:540px;width:100%;padding:36px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.3);border:2px solid #70e000;font-family:\'Inter\',sans-serif;color:#0e2618;position:relative;">' +
                '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#70e000,#38b000);display:inline-flex;align-items:center;justify-content:center;font-size:32px;color:#0e2618;margin-bottom:18px;box-shadow:0 8px 20px rgba(112,224,0,0.35);">' +
                    '<i class="fas fa-check"></i>' +
                '</div>' +
                '<h2 style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:24px;font-weight:800;color:#0e2618;margin:0 0 10px 0;">Details Forwarded Successfully!</h2>' +
                '<p style="font-size:15px;color:#4b5563;line-height:1.6;margin-bottom:20px;">' +
                    'Thank you, <strong>' + escapeHtml(name) + '</strong>. Your specifications for <strong>' + escapeHtml(product) + '</strong> have been forwarded directly to <strong>' + escapeHtml(displayRecipient) + '</strong>.' +
                '</p>' +
                '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;font-size:13px;text-align:left;color:#334155;margin-bottom:24px;">' +
                    '<div style="display:flex;justify-content:space-between;margin-bottom:6px;"><strong>Mapped Recipient:</strong> <span style="color:#15803d;font-weight:700;">' + escapeHtml(displayRecipient) + '</span></div>' +
                    '<div style="display:flex;justify-content:space-between;margin-bottom:6px;"><strong>Customer Email:</strong> <span>' + escapeHtml(email || 'Provided') + '</span></div>' +
                    '<div style="display:flex;justify-content:space-between;"><strong>Contact Phone:</strong> <span>' + escapeHtml(phone || 'Provided') + '</span></div>' +
                '</div>' +
                '<button id="closeKdesModalBtn" style="background:linear-gradient(135deg,#70e000,#38b000);color:#0e2618;font-weight:700;font-size:15px;padding:12px 32px;border:none;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(112,224,0,0.3);">' +
                    '<span>Continue Browsing</span> <i class="fas fa-arrow-right"></i>' +
                '</button>' +
            '</div>';

        document.body.appendChild(modal);

        document.getElementById('closeKdesModalBtn').addEventListener('click', function () {
            modal.remove();
        });
        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.remove();
        });
    }

    function showFallbackModal(name, product, mailtoUrl, form) {
        var existing = document.getElementById('kdesSuccessModal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'kdesSuccessModal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(8,19,13,0.85);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;';

        modal.innerHTML = 
            '<div style="background:#ffffff;border-radius:20px;max-width:540px;width:100%;padding:36px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.3);border:2px solid #70e000;font-family:\'Inter\',sans-serif;color:#0e2618;">' +
                '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#70e000,#38b000);display:inline-flex;align-items:center;justify-content:center;font-size:32px;color:#0e2618;margin-bottom:18px;">' +
                    '<i class="fas fa-envelope-open-text"></i>' +
                '</div>' +
                '<h2 style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:24px;font-weight:800;color:#0e2618;margin:0 0 10px 0;">Send Details to ' + TARGET_EMAIL + '</h2>' +
                '<p style="font-size:15px;color:#4b5563;line-height:1.6;margin-bottom:20px;">' +
                    'Thank you, <strong>' + escapeHtml(name) + '</strong>. Click below to confirm dispatching your details for <strong>' + escapeHtml(product) + '</strong> directly to <strong>' + TARGET_EMAIL + '</strong>:' +
                '</p>' +
                '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
                    '<a href="' + mailtoUrl + '" style="background:linear-gradient(135deg,#70e000,#38b000);color:#0e2618;font-weight:700;font-size:15px;padding:12px 28px;border-radius:999px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;">' +
                        '<i class="fas fa-paper-plane"></i> <span>Send Email to ' + TARGET_EMAIL + '</span>' +
                    '</a>' +
                    '<button id="closeFallbackBtn" style="background:#f1f5f9;color:#475569;font-weight:600;font-size:14px;padding:12px 20px;border:none;border-radius:999px;cursor:pointer;">' +
                        'Close' +
                    '</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(modal);

        document.getElementById('closeFallbackBtn').addEventListener('click', function () {
            modal.remove();
        });
        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.remove();
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
