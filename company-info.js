/* Datele legale ale firmei (denumire, CUI, Reg. Com., sediu), afișate în
   subsolul fiecărei pagini și în politica de confidențialitate.
   Sursa: Admin → Setări → Template contract → date prestator (/api/company).
   Fără CUI salvat se afișează doar denumirea legală. */
(function () {
  function legal(d) {
    return [d.nume, d.cui ? 'CUI ' + d.cui : '', d.regcom ? 'Reg. Com. ' + d.regcom : '', d.adresa ? 'Sediu: ' + d.adresa : '']
      .filter(Boolean).join(' · ');
  }
  function run(d) {
    // se afișează când e completat CUI-ul sau denumirea legală (nu doar marca „C Design”)
    if (!d || (!d.cui && (!d.nume || /^c design$/i.test(d.nume)))) return;
    var line = legal(d);
    var spots = document.querySelectorAll('.footer-bottom');
    if (!spots.length) { var f = document.querySelectorAll('footer'); if (f.length) spots = [f[f.length - 1]]; }
    Array.prototype.forEach.call(spots, function (fb) {
      if (fb.querySelector('.company-legal')) return;
      var el = document.createElement('div');
      el.className = 'company-legal';
      el.textContent = line;
      el.style.cssText = 'flex-basis:100%;width:100%;order:-1;font-size:.8rem;line-height:1.5;opacity:.75;margin-bottom:6px';
      fb.insertBefore(el, fb.firstChild);
    });
    // locuri marcate în pagină, de ex. politica de confidențialitate
    Array.prototype.forEach.call(document.querySelectorAll('[data-company="name"]'), function (el) { if (d.nume) el.textContent = d.nume; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-company="legal"]'), function (el) {
      var rows = [d.cui ? 'CUI: ' + d.cui : '', d.regcom ? 'Nr. Reg. Com.: ' + d.regcom : '', d.adresa ? 'Sediu: ' + d.adresa : ''].filter(Boolean);
      el.textContent = '';
      rows.forEach(function (r) { el.appendChild(document.createTextNode(r)); el.appendChild(document.createElement('br')); });
    });
  }
  try {
    fetch('/api/company').then(function (r) { return r.ok ? r.json() : null; }).then(run).catch(function () {});
  } catch (e) {}
})();
