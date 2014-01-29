// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    if (cs.is_guest) {
      $('.cs-home-sign-in').click(function() {
        return $("<div>\n	<div class=\"uk-form\" style=\"width: 600px;margin-left: -300px;\">\n		<a class=\"uk-modal-close uk-close\"></a>\n		<p>\n			<input type=\"text\" id=\"login\" placeholder=\"" + cs.Language.login + "\" autofocus>\n		</p>\n		<p>\n			<input type=\"password\" id=\"password\" placeholder=\"" + cs.Language.password + "\">\n		</p>\n		<p class=\"cs-right\">\n			<button class=\"uk-button\" onclick=\"cs.sign_in($('#login').val(), $('#password').val());\">" + cs.Language.sign_in + "</button>\n		</p>\n	</div>\n</div>").appendTo('body').cs().modal('show').on('uk.modal.hide', function() {
          return $(this).remove();
        });
      });
      return $(document).on('keyup', '#login, #password', function(event) {
        if (event.which === 13) {
          return $(this).parent().parent().find('button').click();
        }
      });
    } else {
      return $('.cs-home-sign-out').click(function() {
        return cs.sign_out();
      });
    }
  });

}).call(this);
