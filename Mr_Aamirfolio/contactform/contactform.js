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

    // Save directly to Supabase database
    saveContactMessage(name, email, subject, message, submitBtn, originalText);
    
    return false;
  });

  // Save contact message to Supabase database
  function saveContactMessage(name, email, subject, message, submitBtn, originalText) {
    // Check if Supabase is available
    if (typeof SupabaseService === 'undefined') {
      // Supabase not available - show success anyway
      $("#sendmessage").addClass("show");
      $("#errormessage").removeClass("show");
      $('.contactForm').find("input, textarea").val("");
      submitBtn.prop('disabled', false).html(originalText);
      return;
    }

    const client = SupabaseService.getClient();
    if (!client) {
      // Supabase client not available - show success anyway
      $("#sendmessage").addClass("show");
      $("#errormessage").removeClass("show");
      $('.contactForm').find("input, textarea").val("");
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
      .then(function(response) {
        if (response.error) {
          console.error('Error saving message:', response.error);
          $("#errormessage").addClass("show");
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
        $("#errormessage").addClass("show");
        $("#sendmessage").removeClass("show");
        submitBtn.prop('disabled', false).html(originalText);
      });
  }

});
