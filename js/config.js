/** Site configuration — edit these values to customize your portfolio */
var config = {
  siteName: 'Ram editz',
  designStudio: 'Kyle Studios',
  logoLine1: 'Ram',
  logoLine2: 'editz',
  tagline: 'We Make Brands Move',
  email: 'ramanjineyulugangireddy@gmail.com',
  phone: '8555946223',
  location: 'Madanapalle',
  socials: {
    instagram: 'https://www.instagram.com/the_ram_editzz?igsh=NWlkaGY0bWZrNWlq',
    whatsapp: 'https://wa.me/918555946223'
  },
  instagramLabel: 'Checkout our insta page',
  whatsappMessage: 'Hi Ram editz! I visited your portfolio and I\'m interested in discussing a business deal for video production. Could we connect?',
  stats: [
    { value: 150, suffix: '+', label: 'Projects Delivered' },
    { value: 2, suffix: 'Yrs', label: 'Of Experience' }
  ],
  marqueeServices: [
    'Brand Reels',
    'Product Films',
    'Social Content',
    'Typograpghy Animations',
    'Commercials',
    'Live Events',
    'Testimonials',
    'Showreels'
  ],
  testimonials: [
    {
      quote: 'Ram editz transformed our brand story into a cinematic experience. The engagement on our campaign tripled within the first week.',
      author: 'Priya Reddy',
      role: 'CMO, TechVista India',
      rating: 5
    },
    {
      quote: 'Every frame feels intentional. They understood our vision before we could fully articulate it — true creative partners.',
      author: 'Karthik Menon',
      role: 'Founder, Pulse Studios',
      rating: 5
    },
    {
      quote: 'From concept to delivery, the process was seamless. The final reel exceeded every expectation we had.',
      author: 'Ananya Sharma',
      role: 'Brand Director, Aarva Lifestyle',
      rating: 5
    }
  ]
};

config.escapeHtml = function (str) {
  var div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
};

window.RAM_EDITZ_CONFIG = config;

config.getWhatsAppLink = function () {
  var base = (config.socials && config.socials.whatsapp) || ('https://wa.me/91' + (config.phone || ''));
  base = base.split('?')[0];
  if (!config.whatsappMessage) return base;
  return base + '?text=' + encodeURIComponent(config.whatsappMessage);
};

config.getWhatsAppProjectLink = function (details) {
  var base = (config.socials && config.socials.whatsapp) || ('https://wa.me/91' + (config.phone || ''));
  base = base.split('?')[0];
  var site = config.siteName || 'Ram editz';
  var lines = [
    'Hi ' + site + '! I would like to start a new project.',
    '',
    '*Project Details*',
    'Name: ' + (details.name || '-'),
    'Brand: ' + (details.brand || 'Not specified'),
    'Video Type: ' + (details.videoType || '-'),
    'Budget: ' + (details.budget || '-'),
    '',
    'Message:',
    details.message || 'Not specified'
  ];
  return base + '?text=' + encodeURIComponent(lines.join('\n'));
};

(function () {
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var connType = conn && conn.effectiveType;
  var slowConn = conn && (conn.saveData || connType === '2g' || connType === 'slow-2g' || connType === '3g');
  var lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  var lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
  var coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  if (reduced || coarse || lowPower || slowConn || lowMemory) {
    root.classList.add('perf-lite');
  }

  /* Balanced mode — trims the heaviest always-on effects on desktop */
  if (!reduced && !root.classList.contains('perf-lite')) {
    root.classList.add('perf-smooth');
  }
})();
