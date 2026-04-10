document.addEventListener('DOMContentLoaded', function () {
  var lang = localStorage.getItem('fag-lang') || 'nl';
  setLang(lang);

  document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(this.dataset.setLang);
    });
  });
});

function setLang(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem('fag-lang', lang);

  var capLang = lang.charAt(0).toUpperCase() + lang.slice(1);

  document.querySelectorAll('[data-lang-nl]').forEach(function (el) {
    var key = 'lang' + capLang;
    if (el.dataset[key] !== undefined) {
      el.textContent = el.dataset[key];
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-placeholder-nl]').forEach(function (el) {
    var key = 'placeholder' + capLang;
    if (el.dataset[key] !== undefined) {
      el.placeholder = el.dataset[key];
    }
  });

  document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.setLang === lang);
  });
}
