// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var map_container, panel;
    map_container = $('#map');
    panel = $('.cs-home-settings-panel');
    $('.cs-home-settings').click(function() {
      map_container.animate({
        right: (panel.css('display') !== 'none' ? 0 : 310) + 'px'
      }, 'fast', function() {
        return map.container.fitToViewport();
      });
      return $('.cs-home-settings-panel').toggle('fast');
    });
    $('.cs-home-filter-category [data-id]').click(function() {
      var $this;
      $this = $(this);
      $('.cs-home-filter-category').data('id', $this.data('id'));
      $this.parentsUntil('[data-uk-dropdown]').prev().find('span:last').html($this.find('a').text());
      return map.update_events(true);
    });
    return $('.cs-home-filter-urgency [data-id]').click(function() {
      var $this;
      $this = $(this);
      $('.cs-home-filter-urgency').data('id', $this.data('id'));
      $this.parentsUntil('[data-uk-dropdown]').prev().find('span:last').html($this.find('a').text());
      return map.update_events(true);
    });
  });

}).call(this);
