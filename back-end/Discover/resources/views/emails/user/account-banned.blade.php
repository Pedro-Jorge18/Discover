@component('mail::message')
# Account Suspended

Hello {{ $user->name }},

We regret to inform you that your account has been suspended effective immediately.

**Reason for Suspension:**
{{ $reason }}

During this suspension:
- You will not be able to access your account
- All account functionalities are temporarily disabled
- Any active sessions have been terminated

If you believe this suspension is a mistake, or if you would like to appeal this decision, please contact our support team at support@discover.com.

Thank you for your understanding.

Sincerely,
**The Discover Team**
@endcomponent
