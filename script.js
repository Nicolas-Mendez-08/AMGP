
  document.addEventListener('DOMContentLoaded', () => {
    const btnNo    = document.querySelector('.btn-no');
    const btnSi    = document.querySelector('.btn-si');
    const recuadro = document.querySelector('.recuadro');
    const botones  = document.querySelector('.botones');

    /* ===== Rutas ===== */
    const slides = [
      { src: 'img/portada.png',   alt: 'Portada Rayitos de Esperanza', caption: 'Portada' },
      { src: 'img/Pagina 1.png',  alt: 'Página 1', caption: 'Capítulo 1' },
      { src: 'img/Pagina 2.png',  alt: 'Página 2', caption: '' },
      { src: 'img/Pagina 3.png',  alt: 'Página 3', caption: '' },
      { src: 'img/Pagina 4.png',  alt: 'Página 4', caption: '' },
      { src: 'img/Pagina 5.png',  alt: 'Página 5', caption: '' },
      { src: 'img/Pagina 6.png',  alt: 'Página 6', caption: '' },
      { src: 'img/Pagina 7.png',  alt: 'Página 7', caption: '' },
      { src: 'img/Pagina 8.png',  alt: 'Página 8', caption: '' },
      { src: 'img/Pagina 9.png',  alt: 'Página 9', caption: '' },
      { src: 'img/Pagina 10.png', alt: 'Página 10', caption: 'Final' }
    ];

    /* ===== Botón "No" que huye ===== */
    const PADDING = 10, FALL_TIME_MS = 1200;
    const clamp = (v,min,max)=>Math.min(max,Math.max(min,v));
    const relPos = (el, container) => {
      const a = el.getBoundingClientRect(), b = container.getBoundingClientRect();
      return { left:a.left-b.left, top:a.top-b.top, width:a.width, height:a.height };
    };
    const bounds = () => ({
      maxLeft: recuadro.clientWidth  - btnNo.offsetWidth  - PADDING,
      maxTop:  recuadro.clientHeight - btnNo.offsetHeight - PADDING
    });
    function overlapsSi(x,y){
      const a = { x, y, w: btnNo.offsetWidth, h: btnNo.offsetHeight };
      const s = relPos(btnSi, recuadro);
      const b = { x:s.left, y:s.top, w:s.width, h:s.height };
      return !(a.x+a.w<b.x || a.x>b.x+b.w || a.y+a.h<b.y || a.y>b.y+b.h);
    }
    function moverBoton(){
      const b = bounds(); let left, top, tries=0;
      do { left = Math.random()*(b.maxLeft-PADDING)+PADDING; top = Math.random()*(b.maxTop-PADDING)+PADDING; tries++; }
      while (overlapsSi(left, top) && tries<25);
      btnNo.style.position='absolute'; btnNo.style.left=left+'px'; btnNo.style.top=top+'px'; btnNo.style.zIndex=2;
    }
    function placeNoNextToSi(){
      btnNo.style.position='absolute'; btnNo.style.zIndex=2;
      const posSi = relPos(btnSi, recuadro), gap=12;
      let left = posSi.left + posSi.width + gap, top = posSi.top;
      if (left > recuadro.clientWidth - btnNo.offsetWidth - PADDING) left = posSi.left - btnNo.offsetWidth - gap;
      const b = bounds();
      btnNo.style.left = clamp(left, PADDING, b.maxLeft)+'px';
      btnNo.style.top  = clamp(top,  PADDING, b.maxTop)+'px';
    }
    function clampCurrent(){
      const b = bounds();
      const left = clamp(parseFloat(btnNo.style.left)||0, PADDING, b.maxLeft);
      const top  = clamp(parseFloat(btnNo.style.top)||0,  PADDING, b.maxTop);
      btnNo.style.left = left + 'px'; btnNo.style.top = top + 'px';
    }
    btnNo.addEventListener('mouseenter', moverBoton);
    btnNo.addEventListener('touchstart', (e)=>{ e.preventDefault(); moverBoton(); }, {passive:false});
    btnNo.addEventListener('click', ()=>{ if ('ontouchstart' in window) moverBoton(); });
    window.addEventListener('resize', clampCurrent);
    placeNoNextToSi();

    /* ===== Fragmentación de texto ===== */
    function explodeTextOf(el, fragmentsOut, fragRoot) {
      const rect   = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      const text   = (el.innerText || '').replace(/\s+/g,' ').trim();
      if (!text) return;
      const posEl = relPos(el, recuadro);
      const xStep = rect.width / Math.max(1, text.length);
      const midY  = posEl.top + rect.height/2;
      for (let i=0;i<text.length;i++){
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.position='absolute';
        span.style.left=(posEl.left + xStep*i)+'px';
        span.style.top = midY+'px';
        span.style.font=styles.font; span.style.color=styles.color; span.style.textShadow=styles.textShadow;
        span.style.transform='translate3d(0,0,0) rotate(0deg)'; span.style.opacity='1';
        span.style.willChange='transform,opacity';
        span.style.transition='transform 1s cubic-bezier(.17,.67,.83,.67), opacity 1s';
        fragRoot.appendChild(span); fragmentsOut.push(span);
      }
    }

    /* ===== Carrusel ===== */
    function mountCarousel(container, slides){
      const root = document.createElement('div'); root.className='carousel'; root.role='region'; root.ariaLabel='Historia';
      root.innerHTML = `
        <div class="c-frame">
          <img class="c-img" alt="" draggable="false">
          <div class="c-topbar">
            <div class="c-title">Rayitos de Esperanza</div>
            <div class="c-progress"><span class="c-index">1</span>/<span class="c-total">${slides.length}</span></div>
          </div>
          <div class="c-caption"></div>
          <button class="c-navbtn c-prev" aria-label="Anterior" title="Anterior">◀</button>
          <button class="c-navbtn c-next" aria-label="Siguiente" title="Siguiente">▶</button>
        </div>
      `;
      container.appendChild(root);

      const img = root.querySelector('.c-img');
      const cap = root.querySelector('.c-caption');
      const idxEl = root.querySelector('.c-index');
      const btnPrev = root.querySelector('.c-prev');
      const btnNext = root.querySelector('.c-next');

      let i = 0, total = slides.length, startX = 0;

      function preload(k){ if (k>=0 && k<total){ const n = new Image(); n.src = slides[k].src; } }

      function show(k){
        i = (k+total)%total;
        idxEl.textContent = i+1;
        btnPrev.disabled = (i===0);

        img.classList.remove('show'); // fade out
        const s = slides[i];
        const pre = new Image(); pre.src = s.src;
        pre.onload = ()=>{
          img.src = s.src; img.alt = s.alt || ''; cap.textContent = s.caption || '';
          requestAnimationFrame(()=> img.classList.add('show'));
        };
        preload(i+1);
      }

      // Controles
      btnPrev.addEventListener('click', ()=> show(i-1));
      btnNext.addEventListener('click', ()=>{
        if (i === total-1){
          // Pantalla final personalizada
          root.innerHTML =
            '<div style="position:absolute;inset:0;display:grid;place-items:center;gap:22px;text-align:center">' +
              '<div style="font-family:Great Vibes,cursive;font-size:2.4rem;color:#ffd4d6;text-shadow:0 2px 8px #000">… lo más bonito del mundo es tu sonrisa ✨</div>' +
              '<button style="padding:12px 18px;border:none;border-radius:12px;font-weight:800;color:#fff;background:#e53935;box-shadow:0 2px 8px #0006;cursor:pointer" onclick="location.reload()">Volver al inicio</button>' +
            '</div>';
          return;
        }
        show(i+1);
      });

      // Teclado y swipe
      root.tabIndex = 0; root.focus();
      root.addEventListener('keydown', (e)=>{ if (e.key==='ArrowRight') btnNext.click(); if (e.key==='ArrowLeft') btnPrev.click(); });
      root.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
      root.addEventListener('touchend', (e)=>{
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx)>40){ dx<0 ? btnNext.click() : btnPrev.click(); }
      }, {passive:true});

      requestAnimationFrame(()=> root.classList.add('ready'));
      show(0);
    }

    /* ===== Click en “Sí”: animación + carrusel ===== */
    btnSi.addEventListener('click', () => {
      btnSi.disabled = true; btnNo.disabled = true; recuadro.style.pointerEvents = 'none';

      const fragmentos = []; const fragRoot = document.createDocumentFragment();
      const elementos = Array.from(document.querySelectorAll('.titulo, .subtitulo, .btn'));
      elementos.forEach(el => explodeTextOf(el, fragmentos, fragRoot));
      recuadro.appendChild(fragRoot);
      elementos.forEach(el => el.style.opacity = 0); if (botones) botones.style.opacity = 0;

      requestAnimationFrame(() => {
        fragmentos.forEach(span => {
          const x = (Math.random()-0.5)*400, y = Math.random()*500 + 100, r = (Math.random()-0.5)*720;
          span.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`; span.style.opacity = '0';
        });
        setTimeout(() => {
          recuadro.innerHTML = '';
          mountCarousel(recuadro, slides);
        }, FALL_TIME_MS + 80);
      });
    });
  });
