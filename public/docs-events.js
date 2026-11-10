(function () {
  var timer;
  var last = '';

  // The counter script is deferred, so it may not be ready when the first event fires.
  function send(name, data, tries) {
    if (window.umami && window.umami.track) {
      window.umami.track(name, data);
    } else if ((tries || 0) < 20) {
      setTimeout(function () { send(name, data, (tries || 0) + 1); }, 500);
    }
  }

  // Listens on the document because Next.js swaps the page on navigation and the search box with it.
  document.addEventListener('input', function (event) {
    var box = event.target;
    if (!box || !box.matches || !box.matches('input[type="search"]')) return;
    clearTimeout(timer);
    timer = setTimeout(function () {
      var q = (box.value || '').trim().toLowerCase().slice(0, 80);
      if (q.length < 3 || q === last) return;
      last = q;
      send('docs_search', { q: q });
    }, 1500);
  });

  // The static 404 page keeps the normal site title, so its heading is the only marker.
  var heading = document.querySelector('h1');
  if (heading && heading.textContent.trim() === '404') {
    send('docs_404', { path: location.pathname.slice(0, 120) });
  }
})();
