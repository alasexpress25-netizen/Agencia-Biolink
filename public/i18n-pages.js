/* Traductor PT/ES para las páginas sueltas (turnos.html, servicios.html).
   El texto fuente está en español; en PT se reemplaza por coincidencia exacta.
   Lo que el cliente carga (nombres, precios propios, etc.) que no coincida con
   un texto de la plantilla se muestra tal cual. Comparte la elección de idioma
   con la app: localStorage "biolink-lang-<siteId>". */
(function () {
  var PT = {
    'Volver al BioLink': 'Voltar ao BioLink',
    'Ver Tarifas': 'Ver Preços',
    'WhatsApp Directo': 'WhatsApp Direto',
    'Reserva tu Turno por WhatsApp': 'Reserve seu Horário por WhatsApp',
    'Elige tu servicio, fecha y horario. Al confirmar, se abrirá WhatsApp con los detalles listos para enviar.': 'Escolha seu serviço, data e horário. Ao confirmar, o WhatsApp será aberto com os detalhes prontos para enviar.',
    'Servicio seleccionado:': 'Serviço selecionado:',
    'Hemos preseleccionado tu servicio. Elige tu fecha y hora preferida para confirmar.': 'Pré-selecionamos seu serviço. Escolha sua data e horário preferidos para confirmar.',
    'Cambiar': 'Alterar',
    '1. Servicio o Motivo': '1. Serviço ou Motivo',
    'Ver precios y planes': 'Ver preços e planos',
    'Asesoría Personalizada': 'Assessoria Personalizada',
    'Turno General': 'Horário Geral',
    'Presupuesto de Proyecto': 'Orçamento de Projeto',
    'Reunión Virtual (Online)': 'Reunião Virtual (Online)',
    '2. Fecha Deseada': '2. Data Desejada',
    'Hoy': 'Hoje',
    'Mañana': 'Amanhã',
    '3. Horario Preferido': '3. Horário Preferido',
    '4. Tus Datos': '4. Seus Dados',
    'Nombre y Apellido *': 'Nome e Sobrenome *',
    'Tu Teléfono / WhatsApp (opcional)': 'Seu Telefone / WhatsApp (opcional)',
    'Motivo o Comentario (opcional)': 'Motivo ou Comentário (opcional)',
    'Ej: Laura Martínez': 'Ex: Laura Martins',
    'Ej: Consulta sobre presupuestos y servicios': 'Ex: Consulta sobre orçamentos e serviços',
    '📲 Confirmar y Enviar Turno por WhatsApp': '📲 Confirmar e Enviar Horário por WhatsApp',
    'Sistema de Reservas Directo por WhatsApp': 'Sistema de Reservas Direto por WhatsApp',
    'Reserva de Turno por WhatsApp': 'Reserva de Horário por WhatsApp',
    'Agenda tu turno o consulta en pocos pasos y confirma directamente por WhatsApp.': 'Agende seu horário ou consulta em poucos passos e confirme direto pelo WhatsApp.',
    'Reservas aún sin configurar': 'Reservas ainda não configuradas',
    'Este BioLink todavía no tiene un número de WhatsApp configurado para recibir reservas. Hablá con quien administra esta página.': 'Este BioLink ainda não tem um número de WhatsApp configurado para receber reservas. Fale com quem administra esta página.',
    // servicios.html
    'Servicios y Tarifas - Reserva por WhatsApp': 'Serviços e Preços - Reserva por WhatsApp',
    'Conoce nuestros servicios profesionales, planes y tarifas transparentes. Agenda tu turno y confirma directamente por WhatsApp.': 'Conheça nossos serviços profissionais, planos e preços transparentes. Agende seu horário e confirme direto pelo WhatsApp.',
    'Ir a Turnos': 'Ir para Horários',
    'Turnos': 'Horários',
    '💼 Planes, Tarifas y Servicios': '💼 Planos, Preços e Serviços',
    'Nuestros Servicios y Precios': 'Nossos Serviços e Preços',
    'Elige la opción que mejor se adapte a tu necesidad. Al presionar': 'Escolha a opção que melhor se adapta à sua necessidade. Ao clicar em',
    '"Quiero este servicio"': '"Quero este serviço"',
    ', irás directamente al formulario de turnos con el servicio ya seleccionado para confirmar tu cita por WhatsApp.': ', você irá direto ao formulário de horários com o serviço já selecionado para confirmar seu agendamento por WhatsApp.',
    'MÁS ELEGIDO': 'MAIS ESCOLHIDO',
    'RÁPIDO': 'RÁPIDO',
    'SIN COSTO': 'SEM CUSTO',
    'PRESENCIAL': 'PRESENCIAL',
    'Sesión 1 a 1 de consultoría estratégica, análisis de requerimientos y plan de acción inmediato para tu proyecto.': 'Sessão 1 a 1 de consultoria estratégica, análise de requisitos e plano de ação imediato para o seu projeto.',
    '/ sesión': '/ sessão',
    '/ turno': '/ horário',
    '/ cotización': '/ cotação',
    '/ videollamada': '/ videochamada',
    'Auditoría y diagnóstico en vivo': 'Auditoria e diagnóstico ao vivo',
    'Grabación y resumen de conclusiones': 'Gravação e resumo das conclusões',
    'Quiero este servicio': 'Quero este serviço',
    'Consulta / Turno General': 'Consulta / Horário Geral',
    'Atención general, dudas técnicas o comerciales y diagnóstico inicial para orientar tus próximos pasos.': 'Atendimento geral, dúvidas técnicas ou comerciais e diagnóstico inicial para orientar seus próximos passos.',
    'Resolución de dudas clave': 'Resolução de dúvidas-chave',
    'Orientación personalizada': 'Orientação personalizada',
    'Evaluación técnica y comercial sin costo para proyectos web, campañas de marketing, branding y automatizaciones.': 'Avaliação técnica e comercial sem custo para projetos web, campanhas de marketing, branding e automações.',
    'Gratis': 'Grátis',
    'Presupuesto formal por escrito': 'Orçamento formal por escrito',
    'Sin compromiso de compra': 'Sem compromisso de compra',
    'Reunión Virtual (Google Meet / Zoom)': 'Reunião Virtual (Google Meet / Zoom)',
    'Videollamada con pantalla compartida, asesoramiento en tiempo real y entrega de material digital.': 'Videochamada com tela compartilhada, assessoria em tempo real e entrega de material digital.',
    'Enlace privado de Google Meet / Zoom': 'Link privado do Google Meet / Zoom',
    'Asesoramiento desde cualquier país': 'Assessoria de qualquer país',
    'Turno Presencial': 'Horário Presencial',
    'Encuentro cara a cara en nuestras oficinas para coordinación integral, firma de acuerdos y revisión profunda.': 'Encontro presencial em nosso escritório para coordenação integral, assinatura de acordos e revisão aprofundada.',
    'Atención exclusiva y personalizada': 'Atendimento exclusivo e personalizado',
    'Ubicación céntrica con estacionamiento': 'Localização central com estacionamento',
    'Atención profesional personalizada adaptada a tu requerimiento.': 'Atendimento profissional personalizado, adaptado à sua necessidade.',
    'A convenir': 'A combinar',
    'Confirmación directa por WhatsApp': 'Confirmação direta pelo WhatsApp',
    'Atención personalizada garantizada': 'Atendimento personalizado garantido',
    'Preguntas Frecuentes sobre Nuestros Servicios': 'Perguntas Frequentes sobre Nossos Serviços',
    '¿Cómo se confirma el turno?': 'Como o horário é confirmado?',
    'Al tocar "Quiero este servicio", eliges tu fecha y hora preferida en el formulario y se te abrirá WhatsApp con el mensaje ya estructurado para enviarnos. Te respondemos de inmediato confirmando la reserva.': 'Ao clicar em "Quero este serviço", você escolhe sua data e horário preferidos no formulário e o WhatsApp será aberto com a mensagem já estruturada para nos enviar. Respondemos na hora confirmando a reserva.',
    '¿Qué medios de pago aceptan?': 'Quais formas de pagamento vocês aceitam?',
    'Aceptamos transferencias bancarias directas, Pix, tarjetas de crédito/débito, PayPal y pagos locales según tu país de residencia.': 'Aceitamos transferências bancárias diretas, Pix, cartões de crédito/débito, PayPal e pagamentos locais conforme o seu país de residência.',
    '¿Puedo reprogramar si surge un imprevisto?': 'Posso reagendar se surgir um imprevisto?',
    'Sí, puedes solicitar una reprogramación avisándonos por WhatsApp con al menos 24 horas de anticipación sin ningún recargo.': 'Sim, você pode solicitar o reagendamento nos avisando pelo WhatsApp com pelo menos 24 horas de antecedência, sem nenhuma taxa adicional.',
    '¿Necesito tener todo preparado antes de la sesión?': 'Preciso ter tudo preparado antes da sessão?',
    'No es necesario tener todo definido. En la sesión inicial te guiaremos paso a paso para aclarar todas tus dudas y dar inicio a tu proyecto.': 'Não é necessário ter tudo definido. Na sessão inicial, vamos guiar você passo a passo para esclarecer todas as suas dúvidas e dar início ao seu projeto.',
    'Catálogo Oficial de Servicios y Turnos por WhatsApp': 'Catálogo Oficial de Serviços e Horários por WhatsApp',
    'BioLink Principal': 'BioLink Principal',
    'Agendar Turno': 'Agendar Horário',
    'WhatsApp Oficial': 'WhatsApp Oficial',
    // mensaje de WhatsApp (turnos.html)
    '👋 *¡Hola! Deseo agendar un turno:*': '👋 *Olá! Gostaria de agendar um horário:*',
    '💼 *Servicio:*': '💼 *Serviço:*',
    '📅 *Fecha solicitada:*': '📅 *Data solicitada:*',
    '⏰ *Horario:*': '⏰ *Horário:*',
    '👤 *Nombre:*': '👤 *Nome:*',
    '📱 *Teléfono:*': '📱 *Telefone:*',
    '📝 *Nota:*': '📝 *Observação:*',
    '_Enviado desde el sistema de turnos._': '_Enviado pelo sistema de horários._',
    // cursos.html
    'Cursos de Manicura | Thays Unhas': 'Cursos de Manicure | Thays Unhas',
    'Cursos de manicura con Thays: esmaltado en gel, técnica rusa y manicura desde cero. Escribe por WhatsApp.': 'Cursos de manicure com a Thays: esmaltação em gel, técnica russa e manicure do zero. Fale pelo WhatsApp.',
    'Cursos de Manicura': 'Cursos de Manicure',
    'Aprende manicura con Thays': 'Aprenda manicure com a Thays',
    'Clases prácticas para quienes quieren empezar de cero o perfeccionarse en esmaltado en gel y en la técnica rusa, con acabado profesional y cutículas impecables.': 'Aulas práticas para quem quer começar do zero ou se aperfeiçoar em esmaltação em gel e na técnica russa, com acabamento profissional e cutículas impecáveis.',
    '💬 Quiero saber más sobre los cursos': '💬 Quero saber mais sobre os cursos',
    'Manicura desde Cero': 'Manicure do Zero',
    'Principiante': 'Iniciante',
    'Para quienes nunca hicieron uñas y quieren aprender con seguridad desde la base.': 'Para quem nunca fez unhas e quer aprender com segurança desde a base.',
    '✔ Bioseguridad e higiene de los materiales': '✔ Biossegurança e higienização dos materiais',
    '✔ Anatomía de la uña y preparación de la base': '✔ Anatomia da unha e preparação da base',
    '✔ Limado, formas y cuidado de la cutícula': '✔ Lixamento, formatos e cuidados com a cutícula',
    '✔ Esmaltado tradicional con acabado prolijo': '✔ Esmaltação tradicional com acabamento limpo',
    'Pedir información de este curso': 'Pedir informações deste curso',
    'Esmaltado en Gel': 'Esmaltação em Gel',
    'Más buscado': 'Mais procurado',
    'Aprende a aplicar el gel con brillo, uniformidad y durabilidad.': 'Aprenda a aplicar o gel com brilho, uniformidade e durabilidade.',
    '✔ Preparación correcta de la uña para el gel': '✔ Preparação correta da unha para o gel',
    '✔ Aplicación de las capas y uso de la cabina': '✔ Aplicação das camadas e uso da cabine',
    '✔ Cuidados para aumentar la durabilidad': '✔ Cuidados para aumentar a durabilidade',
    '✔ Retiro seguro sin dañar la uña natural': '✔ Remoção segura sem danificar a unha natural',
    'Técnica Rusa (Cutículas)': 'Técnica Russa (Cutículas)',
    'Perfeccionamiento': 'Aperfeiçoamento',
    'El paso a paso de la técnica que deja la cutícula limpia, precisa y sin lastimar.': 'O passo a passo da técnica que deixa a cutícula limpa, precisa e sem machucar.',
    '✔ Elección y uso correcto de las fresas': '✔ Escolha e uso correto das fresas',
    '✔ Movimientos y presión para un resultado seguro': '✔ Movimentos e pressão para um resultado seguro',
    '✔ Retiro de cutícula con acabado impecable': '✔ Remoção de cutícula com acabamento impecável',
    '✔ Cuidados e higiene durante toda la atención': '✔ Cuidados e higiene durante todo o atendimento',
    'Clases prácticas': 'Aulas práticas',
    'Aprendes haciendo, con acompañamiento de cerca.': 'Você aprende fazendo, com acompanhamento de perto.',
    'Consulta por las próximas clases y horarios disponibles.': 'Pergunte pelas próximas turmas e horários disponíveis.',
    'Valores y fechas': 'Valores e datas',
    'Te informamos todo por WhatsApp, sin compromiso.': 'Informamos tudo pelo WhatsApp, sem compromisso.',
    '¿Listo/a para empezar?': 'Pronta para começar?',
    'Escríbele a Thays por WhatsApp, cuéntale qué curso te interesa y recibe valores, fechas y todos los detalles.': 'Chame a Thays no WhatsApp, conte qual curso te interessa e receba valores, datas e todos os detalhes.',
    'Hablar por WhatsApp': 'Falar no WhatsApp',
    'Desarrollado & Diseñado por': 'Desenvolvido & Desenhado por',
    'Todavía no sé qué curso, quiero orientación': 'Ainda não sei qual curso, quero orientação'
  };
  var PATTERNS = [
    [/^Duración estimada: (.+)$/, 'Duração estimada: $1'],
    [/^(\d{1,2}:\d{2}) hs$/, '$1 h'],
    [/^Destino: WhatsApp oficial \((.+)\)$/, 'Destino: WhatsApp oficial ($1)'],
    [/^(\d+) minutos$/, '$1 minutos']
  ];

  function readStored() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('biolink-lang-') === 0) {
          var v = localStorage.getItem(k);
          if (v === 'pt' || v === 'es') return { key: k, v: v };
        }
      }
    } catch (e) {}
    return null;
  }
  function storageKey() {
    var s = readStored();
    return s ? s.key : 'biolink-lang-default';
  }

  var params = new URLSearchParams(location.search);
  var fromUrl = params.get('lang');
  var stored = readStored();
  var lang = fromUrl === 'pt' || fromUrl === 'es' ? fromUrl : stored ? stored.v : 'pt';

  function tr(es) {
    if (lang !== 'pt') return es;
    var lead = es.match(/^\s*/)[0], trail = es.match(/\s*$/)[0], core = es.trim();
    if (!core) return es;
    if (PT[core] !== undefined) return lead + PT[core] + trail;
    for (var i = 0; i < PATTERNS.length; i++) {
      if (PATTERNS[i][0].test(core)) return lead + core.replace(PATTERNS[i][0], PATTERNS[i][1]) + trail;
    }
    return es;
  }

  var origText = new WeakMap();   // nodo de texto -> {src, out}
  var origAttr = new WeakMap();   // elemento -> {attr: {src, out}}
  var observer;

  function applyText(node) {
    var rec = origText.get(node);
    var cur = node.nodeValue;
    if (!rec || cur !== rec.out) rec = { src: cur, out: cur }; // texto nuevo o cambiado por el script de la página
    var out = tr(rec.src);
    if (out !== cur) node.nodeValue = out;
    rec.out = out;
    origText.set(node, rec);
  }
  function applyAttrs(el) {
    ['placeholder', 'title', 'aria-label'].forEach(function (a) {
      if (!el.hasAttribute || !el.hasAttribute(a)) return;
      var map = origAttr.get(el) || {};
      var cur = el.getAttribute(a), rec = map[a];
      if (!rec || cur !== rec.out) rec = { src: cur, out: cur };
      var out = tr(rec.src);
      if (out !== cur) el.setAttribute(a, out);
      rec.out = out; map[a] = rec; origAttr.set(el, map);
    });
  }
  function walk(root) {
    if (root.nodeType === 3) { if (root.parentNode && !/^(SCRIPT|STYLE)$/.test(root.parentNode.nodeName)) applyText(root); return; }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(root.nodeName)) return;
    applyAttrs(root);
    for (var c = root.firstChild; c; c = c.nextSibling) walk(c);
  }
  function applyHead() {
    document.documentElement.lang = lang;
    var m = document.querySelector('meta[name="description"]');
    if (m) {
      if (!m.__src) m.__src = m.getAttribute('content');
      m.setAttribute('content', tr(m.__src));
    }
    if (!document.__srcTitle) document.__srcTitle = document.title;
    document.title = tr(document.__srcTitle);
  }
  function applyAll() {
    if (observer) observer.disconnect();
    applyHead();
    walk(document.body);
    if (observer) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function save(l) {
    try { localStorage.setItem(storageKey(), l); } catch (e) {}
  }
  function setLang(l) {
    lang = l; save(l); applyAll(); renderSwitch();
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: l } }));
  }

  var sw;
  function renderSwitch() {
    if (!sw) {
      sw = document.createElement('div');
      sw.setAttribute('data-i18n-switch', '');
      sw.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:60;display:inline-flex;padding:2px;border-radius:9999px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(8px);font:700 11px system-ui,sans-serif';
      document.body.appendChild(sw);
    }
    sw.innerHTML = '';
    ['pt', 'es'].forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = l.toUpperCase();
      b.style.cssText = 'padding:4px 10px;border-radius:9999px;border:0;cursor:pointer;' + (lang === l ? 'background:rgba(255,255,255,.9);color:#0f172a' : 'background:transparent;color:rgba(255,255,255,.65)');
      b.onclick = function () { setLang(l); };
      sw.appendChild(b);
    });
  }

  window.i18n = {
    get lang() { return lang; },
    t: tr,
    locale: function () { return lang === 'pt' ? 'pt-BR' : 'es-ES'; },
    // idioma por defecto del cliente: solo aplica si el visitante nunca eligió uno
    setDefault: function (l) {
      if ((l === 'pt' || l === 'es') && !fromUrl && !readStored() && l !== lang) { lang = l; applyAll(); renderSwitch(); }
    },
    apply: applyAll
  };

  function init() {
    observer = new MutationObserver(function (muts) {
      observer.disconnect();
      muts.forEach(function (m) {
        if (m.type === 'characterData') applyText(m.target);
        else m.addedNodes.forEach(walk);
      });
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
    applyAll(); renderSwitch();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
