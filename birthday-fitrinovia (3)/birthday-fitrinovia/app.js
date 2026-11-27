/* ==========================================================================
   FITRI NOVIA — A Birthday Story Made With Love · app.js
   modul: petals · parallax · reveal · intro film pendek (countdown →
   HAPPY BIRTHDAY → nama) · musik (MP4 pilihan sendiri → Pink Matter via
   YouTube → piano generatif) · video · surat · galeri enam scene ·
   navigasi titik · progres · ulangi dari awal
   ========================================================================== */
(function () {
'use strict';

/* ---------------- util ---------------- */
var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isSmall = Math.min(window.innerWidth, window.innerHeight) < 640;
var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
var $  = function (s, c) { return (c || document).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
var rand = function (a, b) { return a + Math.random() * (b - a); };
var DPR = Math.min(window.devicePixelRatio || 1, 2);
var W = 0, H = 0;

/* ============================================================
   KELopak bunga lembut (canvas)
   ============================================================ */
var petCv = $('#petals'), petCx = petCv.getContext('2d');
var petals = [], burstPetals = [];
var PETAL_COLORS = [['197,143,145', .34], ['198,168,117', .28], ['231,217,200', .4],
  ['169,112,114', .2], ['255,252,246', .3]];
function makePetal(burst) {
  var c = PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0];
  return { x: rand(-30, W + 30), y: burst ? rand(-H * .2, H * .4) : rand(-60, -16),
    s: rand(6, 13), vy: rand(.28, .68), vx: rand(-.2, .2),
    rot: rand(0, 6.28), vr: rand(-.02, .02),
    swA: rand(14, 32), swP: rand(0, 6.28), swS: rand(.004, .011),
    col: c[0], a: c[1], life: burst ? rand(260, 400) : Infinity };
}
function sizePetals() { petCv.width = W * DPR; petCv.height = H * DPR; petCx.setTransform(DPR, 0, 0, DPR, 0, 0); }
function stepPetal(p, t) { p.y += p.vy; p.x += p.vx + Math.sin(t * p.swS + p.swP) * .5; p.rot += p.vr + Math.sin(t * .0013 + p.swP) * .004; }
function paintPetal(p, alpha) {
  petCx.save(); petCx.translate(p.x, p.y); petCx.rotate(p.rot);
  petCx.globalAlpha = Math.max(0, p.a * alpha);
  petCx.fillStyle = 'rgb(' + p.col + ')';
  petCx.beginPath();
  petCx.moveTo(0, -p.s);
  petCx.bezierCurveTo(p.s * .9, -p.s * .55, p.s * .8, p.s * .6, 0, p.s);
  petCx.bezierCurveTo(-p.s * .8, p.s * .6, -p.s * .9, -p.s * .55, 0, -p.s);
  petCx.fill(); petCx.restore();
}
function petalBurst(n) { for (var i = 0; i < n; i++) burstPetals.push(makePetal(true)); }
var rafId = null;
function loop(t) {
  if (document.hidden) { rafId = null; return; }
  petCx.clearRect(0, 0, W, H);
  var i, p;
  for (i = 0; i < petals.length; i++) {
    p = petals[i]; stepPetal(p, t); paintPetal(p, 1);
    if (p.y > H + 30) { p.y = rand(-60, -16); p.x = rand(-30, W + 30); }
  }
  for (i = burstPetals.length - 1; i >= 0; i--) {
    p = burstPetals[i]; stepPetal(p, t); p.life--;
    paintPetal(p, Math.min(1, p.life / 120));
    if (p.life <= 0 || p.y > H + 30) burstPetals.splice(i, 1);
  }
  rafId = requestAnimationFrame(loop);
}
function startLoop() { if (RM || rafId) return; rafId = requestAnimationFrame(loop); }
W = window.innerWidth; H = window.innerHeight;
sizePetals();
if (!RM) {
  var baseN = isSmall ? 7 : 13;
  for (var pi = 0; pi < baseN; pi++) { var pp = makePetal(false); pp.y = rand(0, H); petals.push(pp); }
  startLoop();
}
window.addEventListener('resize', function () { W = window.innerWidth; H = window.innerHeight; sizePetals(); });

/* ============================================================
   PARALLAX lembut (latar + layer data-depth)
   ============================================================ */
var scenes = $$('.scene, #intro');
var depthEls = $$('[data-depth]');
var ticking = false;
function parallax() {
  ticking = false;
  if (RM) return;
  var vh = window.innerHeight;
  scenes.forEach(function (sc) {
    var r = sc.getBoundingClientRect();
    if (r.bottom < -80 || r.top > vh + 80) return;
    var p = (r.top + r.height / 2 - vh / 2) / vh;
    p = Math.max(-1, Math.min(1, p));
    var img = $('.env-img', sc);
    if (img) img.style.setProperty('--py', (p * -r.height * .045).toFixed(1) + 'px');
  });
  depthEls.forEach(function (el) {
    var sc = el.closest('.scene, #intro');
    if (!sc) return;
    var r = sc.getBoundingClientRect();
    if (r.bottom < -80 || r.top > vh + 80) return;
    var p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
    var d = parseFloat(el.getAttribute('data-depth')) || 0;
    el.style.transform = 'translate3d(0,' + (p * d * vh).toFixed(1) + 'px,0)';
  });
}
window.addEventListener('scroll', function () {
  if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
}, { passive: true });
window.addEventListener('resize', parallax);
parallax();

/* tilt kamera halus pada bingkai (hanya pointer presisi) */
if (canHover && !RM) {
  $$('[data-tilt]').forEach(function (box) {
    var tx = 0, ty = 0, raf = null;
    function apply() {
      raf = null;
      box.style.setProperty('--try', tx.toFixed(2) + 'deg');
      box.style.setProperty('--trx', ty.toFixed(2) + 'deg');
    }
    box.addEventListener('pointermove', function (e) {
      var r = box.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 9;
      ty = ((e.clientY - r.top) / r.height - .5) * -6;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    box.addEventListener('pointerleave', function () {
      box.style.setProperty('--try', '0deg');
      box.style.setProperty('--trx', '0deg');
    });
  });
}

/* ============================================================
   REVEAL
   ============================================================ */
var world = $('#world');
var revealObs = null;
function startRevealObserver() {
  if (revealObs) return;
  world.classList.add('is-ready');
  revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  $$('.anim, .end-line', world).forEach(function (el) { revealObs.observe(el); });
  armEnvelope();
}
function resetReveals() {
  if (revealObs) { revealObs.disconnect(); revealObs = null; }
  $$('.anim, .end-line', world).forEach(function (el) { el.classList.remove('in'); });
}

/* ============================================================
   MUSIK — file lokal (jika ada) atau piano generatif lembut
   ============================================================ */
var music = (function () {
  var mode = 'none';            // 'file' | 'gen'
  var playing = false;
  var gen = null, audio = null;
  var vol = .4;                 // volume awal rendah & nyaman
  var ducked = false;

  /* ---------- mode generatif: piano lembut (orisinal, bebas royalti) ---------- */
  function buildGenerative() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    var ctx = new Ctx();
    var master = ctx.createGain(); master.gain.value = 0;
    var warm = ctx.createBiquadFilter(); warm.type = 'lowpass'; warm.frequency.value = 2400;
    var delay = ctx.createDelay(1); delay.delayTime.value = .34;
    var fb = ctx.createGain(); fb.gain.value = .32;
    var wet = ctx.createGain(); wet.gain.value = .22;
    master.connect(warm);
    warm.connect(ctx.destination);
    warm.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(ctx.destination);

    var FREQ = { F2:87.31, A2:110, Bb2:116.54, C3:130.81, D3:146.83, E3:164.81, F3:174.61,
      G3:196, A3:220, Bb3:233.08, C4:261.63, D4:293.66, E4:329.63, F4:349.23,
      G4:392, A4:440, Bb4:466.16, C5:523.25, D5:587.33, E5:659.26, F5:698.46, A5:880, C6:1046.5 };
    /* progresi hangat: Fmaj7 – Am7 – Dm7 – Bbmaj7 (key F, dreamy) */
    var CHORDS = [
      ['F3','A3','C4','E4'], ['A3','C4','E4','A4'],
      ['D3','F3','A3','C4'], ['Bb2','D3','F3','A3']
    ];
    var ARPEG = [0,1,2,3,2,1,3,1, 0,2,1,3,2,3,1,2];
    var SPARK = { 0:7, 4:6 };           // kolom arpeggio yang boleh mendapat kilau oktaf tinggi
    var bar = 0, step = 0, nextT = 0, timer = null;
    var BPM = 66, STEP = 60 / BPM / 2;  // not seperdelapan

    function pluck(freq, t, vel, decay) {
      var o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = freq;
      var o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = freq * 2.001;
      var g1 = ctx.createGain(), g2 = ctx.createGain();
      g1.gain.setValueAtTime(0, t);
      g1.gain.linearRampToValueAtTime(vel, t + .012);
      g1.gain.exponentialRampToValueAtTime(.0001, t + (decay || 2.4));
      g2.gain.setValueAtTime(0, t);
      g2.gain.linearRampToValueAtTime(vel * .3, t + .01);
      g2.gain.exponentialRampToValueAtTime(.0001, t + (decay || 2.4) * .7);
      o1.connect(g1); o2.connect(g2); g1.connect(master); g2.connect(master);
      o1.start(t); o2.start(t); o1.stop(t + 3); o2.stop(t + 3);
    }
    function pad(chordNotes, t, dur) {
      chordNotes.slice(0, 2).forEach(function (n, i) {
        var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = FREQ[n] / 2;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(.028, t + dur * .3);
        g.gain.linearRampToValueAtTime(0, t + dur);
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + dur + .1);
      });
    }
    function schedule() {
      while (nextT < ctx.currentTime + .6) {
        var chord = CHORDS[bar % 4];
        if (step % 8 === 0) pad(chord, nextT, STEP * 8.5);
        var note = chord[ARPEG[step % ARPEG.length]];
        var vel = .075 + (step % 4 === 0 ? .035 : 0) + Math.random() * .018;
        var oct = SPARK[step % 8] !== undefined && Math.random() < .5;
        var f = FREQ[note] * (oct ? 2 : 1);
        pluck(f, nextT, vel, oct ? 2 : 2.6);
        if (step % 16 === 10 && Math.random() < .6) pluck(FREQ.A5, nextT + STEP, .05, 2.2);
        step++;
        if (step % 16 === 0) bar++;
        nextT += STEP;
      }
    }
    function start() {
      if (timer) return;
      nextT = Math.max(nextT, ctx.currentTime + .1);
      schedule();
      timer = setInterval(schedule, 180);
    }
    return {
      ctx: ctx, master: master,
      setVol: function (v) { master.gain.setTargetAtTime(ducked ? v * .25 : v, ctx.currentTime, .18); },
      start: function () { ctx.resume().then(start); playing = true; },
      stop: function () { playing = false; }
    };
  }

  /* ---------- musik pilihan sendiri: MP4/AAC ----------
     File milik pemilik website: assets/audio/Download (5).mp4
     (diunggah sendiri). Diputar lewat elemen <video> tersembunyi
     setinggi 1px — cara paling kompatibel agar audio track MP4
     benar-benar bersuara di semua browser. Tidak pernah di-mute,
     volume mengikuti slider. */
  function tryFile() {
    return new Promise(function (resolve) {
      var v = document.createElement('video');
      v.setAttribute('playsinline', '');
      v.playsInline = true;
      v.loop = true;
      v.muted = false;
      v.volume = 1;
      v.preload = 'auto';
      v.style.cssText = 'position:fixed;bottom:0;left:0;width:1px;height:1px;opacity:.01;pointer-events:none;';
      document.body.appendChild(v);
      var done = false;
      var to = setTimeout(function () { if (!done) { done = true; resolve(false); } }, 3500);
      function ok() {
        if (done) return; done = true; clearTimeout(to);
        audio = v; resolve(true);
      }
      v.addEventListener('loadeddata', ok);
      v.addEventListener('canplay', ok);
      v.addEventListener('error', function () {
        if (done) return; done = true; clearTimeout(to); resolve(false);
      });
      v.addEventListener('play', function () {
        playing = true;
        if (typeof uiSync === 'function') uiSync();
      });
      v.addEventListener('pause', function () {
        playing = false;
        if (typeof uiSync === 'function') uiSync();
      });
      v.src = encodeURI('assets/audio/Download (5).mp4');
      v.load();
    });
  }

  function applyVol() {
    if (mode === 'file' && audio) audio.volume = ducked ? vol * .25 : vol;
    if (mode === 'yt' && yt && yt.setVolume) yt.setVolume(Math.round(vol * 100 * (ducked ? .16 : 1)));
    if (mode === 'gen' && gen) gen.setVol(vol * .5);
  }

  /* ---------- YouTube: Pink Matter — Frank Ocean (kanal resmi Blonded) ----------
     Cadangan KEDUA kalau file MP4 pilihan sendiri gagal dimuat. Kalau video
     diblokir/dihapus, otomatis kembali ke piano generatif. */
  function loadYTApi() {
    return new Promise(function (resolve) {
      if (window.YT && window.YT.Player) { resolve(true); return; }
      var done = false;
      var to = setTimeout(function () { if (!done) { done = true; resolve(false); } }, 8000);
      window.onYouTubeIframeAPIReady = function () {
        if (!done) { done = true; clearTimeout(to); resolve(true); }
      };
      var s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = function () { if (!done) { done = true; clearTimeout(to); resolve(false); } };
      document.head.appendChild(s);
    });
  }
  function buildYouTube() {
    return loadYTApi().then(function (ok) {
      if (!ok) return false;
      return new Promise(function (resolve) {
        var done = false;
        var to = setTimeout(function () { if (!done) { done = true; resolve(false); } }, 9000);
        yt = new window.YT.Player('ytHost', {
          videoId: 'uaLV003llhY', /* Frank Ocean — Pink Matter · Blonded
             (catatan: sebagian upload lagu berhak cipta menolak embed;
             kalau ditolak, otomatis lanjut ke mp3/piano) */
          playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1,
            rel: 0, fs: 0, iv_load_policy: 3, modestbranding: 1 },
          events: {
            onReady: function (e) {
              if (done) return; done = true; clearTimeout(to);
              e.target.setVolume(Math.round(vol * 100));
              resolve(true);
            },
            onError: function () {
              if (done) { ytFail(); return; }
              done = true; clearTimeout(to); ytFail(); resolve(false);
            }
          }
        });
      });
    });
  }
  function ytFail() {
    if (mode === 'gen') return;
    try { if (yt && yt.destroy) yt.destroy(); } catch (err) {}
    yt = null; mode = 'gen'; api.mode = 'gen'; playing = false;
    gen = buildGenerative(); gen.setVol(vol * .5);
    var t = $('#plTitle'); if (t) t.textContent = 'A Piano for Fitri';
    if (playing) gen.start();
    if (typeof uiSync === 'function') uiSync();
  }

  var startQueued = false;
  var api = {
    ready: false,
    mode: 'none',
    init: function () {
      return tryFile().then(function (ok) {
        if (ok) { mode = 'file'; api.mode = 'file'; api.ready = true; api.setVol(vol); return; }
        return buildYouTube().then(function (ok2) {
          if (ok2) { mode = 'yt'; api.mode = 'yt'; api.ready = true; return; }
          /* ytFail mungkin sudah membuat piano → jangan buat dua kali */
          if (!gen) gen = buildGenerative();
          mode = 'gen'; api.mode = 'gen';
          api.ready = true; api.setVol(vol);
        });
      }).then(function () {
        /* pengguna menekan putar sebelum lagu siap → langsung mainkan */
        if (startQueued) { startQueued = false; api.start(); }
      });
    },
    start: function () {
      if (!api.ready) { startQueued = true; return; }
      if (mode === 'file' && audio) {
        var pr = audio.play();
        if (pr && pr.then) {
          pr.then(function () {
            playing = true; if (typeof uiSync === 'function') uiSync();
          }).catch(function () {
            playing = false; if (typeof uiSync === 'function') uiSync();
          });
        }
        playing = true;
      }
      else if (mode === 'yt' && yt && yt.playVideo) { yt.playVideo(); playing = true; }
      else if (mode === 'gen' && gen) { gen.start(); playing = true; }
    },
    stop: function () {
      if (mode === 'file' && audio) { audio.pause(); playing = false; }
      else if (mode === 'yt' && yt && yt.pauseVideo) { yt.pauseVideo(); playing = false; }
      else if (mode === 'gen' && gen) { gen.stop(); playing = false; }
    },
    toggle: function () { api.isPlaying() ? api.stop() : api.start(); return playing; },
    isPlaying: function () {
      if (mode === 'file' && audio) playing = !audio.paused && !audio.ended;
      else if (mode === 'yt' && yt && yt.getPlayerState) {
        var st = yt.getPlayerState();
        playing = (st === 1 || st === 3);
      }
      return playing;
    },
    setVol: function (v) { vol = v; applyVol(); },
    duck: function (on) { ducked = on; applyVol(); }
  };
  return api;
})();

var musicBtn = $('#musicBtn'), musicPop = $('#musicPop'), volSlider = $('#volSlider');
var player = $('#player'), plState = $('#plState'), plTitle = $('#plTitle'), plVolBtn = $('#plVolBtn');
var plTap = $('#plTap');
function uiSync() {
  var on = music.isPlaying();
  if (player) player.classList.toggle('is-playing', on);
  if (plState) plState.textContent = on ? 'berputar lembut ♪' : 'dijeda — ketuk untuk memutar';
  if (plTap) plTap.hidden = on;
}
/* chip "Tap to play music" — muncul kalau autoplay diblokir browser */
if (plTap) plTap.addEventListener('click', function (e) {
  e.stopPropagation();
  music.start(); uiSync();
});
/* gestur pertama di mana pun = izin memutar musik (fallback autoplay) */
document.addEventListener('pointerdown', function () {
  if (music.ready && !music.isPlaying()) { music.start(); uiSync(); }
}, { once: true });
music.init().then(function () {
  if (plTitle) plTitle.textContent =
    music.mode === 'file' ? 'Lagu Pilihan Kita ♡' :
    music.mode === 'yt' ? 'Pink Matter · Frank Ocean' : 'A Piano for Fitri';
  music.setVol(volSlider.value / 100); /* sinkronkan slider ↔ volume nyata */
  /* coba autoplay sesuai izin browser; kalau diblokir, chip "Tap to play
     music" muncul (dan tombol putar / "Buka Cerita" tetap berfungsi) */
  music.start();
  uiSync();
  setTimeout(function () { uiSync(); }, 1200);
});
musicBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  music.toggle();
  uiSync();
});
if (plVolBtn) plVolBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  musicPop.classList.toggle('open');
});
document.addEventListener('click', function (e) {
  if (!musicPop.contains(e.target) && e.target !== plVolBtn && !plVolBtn.contains(e.target))
    musicPop.classList.remove('open');
});
volSlider.addEventListener('input', function () {
  music.setVol(volSlider.value / 100);
  if (!music.isPlaying() && volSlider.value > 0) {
    music.start(); uiSync();
  }
});

