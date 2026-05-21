// ── THEME ──
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
html.classList.toggle('light', savedTheme === 'light');
themeBtn.innerHTML = savedTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
themeBtn.addEventListener('click', () => {
    const isLight = html.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeBtn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// ── CANVAS BG ──
(function () {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let W, H, dots = [];
    const N = 70, DIST = 130;
    const COLORS = ['#f0a8d0', '#c4b5fd', '#7dd3fc'];
    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < N; i++) dots.push({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, r:Math.random()<.3?2:1, c:COLORS[Math.floor(Math.random()*COLORS.length)], o:Math.random()*.4+.15 });
    function draw() {
        ctx.clearRect(0,0,W,H);
        const isLight = html.classList.contains('light');
        const g = ctx.createLinearGradient(0,0,W,H);
        if (isLight) { g.addColorStop(0,'#e8e4f5'); g.addColorStop(.5,'#f0f0f8'); g.addColorStop(1,'#e4f0ff'); }
        else { g.addColorStop(0,'#0d0420'); g.addColorStop(.5,'#060612'); g.addColorStop(1,'#00111f'); }
        ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
        dots.forEach(d => { d.x+=d.vx; d.y+=d.vy; if(d.x<0||d.x>W)d.vx*=-1; if(d.y<0||d.y>H)d.vy*=-1; ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fillStyle=d.c; ctx.globalAlpha=d.o; ctx.fill(); });
        for(let i=0;i<dots.length;i++){for(let j=i+1;j<dots.length;j++){const dx=dots[i].x-dots[j].x,dy=dots[i].y-dots[j].y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<DIST){ctx.beginPath();ctx.moveTo(dots[i].x,dots[i].y);ctx.lineTo(dots[j].x,dots[j].y);ctx.strokeStyle='rgba(196,181,253,'+(1-dist/DIST)*.12+')';ctx.globalAlpha=1;ctx.lineWidth=.5;ctx.stroke();}}}
        ctx.globalAlpha=1; requestAnimationFrame(draw);
    }
    draw();
})();

// ── PARALLAX ──
const cardEl = document.querySelector('.card');
const isTouch = window.matchMedia('(hover: none)').matches;
if (!isTouch && cardEl) {
    document.addEventListener('mousemove', e => {
        const r = cardEl.getBoundingClientRect();
        const cx = r.left+r.width/2, cy = r.top+r.height/2;
        const dx = e.clientX-cx, dy = e.clientY-cy;
        if (Math.sqrt(dx*dx+dy*dy) < 300) {
            const angle = Math.atan2(dy,dx);
            cardEl.style.transform = `perspective(1000px) rotateY(${Math.cos(angle)*8}deg) rotateX(${-Math.sin(angle)*8}deg) scale(1.01)`;
        }
    });
    document.addEventListener('mouseleave', () => { cardEl.style.transform='perspective(1000px) rotateY(0) rotateX(0) scale(1)'; cardEl.style.transition='transform .6s cubic-bezier(.22,1,.36,1)'; });
    document.addEventListener('mouseenter', () => { cardEl.style.transition='transform .1s ease'; });
}

// ── CLICK PARTICLES ──
const PCOLS = ['#f0a8d0','#c4b5fd','#7dd3fc'];
function createParticles(x,y){for(let i=0;i<8;i++){const p=document.createElement('div');p.className='click-particle';const size=Math.random()*8+4,angle=Math.random()*Math.PI*2,vel=Math.random()*150+100;p.style.cssText=`left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${PCOLS[Math.floor(Math.random()*PCOLS.length)]};--tx:${Math.cos(angle)*vel}px;--ty:${Math.sin(angle)*vel}px;`;document.body.appendChild(p);setTimeout(()=>p.remove(),800);}}
document.addEventListener('click', e=>createParticles(e.clientX,e.clientY));
document.addEventListener('touchstart', e=>createParticles(e.touches[0].clientX,e.touches[0].clientY),{passive:true});

// ── CURSOR TRAIL ──
if (!isTouch) {
    let lastX = 0, lastY = 0;
    const TRAIL_COLORS = ['#f0a8d0', '#c4b5fd', '#7dd3fc'];
    document.addEventListener('mousemove', e => {
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        const speed = Math.sqrt(dx*dx + dy*dy);
        lastX = e.clientX; lastY = e.clientY;
        const count = Math.min(Math.floor(speed / 5), 4);
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 6 + 2;
            const color = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
            const angle = Math.random() * Math.PI * 2;
            const vel = Math.random() * 40 + 10;
            p.style.cssText = `position:fixed;pointer-events:none;z-index:998;border-radius:50%;width:${size}px;height:${size}px;background:${color};left:${e.clientX - size/2}px;top:${e.clientY - size/2}px;opacity:0.7;transition:opacity 0.4s ease,transform 0.4s ease;transform:translate(0,0) scale(1);`;
            document.body.appendChild(p);
            requestAnimationFrame(() => { p.style.opacity='0'; p.style.transform=`translate(${Math.cos(angle)*vel}px,${Math.sin(angle)*vel}px) scale(0)`; });
            setTimeout(() => p.remove(), 400);
        }
    });
}

