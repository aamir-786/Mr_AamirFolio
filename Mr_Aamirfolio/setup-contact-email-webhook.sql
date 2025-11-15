-- Setup Database Webhook to Send Emails via SMTP
-- This creates a trigger that will send emails when contact messages are inserted

-- Note: Supabase SMTP is configured, but it's primarily for auth emails
-- For contact form emails, you need to use a webhook service or Edge Function

-- Option 1: Create a database function that can be called by webhook
CREATE OR REPLACE FUNCTION notify_contact_message()
RETURNS TRIGGER AS $$
BEGIN
  -- This function will be called when a new contact message is inserted
  -- The actual email sending will be handled by a webhook or Edge Function
  PERFORM pg_notify('contact_message_inserted', json_build_object(
    'id', NEW.id,
    'name', NEW.name,
    'email', NEW.email,
    'subject', NEW.subject,
    'message', NEW.message
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_notify_contact_message ON contact_messages;
CREATE TRIGGER trigger_notify_contact_message
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_message();

-- Note: To actually send emails, you need to:
-- 1. Set up a Database Webhook in Supabase Dashboard
-- 2. Or deploy the Edge Function
-- 3. Or use EmailJS (recommended - already integrated)

