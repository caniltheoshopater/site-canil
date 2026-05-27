// ============ NAVEGAÇÃO ============
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

function showPlantel(group, btn) {
    document.querySelectorAll('.plantel-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('plantel-femeas').style.display = group === 'femeas' ? 'grid' : 'none';
    document.getElementById('plantel-machos').style.display = group === 'machos' ? 'grid' : 'none';
}

document.documentElement.classList.add('js-ready');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

setTimeout(() => {
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => el.classList.add('visible'));
}, 2000);

function normalizarCaminho(foto) {
    if (!foto) return '';
    if (foto.startsWith('http')) return foto;
    if (foto.startsWith('/')) return foto;
    return '/' + foto;
}

const placeholderSvg = '<div class="filhote-img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4.5 12.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M14.5 12.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M8 16.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M16 16.5c-1 1-3 1.5-4 1.5s-3-.5-4-1.5"/><ellipse cx="12" cy="14" rx="4" ry="3"/></svg></div>';

const plantelPlaceholderSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4.5 12.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M14.5 12.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M8 16.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3"/><ellipse cx="12" cy="14" rx="4" ry="3"/></svg>';

async function carregarFilhotes() {
    const grid = document.getElementById('filhotes-grid');
    try {
        const response = await fetch('/data/filhotes.json?t=' + Date.now());
        if (!response.ok) throw new Error('Sem dados');
        const data = await response.json();
        const filhotes = (data.filhotes || []).filter(f => f.ativo !== false);

        if (filhotes.length === 0) {
            grid.innerHTML = '<div class="empty-state">Em breve, novos filhotes disponiveis. Fale conosco no WhatsApp.</div>';
            return;
        }

        let html = '';
        filhotes.forEach(f => {
            const fotoUrl = normalizarCaminho(f.foto);
            const fotoHtml = fotoUrl
                ? '<img src="' + fotoUrl + '" alt="Filhote ' + f.nome + '" loading="lazy">'
                : placeholderSvg;
            const tag = f.status || 'Disponivel';
            const meta = f.sexo ? (f.sexo + ' - Spitz Alemao') : 'Spitz Alemao';
            const msg = encodeURIComponent('Ola! Tenho interesse no filhote ' + f.nome + '.');
            html += '<article class="filhote-card fade-in">';
            html += '<div class="filhote-img"><div class="filhote-tag">' + tag + '</div>' + fotoHtml + '</div>';
            html += '<div class="filhote-body">';
            html += '<h3 class="filhote-name">' + f.nome + '</h3>';
            html += '<p class="filhote-meta">' + meta + '</p>';
            html += '<p class="filhote-desc">' + (f.descricao || '') + '</p>';
            html += '<a href="https://wa.me/5547920008177?text=' + msg + '" class="filhote-btn" target="_blank" rel="noopener">Quero conhecer</a>';
            html += '</div></article>';
        });
        grid.innerHTML = html;
        document.querySelectorAll('.filhote-card.fade-in').forEach(el => observer.observe(el));
    } catch (e) {
        grid.innerHTML = '<div class="empty-state">Em breve, novos filhotes. Fale no WhatsApp.</div>';
    }
}

async function carregarPlantel() {
    const gridFemeas = document.getElementById('plantel-femeas');
    const gridMachos = document.getElementById('plantel-machos');
    try {
        const response = await fetch('/data/plantel.json?t=' + Date.now());
        if (!response.ok) throw new Error('Sem dados');
        const data = await response.json();
        const animais = data.animais || [];

        function renderCard(a) {
            const fotoUrl = normalizarCaminho(a.foto);
            const fotoHtml = fotoUrl
                ? '<img src="' + fotoUrl + '" alt="' + a.nome + '" loading="lazy">'
                : plantelPlaceholderSvg;
            const role = a.sexo === 'Macho' ? 'Padreador' : 'Matriz';
            return '<div class="plantel-card"><div class="plantel-img">' + fotoHtml + '</div><div class="plantel-name">' + a.nome + '</div><div class="plantel-role">' + role + '</div></div>';
        }

        const femeas = animais.filter(a => a.sexo === 'Fêmea');
        const machos = animais.filter(a => a.sexo === 'Macho');

        gridFemeas.innerHTML = femeas.map(renderCard).join('') || '<div class="empty-state">Em breve.</div>';
        gridMachos.innerHTML = machos.map(renderCard).join('') || '<div class="empty-state">Em breve.</div>';
    } catch (e) {
        gridFemeas.innerHTML = '<div class="empty-state">Em breve.</div>';
        gridMachos.innerHTML = '<div class="empty-state">Em breve.</div>';
    }
}

async function carregarHero() {
    try {
        const response = await fetch('/data/config.json?t=' + Date.now());
        if (!response.ok) return;
        const data = await response.json();
        if (data.foto_hero) {
            const heroImg = document.getElementById('hero-image');
            heroImg.innerHTML = '<img src="' + normalizarCaminho(data.foto_hero) + '" alt="Canil Theos Ho Pater">';
        }
        if (data.foto_sobre) {
            const sobreImg = document.getElementById('sobre-image');
            sobreImg.innerHTML = '<img src="' + normalizarCaminho(data.foto_sobre) + '" alt="Canil Theos Ho Pater">';
        }
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    carregarFilhotes();
    carregarPlantel();
    carregarHero();
});