// ── AUDIO + ТРЕКИ ──
const TRACKS = [
    { title: 'Дядя полицейский', artist: 'koonki', url: 'https://raw.githubusercontent.com/Finodev/finodev.github.io/main/koonki_-_dyadya_policejjskijj_81052743.mp3' },
    { title: 'Ты любишь танцевать', artist: 'CUPSIZE', url: 'https://raw.githubusercontent.com/Finodev/finodev.github.io/main/2_5238062214925008099%20(2).mp3' }
];

let currentTrack = 0;
let playing = false;
const audio = new Audio();
audio.loop = false;
audio.volume = 0.5;

function fmt(s){ return Math.floor(s/60)+':'+(Math.floor(s%60)+'').padStart(2,'0'); }

function loadTrack(index) {
    currentTrack = index;
    const t = TRACKS[index];
    audio.src = t.url;
    audio.load();
    // обновить названия
    document.querySelectorAll('.player-title').forEach(el => el.textContent = t.title);
    document.querySelectorAll('.player-artist').forEach(el => el.textContent = t.artist);
    // сбросить прогресс
    document.querySelectorAll('.progress-fill').forEach(el => el.style.width = '0%');
    document.querySelectorAll('.player-time[id^="timeCur"]').forEach(el => el.textContent = '0:00');
    document.querySelectorAll('.player-time[id^="timeDur"]').forEach(el => el.textContent = '0:00');
    if (playing) audio.play().catch(()=>{});
}

// авто следующий трек
audio.addEventListener('ended', () => {
    loadTrack((currentTrack + 1) % TRACKS.length);
});

function setPlay(state) {
    playing = state;
    const mi = document.getElementById('playIconMobile');
    const di = document.getElementById('playIconDesk');
    const mb = document.querySelectorAll('#barsMobile .bar');
    const db = document.querySelectorAll('#barsDesk .bar');
    if (playing) {
        if(mi) mi.className = 'fas fa-pause';
        if(di) di.className = 'fas fa-pause';
        mb.forEach(b => b.classList.remove('paused'));
        db.forEach(b => b.classList.remove('paused'));
        audio.play().catch(()=>{});
    } else {
        if(mi) mi.className = 'fas fa-play';
        if(di) di.className = 'fas fa-play';
        mb.forEach(b => b.classList.add('paused'));
        db.forEach(b => b.classList.add('paused'));
        audio.pause();
    }
}

// прогресс
audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100 + '%';
    const cur = fmt(audio.currentTime);
    const pfm = document.getElementById('progressFillMobile');
    const pfd = document.getElementById('progressFillDesk');
    const tcm = document.getElementById('timeCurMobile');
    const tcd = document.getElementById('timeCurDesk');
    if(pfm) pfm.style.width = pct;
    if(pfd) pfd.style.width = pct;
    if(tcm) tcm.textContent = cur;
    if(tcd) tcd.textContent = cur;
});
audio.addEventListener('loadedmetadata', () => {
    const dur = fmt(audio.duration);
    const tdm = document.getElementById('timeDurMobile');
    const tdd = document.getElementById('timeDurDesk');
    if(tdm) tdm.textContent = dur;
    if(tdd) tdd.textContent = dur;
});

// клик по прогрессу
['progressWrapMobile','progressWrapDesk'].forEach(id => {
    const w = document.getElementById(id);
    if(w) w.addEventListener('click', e => {
        const r = w.getBoundingClientRect();
        audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    });
});

// громкость
['volSliderMobile','volSliderDesk'].forEach(id => {
    const s = document.getElementById(id);
    if(s) s.addEventListener('input', () => { audio.volume = s.value; });
});

// play кнопки
const pbm = document.getElementById('playBtnMobile');
const pbd = document.getElementById('playBtnDesk');
if(pbm) pbm.addEventListener('click', () => setPlay(!playing));
if(pbd) pbd.addEventListener('click', () => setPlay(!playing));

// кнопки next (три точки)
document.querySelectorAll('.player-next').forEach(btn => {
    btn.addEventListener('click', () => {
        loadTrack((currentTrack + 1) % TRACKS.length);
    });
});

// загрузить первый трек
loadTrack(0);
