// Diccionarios de idioma para la parte pública del BioLink (visitante + modal de reservas).
// Solo textos fijos de la plantilla. Lo que el cliente escribe (nombre, bio, títulos de
// enlaces, etc.) nunca pasa por acá: se muestra tal cual el cliente lo cargó.

export type Lang = 'pt' | 'es';

export interface Dictionary {
  topBar: {
    liveBadge: string;
    configure: string;
    configureTooltip: string;
    installApp: string;
    installAppTooltip: string;
  };
  header: {
    shareTooltip: string;
    verifiedBadge: string;
  };
  categories: {
    all: string;
    community: string;
    multimedia: string;
    donations: string;
  };
  links: {
    emptyState: string;
    clicksSuffix: string;
  };
  main: {
    shareButton: string;
  };
  footer: {
    adminPanel: string;
    totalClicks: string;
    developedBy: string;
    visit: string;
  };
  qr: {
    close: string;
    title: string;
    subtitle: string;
    shareText: (title: string) => string;
    copy: string;
    copied: string;
    share: string;
    download: string;
  };
  video: {
    openInYoutube: string;
    openInYoutubeShort: string;
    notEmbeddable: string;
    openLink: (url: string) => string;
    liveTag: string;
  };
  pwa: {
    headerTooltip: string;
    headerButton: string;
    cardTitle: string;
    cardSubtitle: string;
    cardButton: string;
    pillButton: string;
    guideTitle: string;
    guideSubtitle: string;
    step1: string;
    step2: string;
    gotIt: string;
  };
  offline: string;
  setup: {
    title: string;
    subtitle: string;
    whatsappLabel: string;
    whatsappPlaceholder: string;
    whatsappHint: string;
    previewPrefix: string;
    invalidNumber: string;
    passwordTitle: string;
    passwordPlaceholder: string;
    passwordHint: string;
    passwordTooShort: string;
    saveButton: string;
    saving: string;
    later: string;
    saveError: string;
    done: string;
    greetingLabel: string;
    greetingPlaceholder: string;
    greetingHint: string;
    settingsTitle: string;
    settingsHelp: string;
    updateButton: string;
    updated: string;
  };
  booking: {
    title: string;
    liveTag: string;
    subtitle: string;
    closeAria: string;
    step1Title: string;
    viewCatalog: string;
    step2Title: string;
    today: string;
    tomorrow: string;
    step3Title: string;
    hoursSuffix: string;
    step4Title: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    nameRequiredError: string;
    previewLabel: string;
    previewService: string;
    previewDate: string;
    previewTime: string;
    previewRequester: string;
    previewNoName: string;
    submitButton: string;
    numberLabel: string;
    viewFullPage: string;
    brandNameFallback: string;
    notConfiguredTitle: string;
    notConfiguredBody: string;
    message: {
      greeting: (brandName: string) => string;
      service: string;
      price: string;
      duration: string;
      date: string;
      time: string;
      requester: string;
      phone: string;
      notes: string;
      footer: string;
    };
    dateLocale: string;
  };
  fallbackServices: {
    id: string;
    name: string;
    duration: string;
    price: string;
    description: string;
    icon: string;
    active: boolean;
  }[];
}

