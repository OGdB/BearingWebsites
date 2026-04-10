document.addEventListener('DOMContentLoaded', function () {
  var lang = localStorage.getItem('ta-lang') || 'nl';
  setLang(lang);

  document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(this.dataset.setLang);
    });
  });
});

function setLang(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem('ta-lang', lang);

  document.querySelectorAll('[data-lang-nl]').forEach(function (el) {
    var key = 'lang' + lang.charAt(0).toUpperCase() + lang.slice(1);
    if (el.dataset[key] !== undefined) {
      el.textContent = el.dataset[key];
    }
  });

  var placeholderKey = 'lang' + lang.charAt(0).toUpperCase() + lang.slice(1) + 'Placeholder';
  document.querySelectorAll('[data-lang-nl-placeholder]').forEach(function (el) {
    if (el.dataset[placeholderKey] !== undefined) {
      el.placeholder = el.dataset[placeholderKey];
    }
  });

  document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.setLang === lang);
  });
}
