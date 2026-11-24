// Mobile menu
document.addEventListener('DOMContentLoaded', function () {
  var b = document.querySelector('.burger'), m = document.querySelector('.menu');
  if (b && m) b.addEventListener('click', function () {
    var open = m.classList.toggle('open');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Videos: YouTube is only loaded when the visitor clicks
  document.querySelectorAll('[data-video]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var frame = '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + el.dataset.video +
        '?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe></div>';
      var target;
      if (el.dataset.target) { target = document.getElementById(el.dataset.target); target.innerHTML = frame; }
      else { var w = document.createElement('div'); w.innerHTML = frame; target = w.firstChild; el.replaceWith(target); }
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Tabs: switch content in place (no jump to the bottom of the page)
  function openTab(id, scroll) {
    var panel = document.getElementById(id);
    if (!panel || !panel.classList.contains('tabpanel')) return false;
    var box = panel.parentNode;
    box.querySelectorAll(':scope > .tabpanel').forEach(function (p) { p.hidden = p !== panel; });
    box.querySelectorAll(':scope > .tabs .tab').forEach(function (t) { t.classList.toggle('on', t.dataset.tab === id); });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    if (scroll) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { openTab(t.dataset.tab, false); });
  });
  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { openTab(b.dataset.open, true); });
  });
  if (location.hash) openTab(location.hash.slice(1), false);

  // Searchable / filterable lists (publications, talks)
  document.querySelectorAll('[data-list]').forEach(function (box) {
    var items = box.querySelectorAll('[data-year]');
    var input = document.querySelector('[data-search="' + box.id + '"]');
    var buttons = document.querySelectorAll('[data-filter="' + box.id + '"]');
    var counter = document.querySelector('[data-count="' + box.id + '"]');
    var year = 'all';
    function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function apply() {
      var q = input ? norm(input.value.trim()) : '', n = 0;
      items.forEach(function (it) {
        var y = parseInt(it.dataset.year, 10), ok = true;
        if (year !== 'all') {
          if (year.indexOf('-') === 0) ok = y <= parseInt(year.slice(1), 10);
          else ok = y === parseInt(year, 10);
        }
        if (ok && q) ok = norm(it.textContent).indexOf(q) !== -1;
        it.style.display = ok ? '' : 'none';
        if (ok) n++;
      });
      if (counter) counter.textContent = n + ' of ' + items.length + ' shown';
      box.querySelectorAll('h3.grp').forEach(function (h) {
        var el = h.nextElementSibling, any = false;
        while (el && !el.matches('h3.grp')) { if (el.style.display !== 'none') any = true; el = el.nextElementSibling; }
        h.style.display = any ? '' : 'none';
      });
    }
    if (input) input.addEventListener('input', apply);
    buttons.forEach(function (bt) {
      bt.addEventListener('click', function () {
        buttons.forEach(function (x) { x.classList.remove('on'); });
        bt.classList.add('on'); year = bt.dataset.value; apply();
      });
    });
    apply();
  });
});
