(function () {
  'use strict';

  var PLAYBACK = 'rP300l2HeKzpzyLY5ZuRNWm3746HkABtE';
  var SRC = 'https://stream.mux.com/' + PLAYBACK + '.m3u8?min_resolution=720p';
  var page = document.body;
  var video = document.getElementById('experience-bg-video');
  if (!page || !video) return;

  function setVideoMode() {
    page.classList.remove('experience-bg--css');
    page.classList.add('experience-bg--video');
    video.play().catch(function () {});
  }

  function setCssMode() {
    page.classList.remove('experience-bg--video');
    page.classList.add('experience-bg--css');
    video.pause();
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setCssMode();
    return;
  }

  function onReady() {
    setVideoMode();
  }

  function onFail() {
    setCssMode();
  }

  if (window.Hls && window.Hls.isSupported()) {
    var hls = new window.Hls({ capLevelToPlayerSize: true });
    hls.loadSource(SRC);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, onReady);
    hls.on(window.Hls.Events.ERROR, function (_, data) {
      if (data.fatal) onFail();
    });
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = SRC;
    video.addEventListener('loadedmetadata', onReady, { once: true });
    video.addEventListener('error', onFail, { once: true });
    return;
  }

  onFail();
})();
