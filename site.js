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

// ============ PLANTEL TABS ============
function showPlantel(group, btn) {
    document.querySelectorAll('.plantel-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('plantel-femeas').style.display = group === 'femeas' ? 'grid' : 'none';
    document.getElementById('plantel-machos').style.display = group === 'machos' ? 'grid' : 'none';
}

// ============ FADE IN ON SCROLL ============
// Só "arma" o fade se o JS está rodando — sem JS, conteúdo aparece direto
document.documentElement.classList.add('js-ready');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Fallback: se algo der errado, garante visibilidade em 2s
setTimeout(() => {
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => el.classList.add('visible'));
}, 2000);

// ============ ÍCONE PLACEHOLDER ============
const placeholderSvg = `<div class="filhote-img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4.5 12.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M14.5 12.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M8 16.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M16 16.5c-1 1-3 1.5-4 1.5s-3-.5-4-1.5"/><ellipse cx="12" cy="14" rx="4" ry="3"/></svg></div>`;
const plantelPlaceholderSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4.5 12.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M14.5 12.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3M8 16.5c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3"/><ellipse cx="12" cy="14" rx="4" ry="3"/></svg>`;

// ============ CARREGAR FILHOTES ============
async function carregarFilhotes() {
    const grid = document.getElementById('filhotes-grid');
    try {
        const response = await fetch('/data/filhotes.json?t=' + Date.now());
        if (!response.ok) throw new Error('Sem dados');
        const data = await response.json();
        const filhotes = (data.filhotes || []).filter(f => f.ativo !== false);

        if (filhotes.length === 0) {
            grid.innerHTML = '<div class="empty-state">Em breve, novos filhotes disponíveis. Fale conosco no WhatsApp para entrar na lista de espera.</div>';
            return;
        }

        grid.innerHTML = filhotes.map(f => {
            const fotoHtml = f.foto
                ? `<img src="${f.foto}" alt="Filhote ${f.nome} — Spitz Alemão" loading="lazy">`
                : placeholderSvg;
            const tag = f.status || 'Disponível';
            const meta = f.sexo ? `${f.sexo} · Spitz Alemão` : 'Spitz Alemão';
            const msg = encodeURIComponent(`Olá! Tenho interesse no filhote ${f.nome}.`);
            return `
            <article class="filhote-card fade-in">
                <div class="filhote-img">
                    <div class="filhote-tag">${tag}</div>
                    ${fotoHtml}
                </div>
                <div class="filhote-body">
                    <h3 class="filhote-name">${f.nome}</h3>
                    <p class="filhote-meta">${meta}</p>
                    <p class="filhote-desc">${f.descricao || ''}</p>
                    <a href="https://wa.me/5547920008177?text=${msg}" class="filhote-btn" target="_blank" rel="noopener">
                        Quero conhecer
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </article>`;
        }).join('');

        // Re-observar novos elementos fade-in
        document.querySelectorAll('.filhote-card.fade-in').forEach(el => observer.observe(el));
    } catch (e) {
        grid.innerHTML = '<div class="empty-state">Em breve, novos filhotes disponíveis. Fale conosco no WhatsApp.</div>';
    }
}

// ============ CARREGAR PLANTEL ============
async function carregarPlantel() {
    const gridFemeas = document.getElementById('plantel-femeas');
    const gridMachos = document.getElementById('plantel-machos');
    try {
        const response = await fetch('/data/plantel.json?t=' + Date.now());
        if (!response.ok) throw new Error('Sem dados');
        const data = await response.json();
        const animais = data.animais || [];

        const renderCard = (a) => {
            const fotoHtml = a.foto
                ? `<img src="${a.foto}" alt="${a.nome} — ${a.sexo === 'Macho' ? 'Padreador' : 'Matriz'} Spitz Alemão" loading="lazy">`
                : plantelPlaceholderSvg;
            const role = a.sexo === 'Macho' ? 'Padreador' : 'Matriz';
            return `
            <div class="plantel-card">
                <div class="plantel-img">${fotoHtml}</div>
                <div class="plantel-name">${a.nome}</div>
                <div class="plantel-role">${role}</div>
            </div>`;
        };

        const femeas = animais.filter(a => a.sexo === 'Fêmea');
        const machos = animais.filter(a => a.sexo === 'Macho');

        gridFemeas.innerHTML = femeas.map(renderCard).join('') || '<div class="empty-state">Em breve.</div>';
        gridMachos.innerHTML = machos.map(renderCard).join('') || '<div class="empty-state">Em breve.</div>';
    } catch (e) {
        gridFemeas.innerHTML = '<div class="empty-state">Em breve.</div>';
        gridMachos.innerHTML = '<div class="empty-state">Em breve.</div>';
    }
}

// ============ CARREGAR FOTO DO HERO ============
async function carregarHero() {
    try {
        const response = await fetch('/data/config.json?t=' + Date.now());
        if (!response.ok) return;
        const data = await response.json();
        if (data.foto_hero) {
            const heroImg = document.getElementById('hero-image');
            heroImg.innerHTML = `<img src="${data.foto_hero}" alt="Filhote Spitz Alemão — Canil Theos Ho Pater">`;
        }
        if (data.foto_sobre) {
            const sobreImg = document.getElementById('sobre-image');
            sobreImg.innerHTML = `<img src="${data.foto_sobre}" alt="Canil Theos Ho Pater — Spitz Alemão">`;
        }
    } catch (e) { /* mantém placeholder */ }
}

// ============ INICIALIZAR ============
document.addEventListener('DOMContentLoaded', () => {
    carregarFilhotes();
    carregarPlantel();
    carregarHero();
});
