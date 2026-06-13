'use strict';

const CreatorDashboardPage = {
  lang() { return location.pathname === '/fr' || location.pathname.startsWith('/fr/') ? 'FR' : 'EN'; },
  strings: {
    EN: {
      invalid: 'Enter a valid YouTube channel URL, channel ID, or @handle.',
      loading: 'Collecting recent public YouTube videos and calculating the Creator Dashboard...',
      error: 'The Creator Dashboard is temporarily unavailable. Please try again later.',
      hidden: 'Hidden',
      subscribers: 'Subscribers',
      total_views: 'Total views',
      videos: 'Videos',
      created: 'Created'
    },
    FR: {
      invalid: 'Saisissez une URL de chaîne YouTube, un identifiant de chaîne ou un @pseudo valide.',
      loading: 'Collecte des vidéos YouTube publiques récentes et calcul du tableau de bord...',
      error: 'Le tableau de bord du créateur est temporairement indisponible. Réessayez plus tard.',
      hidden: 'Masqué',
      subscribers: 'Abonnés',
      total_views: 'Vues totales',
      videos: 'Vidéos',
      created: 'Créée'
    }
  },
  text(key) { return this.strings[this.lang()]?.[key] || this.strings.EN[key] || key; },
  parse(raw) {
    const value = String(raw || '').trim().replace(/\s+/g, '');
    if (/^@[\w.-]+$/.test(value)) return { type: 'handle', value: value.slice(1) };
    const patterns = [
      [/youtube\.com\/@([\w.-]+)/i, 'handle'],
      [/youtube\.com\/channel\/(UC[\w-]+)/i, 'id'],
      [/youtube\.com\/c\/([\w.-]+)/i, 'handle'],
      [/youtube\.com\/user\/([\w.-]+)/i, 'handle']
    ];
    for (const [pattern, type] of patterns) {
      const match = value.match(pattern);
      if (match) return { type, value: match[1] };
    }
    if (/^UC[\w-]{20,}$/.test(value)) return { type: 'id', value };
    if (/^[\w][\w.-]{2,}$/.test(value)) return { type: 'handle', value };
    return null;
  },
  number(value) {
    if (value === null || value === undefined) return this.text('hidden');
    return new Intl.NumberFormat(this.lang() === 'FR' ? 'fr-FR' : 'en-US', { notation: Number(value) >= 1000000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value);
  },
  setStatus(message, error = false) {
    const status = document.getElementById('creator-page-status');
    status.textContent = message;
    status.classList.toggle('error', error);
  },
  renderChannel(channel) {
    const overview = document.getElementById('creator-channel-overview');
    const avatar = document.getElementById('creator-page-avatar');
    avatar.src = channel.avatar || '';
    avatar.alt = channel.title;
    document.getElementById('creator-page-name').textContent = channel.title;
    document.getElementById('creator-page-handle').textContent = channel.handle || channel.id;
    const values = [
      [this.text('subscribers'), channel.hiddenSubscriberCount ? this.text('hidden') : this.number(channel.subscriberCount)],
      [this.text('total_views'), this.number(channel.viewCount)],
      [this.text('videos'), this.number(channel.videoCount)],
      [this.text('created'), new Date(channel.publishedAt).toLocaleDateString(this.lang() === 'FR' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long' })]
    ];
    document.getElementById('creator-page-channel-stats').innerHTML = values.map(([label, value]) =>
      `<div class="creator-page-stat"><strong>${CreatorDashboard.escape(value)}</strong><span>${CreatorDashboard.escape(label)}</span></div>`
    ).join('');
    overview.hidden = false;
  },
  async run() {
    const parsed = this.parse(document.getElementById('creator-page-input').value);
    if (!parsed) {
      this.setStatus(this.text('invalid'), true);
      document.getElementById('creator-page-input').focus();
      return;
    }
    const button = document.getElementById('creator-page-submit');
    button.disabled = true;
    this.setStatus(this.text('loading'));
    document.getElementById('creator-page-report').hidden = true;
    try {
      const response = await fetch(`/api/creator-dashboard?type=${encodeURIComponent(parsed.type)}&value=${encodeURIComponent(parsed.value)}`);
      const report = await response.json();
      if (!response.ok) throw new Error(report.error);
      this.renderChannel(report.channel);
      document.getElementById('creator-page-report').hidden = false;
      CreatorDashboard.accept(report);
      this.setStatus('');
      document.getElementById('creator-channel-overview').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (_) {
      this.setStatus(this.text('error'), true);
    } finally {
      button.disabled = false;
    }
  },
  init() {
    const form = document.getElementById('creator-page-form');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.run();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => CreatorDashboardPage.init());
