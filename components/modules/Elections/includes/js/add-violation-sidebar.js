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
    var L, add_violation, add_violation_button, add_violation_sidebar, details, map_container, precinct_sidebar;
    if (cs.module !== 'Elections') {
      return;
    }
    map_container = $('#map');
    precinct_sidebar = $('.cs-elections-precinct-sidebar');
    add_violation_button = $('.cs-elections-add-violation');
    add_violation_sidebar = $('.cs-elections-add-violation-sidebar');
    L = cs.Language;
    add_violation_button.click(function() {
      var is_open, last_search_value, precincts_search_results, precints_search_timeout;
      if (!cs.is_user) {
        sessionStorage.setItem('action', 'add-violation');
        cs.elections.sign_in();
        return;
      }
      if (precinct_sidebar.data('open')) {
        $('.cs-elections-precinct-sidebar-add-violation').click();
        return;
      }
      is_open = add_violation_sidebar.data('open');
      add_violation_sidebar.html("<i class=\"cs-elections-add-violation-sidebar-close uk-icon-times\"></i>\n<h2>" + L.add_violation + "</h2>\n<input class=\"cs-elections-add-violation-sidebar-search\" type=\"search\" placeholder=\"" + L.number_or_address + "\">\n<div class=\"cs-elections-add-violation-sidebar-search-results\"></div>").animate({
        width: 320
      }, 'fast').data('open', 1);
      if (!is_open) {
        $('.cs-elections-violation-read-more-sidebar-close').click();
        map_container.animate({
          left: '+=320'
        }, 'fast');
        $('.cs-elections-switch-to-map').click();
      }
      $('.cs-elections-switch-to-map').click();
      precints_search_timeout = 0;
      last_search_value = '';
      precincts_search_results = $('.cs-elections-add-violation-sidebar-search-results');
      $('.cs-elections-add-violation-sidebar-search').keydown(function() {
        var $this;
        $this = $(this);
        clearTimeout(precints_search_timeout);
        return precints_search_timeout = setTimeout((function() {
          var value;
          value = $this.val();
          if (value.length < 3) {
            precincts_search_results.html('');
            return;
          }
          if (value === last_search_value) {
            return;
          }
          return $.ajax({
            url: 'api/Precincts/search',
            data: {
              text: value,
              coordinates: JSON.parse(localStorage.getItem('coordinates'))
            },
            type: 'get',
            success: function(precincts) {
              var content, precinct;
              last_search_value = value;
              content = '';
              for (precinct in precincts) {
                precinct = precincts[precinct];
                content += ("<article data-id=\"" + precinct.id + "\">\n<h3>") + L.precint_number(precinct.number) + ("</h3>\n	<p>" + precinct.address + "</p>\n</article>");
              }
              return precincts_search_results.html(content);
            },
            error: function() {
              return precincts_search_results.html(L.no_precincts_found);
            }
          });
        }), 300);
      });
      return precincts_search_results.on('click', 'article', function() {
        var $this, title;
        $this = $(this);
        title = $this.children('h3').html();
        return add_violation($this.data('id'), title);
      });
    });
    if (sessionStorage.getItem('action') === 'add-violation' && cs.is_user) {
      sessionStorage.removeItem('action');
      add_violation_button.click();
    }
    precinct_sidebar.on('click', '.cs-elections-precinct-sidebar-add-violation', function() {
      var $this;
      $this = $(this);
      return add_violation($this.data('id'), precinct_sidebar.children('h2:first').html());
    });
    add_violation = function(precinct, title) {
      var add_image_button, is_open;
      if (!cs.is_user) {
        sessionStorage.setItem('action', 'add-violation-for-precinct');
        sessionStorage.setItem('action-details', JSON.stringify([precinct, title]));
        cs.elections.sign_in();
        return;
      }
      is_open = add_violation_sidebar.data('open');
      add_violation_sidebar.html("<i class=\"cs-elections-add-violation-sidebar-close uk-icon-times\"></i>\n<h2>" + L.add_violation + "</h2>\n<h2>" + title + "</h2>\n<textarea placeholder=\"" + L.violation_text + "\"></textarea>\n<button class=\"cs-elections-add-violation-add-image\">\n	<i class=\"uk-icon-picture-o\"></i>\n	" + L.photo + "\n</button>\n<span>" + L.or + "</span>\n<button class=\"cs-elections-add-violation-add-video\">\n	<i class=\"uk-icon-video-camera\"></i>\n	" + L.video + "\n</button>\n<button class=\"cs-elections-add-violation-add\">" + L.add + "</button>").animate({
        width: 320
      }, 'fast').data('open', 1);
      if (!is_open) {
        $('.cs-elections-violation-read-more-sidebar-close').click();
        map_container.animate({
          left: '+=320'
        }, 'fast');
      }
      add_image_button = $('.cs-elections-add-violation-add-image');
      cs.file_upload(add_image_button, function(files) {
        var file, textarea, _i, _len;
        if (files.length) {
          textarea = add_violation_sidebar.children('textarea');
          for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            textarea.after("<img src=\"" + file + "\" alt=\"\">");
          }
        }
        return cs.elections.loading('hide');
      }, function() {
        return cs.elections.loading('hide');
      }, function() {
        return cs.elections.loading('show');
      }, true);
      $('.cs-elections-add-violation-add-video').click(function() {
        var modal;
        modal = $.cs.simple_modal("<div class=\"cs-elections-add-violation-add-video-modal\">\n	<h2>" + L.video + "</h2>\n	<input placeholder=\"" + L.youtube_or_ustream_video_link + "\">\n	<button>" + L.add + "</button>\n</div>");
        return modal.find('button').click(function() {
          var match, video_url;
          video_url = modal.find('input').val();
          if (match = /ustream.tv\/(channel|embed)\/([0-9]+)/i.exec(video_url)) {
            video_url = "https://www.ustream.tv/embed/" + match[2];
          } else if (match = /ustream.tv\/(recorded|embed\/recorded)\/([0-9]+)/i.exec(video_url)) {
            video_url = "https://www.ustream.tv/embed/recorded/" + match[2];
          } else if (match = /(youtube.com\/embed\/|youtube.com\/watch\?v=)([0-9a-z\-]+)/i.exec(video_url)) {
            video_url = "https://www.youtube.com/embed/" + match[2];
          } else {
            alert(L.bad_link);
            return;
          }
          add_violation_sidebar.find('iframe').remove();
          add_image_button.before("<iframe src=\"" + video_url + "\" frameborder=\"0\" scrolling=\"no\"></iframe>");
          return modal.hide().remove();
        });
      });
      return $('.cs-elections-add-violation-add').click(function() {
        var images, video;
        images = add_violation_sidebar.children('img').map(function() {
          return $(this).attr('src');
        }).get() || [];
        images.reverse();
        video = add_violation_sidebar.children('iframe').attr('src') || '';
        return $.ajax({
          url: "api/Precincts/" + precinct + "/violations",
          data: {
            text: add_violation_sidebar.children('textarea').val(),
            images: images,
            video: video
          },
          type: 'post',
          success: function() {
            alert(L.thank_you_for_your_message);
            cs.elections.open_precinct(precinct);
            return $('.cs-elections-add-violation-sidebar-close').click();
          }
        });
      });
    };
    if (sessionStorage.getItem('action') === 'add-violation-for-precinct' && cs.is_user) {
      sessionStorage.removeItem('action');
      details = JSON.parse(sessionStorage.getItem('action-details'));
      sessionStorage.removeItem('action-details');
      cs.elections.open_precinct(details[0]);
      add_violation(details[0], details[1]);
    }
    return add_violation_sidebar.on('click', '.cs-elections-add-violation-sidebar-close', function() {
      if (!add_violation_sidebar.data('open')) {
        return;
      }
      add_violation_sidebar.animate({
        width: 0
      }, 'fast').data('open', 0);
      return map_container.animate({
        left: '-=320'
      }, 'fast');
    });
  });

}).call(this);