export const PT: Dictionary = {
  topBar: {
    liveBadge: 'cliques ao vivo',
    configure: 'Configurar',
    configureTooltip: 'Abrir Painel de Configuração e Segurança',
    installApp: 'Instalar App',
    installAppTooltip: 'Instalar como App no seu celular ou PC',
  },
  header: {
    shareTooltip: 'Compartilhar ou ver QR',
    verifiedBadge: 'Conta Oficial Verificada',
  },
  categories: {
    all: 'Todos',
    community: 'Comunidade',
    multimedia: 'Vídeos',
    donations: 'Doações',
  },
  links: {
    emptyState: 'Nenhum link nesta categoria.',
    clicksSuffix: 'cliques',
  },
  main: {
    shareButton: 'Ver Código QR e Compartilhar',
  },
  footer: {
    adminPanel: 'Painel Administrador',
    totalClicks: 'cliques totais',
    developedBy: 'Desenvolvido & Desenhado por',
    visit: 'Visitar',
  },
  qr: {
    close: 'Fechar',
    title: 'Compartilhar Perfil',
    subtitle: 'Escaneie o código QR com qualquer celular ou copie o link direto',
    shareText: (title) => `Visite ${title} em:`,
    copy: 'Copiar',
    copied: 'Copiado!',
    share: 'Compartilhar',
    download: 'Baixar QR',
  },
  video: {
    openInYoutube: 'Abrir no YouTube',
    openInYoutubeShort: 'Ver no YouTube',
    notEmbeddable: 'Este vídeo não é um link incorporável do YouTube direto.',
    openLink: (url) => `Abrir link do vídeo (${url})`,
    liveTag: 'Transmissão',
  },
  pwa: {
    headerTooltip: 'Instalar como App no seu celular ou PC',
    headerButton: 'Instalar App',
    cardTitle: 'Instalar Aplicativo na sua Tela',
    cardSubtitle: 'Acesse rápido sem abrir o navegador • Funciona offline',
    cardButton: 'Instalar',
    pillButton: 'Instalar no seu Celular',
    guideTitle: 'Instalar no seu Dispositivo',
    guideSubtitle: 'Adicione esta página à tela inicial para abri-la como um aplicativo nativo.',
    step1: 'Passo 1: Toque no botão Compartilhar (ou no menu de opções do seu navegador).',
    step2: 'Passo 2: Role para baixo e selecione "Adicionar à Tela de Início".',
    gotIt: 'Entendido!',
  },
  offline: 'Modo sem conexão — Mostrando conteúdo salvo',
  setup: {
    title: 'Configure seu WhatsApp',
    subtitle: 'Este é o número que vai receber as reservas e os contatos do seu BioLink. Você só precisa fazer isso uma vez.',
    whatsappLabel: 'Seu número de WhatsApp *',
    whatsappPlaceholder: 'Ex: 55 48 99999-9999',
    whatsappHint: 'Inclua o código do país (Brasil: 55) + DDD + número.',
    previewPrefix: 'Será usado:',
    invalidNumber: 'Número inválido. Use de 10 a 15 dígitos, incluindo o código do país.',
    passwordTitle: 'Nova senha (opcional, recomendado)',
    passwordPlaceholder: 'Mínimo 8 caracteres',
    passwordHint: 'Se quiser, troque a senha inicial por uma só sua.',
    passwordTooShort: 'A senha precisa ter pelo menos 8 caracteres.',
    saveButton: 'Salvar e continuar',
    saving: 'Salvando…',
    later: 'Agora não',
    saveError: 'Não foi possível salvar',
    done: 'Pronto!',
    greetingLabel: 'Mensagem de saudação (opcional)',
    greetingPlaceholder: 'Ex: Olá! Vi seu BioLink e gostaria de mais informações.',
    greetingHint: 'Aparece já escrita quando alguém toca em qualquer botão de WhatsApp. Deixe em branco para não usar.',
    settingsTitle: 'WhatsApp do negócio',
    settingsHelp: 'Se você mudar de número ou de mensagem, altere aqui: é atualizado nos botões, nas reservas e nas páginas de horários e serviços.',
    updateButton: 'Salvar alterações',
    updated: 'Dados de WhatsApp atualizados.',
  },
  booking: {
    title: 'Reserva de Horário por WhatsApp',
    liveTag: 'Direto',
    subtitle: 'Escolha serviço, data e horário. Confirmamos na hora.',
    closeAria: 'Fechar modal',
    step1Title: '1. Escolha o Serviço ou Consulta',
    viewCatalog: 'Ver catálogo e preços',
    step2Title: '2. Escolha a Data',
    today: 'Hoje',
    tomorrow: 'Amanhã',
    step3Title: '3. Escolha o Horário Preferido',
    hoursSuffix: 'h',
    step4Title: '4. Seus Dados de Contato',
    nameLabel: 'Seu Nome e Sobrenome *',
    namePlaceholder: 'Ex: Laura Martins',
    phoneLabel: 'Seu WhatsApp / Telefone (opcional)',
    phonePlaceholder: 'Ex: +55 48 99999-9999',
    notesLabel: 'Motivo ou Observação (opcional)',
    notesPlaceholder: 'Ex: Informações de preços',
    nameRequiredError: 'Por favor, digite seu nome completo.',
    previewLabel: 'Pré-visualização da Mensagem no WhatsApp:',
    previewService: 'Serviço',
    previewDate: 'Data',
    previewTime: 'Horário',
    previewRequester: 'Solicitante',
    previewNoName: '[Seu Nome]',
    submitButton: '📲 Confirmar e Enviar Horário por WhatsApp',
    numberLabel: 'Número',
    viewFullPage: 'Ver página completa',
    brandNameFallback: 'Atendimento ao Cliente',
    notConfiguredTitle: 'Reservas ainda não configuradas',
    notConfiguredBody: 'Este BioLink ainda não tem um número de WhatsApp configurado para receber reservas. Fale com quem administra esta página.',
    message: {
      greeting: (brandName) => `👋 *Olá ${brandName}! Gostaria de agendar um horário:*`,
      service: '💼 *Serviço:*',
      price: '💵 *Valor estimado:*',
      duration: '⏱️ *Duração estimada:*',
      date: '📅 *Data solicitada:*',
      time: '⏰ *Horário preferido:*',
      requester: '👤 *Nome do solicitante:*',
      phone: '📱 *Telefone de contato:*',
      notes: '📝 *Detalhes / Motivo:*',
      footer: '_Enviado pelo sistema de reservas do BioLink._',
    },
    dateLocale: 'pt-BR',
  },
  fallbackServices: [
    { id: 'asesoria', name: 'Assessoria Personalizada', duration: '45 min', price: 'R$ 150', description: 'Consultoria estratégica individual', icon: '💼', active: true },
    { id: 'consulta', name: 'Consulta / Horário Geral', duration: '30 min', price: 'R$ 80', description: 'Dúvidas e diagnóstico rápido', icon: '🗓️', active: true },
    { id: 'presupuesto', name: 'Orçamento de Projeto', duration: '30 min', price: 'Grátis', description: 'Avaliação personalizada sem custo', icon: '📊', active: true },
    { id: 'virtual', name: 'Reunião Virtual (Online)', duration: '45 min', price: 'R$ 120', description: 'Chamada de vídeo ao vivo', icon: '💻', active: true },
    { id: 'presencial', name: 'Horário Presencial', duration: '60 min', price: 'R$ 200', description: 'Encontro presencial', icon: '📍', active: true },
  ],
};