/* ============================================================
   BAGIAN 1 · OPENING — hitung mundur sinematik 3·2·1 → teks ulang
   tahun → pintu album terbuka (musik mulai lewat gestur tombol)
   ============================================================ */
var intro = $('#intro'), openBtn = $('#openBtn'),
    cdWrap = $('#cdWrap'), introBday = $('#introBday'),
    cdNums = $$('.cd-num'), skipCd = $('#skipCd');
var opening = false, bdayShown = false, cdTimers = [], hbTimers = [];
/* pecah nama jadi per-huruf untuk reveal yang elegan */
(function splitName() {
  var ibName = $('#ibName');
  if (!ibName || ibName.dataset.split) return;
  ibName.dataset.split = '1';
  var txt = ibName.textContent.trim();
  ibName.textContent = '';
  txt.split('').forEach(function (ch, i) {
    var sp = document.createElement('span');
    sp.className = 'il' + (ch === ' ' ? ' il-space' : '');
    sp.style.setProperty('--i', i);
    sp.textContent = ch;
    ibName.appendChild(sp);
  });
})();
function runCountdown() {
  cdTimers.forEach(clearTimeout); cdTimers = [];
  cdNums.forEach(function (n) { n.classList.remove('cd-show'); });
  if (RM) { showBday(); return; }
  [[0, 600], [1, 1800], [2, 3000]].forEach(function (s) {
    cdTimers.push(setTimeout(function () {
      var el = cdNums[s[0]];
      el.classList.remove('cd-show');
      void el.offsetWidth; /* ulang animasi */
      el.classList.add('cd-show');
      petalBurst(6); /* kelopak kecil tiap ganti angka */
    }, s[1]));
  });
  cdTimers.push(setTimeout(showBday, 4300));
}
/* Urutan wajib: countdown 3→2→1 → REVEAL 1 "HAPPY BIRTHDAY!" besar
   sendirian → memudar → REVEAL 2 "Fitri Novia" + umur + tanggal.
   Nama tidak boleh muncul sebelum HAPPY BIRTHDAY selesai. */
