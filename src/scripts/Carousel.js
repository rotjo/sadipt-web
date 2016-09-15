var Carousel = (function() {

  //defino variables privadas
  //A futuro pasar como parametro el nodo HTML de un carousel
  var cardsContainer   = document.getElementById('carouselItemsContainer');
  var moveLeft        = document.getElementById('carouselMoveLeft');
  var moveRight       = document.getElementById('carouselMoveRight');
  var controls         = document.getElementById('carouselControls');
  var pos              = 0;
  var cardWidth        = 0;
  var cardsNum         = 0;
  var lim              = 0;
  var containerWidth   = 0;
  var startPosition    = 0;     // start position mousedown event
  var currentPosition  = 0;     // count current translateX value
  var distancePosition = 0;     // count distance between "down" & "move" event
  var isMouseDown      = false; // check if mouse is down or not
  var needForRAF       = true;  // to prevent redundant rAF calls

  //funcion privada de inicializacion del carrusel
  function init() {

    //si tiene tarjetas
    if(cardsContainer.children) {
      var cardMargin = parseInt(getComputedStyle(cardsContainer.children[0].children[0], null).getPropertyValue('margin').split(' ')[1].split('px')[0]);
      cardsNum = cardsContainer.children.length;
      cardWidth = cardsContainer.children[0].offsetWidth + cardMargin*2;
      //siempre centrado
      distancePosition = (((cardsNum/2)*cardWidth)-(window.innerWidth/2))*-1;
      containerWidth = cardWidth * cardsNum;
      //pongo el carrusel en la mitad
      _moveCarousel();

      if(containerWidth > window.innerWidth) {
        addEvents();
      }
    }

  }

  function _refresh() {
    distancePosition = (((cardsNum/2)*cardWidth)-(window.innerWidth/2))*-1;
    _moveCarousel();
  }

  function addEvents() {
    //adhiero los eventos a los botones de control
    moveLeft.addEventListener('click', function() {
      lim = _carouselLimits();
      _clickCarousel('left');
    }, false);

    moveRight.addEventListener('click', function() {
      lim = _carouselLimits();
      _clickCarousel('right');
    }, false);

    cardsContainer.addEventListener('mousedown', function() {
      event.preventDefault(); // reset default behavior
      lim = _carouselLimits();
      cardsContainer.classList.add('is-dragging');
      isMouseDown     = true;
      currentPosition = _getTranslateX(); // get current translateX value
      startPosition   = event.clientX;       // get position X
    }, false);

    cardsContainer.addEventListener('mouseup', function() {
      event.preventDefault();
      cardsContainer.classList.remove('is-dragging');
      isMouseDown = false; // reset mouse is down boolean
    }, false);

    cardsContainer.addEventListener('mousemove', function() {
      _touchCarousel();
    }, false);

    cardsContainer.addEventListener('touchstart', function() {
      lim = _carouselLimits();
      currentPosition = _getTranslateX(); // get current translateX value
      startPosition   = event.touches[0].clientX;       // get position X
    }, false);

    cardsContainer.addEventListener('touchmove', function() {
      cardsContainer.classList.add('is-dragging');
      isMouseDown     = true;
      _touchCarousel();
    }, false);
  }

  //funcion que sabe que hacer cuando se hace click en las flechas de control
  function _clickCarousel(direction) {
    currentPosition = _getTranslateX(); // get current translateX value
    switch(direction){
      case 'left':

            moveRight.style.opacity = '1';
            moveRight.style.pointerEvents = 'all';

            if(currentPosition + cardWidth >= lim.rightLimit) {
              //cuando esta al tope izquierdo oculto el boton de ese mismo lado
              moveLeft.style.opacity = '0';
              moveLeft.style.pointerEvents = 'none';
            }

            distancePosition = currentPosition + cardWidth;
            _moveCarousel();

            break;
      case 'right':

            moveLeft.style.opacity = '1';
            moveLeft.style.pointerEvents = 'all';

            if(currentPosition - cardWidth <= lim.leftLimit) {
              //cuando esta al tope derecho oculto el boton de ese mismo lado
              moveRight.style.opacity = '0';
              moveRight.style.pointerEvents = 'none';
            }

            distancePosition = currentPosition - cardWidth;
            _moveCarousel();

            break;
    }
  }

  function _carouselLimits() {

    var ww = window.innerWidth;
    var limits = {};
    var bounds = Math.abs(containerWidth-(ww - 100/*margins and scrollbars*/));

    limits.rightLimit = 0;
    limits.leftLimit = bounds*-1;

    return limits;
  }

  function _getTranslateX() {
    var translateX = parseInt(getComputedStyle(cardsContainer, null).getPropertyValue('transform').split(',')[4]);
    return translateX; // get translateX value
  }

  function _carouselMovingEvent() {
    var event = new Event('carouselmoving');
    window.dispatchEvent(event);
  }

  function _moveCarousel() {
    needForRAF = true; // rAF consumes the movement instruction a new one can come
    cardsContainer.style.transform = 'translateX(' + distancePosition + 'px)';// move it!
    _carouselMovingEvent();
    cardsContainer.addEventListener('webkitTransitionEnd', _carouselMovingEvent, false);
    cardsContainer.addEventListener('oTransitionEnd', _carouselMovingEvent, false);
    cardsContainer.addEventListener('transitionend', _carouselMovingEvent, false);
  }

  //funcion que sabe que hacer cuando se draggea el carrusel
  function _touchCarousel() {

    if (needForRAF && isMouseDown) {

      moveRight.style.opacity = '1';
      moveRight.style.pointerEvents = 'all';
      moveLeft.style.opacity = '1';
      moveLeft.style.pointerEvents = 'all';
      
      var x = 0;
      if(event.clientX !== 0){
        x = event.clientX || event.touches[0].clientX;
      }

      distancePosition = (x - startPosition) + currentPosition; // count it!
    
      if(distancePosition >= lim.rightLimit){
        distancePosition = lim.rightLimit;

        moveLeft.style.opacity = '0';
        moveLeft.style.pointerEvents = 'none';
      }

      if(distancePosition <= lim.leftLimit){
        distancePosition = lim.leftLimit;

        moveRight.style.opacity = '0';
        moveRight.style.pointerEvents = 'none';
      }

      needForRAF = false;            // no need to call rAF up until next frame
      requestAnimationFrame(_moveCarousel); // request 60fps animation
    }
    
  }

  //devuelvo una referencia a la funcion privada que quiero que sea publica
  return {
    init: init,
    refresh: _refresh
  };

})();