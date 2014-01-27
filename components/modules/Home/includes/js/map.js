// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var add_zero;
    add_zero = function(input) {
      if (input < 10) {
        return '0' + input;
      } else {
        return input;
      }
    };
    return ymaps.ready(function() {
      var add_events_on_map, clusterer, filter_events, update_events_interval;
      window.map = new ymaps.Map('map', {
        center: [50.45, 30.523611],
        zoom: 13,
        controls: ['typeSelector', 'zoomControl']
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
              offset: [0, 0]
            }, {
              href: '/components/modules/Home/includes/img/cluster-58.png',
              size: [58, 58],
              offset: [0, 0]
            }
          ]
        });
        return cluster;
      };
      map.geoObjects.add(clusterer);
      filter_events = function(events) {
        var category, urgency;
        category = $('.cs-home-filter-category').data('id');
        urgency = $('.cs-home-filter-urgency').data('id');
        return events.filter(function(event) {
          return (!category || category === parseInt(event.category)) && (urgency === 'any' || urgency === event.urgency);
        });
      };
      add_events_on_map = function(events) {
        var category_name, event, placemarks, t, text, time, urgency;
        events = filter_events(events);
        placemarks = [];
        for (event in events) {
          event = events[event];
          category_name = cs.home.categories[event.category];
          t = new Date(event.timeout * 1000);
          time = add_zero(t.getHours()) + ':' + add_zero(t.getMinutes()) + ' ' + add_zero(t.getDate()) + '.' + add_zero(t.getMonth() + 1) + '.' + t.getFullYear();
          urgency = (function() {
            switch (event.urgency) {
              case 'unknown':
                return 0;
              case 'can-wait':
                return 1;
              case 'urgent':
                return 2;
            }
          })();
          time = urgency === 0 ? '' : "<time>Актуально до " + time + "</time>";
          text = event.text.replace(/\n/g, '<br>');
          placemarks.push(new ymaps.Placemark([event.lat, event.lng], {
            hintContent: category_name,
            balloonContentHeader: category_name,
            balloonContentBody: "" + time + "\n<p>" + text + "</p>",
            balloonContentFooter: event.id ? "<button class=\"cs-home-edit\" data-id=\"" + event.id + "\">Редагувати</button> <button onclick=\"cs.home.delete_event(" + event.id + ")\">Видалити</button>" : ''
          }, {
            iconLayout: 'default#image',
            iconImageHref: '/components/modules/Home/includes/img/events.png',
            iconImageSize: [59, 56],
            iconImageOffset: [-24, -56],
            iconImageClipRect: [[59 * urgency, 56 * (event.category - 1)], [59 * (urgency + 1), 56 * event.category]]
          }));
        }
        clusterer.removeAll();
        return clusterer.add(placemarks);
      };
      update_events_interval = 0;
      map.update_events = function(from_cache) {
        if (from_cache == null) {
          from_cache = false;
        }
        clearInterval(update_events_interval);
        if (from_cache && map.update_events.cache) {
          add_events_on_map(map.update_events.cache);
          update_events_interval = setInterval(map.update_events, 60 * 1000);
        } else {
          $.ajax({
            url: 'api/Home/events',
            type: 'get',
            complete: function() {
              return update_events_interval = setInterval(map.update_events, 60 * 1000);
            },
            success: function(events) {
              map.update_events.cache = events;
              add_events_on_map(events);
            }
          });
        }
      };
      map.update_events();
      return cs.home.delete_event = function(id) {
        if (!confirm('Точно видалити?')) {
          return;
        }
        $.ajax({
          url: "api/Home/events/" + id,
          type: 'delete',
          success: function() {
            map.update_events();
          }
        });
      };
    });
  });

}).call(this);