function showBday() {
  if (bdayShown) return;
  bdayShown = true;
  cdTimers.forEach(clearTimeout);
  intro.classList.add('is-hb'); /* REVEAL 1 — hanya HAPPY BIRTHDAY */
  if (!RM) petalBurst(isSmall ? 16 : 24);
  if (skipCd) skipCd.style.display = 'none';
  hbTimers.push(setTimeout(function () {
    intro.classList.add('is-hb-out'); /* HAPPY BIRTHDAY memudar dulu */
    hbTimers.push(setTimeout(function () {
      intro.classList.add('is-bday'); /* REVEAL 2 — nama + umur + tanggal */
      if (!RM) petalBurst(isSmall ? 12 : 18);
    }, RM ? 120 : 1050));
  }, RM ? 300 : 3100));
}
function openSurprise() {
  if (opening) return;
  opening = true;
  openBtn.disabled = true;
  if (!music.isPlaying()) { music.start(); uiSync(); }
  celebrate();
  intro.classList.add('is-opening');
  setTimeout(function () {
    world.classList.remove('is-hidden');
    document.body.classList.add('no-scroll');
    setTimeout(function () {
      document.body.classList.remove('no-scroll');
      startRevealObserver();
      parallax(); updateNav();
    }, 60);
  }, RM ? 120 : 420);
  setTimeout(function () { intro.classList.add('intro--leaving'); }, RM ? 200 : 1500);
}
openBtn.addEventListener('click', openSurprise);
if (skipCd) skipCd.addEventListener('click', showBday);
runCountdown();
function celebrate() {
  if (!RM) petalBurst(isSmall ? 20 : 34);
}

