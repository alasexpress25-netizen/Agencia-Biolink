/*
 * "Volver al BioLink": vuelve a la página del bio link que ya estaba abierta
 * (historial del navegador / PWA) en vez de cargar una copia nueva.
 * Lleva la cuenta de cuántas páginas estáticas se visitaron desde el bio link
 * (cursos -> turnos, servicios -> turnos, etc.) y retrocede todas de una vez.
 */
(function () {
  var KEY = 'bl_cur';
  var depth = 0;
  try {
    var st = history.state;
    if (st && typeof st.blDepth === 'number') {
      depth = st.blDepth; // recarga o botón atrás/adelante: ya sabemos la profundidad
    } else {
      var prev = sessionStorage.getItem(KEY);
      var sameOrigin = false;
      try { sameOrigin = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
      depth = prev !== null && sameOrigin ? parseInt(prev, 10) + 1 : 0; // 0 = entrada directa
      history.replaceState(Object.assign({}, st || {}, { blDepth: depth }), '');
    }
    sessionStorage.setItem(KEY, String(depth));
  } catch (e) {}

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="./"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    if (depth > 0 && history.length > depth) {
      e.preventDefault();
      history.go(-depth);
    }
    // si no hay historial (entrada directa / pestaña nueva), sigue el link normal a ./
  });
})();
