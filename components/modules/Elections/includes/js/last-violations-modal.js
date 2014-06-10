// Generated by CoffeeScript 1.4.0

/**
 * @package        Elections
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
*/


(function() {

  $(function() {
    var L, last_violations_panel;
    if (cs.module !== 'Elections') {
      return;
    }
    last_violations_panel = $('.cs-elections-last-violations-panel');
    L = cs.Language;
    return last_violations_panel.on('click', 'article[data-id]', function(e) {
      var article, id, modal, title;
      if ($(e.target).is('h3, span, img, iframe, div')) {
        return;
      }
      article = $(this);
      id = article.data('id');
      title = L.violation_number(id);
      return modal = $("<section data-modal-frameless class=\"cs-elections-last-violations-modal\">\n	<article data-id=\"\">\n		<header>\n			<a class=\"uk-modal-close uk-close\"></a>\n			<nav>\n				<a class=\"uk-icon-chevron-left prev\"></a>\n				" + title + "\n				<a class=\"uk-icon-chevron-right next\"></a></nav>\n		</header>\n		" + article[0].innerHTML + "\n	</article>\n</section>").appendTo('body').cs().modal('show').on('uk.modal.hide', function() {
        return $(this).remove();
      }).on('click', 'article[data-id] h3 span', function() {
        var precinct;
        modal.cs().modal('hide');
        cs.elections.open_precinct(id);
        precinct = cs.elections.get_precincts()[id];
        return map.panTo([precinct.lat, precinct.lng]).then(function() {
          return map.zoomRange.get([precinct.lat, precinct.lng]).then(function(zoomRange) {
            return map.setZoom(zoomRange[1], {
              duration: 500
            });
          });
        });
      }).on('click', '.prev, .next', function() {
        var opened_article;
        opened_article = last_violations_panel.find("article[data-id=" + id + "]");
        if ($(this).is('.prev')) {
          return opened_article.prev().click();
        } else {
          return opened_article.next().click();
        }
      });
    });
  });

}).call(this);
