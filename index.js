/**
 * Module dependencies
 */

var classes = require('classes');
var events = require('events');
var isTouch = require('is-touch')();
var toArray = require('to-array');
var path = require('path');
var each = require('each');
var empty = require('empty');

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
  if (!isTouch){
    this.parent = document.createElement('div');
    classes(this.parent).add('background-video-parent');
    this.url = url;
    var video = this.video = document.createElement('video');
    each(toArray(url), function(src){
      var source = document.createElement('source');
      source.src = src;
      source.type = 'video/' + path.extname(src).replace('.', '');
      video.appendChild(source);
    });
    classes(this.video).add('background-video');
    this.parent.appendChild(this.video);

    this.originalContents = document.createDocumentFragment();

    each(el.children, function(child){
      this.originalContents.appendChild(child.cloneNode(true));
    }.bind(this));

    el.cloneNode(true);
    this.overlay = document.createElement('div');
    classes(this.overlay).add('background-video-content');
    this.overlay.appendChild(this.originalContents);
    this.bind();
  }
};


/**
 * Bind events
 */

BackgroundVideo.prototype.bind = function(){
  this.events = events(this.video, this);
  this.events.bind('loadedmetadata', 'calcSize');
};


/**
 * Fallback to a poster when using mobile/ish devices.
 * Note: this isn't ideal, because touch !== mobile
 * 
 * @param  {String} url 
 * @return {BackgroundVideo}     
 */

BackgroundVideo.prototype.poster = function(url){
  if (isTouch) {
    this.el.style['background-image'] = 'url("'+ url + '")';
    classes(this.el).add('background-video-poster');
  }
  return this;
};

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
  if (this.video) this.video.setAttribute('loop', true);
  return this;
};

// Enable autoplay
BackgroundVideo.prototype.autoplay = function(){
  if (this.video) this.video.setAttribute('autoplay', 'autoplay');
  return this;
};

// Append to the DOM. Note: This also places all of the
// current contents of the element into its own element.
BackgroundVideo.prototype.append = function(el){
  if (this.video){
    empty(this.el);
    this.parent.appendChild(this.overlay);
    this.el.insertBefore(this.parent, this.el.firstChild);
  }
  return this;
};

// Play the video
BackgroundVideo.prototype.play = function(){
  if (this.video) this.video.play();
  return this;
};

// Pause
BackgroundVideo.prototype.pause = function(){
  if (this.video) this.video.pause();
  return this;
};