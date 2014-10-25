// Generated by CoffeeScript 1.4.0

/**
 * @package        Elections
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
*/


(function() {
  var initialized;

  initialized = false;

  window.init_disqus = function(disqus_identifier) {
    var dsq;
    if (!initialized) {
      window.disqus_identifier = disqus_identifier;
      window.disqus_url = 'https://opir.org/#!' + disqus_identifier;
      dsq = document.createElement('script');
      dsq.type = 'text/javascript';
      dsq.async = true;
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      return initialized = true;
    } else {
      return DISQUS.reset({
        reload: true,
        config: function() {
          this.page.identifier = disqus_identifier;
          return this.page.url = 'https://opir.org/#!' + disqus_identifier;
        }
      });
    }
  };

}).call(this);
