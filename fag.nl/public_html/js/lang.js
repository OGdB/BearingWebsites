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

  document.querySelectorAll('[data-lang-nl]').forEach(function (el) {
    var key = 'lang' + lang.charAt(0).toUpperCase() + lang.slice(1);
    if (el.dataset[key] !== undefined) {
      if (el.dataset[key + 'Html'] !== undefined) {
        el.innerHTML = el.dataset[key + 'Html'];
      } else {
        el.textContent = el.dataset[key];
      }
    }
  });

  document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.setLang === lang);
  });
}