export const ES: Dictionary = {
  topBar: {
    liveBadge: 'clics en vivo',
    configure: 'Configurar',
    configureTooltip: 'Abrir Panel de Configuración y Seguridad',
    installApp: 'Instalar App',
    installAppTooltip: 'Instalar como App en tu teléfono o PC',
  },
  header: {
    shareTooltip: 'Compartir o ver QR',
    verifiedBadge: 'Cuenta Oficial Verificada',
  },
  categories: {
    all: 'Todos',
    community: 'Comunidad',
    multimedia: 'Transmisiones',
    donations: 'Donaciones',
  },
  links: {
    emptyState: 'No hay enlaces en esta categoría.',
    clicksSuffix: 'clics',
  },
  main: {
    shareButton: 'Ver Código QR & Compartir',
  },
  footer: {
    adminPanel: 'Panel Administrador',
    totalClicks: 'clics totales',
    developedBy: 'Desarrollado & Diseñado por',
    visit: 'Visitar',
  },
  qr: {
    close: 'Cerrar',
    title: 'Compartir Perfil',
    subtitle: 'Escanea el código QR con cualquier teléfono o copia el enlace directo',
    shareText: (title) => `Visita ${title} en:`,
    copy: 'Copiar',
    copied: '¡Copiado!',
    share: 'Compartir',
    download: 'Descargar QR',
  },
  video: {
    openInYoutube: 'Abrir en YouTube',
    openInYoutubeShort: 'Ver en YouTube',
    notEmbeddable: 'Este video no es un enlace embebible de YouTube directo.',
    openLink: (url) => `Abrir enlace del video (${url})`,
    liveTag: 'Transmisión',
  },
  pwa: {
    headerTooltip: 'Instalar como App en tu teléfono o PC',
    headerButton: 'Instalar App',
    cardTitle: 'Instalar Aplicación en tu Pantalla',
    cardSubtitle: 'Accede rápido sin abrir el navegador • Funciona offline',
    cardButton: 'Instalar',
    pillButton: 'Instalar en tu Celular',
    guideTitle: 'Instalar en tu Dispositivo',
    guideSubtitle: 'Agrega esta página a tu pantalla de inicio para abrirla como una aplicación nativa.',
    step1: 'Paso 1: Pulsa el botón Compartir (o el menú de opciones de tu navegador).',
    step2: 'Paso 2: Desplázate hacia abajo y selecciona "Agregar a la pantalla de inicio".',
    gotIt: '¡Entendido!',
  },
  offline: 'Modo sin conexión — Mostrando contenido en caché',
  setup: {
    title: 'Configura tu WhatsApp',
    subtitle: 'Este es el número que recibirá las reservas y los contactos de tu BioLink. Solo lo haces una vez.',
    whatsappLabel: 'Tu número de WhatsApp *',
    whatsappPlaceholder: 'Ej: 54 9 11 2345-6789',
    whatsappHint: 'Incluye el código de país + código de área + número.',
    previewPrefix: 'Se usará:',
    invalidNumber: 'Número inválido. Usa de 10 a 15 dígitos, incluyendo el código de país.',
    passwordTitle: 'Nueva contraseña (opcional, recomendado)',
    passwordPlaceholder: 'Mínimo 8 caracteres',
    passwordHint: 'Si quieres, cambia la contraseña inicial por una solo tuya.',
    passwordTooShort: 'La contraseña debe tener al menos 8 caracteres.',
    saveButton: 'Guardar y continuar',
    saving: 'Guardando…',
    later: 'Ahora no',
    saveError: 'No se pudo guardar',
    done: '¡Listo!',
    greetingLabel: 'Mensaje de saludo (opcional)',
    greetingPlaceholder: 'Ej: ¡Hola! Vi tu BioLink y quisiera más información.',
    greetingHint: 'Aparece ya escrito cuando alguien toca cualquier botón de WhatsApp. Déjalo vacío para no usarlo.',
    settingsTitle: 'WhatsApp del negocio',
    settingsHelp: 'Si cambias de número o de mensaje, corrígelo aquí: se actualiza en los botones, en las reservas y en las páginas de turnos y servicios.',
    updateButton: 'Guardar cambios',
    updated: 'Datos de WhatsApp actualizados.',
  },
  booking: {
    title: 'Reserva de Turno por WhatsApp',
    liveTag: 'Directo',
    subtitle: 'Selecciona servicio, fecha y horario. Te confirmamos de inmediato.',
    closeAria: 'Cerrar modal',
    step1Title: '1. Elige el Servicio o Consulta',
    viewCatalog: 'Ver catálogo y tarifas',
    step2Title: '2. Selecciona la Fecha',
    today: 'Hoy',
    tomorrow: 'Mañana',
    step3Title: '3. Elige Horario Preferido',
    hoursSuffix: 'hs',
    step4Title: '4. Tus Datos de Contacto',
    nameLabel: 'Tu Nombre y Apellido *',
    namePlaceholder: 'Ej: Laura Martínez',
    phoneLabel: 'Tu WhatsApp / Teléfono (opcional)',
    phonePlaceholder: 'Ej: +54 9 11 2345-6789',
    notesLabel: 'Motivo o Consulta (opcional)',
    notesPlaceholder: 'Ej: Información de precios',
    nameRequiredError: 'Por favor ingresa tu nombre completo.',
    previewLabel: 'Previsualización del Mensaje para WhatsApp:',
    previewService: 'Servicio',
    previewDate: 'Fecha',
    previewTime: 'Horario',
    previewRequester: 'Solicitante',
    previewNoName: '[Tu Nombre]',
    submitButton: '📲 Confirmar y Enviar Turno por WhatsApp',
    numberLabel: 'Número',
    viewFullPage: 'Ver página completa',
    brandNameFallback: 'Atención al Cliente',
    notConfiguredTitle: 'Reservas aún sin configurar',
    notConfiguredBody: 'Este BioLink todavía no tiene un número de WhatsApp configurado para recibir reservas. Hablá con quien administra esta página.',
    message: {
      greeting: (brandName) => `👋 *¡Hola ${brandName}! Deseo agendar un turno:*`,
      service: '💼 *Servicio:*',
      price: '💵 *Tarifa estimada:*',
      duration: '⏱️ *Duración estimada:*',
      date: '📅 *Fecha solicitada:*',
      time: '⏰ *Horario preferido:*',
      requester: '👤 *Nombre del solicitante:*',
      phone: '📱 *Teléfono de contacto:*',
      notes: '📝 *Detalles / Motivo:*',
      footer: '_Enviado desde el sistema de reservas del BioLink._',
    },
    dateLocale: 'es-ES',
  },
  fallbackServices: [
    { id: 'asesoria', name: 'Asesoría Personalizada', duration: '45 min', price: '$50 USD', description: 'Consultoría estratégica 1 a 1', icon: '💼', active: true },
    { id: 'consulta', name: 'Consulta / Turno General', duration: '30 min', price: '$30 USD', description: 'Dudas y diagnóstico rápido', icon: '🗓️', active: true },
    { id: 'presupuesto', name: 'Presupuesto de Proyecto', duration: '30 min', price: 'Gratis', description: 'Evaluación personalizada sin costo', icon: '📊', active: true },
    { id: 'virtual', name: 'Reunión Virtual (Online)', duration: '45 min', price: '$45 USD', description: 'Videollamada en vivo', icon: '💻', active: true },
    { id: 'presencial', name: 'Turno Presencial', duration: '60 min', price: '$65 USD', description: 'Encuentro presencial', icon: '📍', active: true },
  ],
};

export const DICTIONARIES: Record<Lang, Dictionary> = { pt: PT, es: ES };
