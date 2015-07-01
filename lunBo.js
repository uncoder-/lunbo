function lunBo(opts) {
  if (!(this instanceof lunBo)) {
    return new lunBo(opts);
  }
  this.selector = opts.selector;
  this.height = opts.height;
  this.width = opts.width;
  this.duration = opts.duration || 3000;
  this.init();
}
lunBo.prototype = {
  init: function() {
    this.container = document.querySelector(this.selector);
    this.container.children[0].style.transform = "translate3d(0px,0px,0px)";
    this.els = this.container.children[0].children;
    for (var i = 0; i < this.els.length; i++) {
      this.els[i].style.left = i * this.container.offsetWidth + "px";
    }
    this.autoPlay();
    this.addTouchEvent();
  },
  addTouchEvent: function() {
    var that = this;
    var start, moveSize, position, step, index, moveON;
    this.container.children[0].addEventListener("touchstart", function(event) {
      that.destroyTimmer();
      index = parseInt(event.target.parentNode.dataset.index);
      start = event.changedTouches[0].pageX;
      moveSize = 0;
      step = that.width;
      position = parseFloat(that.getTranslate(that.container.children[0])[4]);
      event.preventDefault();
    }, false);
    this.container.children[0].addEventListener("touchmove", function(event) {
      moveSize = event.changedTouches[0].pageX - start;
      that.container.children[0].style.transform = "translate3d(" + (position + moveSize) + "px,0px,0px)";
    }, false);
    this.container.children[0].addEventListener("touchend", function(event) {
      if (Math.abs(moveSize) > 20) {
        if (index == 1 && moveSize > 0) {
          position = position;
          index = 0;
        } else if (index == that.els.length && moveSize < 0) {
          position = position;
          index = index -1;
        } else {
          var temp = (moveSize >= 0) ? step : step * (-1);
          if(moveSize >= 0){
              position = position + step;
              index = index - 2;
          }else{
              position = position + (-1)*step;
              index = index;
          }
        }
        that.showIndicator(index);
        that.container.children[0].style.transform = "translate3d(" + (position) + "px,0px,0px)";
        this.Timmer2 = window.setTimeout(function(){
            that.autoPlay();
        },300);
      }
    }, false);
  },
  autoPlay: function() {
    var that = this;
    this.Timmer = window.setInterval(function() {
      that.move();
    }, this.duration);
  },
  move: function() {
    var position = parseFloat(this.getTranslate(this.container.children[0])[4]);
    var pIndex = Math.abs(position) / this.width;

    if (pIndex >= this.els.length - 1) {
      position = 0;
    } else {
      position = (pIndex + 1) * this.width;
    }
    this.container.children[0].style.transform = "translate3d(-" + (position) + "px,0px,0px)";

    //计算dot位置
    if(pIndex == this.els.length-1){
      pIndex = 0;
    }else{
      pIndex = pIndex+1;
    }
    this.showIndicator(pIndex);
  },
  showIndicator: function(index) {
    var dots = this.container.children[1].children;
    for (var i = 0; i < dots.length; i++) {
      dots[i].className = "";
    }
    dots[index].className = "selected";
  },
  destroyTimmer: function() {
    clearInterval(this.Timmer);
  },
  getTranslate: function(_self) {
    var st = window.getComputedStyle(_self, null);
    var tr = st.getPropertyValue("-webkit-transform") || st.getPropertyValue("transform");
    var values = tr.split('(')[1].split(')')[0].split(',');
    return values;
  }
};
