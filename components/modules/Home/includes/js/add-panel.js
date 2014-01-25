// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var addition_editing_panel, category, coords, event_coords, map_cursor, panel, put_events_coords, timeout, timeout_interval, urgency, visible;
    panel = $('.cs-home-add-panel');
    category = 0;
    visible = 2;
    urgency = 'urgent';
    timeout_interval = 60;
    timeout = 15 * timeout_interval;
    coords = [0, 0];
    event_coords = null;
    put_events_coords = false;
    map_cursor = null;
    $(document).on('click', '.cs-home-add, .cs-home-add-close', function() {
      category = 0;
      visible = 2;
      urgency = 'urgent';
      timeout_interval = 60;
      timeout = 15 * timeout_interval;
      coords = [0, 0];
      event_coords && map.geoObjects.remove(event_coords);
      event_coords = null;
      map_cursor && map_cursor.remove();
      map_cursor = null;
      put_events_coords = false;
      return panel.html('').toggle('fast', function() {
        var content, _ref;
        if (panel.css('display') !== 'none') {
          content = '';
          _ref = cs.home.categories;
          for (category in _ref) {
            category = _ref[category];
            content += "<li data-id=\"" + category.id + "\">\n	<img src=\"/components/modules/Home/includes/img/" + category.id + ".png\" alt=\"\">\n	<span>" + category.name + "</span>\n</li>";
          }
          return panel.html("<ul>" + content + "</ul>");
        }
      });
    });
    (function() {
      var map_init;
      map_init = setInterval((function() {
        if (!window.map || !map.events) {
          return;
        }
        clearInterval(map_init);
        map.events.add('click', function(e) {
          if (!put_events_coords) {
            return;
          }
          coords = e.get('coords');
          event_coords && map.geoObjects.remove(event_coords);
          event_coords = new ymaps.Placemark(coords, {}, {
            draggable: true,
            iconLayout: 'default#image',
            iconImageHref: '/components/modules/Home/includes/img/new-event.png',
            iconImageSize: [91, 86],
            iconImageOffset: [-36, -86]
          });
          map.geoObjects.add(event_coords);
          return event_coords.events.add('geometrychange', function(e) {
            return coords = e.get('originalEvent').originalEvent.newCoordinates;
          });
        });
      }), 100);
    })();
    addition_editing_panel = function() {
      var content, name;
      category = $(this).data('id');
      name = $(this).find('span').text();
      content = ("<h2>" + name + "</h2>\n<textarea placeholder=\"Коментар\"></textarea>\n<div data-uk-dropdown=\"{mode:'click'}\" class=\"uk-button-dropdown\">\n	<button type=\"button\" class=\"uk-button\">\n		<span class=\"uk-icon-caret-down\"></span> <span>Моїй групі активістів</span>\n	</button>\n	<div class=\"uk-dropdown\">\n		<ul class=\"cs-home-add-visible uk-nav uk-nav-dropdown\">\n			<li class=\"uk-nav-header\">Кому відображати</li>\n			<li data-id=\"2\">\n				<a>Моїй групі активістів</a>\n			</li>") + "<li data-id=\"0\">\n				<a>Всім</a>\n			</li>\n		</ul>\n	</div>\n</div>\n<div data-uk-dropdown=\"{mode:'click'}\" class=\"uk-button-dropdown\">\n	<button type=\"button\" class=\"uk-button\">\n		<span class=\"uk-icon-caret-down\"></span> <span>Терміново</span>\n	</button>\n	<div class=\"uk-dropdown\">\n		<ul class=\"cs-home-add-urgency uk-nav uk-nav-dropdown\">\n			<li class=\"uk-nav-header\">Терміновість</li>\n			<li data-id=\"urgent\">\n				<a>Терміново</a>\n			</li>\n			<li data-id=\"can-wait\">\n				<a>Може почекати</a>\n			</li>\n			<li data-id=\"unknown\">\n				<a>Не вказано</a>\n			</li>\n		</ul>\n	</div>\n</div>\n<h3 class=\"cs-home-actuality-control\">Актуально протягом</h3>\n<div class=\"cs-home-actuality-control\">\n	<input class=\"cs-home-add-time\" type=\"number\" min=\"1\" value=\"15\"/>\n	<div data-uk-dropdown=\"{mode:'click'}\" class=\"uk-button-dropdown\">\n		<button type=\"button\" class=\"uk-button\">\n			<span class=\"uk-icon-caret-down\"></span> <span>Хвилин</span>\n		</button>\n		<div class=\"uk-dropdown\">\n			<ul class=\"cs-home-add-time-interval uk-nav uk-nav-dropdown\">\n				<li class=\"uk-nav-header\">Одиниці часу</li>\n				<li data-id=\"60\">\n					<a>Хвилин</a>\n				</li>\n				<li data-id=\"3600\">\n					<a>Годин</a>\n				</li>\n				<li data-id=\"86400\">\n					<a>Днів</a>\n				</li>\n			</ul>\n		</div>\n	</div>\n</div>\n<div class=\"cs-home-add-location\">\n	<span>Вказати на карті</span>\n</div>\n<div>\n	<button class=\"cs-home-add-close\"></button>\n	<button class=\"cs-home-add-process\">Додати</button>\n</div>";
      return panel.html(content);
    };
    panel.on('click', '> ul > li', addition_editing_panel).on('click', '.cs-home-add-visible [data-id]', function() {
      var $this;
      $this = $(this);
      visible = $this.data('id');
      return $this.parentsUntil('[data-uk-dropdown]').prev().find('span:last').html($this.find('a').text());
    }).on('click', '.cs-home-add-urgency [data-id]', function() {
      var $this;
      $this = $(this);
      urgency = $this.data('id');
      if (urgency === 'unknown') {
        $('.cs-home-actuality-control').hide('fast');
      } else {
        $('.cs-home-actuality-control').show('fast');
      }
      return $this.parentsUntil('[data-uk-dropdown]').prev().find('span:last').html($this.find('a').text());
    }).on('click', '.cs-home-add-time-interval [data-id]', function() {
      var $this;
      $this = $(this);
      timeout_interval = $this.data('id');
      timeout = $('.cs-home-add-time').val() * timeout_interval;
      return $this.parentsUntil('[data-uk-dropdown]').prev().find('span:last').html($this.find('a').text());
    }).on('change', '.cs-home-add-time', function() {
      var $this;
      $this = $(this);
      timeout = timeout_interval * $this.val();
      return $this.parentsUntil('[data-uk-dropdown]').prev().find('span:last').html($this.find('a').text());
    }).on('click', '.cs-home-add-location', function() {
      if (event_coords) {
        return;
      }
      put_events_coords = true;
      map_cursor = map.cursors.push('pointer');
      return alert('Клікніть місце з подією на карті');
    }).on('click', '.cs-home-add-process', function() {
      var comment;
      comment = panel.find('textarea').val();
      if (category && timeout && coords[0] && coords[1] && urgency) {
        return $.ajax({
          url: 'api/Home/events',
          type: 'post',
          data: {
            category: category,
            timeout: timeout,
            lat: coords[0],
            lng: coords[1],
            visible: visible,
            text: comment,
            urgency: urgency
          },
          success: function() {
            panel.hide('fast');
            map.geoObjects.remove(event_coords);
            event_coords = null;
            put_events_coords = false;
            map_cursor.remove();
            map.update_events();
            return alert('Успішно додано, дякуємо вам!');
          }
        });
      } else {
        return alert('Вкажіть точку на карті');
      }
    });
    return $('#map').on('click', '.cs-home-edit', addition_editing_panel);
  });

}).call(this);
