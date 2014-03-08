// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    if (cs.module !== 'Home') {
      return;
    }
    return $(document).on('click', '.cs-home-social-links > *', function() {
      var $this, content, id, image, link, params, parent, title;
      $this = $(this);
      parent = $this.parent();
      id = parent.data('id');
      title = parent.parent().find('h2:first').text();
      content = parent.prev().text().replace(/\n/g, ' ');
      content = content.replace(/\t/g, '');
      link = $('base').attr('href') + id;
      params = 'location=no,width=500,height=400,resizable=no,status=no';
      image = parent.parent().find('img:first');
      image = image.length ? image.prop('src') : '';
      if ($this.hasClass('vk')) {
        return window.open('https://vk.com/share.php?url=' + link + '&title=' + title + '&description=' + content + (image ? '&image=' + image : ''), 'share_opir.org', params);
      } else if ($this.hasClass('fb')) {
        return window.open('https://www.facebook.com/sharer/sharer.php?src=sp&u=' + link + '&t=' + title + '&description=' + content + (image ? '&image=' + image : ''), 'share_opir.org', params);
      } else if ($this.hasClass('tw')) {
        return window.open('https://twitter.com/intent/tweet?status=' + link + ' ' + title + ' ' + content, 'share_opir.org', params);
      }
    });
  });

}).call(this);
