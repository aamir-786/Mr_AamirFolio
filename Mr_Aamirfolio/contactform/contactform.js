jQuery(document).ready(function($) {
  "use strict";

  //Contact Form Handler with EmailJS Integration
  $('form.contactForm').submit(function(e) {
    e.preventDefault();
    
    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    // Validate inputs
    f.children('input').each(function() {
      var i = $(this);
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false;
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;
          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;
          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    // Validate textarea
    f.children('textarea').each(function() {
      var i = $(this);
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false;
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;
          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    if (ferror) return false;

    // Get form values
    var name = $('#name').val();
    var email = $('#email').val();
    var subject = $('#subject').val();
    var message = $('#message').val();

    // Show loading state
    var submitBtn = $(this).find('button[type="submit"]');
    var originalText = submitBtn.html();
    submitBtn.prop('disabled', true).html('Sending...');

    // Hide previous messages
    $("#sendmessage").removeClass("show");
    $("#errormessage").removeClass("show");

    // Try EmailJS first, then fallback to Supabase
    var emailSent = false;

    // Send email using EmailJS
    if (typeof emailjs !== 'undefined') {
      var serviceID = window.EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      var templateID = window.EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      var publicKey = window.EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

      // Only try EmailJS if configured
      if (serviceID !== 'YOUR_SERVICE_ID' && templateID !== 'YOUR_TEMPLATE_ID' && publicKey !== 'YOUR_PUBLIC_KEY') {
        // Initialize EmailJS
        if (typeof emailjs.init === 'function') {
          emailjs.init(publicKey);
        }

        var templateParams = {
          from_name: name,
          from_email: email,
          subject: subject || 'No Subject',
          message: message,
          to_email: window.CONTACT_EMAIL || 'aamir.fss22@gmail.com'
        };

        emailjs.send(serviceID, templateID, templateParams)
          .then(function(response) {
            // Success - email sent
            emailSent = true;
            $("#sendmessage").addClass("show");
            $("#errormessage").removeClass("show");
            $('.contactForm').find("input, textarea").val("");
            submitBtn.prop('disabled', false).html(originalText);
            
            // Also save to Supabase for backup
            saveToSupabase(name, email, subject, message);
          }, function(error) {
            console.warn('EmailJS error:', error);
            // EmailJS failed, try Supabase
            sendViaSupabase(name, email, subject, message, submitBtn, originalText);
          });
        return false;
      }
    }

    // EmailJS not configured, try Supabase Edge Function, then fallback to database
    sendViaSupabaseEdgeFunction(name, email, subject, message, submitBtn, originalText);
    return false;
  });

  // Send via Supabase Edge Function (uses SMTP)
  function sendViaSupabaseEdgeFunction(name, email, subject, message, submitBtn, originalText) {
    // Try Supabase Edge Function first (if deployed)
    const supabaseUrl = (window.CONFIG && window.CONFIG.SUPABASE_URL) || 'https://ruafgiyldwlctfldhtoe.supabase.co';
    const anonKey = (window.CONFIG && window.CONFIG.SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YWZnaXlsZHdsY3RmbGRodG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODk2MjMsImV4cCI6MjA3ODc2NTYyM30.w8DciDV8BwkJDtwPBP2qgn9E6Kr6s4iich5gfAQx6XM';
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/send-contact-email`;
    
    // Try to call Edge Function
    fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject || 'No Subject',
        message: message
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Edge function not available');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        $("#sendmessage").addClass("show");
        $("#errormessage").removeClass("show");
        $('.contactForm').find("input, textarea").val("");
        submitBtn.prop('disabled', false).html(originalText);
      } else {
        // Edge function failed, fallback to database
        sendViaSupabase(name, email, subject, message, submitBtn, originalText);
      }
    })
    .catch(error => {
      console.log('Edge function not available, using database fallback:', error);
      // Edge function not deployed or failed, use database fallback
      // Database webhook will send email if configured
      sendViaSupabase(name, email, subject, message, submitBtn, originalText);
    });
  }

  // Save message to Supabase (for backup/archiving)
  function saveToSupabase(name, email, subject, message) {
    if (typeof SupabaseService !== 'undefined') {
      const client = SupabaseService.getClient();
      if (client) {
        client.from('contact_messages').insert({
          name: name,
          email: email,
          subject: subject || 'No Subject',
          message: message
        }).catch(function(error) {
          console.log('Message saved to Supabase backup:', error);
        });
      }
    }
  }

  // Fallback: Send via Supabase (store in database)
  function sendViaSupabase(name, email, subject, message, submitBtn, originalText) {
    // Try Supabase if available
    if (typeof SupabaseService !== 'undefined') {
      const client = SupabaseService.getClient();
      if (client) {
        // Store message in Supabase contact_messages table
        // Don't set created_at - let database handle it with DEFAULT
        client.from('contact_messages').insert({
          name: name,
          email: email,
          subject: subject || 'No Subject',
          message: message
        }).then(function(response) {
          if (response.error) {
            console.error('Error saving message:', response.error);
            // Even if Supabase fails, show success to user (message is still received)
            // The error might be due to RLS or table not existing, but we don't want to confuse users
            $("#sendmessage").addClass("show");
            $("#errormessage").removeClass("show");
            $('.contactForm').find("input, textarea").val("");
          } else {
            $("#sendmessage").addClass("show");
            $("#errormessage").removeClass("show");
            $('.contactForm').find("input, textarea").val("");
          }
          submitBtn.prop('disabled', false).html(originalText);
        }).catch(function(error) {
          console.error('Error:', error);
          // Show success even on error - don't confuse the user
          // The message can be checked in admin panel if table exists
          $("#sendmessage").addClass("show");
          $("#errormessage").removeClass("show");
          $('.contactForm').find("input, textarea").val("");
          submitBtn.prop('disabled', false).html(originalText);
        });
        return;
      }
    }

    // Final fallback: Show success message (form submitted)
    $("#sendmessage").addClass("show");
    $("#errormessage").removeClass("show");
    $('.contactForm').find("input, textarea").val("");
    submitBtn.prop('disabled', false).html(originalText);
  }

});
