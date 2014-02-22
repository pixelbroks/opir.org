// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    if (cs.module !== 'Home') {
      return;
    }
    return ymaps.ready(function() {
      var add_events_on_map, add_zero, balloon_footer, clusterer, events_stream_panel, filter_events, focus_map_timer, icons_shape, placemarks, refresh_delay, stop_updating, streaming_opened;
      refresh_delay = cs.home.automaidan_coord ? 10 : 10;
      streaming_opened = false;
      stop_updating = false;
      add_zero = function(input) {
        if (input < 10) {
          return '0' + input;
        } else {
          return input;
        }
      };
      placemarks = [];
      window.map = new ymaps.Map('map', {
        center: [50.45, 30.523611],
        zoom: 13,
        controls: ['typeSelector', 'zoomControl', 'fullscreenControl', 'rulerControl', 'trafficControl']
      });
      clusterer = new ymaps.Clusterer();
      clusterer.createCluster = function(center, geoObjects) {
        var cluster;
        cluster = ymaps.Clusterer.prototype.createCluster.call(this, center, geoObjects);
        cluster.options.set({
          icons: [
            {
              href: '/components/modules/Home/includes/img/cluster-46.png',
              size: [46, 46],
              offset: [-23, -23]
            }, {
              href: '/components/modules/Home/includes/img/cluster-58.png',
              size: [58, 58],
              offset: [-27, -27]
            }
          ]
        });
        return cluster;
      };
      map.geoObjects.add(clusterer);
      filter_events = function(events) {
        var categories;
        categories = $('.cs-home-filter-category .active');
        return events.filter(function(event) {
          return !categories.length || categories.filter("[data-id=" + event.category + "]").length;
        });
      };
      events_stream_panel = $('.cs-home-events-stream-panel');
      placemarks = [];
      icons_shape = new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([[[23 - 24, 56 - 58], [44 - 24, 34 - 58], [47 - 24, 23 - 58], [45 - 24, 14 - 58], [40 - 24, 7 - 58], [29 - 24, 0 - 58], [17 - 24, 0 - 58], [7 - 24, 6 - 58], [0 - 24, 18 - 58], [0 - 24, 28 - 58], [4 - 24, 36 - 58], [23 - 24, 56 - 58]]]));
      add_events_on_map = function(events) {
        var a, added, bounds, category_name, event, events_stream_panel_content, img, is_streaming, new_pixel_coords, old_pixel_coords, placemark_id, t, text, timeout;
        if (stop_updating) {
          return;
        }
        events = filter_events(events);
        placemarks = [];
        events_stream_panel_content = '';
        for (event in events) {
          event = events[event];
          if (streaming_opened) {
            if (streaming_opened.unique_id === event.id) {
              old_pixel_coords = map.options.get('projection').fromGlobalPixels(streaming_opened.geometry.getCoordinates(), map.getZoom());
              new_pixel_coords = map.options.get('projection').fromGlobalPixels([event.lat, event.lng], map.getZoom());
              $('.ymaps-balloon').animate({
                left: '+=' + (new_pixel_coords[0] - old_pixel_coords[0]),
                top: '+=' + (new_pixel_coords[1] - old_pixel_coords[1])
              });
              streaming_opened.geometry.setCoordinates([event.lat, event.lng]);
              bounds = map.getBounds();
              map.panTo([parseFloat(event.lat) - (bounds[0][0] - bounds[1][0]) / 4, parseFloat(event.lng)]);
              return;
            }
            continue;
          }
          category_name = cs.home.categories[event.category].name;
          t = new Date(event.timeout * 1000);
          timeout = add_zero(t.getHours()) + ':' + add_zero(t.getMinutes()) + ' ' + add_zero(t.getDate()) + '.' + add_zero(t.getMonth() + 1) + '.' + t.getFullYear();
          timeout = event.timeout > 0 ? "<time>Актуально до " + timeout + "</time>" : '';
          a = new Date(event.added * 1000);
          added = add_zero(a.getHours()) + ':' + add_zero(a.getMinutes()) + ' ' + add_zero(a.getDate()) + '.' + add_zero(a.getMonth() + 1) + '.' + a.getFullYear();
          added = "<time>Додано " + added + "</time>";
          text = event.text.replace(/\n/g, '<br>');
          is_streaming = false;
          if (text && text.substr(0, 7) === 'stream:') {
            timeout = '';
            is_streaming = true;
            text = text.substr(7);
            text = "<p><iframe width=\"260\" height=\"240\" src=\"" + text + "\" frameborder=\"0\" scrolling=\"no\"></iframe></p>";
          } else {
            text = text ? "<p>" + text + "</p>" : '';
          }
          img = event.img ? "<p><img height=\"240\" width=\"260\" src=\"" + event.img + "\" alt=\"\"></p>" : '';
          event.confirmed = parseInt(event.confirmed);
          placemarks.push(new ymaps.Placemark([event.lat, event.lng], {
            hintContent: category_name,
            balloonContentHeader: category_name,
            balloonContentBody: "" + added + "\n" + timeout + "\n" + img + "\n" + text,
            balloonContentFooter: balloon_footer(event, is_streaming)
          }, {
            iconLayout: 'default#image',
            iconImageHref: '/components/modules/Home/includes/img/events.png',
            iconImageSize: [59, 56],
            iconImageOffset: [-24, -56],
            iconImageClipRect: [[59 * (1 - event.confirmed), 56 * (event.category - 1)], [59 * (2 - event.confirmed), 56 * event.category]],
            iconImageShape: icons_shape
          }));
          placemark_id = placemarks.length - 1;
          events_stream_panel_content += "<li data-location=\"" + event.lat + "," + event.lng + "\" data-placemark=\"" + placemark_id + "\">\n	<img src=\"/components/modules/Home/includes/img/" + event.category + ".png\" alt=\"\">\n	<h2>" + category_name + "</span></h2>\n	<br>\n	" + added + "\n	" + timeout + "\n	" + img + "\n	" + text + "\n</li>";
          if (is_streaming) {
            (function(event) {
              var placemark;
              placemark = placemarks[placemarks.length - 1];
              placemark.unique_id = event.id;
              placemark.balloon.events.add('open', function() {
                streaming_opened = placemark;
                refresh_delay = 10;
                return map.update_events();
              }).add('close', function() {
                streaming_opened = false;
                refresh_delay = 60;
                return map.update_events(true);
              });
            })(event);
          } else {
            (function(event) {
              var placemark;
              placemark = placemarks[placemarks.length - 1];
              placemark.balloon.events.add('open', function() {
                stop_updating = true;
              }).add('close', function() {
                stop_updating = false;
              });
            })(event);
          }
        }
        events_stream_panel.html("<h2>Ефір подій</h2><ul>" + events_stream_panel_content + "</ul>");
        placemarks.push(new ymaps.Placemark([50.615181, 30.475790], {
          hintContent: 'Золотий унітаз',
          balloonContentHeader: 'Золотий унітаз',
          balloonContentBody: "<img src=\"/components/modules/Home/includes/img/yanukovych.jpg\">"
        }, {
          iconLayout: 'default#image',
          iconImageHref: '/components/modules/Home/includes/img/golden-toilet.png',
          iconImageSize: [59, 56],
          iconImageOffset: [-24, -56],
          iconImageShape: icons_shape
        }));
        placemarks.push(new ymaps.Placemark([50.449573, 30.525336], {
          hintContent: 'Меморіал пам’яті за загиблими',
          balloonContentHeader: 'Меморіал пам’яті за загиблими'
        }, {
          iconLayout: 'default#image',
          iconImageHref: '/components/modules/Home/includes/img/cross.png',
          iconImageSize: [59, 56],
          iconImageOffset: [-24, -56],
          iconImageShape: icons_shape
        }));
        clusterer.removeAll();
        clusterer.add(placemarks);
        if (!window.golden_shown && location.hash === '#golden-toilet') {
          window.golden_shown = true;
          return map.panTo([50.615181, 30.475790]).then(function() {
            return map.zoomRange.get([50.615181, 30.475790]).then(function(zoomRange) {
              return map.setZoom(zoomRange[1], {
                duration: 500
              });
            });
          });
        }
      };
      balloon_footer = function(event, is_streaming) {
        var confirmation;
        if (cs.home.automaidan_coord) {
          if (!parseInt(event.assigned_to)) {
            return "<button class=\"cs-home-check-assign\" data-id=\"" + event.id + "\">Відправити водія для перевірки</button>";
          } else {
            return '';
          }
        } else if (!cs.home.automaidan && event.user && !is_streaming) {
          confirmation = !event.confirmed ? "<button class=\"cs-home-check-confirm\" data-id=\"" + event.id + "\">Підтвердити подію</button>" : '';
          return "" + confirmation + "<button class=\"cs-home-edit\" data-id=\"" + event.id + "\">Редагувати</button> <button onclick=\"cs.home.delete_event(" + event.id + ")\">Видалити</button>";
        } else {
          return '';
        }
      };
      map.update_events = function(from_cache) {
        if (from_cache == null) {
          from_cache = false;
        }
        if (from_cache && map.update_events.cache) {
          add_events_on_map(map.update_events.cache);
          setTimeout(map.update_events, refresh_delay * 1000);
        } else {
          $.ajax({
            url: 'api/Home/events',
            type: 'get',
            success: function(events) {
              map.update_events.cache = events;
              add_events_on_map(events);
              setTimeout(map.update_events, refresh_delay * 1000);
            },
            error: function() {
              return setTimeout(map.update_events, refresh_delay * 1000);
            }
          });
        }
      };
      map.update_events();
      cs.home.delete_event = function(id) {
        if (!confirm('Точно видалити?')) {
          return;
        }
        $.ajax({
          url: "api/Home/events/" + id,
          type: 'delete',
          success: function() {
            map.update_events();
            map.balloon.close();
            alert('Успішно видалено');
          }
        });
      };
      focus_map_timer = 0;
      events_stream_panel.on('mousemove', 'li', function() {
        var $this;
        $this = $(this);
        clearTimeout(focus_map_timer);
        return focus_map_timer = setTimeout((function() {
          var location;
          location = $this.data('location').split(',');
          location = [parseFloat(location[0]), parseFloat(location[1])];
          return map.panTo(location).then(function() {
            return map.zoomRange.get(location).then(function(zoomRange) {
              return map.setZoom(zoomRange[1], {
                duration: 500
              });
            });
          });
        }), 500);
      }).on('mouseleave', 'li', function() {
        return clearTimeout(focus_map_timer);
      }).on('click', 'li', function() {
        var placemark, state;
        placemark = placemarks[$(this).data('placemark')];
        state = clusterer.getObjectState(placemark);
        if (state.isClustered) {
          state.cluster.state.set('activeObject', placemark);
          return state.cluster.events.fire('click');
        } else {
          return placemark.balloon.open();
        }
      });
      if (!cs.home.automaidan) {
        return $('#map').on('click', '.cs-home-check-confirm', function() {
          return $.ajax({
            url: 'api/Home/events/' + $(this).data('id') + '/check',
            type: 'put',
            success: function() {
              map.update_events();
              map.balloon.close();
              return alert('Підтвердження отримано, дякуємо вам!');
            }
          });
        });
      }
    });
  });

}).call(this);
