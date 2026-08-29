'use strict';

/** Cursor-tracking blob spotlight for .link-btn mesh buttons. */
(function initLinkBtnBlob() {
  document.querySelectorAll('.link-btn').forEach(function (button) {
    button.addEventListener('mousemove', function (e) {
      var rect = button.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      button.style.setProperty('--blob-x', x + '%');
      button.style.setProperty('--blob-y', y + '%');
    });
    button.addEventListener('mouseleave', function () {
      button.style.setProperty('--blob-x', '50%');
      button.style.setProperty('--blob-y', '50%');
    });
  });
})();
