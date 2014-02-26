/**
 * Module dependencies
 */

var classes = require('classes');
var events = require('events');

/**
 * Expose BackgroundVideo
 */

module.exports = BackgroundVideo;


/**
 * BackgroundVideo Constructor
 * @param {DOM} el  wrapper element
 * @param {String} url to video
 */

function BackgroundVideo(el, url){
  if (!(this instanceof BackgroundVideo)) return new BackgroundVideo(el, url);
  this.el = el;
  this.parent = document.createElement('div');
  classes(this.parent).add('background-video-parent');
  this.url = url;
  this.video = document.createElement('video');
  this.video.setAttribute('type', 'mp4');
  this.video.src = url;
  classes(this.video).add('background-video');
  this.parent.appendChild(this.video);
  this.originalHTML = el.innerHTML;
  this.overlay = document.createElement('div');
  classes(this.overlay).add('background-video-content');
  this.overlay.innerHTML = this.originalHTML;
  this.bind();
};



BackgroundVideo.prototype.bind = function(){
  this.events = events(this.video, this);
  this.events.bind('loadedmetadata', 'calcSize');
}

/**
 * Calculate the size of the video such that it always
 * covers the entire element. This needs to be called
 * after the video metadata has loaded.
 */

BackgroundVideo.prototype.calcSize = function(){
  var w = this.el.clientWidth;
  var h = this.el.clientHeight;
  var dratio = w / h;

  var vw = this.video.videoWidth;
  var vh = this.video.videoHeight;
  var vratio = vw / vh;

  if (vratio > dratio) w = vw * (h / vh);
  else  h = vh * (w / vw);

  this.video.height = h;
  this.video.width = w;
  return this;
};

// Enable looping
BackgroundVideo.prototype.loop = function(){
  this.video.setAttribute('loop', true);
  return this;
};

// Enable autoplay
BackgroundVideo.prototype.autoplay = function(){
  this.video.setAttribute('autoplay', 'autoplay');
  return this;
};

// Append to the DOM. Note: This also places all of the
// current contents of the element into its own element.
BackgroundVideo.prototype.append = function(el){
  this.el.innerHTML = '';
  this.parent.appendChild(this.overlay);
  this.el.insertBefore(this.parent, this.el.firstChild);
  return this;
};

// Play the video
BackgroundVideo.prototype.play = function(){
  this.video.play();
  return this;
};

// Pause
BackgroundVideo.prototype.pause = function(){
  this.video.pause();
  return this;
};