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
    var L, map_container, precinct_sidebar, violation_read_more_sidebar;
    if (cs.module !== 'Elections') {
      return;
    }
    map_container = $('#map');
    precinct_sidebar = $('.cs-elections-precinct-sidebar');
    violation_read_more_sidebar = $('.cs-elections-violation-read-more-sidebar');
    L = cs.Language;
    precinct_sidebar.on('click', '.cs-elections-precinct-sidebar-read-more', function() {
      var images, is_open, text, video, violation;
      violation = $(this).data('violation');
      text = violation.text ? "<p>" + violation.text + "</p>" : '';
      images = violation.images.length ? violation.images.map(function(image) {
        return "<img src=\"" + image + "\" alt=\"\">";
      }).join('') : '';
      video = violation.video ? "<iframe src=\"" + violation.video + "\" frameborder=\"0\" scrolling=\"no\"></iframe>" : '';
      is_open = violation_read_more_sidebar.data('open');
      violation_read_more_sidebar.html("<i class=\"cs-elections-violation-read-more-sidebar-close uk-icon-times\"></i>\n" + text + "\n" + images + "\n" + video + "\n<div class=\"cs-elections-violation-feedback\" data-id=\"" + violation.id + "\">\n	<button class=\"not-true\">" + L.not_true + "</button>\n	<button class=\"confirm\">" + L.confirm_violation + "</button>\n</div>").animate({
        width: 320
      }, 'fast').data('open', 1);
      if (!is_open) {
        $('.cs-elections-add-violation-sidebar-close').click();
        return map_container.animate({
          left: '+=320'
        }, 'fast');
      }
    });
    return violation_read_more_sidebar.on('click', '.cs-elections-violation-read-more-sidebar-close', function() {
      if (!violation_read_more_sidebar.data('open')) {
        return;
      }
      violation_read_more_sidebar.animate({
        width: 0
      }, 'fast').data('open', 0);
      return map_container.animate({
        left: '-=320'
      }, 'fast');
    }).on('click', 'img', function() {
      return $("<div>\n	<div style=\"text-align: center; width: 90%;\">\n		" + this.outerHTML + "\n	</div>\n</div>").appendTo('body').cs().modal('show').click(function() {
        return $(this).hide();
      }).on('uk.modal.hide', function() {
        return $(this).remove();
      });
    });
  });

}).call(this);
