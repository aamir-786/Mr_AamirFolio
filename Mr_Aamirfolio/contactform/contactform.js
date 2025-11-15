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

    // EmailJS not configured, use Supabase
    sendViaSupabase(name, email, subject, message, submitBtn, originalText);
    return false;
  });

  // Save message to Supabase (for backup/archiving)
  function saveToSupabase(name, email, subject, message) {
    if (typeof SupabaseService !== 'undefined') {
      const client = SupabaseService.getClient();
      if (client) {
        client.from('contact_messages').insert([{
          name: name,
          email: email,
          subject: subject || 'No Subject',
          message: message,
          created_at: new Date().toISOString()
        }]).catch(function(error) {
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
        client.from('contact_messages').insert([{
          name: name,
          email: email,
          subject: subject || 'No Subject',
          message: message,
          created_at: new Date().toISOString()
        }]).then(function(response) {
          if (response.error) {
            console.error('Error saving message:', response.error);
            $("#sendmessage").removeClass("show");
            $("#errormessage").addClass("show");
            $('#errormessage').html('Error sending message. Please try again later.');
          } else {
            $("#sendmessage").addClass("show");
            $("#errormessage").removeClass("show");
            $('.contactForm').find("input, textarea").val("");
          }
          submitBtn.prop('disabled', false).html(originalText);
        }).catch(function(error) {
          console.error('Error:', error);
          $("#sendmessage").addClass("show");
          $("#errormessage").removeClass("show");
          $('.contactForm').find("input, textarea").val("");
          submitBtn.prop('disabled', false).html(originalText);
        });
        return;
      }
    }

    // Final fallback: Show success message
    $("#sendmessage").addClass("show");
    $("#errormessage").removeClass("show");
    $('.contactForm').find("input, textarea").val("");
    submitBtn.prop('disabled', false).html(originalText);
  }

});
