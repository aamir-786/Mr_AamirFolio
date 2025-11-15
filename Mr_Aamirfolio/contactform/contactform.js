jQuery(document).ready(function($) {
  "use strict";

  // Contact Form Handler - Save to Database Only
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
            if (i.val() === '' || !i.val().trim()) {
              ferror = ierror = true;
            }
            break;
          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
          case 'email':
            if (i.val() === '' || !i.val().trim()) {
              ferror = ierror = true;
            } else if (!emailExp.test(i.val())) {
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
            if (i.val() === '' || !i.val().trim()) {
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

    // Save directly to Supabase database
    saveContactMessage(name, email, subject, message, submitBtn, originalText);
    
    return false;
  });

  // Save contact message to Supabase database
  function saveContactMessage(name, email, subject, message, submitBtn, originalText) {
    // Get Supabase client - use public/anonymous client for contact form
    let client = null;
    
    // Try to get public client (anon key) - contact form should work without authentication
    if (typeof supabase !== 'undefined') {
      const supabaseUrl = (window.CONFIG && window.CONFIG.SUPABASE_URL) || 'https://ruafgiyldwlctfldhtoe.supabase.co';
      const anonKey = (window.CONFIG && window.CONFIG.SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YWZnaXlsZHdsY3RmbGRodG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODk2MjMsImV4cCI6MjA3ODc2NTYyM30.w8DciDV8BwkJDtwPBP2qgn9E6Kr6s4iich5gfAQx6XM';
      client = supabase.createClient(supabaseUrl, anonKey);
    }
    
    // Fallback to SupabaseService if available
    if (!client && typeof SupabaseService !== 'undefined') {
      client = SupabaseService.getClient();
    }
    
    if (!client) {
      // Supabase client not available - show error
      console.error('Supabase client not available');
      $("#errormessage").html('Error: Unable to connect to server. Please try again later.').addClass("show");
      $("#sendmessage").removeClass("show");
      submitBtn.prop('disabled', false).html(originalText);
      return;
    }

    // Prepare data for insertion
    const insertData = {
      name: (name || '').trim(),
      email: (email || '').trim(),
      message: (message || '').trim()
    };
    
    // Subject can be null if not provided
    if (subject && subject.trim()) {
      insertData.subject = subject.trim();
    } else {
      insertData.subject = null;
    }
    
    // Validate required fields
    if (!insertData.name || !insertData.email || !insertData.message) {
      $("#errormessage").addClass("show");
      $("#sendmessage").removeClass("show");
      submitBtn.prop('disabled', false).html(originalText);
      return;
    }
    
    // Insert into database
    client.from('contact_messages').insert(insertData)
      .select()
      .then(function(response) {
        if (response.error) {
          console.error('Error saving message:', response.error);
          let errorMsg = 'Error: ' + (response.error.message || 'Failed to send message.');
          
          // Check if it's an RLS error
          if (response.error.message && response.error.message.includes('row-level security')) {
            errorMsg += '<br><br><strong>Database Setup Required:</strong><br>';
            errorMsg += 'Run FIX-CONTACT-FORM.sql in Supabase SQL Editor';
          }
          
          $("#errormessage").html(errorMsg).addClass("show");
          $("#sendmessage").removeClass("show");
          submitBtn.prop('disabled', false).html(originalText);
        } else {
          // Success - show success message
          $("#sendmessage").addClass("show");
          $("#errormessage").removeClass("show");
          $('.contactForm').find("input, textarea").val("");
          submitBtn.prop('disabled', false).html(originalText);
        }
      })
      .catch(function(error) {
        console.error('Error saving to database:', error);
        let errorMsg = 'Error: ' + (error.message || 'Failed to send message.');
        
        // Check if it's an RLS error
        if (error.message && error.message.includes('row-level security')) {
          errorMsg += '<br><br><strong>Database Setup Required:</strong><br>';
          errorMsg += 'Run FIX-CONTACT-FORM.sql in Supabase SQL Editor';
        }
        
        $("#errormessage").html(errorMsg).addClass("show");
        $("#sendmessage").removeClass("show");
        submitBtn.prop('disabled', false).html(originalText);
      });
  }

});