/* ============================================================
   BAGIAN 3b · GALERI — enam scene unik, satu foto per scene:
   panah prev/next, indikator 01/06, titik pilih, swipe di HP,
   dan panah keyboard saat galeri di layar. Caption muncul
   sesudah fotonya (transisi di CSS). Tanpa pop-up.
   ============================================================ */
var gstage = $('#gstage'), gScenes = $$('.gscene', world), gNow = $('#gNow'),
    gDots = $('#gDots'), gPrevBtn = $('#gPrev'), gNextBtn = $('#gNext');
var gIdx = 0;
function gDotsBuild() {
  if (!gDots) return;
  gDots.innerHTML = '';
  gScenes.forEach(function (sc, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Foto ' + (i + 1) + ' dari ' + gScenes.length);
    b.addEventListener('click', function () { gSet(i, i > gIdx ? 1 : -1); });
    gDots.appendChild(b);
  });
}
function gSync() {
  if (gNow) gNow.textContent = ('0' + (gIdx + 1)).slice(-2);
  if (gDots) $$('button', gDots).forEach(function (b, i) {
    b.classList.toggle('on', i === gIdx);
    b.setAttribute('aria-current', i === gIdx ? 'true' : 'false');
  });
}
function gSet(n, dir) {
  var len = gScenes.length;
  n = ((n % len) + len) % len;
  if (n === gIdx) return;
  dir = dir || (n > gIdx ? 1 : -1);
  gstage.setAttribute('data-dir', dir > 0 ? 'fwd' : 'back');
  gScenes[gIdx].classList.remove('is-active');
  gScenes[n].classList.add('is-active');
  gIdx = n;
  gSync();
}
if (gstage && gScenes.length) {
  gDotsBuild(); gSync();
  if (gPrevBtn) gPrevBtn.addEventListener('click', function () { gSet(gIdx - 1, -1); });
  if (gNextBtn) gNextBtn.addEventListener('click', function () { gSet(gIdx + 1, 1); });
  var gt0 = null, gtY0 = null;
  gstage.addEventListener('touchstart', function (e) {
    gt0 = e.touches[0].clientX; gtY0 = e.touches[0].clientY;
  }, { passive: true });
  gstage.addEventListener('touchend', function (e) {
    if (gt0 === null) return;
    var dx = e.changedTouches[0].clientX - gt0;
    var dy = e.changedTouches[0].clientY - gtY0;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.2)
      gSet(gIdx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    gt0 = null;
  }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    var r = gstage.getBoundingClientRect(), vh = window.innerHeight;
    if (r.bottom < vh * .18 || r.top > vh * .82) return;
    if (e.key === 'ArrowLeft') gSet(gIdx - 1, -1);
    if (e.key === 'ArrowRight') gSet(gIdx + 1, 1);
  });
}

