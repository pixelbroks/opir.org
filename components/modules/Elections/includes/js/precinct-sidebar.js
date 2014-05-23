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
    var L, add_stream, add_violation_sidebar, map_container, precinct, precinct_sidebar, precincts_search_results;
    if (cs.module !== 'Elections') {
      return;
    }
    map_container = $('#map');
    precincts_search_results = $('.cs-elections-precincts-search-results');
    precinct_sidebar = $('.cs-elections-precinct-sidebar');
    add_violation_sidebar = $('.cs-elections-add-violation-sidebar');
    L = cs.Language;
    precincts_search_results.on('click', '[data-id]', function() {
      return cs.elections.open_precinct(parseInt($(this).data('id')));
    });
    window.cs.elections = window.cs.elections || {};
    window.cs.elections.open_precinct = function(id) {
      return $.ajax({
        url: "api/Precincts/" + id,
        type: 'get',
        data: null,
        success: function(precinct) {
          var is_open, streams_container, violations_container;
          is_open = precinct_sidebar.data('open');
          precinct_sidebar.html("<i class=\"cs-elections-precinct-sidebar-close uk-icon-times\"></i>\n<h2>" + L.precint_number(precinct.number) + ("</h2>\n<p>" + L.district + " " + precinct.district + "</p>\n<p class=\"cs-elections-precinct-sidebar-address\">\n	<i class=\"uk-icon-location-arrow\"></i>\n	<span>" + precinct.address + "</span>\n</p>\n<h2>\n	<button class=\"cs-elections-precinct-sidebar-add-stream uk-icon-plus\" data-id=\"" + precinct.id + "\"></button>\n	" + L.video_stream + "\n</h2>\n<div class=\"cs-elections-precinct-sidebar-streams\">\n	<i class=\"uk-icon-spinner uk-icon-spin\"></i>\n</div>\n<h2>\n	<button class=\"cs-elections-precinct-sidebar-add-violation uk-icon-plus\" data-id=\"" + precinct.id + "\"></button>\n	" + L.violations + "\n</h2>\n<section class=\"cs-elections-precinct-sidebar-violations\">\n	<i class=\"uk-icon-spinner uk-icon-spin\"></i>\n</section>")).animate({
            width: 320
          }, 'fast').data('open', 1);
          if (!is_open) {
            add_violation_sidebar.animate({
              left: '+=320'
            }, 'fast');
            map_container.animate({
              left: '+=320'
            }, 'fast');
          }
          streams_container = $('.cs-elections-precinct-sidebar-streams');
          $.ajax({
            url: "api/Precincts/" + id + "/streams",
            type: 'get',
            data: null,
            success: function(streams) {
              var content, stream, _i, _len;
              content = '';
              for (_i = 0, _len = streams.length; _i < _len; _i++) {
                stream = streams[_i];
                content += "<iframe src=\"" + stream.stream_url + "\" frameborder=\"0\" scrolling=\"no\"></iframe>";
              }
              if (content) {
                return streams_container.html(content);
              } else {
                return streams_container.html("<p class=\"uk-text-center\">" + L.empty + "</p>");
              }
            },
            error: function() {
              return streams_container.html("<p class=\"uk-text-center\">" + L.empty + "</p>");
            }
          });
          violations_container = $('.cs-elections-precinct-sidebar-violations');
          $.ajax({
            url: "api/Precincts/" + id + "/violations",
            type: 'get',
            data: null,
            success: function(violations) {
              var content, images, text, video, violation, _i, _j, _len, _len1, _results;
              content = '';
              for (_i = 0, _len = violations.length; _i < _len; _i++) {
                violation = violations[_i];
                text = violation.text ? "<p>" + violation.text.substr(0, 200) + "</p>" : '';
                images = violation.images.length ? "<img src=\"" + violation.images[0] + "\" alt=\"\">" : '';
                video = violation.video ? "<iframe src=\"" + violation.video + "\" frameborder=\"0\" scrolling=\"no\"></iframe>" : '';
                content += "<article>\n	" + text + "\n	" + images + "\n	" + video + "\n	<div class=\"cs-elections-precinct-sidebar-read-more\" data-id=\"" + violation.id + "\">" + L.read_more + " »</div>\n</article>";
              }
              if (content) {
                violations_container.html(content);
                _results = [];
                for (_j = 0, _len1 = violations.length; _j < _len1; _j++) {
                  violation = violations[_j];
                  _results.push($(".cs-elections-precinct-sidebar-read-more[data-id=" + violation.id + "]").data('violation', violation));
                }
                return _results;
              } else {
                return violations_container.html("<p class=\"uk-text-center\">" + L.empty + "</p>");
              }
            },
            error: function() {
              return violations_container.html("<p class=\"uk-text-center\">" + L.empty + "</p>");
            }
          });
          return violations_container.on('click', 'img', function() {
            return $("<div>\n	<div style=\"text-align: center; width: 90%;\">\n		" + this.outerHTML + "\n	</div>\n</div>").appendTo('body').cs().modal('show').click(function() {
              return $(this).hide();
            }).on('uk.modal.hide', function() {
              return $(this).remove();
            });
          });
        }
      });
    };
    precinct_sidebar.on('click', '.cs-elections-precinct-sidebar-close', function() {
      if (!precinct_sidebar.data('open')) {
        return;
      }
      $('.cs-elections-violation-read-more-sidebar-close').click();
      precinct_sidebar.animate({
        width: 0
      }, 'fast').data('open', 0);
      add_violation_sidebar.animate({
        left: '-=320'
      }, 'fast');
      return map_container.animate({
        left: '-=320'
      }, 'fast');
    }).on('click', '.cs-elections-precinct-sidebar-add-stream', function() {
      return add_stream($(this).data('id'));
    });
    add_stream = function(precinct) {
      var modal;
      if (!cs.is_user) {
        sessionStorage.setItem('action', 'add-stream-for-precinct');
        sessionStorage.setItem('action-details', precinct);
        cs.elections.sign_in();
        return;
      }
      modal = $.cs.simple_modal("<div class=\"cs-elections-precinct-sidebar-add-stream-modal\">\n	<h2>" + L.stream + "</h2>\n	<input placeholder=\"" + L.youtube_or_ustream_stream_link + "\">\n	<button>" + L.add + "</button>\n</div>");
      return modal.find('button').click(function() {
        var match, stream_url;
        stream_url = modal.find('input').val();
        if (match = /ustream.tv\/(channel|embed)\/([0-9]+)/i.exec(stream_url)) {
          stream_url = "https://www.ustream.tv/embed/" + match[2];
        } else if (match = /(youtube.com\/embed\/|youtube.com\/watch\?v=)([0-9a-z\-]+)/i.exec(stream_url)) {
          stream_url = "https://www.youtube.com/embed/" + match[2];
        } else {
          alert(L.bad_link);
          return;
        }
        $.ajax({
          url: "api/Precincts/" + precinct + "/streams",
          data: {
            stream_url: stream_url
          },
          type: 'post',
          success: function() {
            alert(L.thank_you_for_your_stream);
            return cs.elections.open_precinct(precinct);
          }
        });
        return modal.hide().remove();
      });
    };
    if (sessionStorage.getItem('action') === 'add-stream-for-precinct' && cs.is_user) {
      sessionStorage.removeItem('action');
      precinct = sessionStorage.getItem('action-details');
      sessionStorage.removeItem('action-details');
      cs.elections.open_precinct(precinct);
      return add_stream(precinct);
    }
  });

}).call(this);
