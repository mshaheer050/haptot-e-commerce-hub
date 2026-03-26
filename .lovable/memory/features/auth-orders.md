Customer auth system with Google OAuth (via lovable cloud-auth-js), email/password login, and customer dashboard at /my-account.

## Routes
- /auth → Login/Signup (Google + email)
- /my-account → Customer dashboard (orders, returns, profile)
- /haptot-admin → Admin panel (hardcoded credentials: haptot_admin / haptot@2025)

## Database Tables
- profiles: id (FK auth.users), full_name, phone, address
- orders: id, user_id, order_number, status, items (jsonb), total, shipping_address
- return_requests: id, order_id (FK orders), user_id, reason, request_type, status, admin_notes

## Return Statuses
pending, approved, rejected, waiting_proof

## Order Statuses
processing, shipped, delivered, cancelled, returned

## WhatsApp for video proof
+91 9497809094