/* ============================================================
   QR — kode menuju halaman ini (tujuan sama seperti
   tools/qr-generator.html; URL halaman tidak diubah)
   ============================================================ */
(function () {
  var qrBox = $('#qrBox');
  if (!qrBox || typeof qrcode !== 'function') return;
  try {
    var qr = qrcode(0, 'M');
    qr.addData(window.location.href.split('#')[0]);
    qr.make();
    qrBox.innerHTML = qr.createSvgTag(3, 9);
  } catch (err) {
    qrBox.innerHTML = '<span class="sq-fallback">QR bisa dibuat lewat tools/qr-generator.html</span>';
  }
})();

/* ============================================================
   BAGIAN 4 · VIDEO — kontrol asli + musik turun otomatis
   ============================================================ */
var video = $('#memVideo'), videoCover = $('#videoCover');
function playVideo() {
  videoCover.classList.add('gone');
  var pr = video.play();
  if (pr && pr.catch) pr.catch(function () { videoCover.classList.remove('gone'); });
}
videoCover.addEventListener('click', playVideo);
videoCover.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playVideo(); }
});
video.addEventListener('play',  function () { music.duck(true); });
video.addEventListener('pause', function () { music.duck(false); });
video.addEventListener('ended', function () { music.duck(false); videoCover.classList.remove('gone'); });

