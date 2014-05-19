// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var L, map_container, precinct_sidebar, search_results, show_timeout;
    if (cs.module !== 'Elections') {
      return;
    }
    map_container = $('#map');
    search_results = $('.cs-elections-precincts-search-results');
    precinct_sidebar = $('.cs-elections-precinct-sidebar');
    show_timeout = 0;
    L = cs.Language;
    search_results.on('mouseenter', '[data-id]', function() {
      var $this;
      clearTimeout(show_timeout);
      $this = $(this);
      return show_timeout = setTimeout((function() {
        var id, precinct, _ref;
        id = parseInt($this.data('id'));
        _ref = JSON.parse(localStorage.getItem('precincts'));
        for (precinct in _ref) {
          precinct = _ref[precinct];
          if (precinct.id === id) {
            break;
          }
        }
        return map.panTo([precinct.lat, precinct.lng]).then(function() {
          return map.zoomRange.get([precinct.lat, precinct.lng]).then(function(zoomRange) {
            return map.setZoom(zoomRange[1], {
              duration: 500
            });
          });
        });
      }), 200);
    }).on('mouseleave', '[data-id]', function() {
      return clearTimeout(show_timeout);
    }).on('click', '[data-id]', function() {
      var $this, id, precinct, streams_container, violations_container, _ref;
      $this = $(this);
      id = parseInt($this.data('id'));
      _ref = JSON.parse(localStorage.getItem('precincts'));
      for (precinct in _ref) {
        precinct = _ref[precinct];
        if (precinct.id === id) {
          break;
        }
      }
      precinct_sidebar.html("<i class=\"cs-elections-precinct-sidebar-close uk-icon-times\"></i>\n<h2>" + L.precint_number(precinct.number) + "</h2>\n<p>" + $this.children('p').html() + ("</p>\n<h2>" + L.video_stream + "</h2>\n<div class=\"cs-elections-precinct-sidebar-streams\">\n	<i class=\"uk-icon-spinner uk-icon-spin\"></i>\n</div>\n<h2>" + L.violations + "</h2>\n<section class=\"cs-elections-precinct-sidebar-violations\">\n	<i class=\"uk-icon-spinner uk-icon-spin\"></i>\n</section>")).animate({
        width: 320
      }, 'fast');
      map_container.animate({
        left: 320
      }, 'fast');
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
            return streams_container.hide().prev().hide();
          }
        },
        error: function() {
          return streams_container.hide().prev().hide();
        }
      });
      violations_container = $('.cs-elections-precinct-sidebar-violations');
      return $.ajax({
        url: "api/Precincts/" + id + "/violations",
        type: 'get',
        data: null,
        success: function(violations) {
          var content, images, text, video, violation, _i, _len;
          content = '';
          for (_i = 0, _len = violations.length; _i < _len; _i++) {
            violation = violations[_i];
            text = violation.text ? "<p>" + violation.text.substr(0, 200) + "</p>" : '';
            images = violation.images.length ? "<img src=\"" + violation.images[0] + "\">" : '';
            video = violation.video ? "<iframe src=\"" + violation.video + "\" frameborder=\"0\" scrolling=\"no\"></iframe>" : '';
            content += "<article>\n	" + text + "\n	" + images + "\n	" + video + "\n</article>";
          }
          if (content) {
            return violations_container.html(content);
          } else {
            return violations_container.html("<p class=\"uk-text-center\">" + L.empty + "</p>");
          }
        },
        error: function() {
          return violations_container.html("<p class=\"uk-text-center\">" + L.empty + "</p>");
        }
      });
    });
    return precinct_sidebar.on('click', '.cs-elections-precinct-sidebar-close', function() {
      precinct_sidebar.animate({
        width: 0
      }, 'fast');
      return map_container.animate({
        left: 0
      }, 'fast');
    });
  });

}).call(this);
