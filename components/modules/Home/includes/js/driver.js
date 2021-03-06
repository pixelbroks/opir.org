// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var _ref;
    if (!((_ref = cs.home) != null ? _ref.automaidan : void 0)) {
      return;
    }
    return ymaps.ready(function() {
      var add_zero, init;
      add_zero = function(input) {
        if (input < 10) {
          return '0' + input;
        } else {
          return input;
        }
      };
      return init = setInterval((function() {
        var check_assignment, driving_point, driving_route, event_coords, location_updating, my_location;
        if (!window.map) {
          return;
        }
        clearInterval(init);
        my_location = null;
        driving_point = null;
        driving_route = null;
        event_coords = null;
        if (navigator.geolocation) {
          location_updating = function() {
            return navigator.geolocation.getCurrentPosition(function(position) {
              my_location && map.geoObjects.remove(my_location);
              my_location = new ymaps.Placemark([position.coords.latitude, position.coords.longitude], {
                hintContent: 'Тут знаходитесь ви'
              }, {
                iconLayout: 'default#image',
                iconImageHref: '/components/modules/Home/includes/img/driver.png',
                iconImageSize: [40, 38],
                iconImageOffset: [-16, -38],
                iconImageClipRect: [[0, 0], [40, 0]]
              });
              map.geoObjects.add(my_location);
              if (driving_route) {
                ymaps.route([my_location.geometry.getCoordinates(), event_coords], {
                  avoidTrafficJams: true
                }).then(function(route) {
                  driving_route = route;
                  route.getWayPoints().removeAll();
                  return map.geoObjects.add(route);
                });
              }
              return $.ajax({
                url: 'api/Home/driver_location',
                type: 'put',
                data: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                },
                complete: function() {
                  return setTimeout(location_updating, 2 * 1000);
                }
              });
            }, function() {
              setTimeout(location_updating, 2 * 1000);
              return alert('Не вдалось отримати доступ до вашого місцеположення');
            }, {
              enableHighAccuracy: true,
              timeout: 30 * 1000
            });
          };
          setTimeout(location_updating, 0);
        } else {
          setTimeout(location_updating, 2 * 1000);
          alert('Дозвольте доступ до вашого місцеположення, це потрібно диспетчеру');
        }
        check_assignment = function() {
          if (driving_point || !my_location) {
            setTimeout(check_assignment, 100);
            return;
          }
          return $.ajax({
            url: "api/Home/events/check",
            type: 'get',
            complete: function() {
              return setTimeout(check_assignment, 3000);
            },
            success: function(event) {
              var category_name, img, t, text, time;
              category_name = cs.home.categories[event.category].name;
              t = new Date(event.timeout * 1000);
              time = add_zero(t.getHours()) + ':' + add_zero(t.getMinutes()) + ' ' + add_zero(t.getDate()) + '.' + add_zero(t.getMonth() + 1) + '.' + t.getFullYear();
              time = event.timeout > 0 ? "<time>Актуально до " + time + "</time>" : '';
              text = event.text.replace(/\n/g, '<br>');
              text = text ? "<p>" + text + "</p>" : '';
              img = event.img ? "<p><img height=\"240\" width=\"260\" src=\"" + event.img + "\" alt=\"\"></p>" : '';
              driving_point && map.geoObjects.remove(driving_point);
              driving_point = new ymaps.Placemark([event.lat, event.lng], {
                hintContent: category_name,
                balloonContentHeader: category_name,
                balloonContentBody: "" + time + "\n" + img + "\n" + text,
                balloonContentFooter: "<p><b>Координатор просить вас приїхати сюди і підтвердити подію коли будете на місці</b></p>\n<button class=\"cs-home-check-confirm\" data-id=\"" + event.id + "\">Підтвердити подію</button> <button class=\"cs-home-check-refuse\" data-id=\"" + event.id + "\">Відмовитись</button>"
              }, {
                iconLayout: 'default#image',
                iconImageHref: '/components/modules/Home/includes/img/events.png',
                iconImageSize: [59, 56],
                iconImageOffset: [-24, -56],
                iconImageClipRect: [[59, 56 * (event.category - 1)], [59 * 2, 56 * event.category]]
              });
              event_coords = [event.lat, event.lng];
              ymaps.route([my_location.geometry.getCoordinates(), event_coords], {
                avoidTrafficJams: true,
                mapStateAutoApply: true
              }).then(function(route) {
                driving_route = route;
                route.getWayPoints().removeAll();
                return map.geoObjects.add(route);
              });
              map.geoObjects.add(driving_point);
              return driving_point.balloon.open();
            },
            error: function() {}
          });
        };
        setTimeout(check_assignment, 0);
        $('#map').on('click', '.cs-home-check-confirm', function() {
          return $.ajax({
            url: 'api/Home/events/' + $(this).data('id') + '/check',
            type: 'put',
            success: function() {
              driving_point && map.geoObjects.remove(driving_point);
              driving_point = null;
              driving_route && map.geoObjects.remove(driving_route);
              driving_route = null;
              return alert('Підтвердження отримано, дякуємо вам!');
            }
          });
        }).on('click', '.cs-home-check-refuse', function() {
          return $.ajax({
            url: 'api/Home/events/' + $(this).data('id') + '/check',
            type: 'delete',
            success: function() {
              driving_point && map.geoObjects.remove(driving_point);
              driving_point = null;
              driving_route && map.geoObjects.remove(driving_route);
              driving_route = null;
              return alert('Запит на підтвердження відхилено');
            }
          });
        });
      }), 100);
    });
  });

}).call(this);