/* ============================================================
   BAGIAN 5 · SURAT — amplop terbuka otomatis saat dibaca
   ============================================================ */
var envBox = $('#envBox'), letterFlow = $('#letterFlow'), envHint = $('#envHint');
function openLetter() {
  if (letterFlow.classList.contains('is-open')) return;
  letterFlow.classList.add('is-open');
  envBox.classList.add('is-open');
  if (envHint) envHint.style.opacity = '0';
  celebrate();
}
envBox.addEventListener('click', openLetter);
envBox.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); }
});
function armEnvelope() {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { io.disconnect(); setTimeout(openLetter, RM ? 100 : 1200); }
    });
  }, { threshold: .3 });
  io.observe(envBox);
}

/* ============================================================
   BAGIAN 9 · HADIAH — buka → pesan khusus
   ============================================================ */
var keepsakeGift = $('#keepsakeGift'), keepsakeCard = $('#keepsakeCard'), giftHint2 = $('#giftHint2');
function openKeepsake() {
  if (keepsakeGift.classList.contains('is-open')) return;
  keepsakeGift.classList.add('is-open');
  if (giftHint2) giftHint2.style.opacity = '0';
  setTimeout(function () {
    keepsakeCard.classList.add('show');
    celebrate();
  }, RM ? 80 : 700);
}
keepsakeGift.addEventListener('click', openKeepsake);
keepsakeGift.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openKeepsake(); }
});

