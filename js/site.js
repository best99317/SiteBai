(function () {
  'use strict';

  function togglePanel(button) {
    var panel = button.nextElementSibling;
    if (!panel || !panel.classList.contains('content')) return;
    var open = panel.classList.toggle('is-open');
    button.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open));
    if (open) {
      Array.prototype.forEach.call(panel.querySelectorAll('iframe[data-src]'), function (frame) {
        frame.src = frame.getAttribute('data-src');
        frame.removeAttribute('data-src');
      });
    }
  }

  function initCollapsibles() {
    Array.prototype.forEach.call(document.querySelectorAll('button.collapsible, button.collapsible1'), function (button) {
      if (/window\.open/.test(button.getAttribute('onclick') || '')) return;
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', function () { togglePanel(button); });
    });
  }

  window.filterSelection = function (category) {
    var value = category === 'all' ? '' : category;
    var shown = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.filterDiv'), function (card) {
      var visible = !value || card.classList.contains(value);
      card.classList.toggle('show', visible);
      if (visible) shown += 1;
    });
    Array.prototype.forEach.call(document.querySelectorAll('.filter-bar .btn'), function (button) {
      var action = button.getAttribute('onclick') || '';
      var selected = category === 'all' ? /'all'/.test(action) : action.indexOf("'" + category + "'") !== -1;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    var empty = document.getElementById('filter-empty');
    if (empty) empty.hidden = shown > 0;
  };

  function toggleMore(suffix) {
    var dots = document.getElementById('dots' + suffix);
    var more = document.getElementById('more' + suffix);
    var button = document.getElementById('myBtn' + suffix);
    if (!more || !button) return;
    var open = getComputedStyle(more).display !== 'none';
    more.style.display = open ? 'none' : 'inline';
    if (dots) dots.style.display = open ? 'inline' : 'none';
    button.textContent = open ? 'More...' : 'Less...';
    button.setAttribute('aria-expanded', String(!open));
  }

  window.myFunction = function () { toggleMore(''); };
  window.myFunction1 = function () { toggleMore('1'); };
  window.myFunction2 = function () { toggleMore('2'); };

  function init() {
    initCollapsibles();
    if (document.querySelector('.filterDiv')) window.filterSelection('all');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
