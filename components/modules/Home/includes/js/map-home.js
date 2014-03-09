// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    if (cs.module !== 'Home') {
      return;
    }
    return ymaps.ready(function() {
      var add_events_on_map, add_zero, balloon_footer, clusterer, events_stream_panel, filter_events, focus_map_timer, icons_shape, map_moving, modal_opened, open_modal_commenting, placemarks, refresh_delay, stop_updating, streaming_opened;
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
        zoom: 12,
        controls: ['typeSelector', 'zoomControl', 'fullscreenControl', 'rulerControl', 'trafficControl']
      }, {
        avoidFractionalZoom: false
      });
      map.setBounds([[44.02462975216294, 21.777120521484335], [52.82663432351663, 40.32204239648433]], {
        preciseZoom: true
      });
      map.balloon.events.add('open', function() {
        stop_updating = true;
      }).add('close', function() {
        stop_updating = false;
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
        var categories, tags;
        categories = $('.cs-home-filter-category .active');
        tags = $('.cs-home-added-tags [data-id]');
        if (tags.length) {
          tags = tags.map(function() {
            return $(this).data('id');
          }).get();
        }
        return events.filter(function(event) {
          var tag, _i, _len;
          if (categories.length && !categories.filter("[data-id=" + event.category + "]").length) {
            return false;
          }
          if (!tags.length) {
            return events;
          }
          for (_i = 0, _len = tags.length; _i < _len; _i++) {
            tag = tags[_i];
            if (event.tags.indexOf(String(tag)) > -1) {
              return true;
            }
          }
          return false;
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
            if (/youtube/.test(text)) {
              text += '?wmode=transparent';
            }
            text = "<p><iframe width=\"400\" height=\"240\" src=\"" + text + "\" frameborder=\"0\" scrolling=\"no\"></iframe></p>";
          } else {
            text = text ? "<p>" + text + "</p>" : '';
          }
          img = event.img ? "<p><img height=\"240\" width=\"260\" src=\"" + event.img + "\" alt=\"\"></p>" : '';
          event.confirmed = parseInt(event.confirmed);
          placemarks.push(new ymaps.Placemark([event.lat, event.lng], {
            event_id: event.id,
            hintContent: category_name,
            balloonContentHeader: category_name,
            balloonContentBody: "<div>\n	" + added + "<br>\n	" + timeout + "\n	" + img + "\n	" + text + "\n</div>\n<div class=\"cs-home-social-links\" data-id=\"" + event.id + "\">\n	<a class=\"fb uk-icon-facebook\"></a>\n	<a class=\"vk uk-icon-vk\"></a>\n	<a class=\"tw uk-icon-twitter\"></a>\n</div>\n<button onclick=\"cs.home.commenting(" + event.id + ")\" class=\"uk-icon-comment\" data-uk-tooltip title=\"Коментувати\"></button>",
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
          events_stream_panel_content += "<li data-location=\"" + event.lat + "," + event.lng + "\" data-placemark=\"" + placemark_id + "\">\n	<img src=\"/components/modules/Home/includes/img/" + event.category + ".png\" alt=\"\">\n	<h2>" + category_name + "</h2>\n	<br>\n	<div>\n		" + added + "<br>\n		" + timeout + "\n		" + img + "\n		" + text + "\n	</div>\n	<div class=\"cs-home-social-links\" data-id=\"" + event.id + "\">\n		<a class=\"fb uk-icon-facebook\"></a>\n		<a class=\"vk uk-icon-vk\"></a>\n		<a class=\"tw uk-icon-twitter\"></a>\n	</div>\n	<button onclick=\"cs.home.commenting(" + event.id + ")\" class=\"uk-icon-comment\" data-uk-tooltip title=\"Коментувати\"></button>\n</li>";
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
          map.panTo([50.615181, 30.475790]).then(function() {
            return map.zoomRange.get([50.615181, 30.475790]).then(function(zoomRange) {
              return map.setZoom(zoomRange[1], {
                duration: 500
              });
            });
          });
        }
        if (!window.event_shown) {
          return (function() {
            window.event_shown = true;
            return open_modal_commenting();
          })();
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
      cs.home.commenting = function(id) {
        history.pushState(null, null, id);
        return open_modal_commenting();
      };
      modal_opened = false;
      window.addEventListener('popstate', function() {
        if (modal_opened) {
          return false;
        }
        return open_modal_commenting();
      });
      focus_map_timer = 0;
      map_moving = false;
      events_stream_panel.on('mousemove', 'li', function() {
        var $this;
        map_moving = true;
        $this = $(this);
        clearTimeout(focus_map_timer);
        return focus_map_timer = setTimeout((function() {
          var location;
          location = $this.data('location').split(',');
          location = [parseFloat(location[0]), parseFloat(location[1])];
          return map.panTo(location).then(function() {
            return map.zoomRange.get(location).then(function(zoomRange) {
              map_moving = false;
              return map.setZoom(zoomRange[1], {
                duration: 500
              });
            });
          });
        }), 500);
      }).on('mouseleave', 'li', function() {
        return clearTimeout(focus_map_timer);
      }).on('click', 'li', function() {
        var action, interval, placemark;
        placemark = placemarks[$(this).data('placemark')];
        action = function() {
          var state;
          if (map_moving) {
            return;
          }
          clearInterval(interval);
          state = clusterer.getObjectState(placemark);
          if (state.isClustered) {
            state.cluster.state.set('activeObject', placemark);
            return state.cluster.events.fire('click');
          } else {
            return placemark.balloon.open();
          }
        };
        if (map_moving) {
          return interval = setInterval(action, 100);
        } else {
          return action();
        }
      });
      if (!cs.home.automaidan) {
        $('#map').on('click', '.cs-home-check-confirm', function() {
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
      return open_modal_commenting = function() {
        var content, i, id, placemark, title, _i, _len;
        if (/\/[0-9]+/.test(location.pathname)) {
          modal_opened = true;
          id = parseInt(location.pathname.substr(1));
          window.disqus_shortname = 'opirorg';
          window.disqus_identifier = 'Events/' + id;
          for (_i = 0, _len = placemarks.length; _i < _len; _i++) {
            i = placemarks[_i];
            if (parseInt(i.properties.get('event_id')) === id) {
              placemark = i;
              break;
            }
          }
          if (!placemark) {
            $.cs.simple_modal('<h3 class="cs-center">Подія більше не актуальна</h3>', false, 400);
            return;
          }
          (function(c) {
            c[0] = parseFloat(c[0]);
            c[1] = parseFloat(c[1]);
            return map.panTo(c).then(function() {
              return map.zoomRange.get(c).then(function(zoomRange) {
                return map.setZoom(zoomRange[1], {
                  duration: 500
                }).then(function() {
                  var state;
                  state = clusterer.getObjectState(placemark);
                  if (state.isClustered) {
                    state.cluster.state.set('activeObject', placemark);
                    state.cluster.events.once('click', function() {
                      if (state.isClustered) {
                        state.cluster.state.set('activeObject', placemark);
                        return state.cluster.events.fire('click');
                      } else {
                        return placemark.balloon.open();
                      }
                    });
                    return state.cluster.events.fire('click');
                  } else {
                    return placemark.balloon.open();
                  }
                });
              });
            });
          })(placemark.geometry.getCoordinates());
          title = placemark.properties.get('balloonContentHeader');
          content = placemark.properties.get('balloonContentBody');
          $.cs.simple_modal("<h1>" + title + "</h1>\n" + content + "\n<div id=\"disqus_thread\"></div>", true, 800).on('uk.modal.hide', function() {
            modal_opened = false;
            return history.pushState(null, null, '/');
          });
          $('#disqus_thread').prev('button').remove();
          init_disqus();
          return false;
        } else {
          return true;
        }
      };
    });
  });

}).call(this);
