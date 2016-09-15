var LazyImg = (function() {

  function init() {
    _lazyLoadImages();
    window.addEventListener('DOMContentLoaded', _lazyLoadImages);
    window.addEventListener('resize', _lazyLoadImages);
    window.addEventListener('scroll', _lazyLoadImages);
    window.addEventListener('carouselmoving', _lazyLoadImages);
  }

  function _isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function _lazyLoadImages() {

    var images = document.querySelectorAll('img[data-src]'),
        item;

    // carga las imagenes que fueron entrando al viewport
    [].forEach.call(images, function (item) {
      if (_isElementInViewport(item)) {
        item.setAttribute('src',item.getAttribute('data-src'));
        item.setAttribute('alt',item.getAttribute('data-alt'));
        item.removeAttribute('data-src');
        item.removeAttribute('data-alt');
        item.addEventListener('load', function() {
          item.setAttribute('class','loaded');
        }, false);
      }
    });

    // si todas las imagenes fueron cargadas remuevo los eventos
    if (images.length === 0) {
      window.removeEventListener('DOMContentLoaded', _lazyLoadImages);
      window.removeEventListener('load', _lazyLoadImages);
      window.removeEventListener('resize', _lazyLoadImages);
      window.removeEventListener('scroll', _lazyLoadImages);
      window.removeEventListener('carouselmoving', _lazyLoadImages);
    }
  }

  return { 
    init: init
  };

})();