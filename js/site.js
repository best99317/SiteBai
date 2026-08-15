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

  function initPublicationFilters() {
    var entries = Array.prototype.slice.call(document.querySelectorAll('.publication-entry[data-tags]'));
    var areaButtons = Array.prototype.slice.call(document.querySelectorAll('.publication-area-filter[data-category]'));
    var topicButtons = Array.prototype.slice.call(document.querySelectorAll('.publication-topic-filter[data-topic]'));
    var topicLevel = document.getElementById('publication-topic-level');
    var topicGroups = Array.prototype.slice.call(document.querySelectorAll('.publication-subfilters[data-category]'));
    var count = document.getElementById('publication-filter-count');
    if (!entries.length || !areaButtons.length) return;

    function belongsToArea(tags, category) {
      if (category === 'Optimization') {
        return tags.some(function (tag) { return tag === 'Optimization' || /Optimization$/.test(tag); });
      }
      if (category === 'LLM') {
        return tags.some(function (tag) { return tag === 'LLM' || tag.indexOf('LLM ') === 0; });
      }
      return tags.indexOf(category) !== -1;
    }

    function applyFilters(category, topic) {
      var shown = 0;
      entries.forEach(function (entry) {
        var tags = (entry.getAttribute('data-tags') || '').split('|');
        var visible = category === 'all' || (topic && topic !== 'all' ? tags.indexOf(topic) !== -1 : belongsToArea(tags, category));
        entry.hidden = !visible;
        if (visible) shown += 1;
      });
      areaButtons.forEach(function (button) {
        var selected = button.getAttribute('data-category') === category;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      if (count) count.textContent = shown + (shown === 1 ? ' paper' : ' papers');
    }

    function selectArea(category) {
      var hasTopics = false;
      topicGroups.forEach(function (group) {
        var visible = group.getAttribute('data-category') === category;
        group.hidden = !visible;
        if (visible) hasTopics = true;
        Array.prototype.forEach.call(group.querySelectorAll('.publication-topic-filter'), function (button) {
          var selected = button.getAttribute('data-topic') === 'all';
          button.classList.toggle('is-active', selected);
          button.setAttribute('aria-pressed', String(selected));
        });
      });
      if (topicLevel) topicLevel.hidden = !hasTopics;
      applyFilters(category, 'all');
    }

    areaButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        selectArea(button.getAttribute('data-category'));
      });
    });
    topicButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var group = button.closest('.publication-subfilters');
        if (!group) return;
        var category = group.getAttribute('data-category');
        var topic = button.getAttribute('data-topic');
        Array.prototype.forEach.call(group.querySelectorAll('.publication-topic-filter'), function (candidate) {
          var selected = candidate === button;
          candidate.classList.toggle('is-active', selected);
          candidate.setAttribute('aria-pressed', String(selected));
        });
        applyFilters(category, topic);
      });
    });
    selectArea('all');
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
    initPublicationFilters();
    if (document.querySelector('.filterDiv')) window.filterSelection('all');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
