/* Shared behavior for the Systems & Work detail pages.
   Page content comes from the inline <script type="application/json" id="system-data">. */
(function () {
  var source = document.getElementById('system-data');
  if (!source) return;
  var data = JSON.parse(source.textContent);
  var panel = document.querySelector('[data-panel]');
  var buttons = [].slice.call(document.querySelectorAll('[data-station]'));
  var detail = document.getElementById('station-detail');
  var close = document.getElementById('close-detail');

  function select(i) {
    var station = data.stations[i];
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.station) === i)); });
    if (panel) panel.dataset.active = i;
    if (detail) {
      detail.hidden = false;
      detail.querySelector('h3').textContent = station.title;
      detail.querySelector('.badge').textContent = station.status;
      detail.querySelector('p').textContent = station.copy;
    }
    Object.keys(station.bind || {}).forEach(function (key) {
      var el = document.querySelector('[data-bind="' + key + '"]');
      if (el) el.textContent = station.bind[key];
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { select(Number(b.dataset.station)); });
  });
  if (close) close.addEventListener('click', function () {
    var selected = buttons.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0];
    detail.hidden = true;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    if (panel) delete panel.dataset.active;
    if (selected) selected.focus();
  });
  if (panel && panel.dataset.default !== undefined) select(Number(panel.dataset.default));

  var choices = [].slice.call(document.querySelectorAll('[data-scenario]'));
  var result = document.querySelector('.result');
  if (result) result.setAttribute('aria-live', 'polite');
  choices.forEach(function (b, i) {
    b.addEventListener('click', function () {
      choices.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      ['signal-text', 'decision-title', 'decision-copy', 'result-icon'].forEach(function (id, j) {
        document.getElementById(id).textContent = data.scenarios[i][j];
      });
      result.dataset.state = i;
    });
  });
})();