/* ============================================================
   NAVIGASI TITIK + GARIS PROGRES
   ============================================================ */
var dotnav = $('#dotnav'), progress = $('#progress');
var navBtns = [];
if (dotnav) {
  navBtns = $$('button[data-target]', dotnav);
  navBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.getElementById(b.getAttribute('data-target'));
      if (t) t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    });
  });
}
var current = '';
function updateNav() {
  var best = null, bestD = 1e9, vh = window.innerHeight;
  navBtns.forEach(function (b) {
    var t = document.getElementById(b.getAttribute('data-target'));
    if (!t) return;
    var r = t.getBoundingClientRect();
    var d = Math.abs(r.top + r.height / 2 - vh / 2);
    if (d < bestD) { bestD = d; best = b; }
  });
  navBtns.forEach(function (b) { b.classList.toggle('on', b === best); });
}
var docEl = document.documentElement;
function updateProgress() {
  var max = docEl.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}
window.addEventListener('scroll', function () { updateProgress(); updateNav(); }, { passive: true });
updateProgress(); updateNav();

/* ============================================================
   ULANGI DARI AWAL — semua kembali ke awal, musik tetap jalan
   ============================================================ */
$('#replayBtn').addEventListener('click', function () {
  world.style.transition = 'opacity 1s ease, transform 1s ease';
  world.style.opacity = '0';
  world.style.transform = 'scale(.99)';
  setTimeout(function () {
    window.scrollTo(0, 0);
    video.pause(); video.currentTime = 0; videoCover.classList.remove('gone');
    keepsakeGift.classList.remove('is-open');
    keepsakeCard.classList.remove('show');
    if (giftHint2) giftHint2.style.opacity = '';
    letterFlow.classList.remove('is-open');
    envBox.classList.remove('is-open');
    if (envHint) envHint.style.opacity = '';
    resetReveals();
    world.classList.add('is-hidden');
    world.style.opacity = '';
    world.style.transform = '';
    intro.classList.remove('is-opening');
    intro.classList.remove('intro--leaving');
    intro.classList.remove('is-bday');
    intro.classList.remove('is-hb');
    intro.classList.remove('is-hb-out');
    if (skipCd) skipCd.style.display = '';
    openBtn.disabled = false;
    opening = false;
    bdayShown = false;
    hbTimers.forEach(clearTimeout);
    runCountdown();
    /* galeri kembali ke scene pertama */
    if (gScenes.length) {
      gScenes.forEach(function (sc, i) { sc.classList.toggle('is-active', i === 0); });
      gIdx = 0; gSync();
    }
  }, RM ? 60 : 950);
});
})();
