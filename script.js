// ── THEME ──
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
html.classList.toggle('light', savedTheme === 'light');
themeBtn.innerHTML = savedTheme === 'light'
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';

themeBtn.addEventListener('click', () => {
    const isLight = html.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeBtn.innerHTML = isLight
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
});

// ── PARTICLE NETWORK CANVAS ──
(function () {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let W, H, dots = [];
    const N = 70, DIST = 130;
    const COLORS = ['#f0a8d0', '#c4b5fd', '#7dd3fc'];

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < N; i++) {
        dots.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
            r: Math.random() < .3 ? 2 : 1,
            c: COLORS[Math.floor(Math.random() * COLORS.length)],
            o: Math.random() * .4 + .15
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const isLight = html.classList.contains('light');
        const g = ctx.createLinearGradient(0, 0, W, H);
        if (isLight) {
            g.addColorStop(0, '#e8e4f5');
            g.addColorStop(.5, '#f0f0f8');
            g.addColorStop(1, '#e4f0ff');
        } else {
            g.addColorStop(0, '#0d0420');
            g.addColorStop(.5, '#060612');
            g.addColorStop(1, '#00111f');
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        dots.forEach(d => {
            d.x += d.vx; d.y += d.vy;
            if (d.x < 0 || d.x > W) d.vx *= -1;
            if (d.y < 0 || d.y > H) d.vy *= -1;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = d.c;
            ctx.globalAlpha = d.o;
            ctx.fill();
        });

        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < DIST) {
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.strokeStyle = 'rgba(196,181,253,' + (1 - dist / DIST) * .12 + ')';
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = .5;
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    draw();
})();

// ── CARD PARALLAX ──
const card = document.getElementById('card');
const cardEl = card.querySelector('.card');
const isTouch = window.matchMedia('(hover: none)').matches;

if (!isTouch) {
    document.addEventListener('mousemove', e => {
        const r = cardEl.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 300;

        if (dist < maxDist) {
            const angle = Math.atan2(dy, dx);
            const tilt = Math.sin(angle) * 8;
            const rot = Math.cos(angle) * 8;
            cardEl.style.transform = `perspective(1000px) rotateY(${rot}deg) rotateX(${-tilt}deg) scale(1.01)`;
        }
    });

    document.addEventListener('mouseleave', () => {
        cardEl.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
        cardEl.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
    });
    document.addEventListener('mouseenter', () => {
        cardEl.style.transition = 'transform .1s ease';
    });
}

// ── CLICK PARTICLES ──
const PARTICLE_COLORS = ['#f0a8d0', '#c4b5fd', '#7dd3fc'];

function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'click-particle';
        const size = Math.random() * 8 + 4;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 150 + 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        p.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]};--tx:${tx}px;--ty:${ty}px;`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

document.addEventListener('click', e => createParticles(e.clientX, e.clientY));
document.addEventListener('touchstart', e => createParticles(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

// ── PLAYER ──
const TRACKS = [
    { title: 'Ты любишь танцевать', url: 'https://raw.githubusercontent.com/Finodev/finodev.github.io/main/2_5238062214925008099%20(2).mp3' }
];

let playing = false;
const audio = new Audio();
audio.volume = .5;
audio.loop = true;

const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const bars = document.querySelectorAll('.bar');
const volSlider = document.getElementById('volSlider');
const progressFill = document.getElementById('progressFill');
const progressWrap = document.getElementById('progressWrap');
const timeCur = document.getElementById('timeCur');
const timeDur = document.getElementById('timeDur');

function fmt(s) {
    const m = Math.floor(s / 60);
    return m + ':' + (Math.floor(s % 60) + '').padStart(2, '0');
}

audio.src = TRACKS[0].url;

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    timeCur.textContent = fmt(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    timeDur.textContent = fmt(audio.duration);
});

progressWrap.addEventListener('click', e => {
    const r = progressWrap.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

function setPlay(state) {
    playing = state;
    if (playing) {
        playIcon.className = 'fas fa-pause';
        bars.forEach(b => b.classList.remove('paused'));
        audio.play().catch(() => {});
    } else {
        playIcon.className = 'fas fa-play';
        bars.forEach(b => b.classList.add('paused'));
        audio.pause();
    }
}

playBtn.addEventListener('click', () => setPlay(!playing));

volSlider.addEventListener('input', () => {
    audio.volume = volSlider.value;
});
