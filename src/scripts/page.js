var SADIPT = window.SADIPT || {};

SADIPT = {

  //inicializa la pagina
  init: function() {
    this.setPresentationHeight();
    this.setColorBar();
    this.setToggleMenuButton();
  },

  //setea el alto del div principal de presentacion
  setPresentationHeight: function() {
    var el = document.getElementsByClassName('presentation')[0];
    if(el) {
      var height = window.innerHeight;
      el.style.height = height + 'px';
    }
  },

  //colorea la toolbar segun la posicion del scroll
  setColorBar: function() {
    var header = document.getElementsByClassName('header')[0];
    if(header) {
      header.style.background = 'rgba(54, 60, 64, '+ document.body.scrollTop*0.007 +')';
      document.addEventListener('scroll', function() {
        header.style.background = 'rgba(54, 60, 64, '+ document.body.scrollTop*0.007 +')';
      }, false);
    }
  },

  //agrega la funcionalidad del menu responsive
  setToggleMenuButton: function() {
    
    var header = document.querySelector('header');
    var menuButton = document.getElementById('menuButton');
    var menu = document.getElementById('menu');
    var ulMenuMargin = parseInt(getComputedStyle(menu.children[0], null).getPropertyValue('margin').split(' ')[0].split('px')[0]);
    
    menuButton.addEventListener('click', function() {
      
      if(menuButton.children[0].innerHTML === 'menu') {
        menuButton.children[0].innerHTML = 'clear';
        menu.style.height = menu.children[0].offsetHeight + (ulMenuMargin * 2) + 'px';
        menu.style.opacity = '1';
        header.style.background = 'rgba(54, 60, 64, 1)';
      }else {
        menuButton.children[0].innerHTML = 'menu';
        menu.removeAttribute('style');

        if(document.body.scrollTop === 0) {
          header.style.background = 'rgba(54, 60, 64, 0)';
        }
      }

    }, false);

  }

};