-- Database Trigger to Send Email When Contact Message is Inserted
-- This uses Supabase's configured SMTP to send emails

-- Create a function to send email notification
CREATE OR REPLACE FUNCTION send_contact_email_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- This will trigger Supabase to send email using configured SMTP
  -- The email will be sent to the admin email configured in Supabase settings
  PERFORM
    net.http_post(
      url := current_setting('app.settings.webhook_url', true),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'to', 'aamir.fss22@gmail.com',
        'subject', 'New Contact Form Message: ' || COALESCE(NEW.subject, 'No Subject'),
        'html', format(
          '<h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> %s</p>
          <p><strong>Email:</strong> %s</p>
          <p><strong>Subject:</strong> %s</p>
          <p><strong>Message:</strong></p>
          <p>%s</p>
          <hr>
          <p><small>Sent from your portfolio contact form</small></p>',
          NEW.name,
          NEW.email,
          COALESCE(NEW.subject, 'No Subject'),
          NEW.message
        )
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_send_contact_email ON contact_messages;
CREATE TRIGGER trigger_send_contact_email
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION send_contact_email_notification();

-- Note: The above approach requires Supabase Edge Functions or webhooks
-- For simpler implementation, use EmailJS (already integrated) or
-- configure Supabase Database Webhooks to send emails

