/* NMA — a tiny, entirely offline universe. No network requests or libraries. */
(() => {
  'use strict';
  const P = window.NMA_CONFIG;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const app = $('#app');
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const personalize = value => String(value).replace(/\{(name|nickname|joke|treat)\}/g, (_, key) => ({name:P.name,nickname:P.nickname,joke:P.insideJoke,treat:P.favoriteTreat}[key]));
  const tx = value => esc(personalize(value));
  const messages = key => tx(P.messages[key] || '');
  const storageKey = 'nma-little-universe-v1';
  const fresh = () => ({ version:1, scene:0, intro:0, stars:[], reward:0, constellation:0, cookie:{stage:0,shape:'heart',ingredients:[],stirs:0,toppings:[],baked:false}, memory:{deck:[],matched:[]}, joke:{caught:false,order:[],beats:0,secret:false}, quiz:{index:0,answers:[],reaction:false}, riddle:false, finale:0 });
  let state = fresh(), storageOK = true, screenCleanup = () => {}, sceneTimer = 0;
  let settings = { music:P.music.enabledByDefault, reduced:P.effects.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches };
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey));
    if (raw?.version === 1 && Number.isInteger(raw.scene) && raw.scene >= 0 && raw.scene <= 7 && Array.isArray(raw.stars)) state = {...fresh(),...raw};
    const savedSettings = JSON.parse(localStorage.getItem(storageKey + '-settings'));
    if (savedSettings) settings = {...settings,...savedSettings};
  } catch { storageOK = false; }
  function save() { try { localStorage.setItem(storageKey,JSON.stringify(state)); } catch { storageOK = false; } }
  function saveSettings() { try { localStorage.setItem(storageKey+'-settings',JSON.stringify(settings)); } catch {} }
  let toastTimer;
  function toast(message) { $('#toast').textContent = personalize(message); $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'),3400); }
  function announce(message) { $('#announcer').textContent = ''; requestAnimationFrame(() => { $('#announcer').textContent = personalize(message); }); }
  function listen(selector, event, fn, root = app) { const el = $(selector,root); if(el) el.addEventListener(event,fn); return el; }
  function lumi(text, extra = '') { return `<div class="lumi-dialogue"><span class="lumi ${extra}" aria-hidden="true"><img src="assets/star.svg" alt=""></span><p><strong>LUMI, YOUR LITTLE GUIDE</strong>${text}</p></div>`; }
  const titles = ['','Your name is written<br>in the <em>stars.</em>','A little flour.<br>A lot of <em>love.</em>','Two hearts.<br>One little <em>galaxy.</em>','Our very own<br>little <em>language.</em>','One in the<br>entire <em>universe.</em>','The heart<br>behind the <em>moon.</em>'];
  const places = ['','THE FLOATING OBSERVATORY','THE ENCHANTED COOKIE BAKERY','THE GARDEN ABOVE THE CLOUDS','THE WJIIIIII CARNIVAL','THE CELESTIAL LIBRARY','THE MOONLIT LAKE'];
  const rewards = ['','Wonder','Sweetness','Connection','Laughter','Uniqueness','Love'];
  const guidance = ['','Tap the glowing stars in number order. Draw three little letters, and see who the sky has been thinking of.','Choose, mix, swirl, sprinkle, bake. A tiny recipe with a very sweet secret inside.','Find five things that belong together. Turn over two cards at a time and follow your heart.','A cheeky cloud scattered our secret word. Catch it, put it together, and give it a heartbeat.','Four little questions. A suspicious number of compliments. Every answer is a lovely answer.','Five little stars have led you here. One answer will open something made just for you.'];
  const speechKeys = ['','stars','bakery','pairs','joke','quiz','moon'];
  const hints = ['','Each letter starts at 1. Tap the numbered points in order; the next point has a glowing ring. You can also draw across them.','Tap ingredients or drag them to the bowl. Stir in a circle, or use “Stir once.” Then pick any three toppings. Bake when the light is in the gold zone.','The five pairs are shown below the cards. Cookie goes with milk, moon with stars, flower with butterfly, key with heart lock, and letter with envelope.','The pieces spell W + j + iii + iii. Catch the moving piece first, then tap pieces in order or drag them into the next empty space. Tap each heart when it glows.','Choose whichever answer feels most like you. Every choice continues the adventure.','A few little words can hold a whole universe of love. The answer is “A secret message.”'];
  function journey() { return `<div class="journey" aria-label="${state.stars.length} of 6 stars collected">${rewards.slice(1).map((v,i) => `${i?'<i aria-hidden="true"></i>':''}<span class="${state.stars.includes(i+1)?'earned':state.scene===i+1?'current':''}" title="${v}" aria-label="${v}${state.stars.includes(i+1)?' collected':''}">✦</span>`).join('')}</div>`; }
  function destination(n) {
    const art={
      1:'<circle cx="525" cy="80" r="120" stroke="#dfc7c6" stroke-opacity=".12"/><circle cx="525" cy="80" r="144" stroke="#dfc7c6" stroke-opacity=".07"/><path d="M0 405Q140 325 300 405T600 405" stroke="#b49cb6" stroke-opacity=".14"/><path d="M0 420Q140 340 300 420T600 420" stroke="#b49cb6" stroke-opacity=".1"/>',
      2:'<g fill="#c9a2c0" opacity=".22"><path d="M0 408c0-55 55-60 70-25 20-65 95-60 109-8 25-30 70-21 75 13 32-22 65-6 68 25l-2 30H0Z"/><path d="M370 430c-9-38 32-62 56-29 10-57 75-60 96-15 41-40 79-7 78 44Z"/></g><g fill="#ac7f9e" opacity=".26"><path d="M32 399V297l60-36 60 36v102Z"/><path d="M20 298 92 250l73 48Z"/><path d="M54 319h76v15H54Z"/></g><path d="M73 393v-34a19 19 0 0 1 38 0v34" fill="#e9bb92" opacity=".2"/><text x="84" y="318" fill="#f1cbad" opacity=".4" font-size="26">♡</text><ellipse cx="510" cy="62" rx="39" ry="12" stroke="#ceadbf" stroke-opacity=".17" transform="rotate(-25 510 62)"/><circle cx="510" cy="62" r="23" fill="#ceadbf" opacity=".1"/>',
      3:'<g stroke="#a9b9a1" stroke-width="2" opacity=".25"><path d="M28 430q35-55 8-140M74 430q-15-50 13-94M570 430q-36-75-10-144M526 430q13-62-10-104"/></g><g fill="#a9b9a1" opacity=".2"><ellipse cx="24" cy="350" rx="9" ry="25" transform="rotate(-35 24 350)"/><ellipse cx="47" cy="380" rx="9" ry="25" transform="rotate(35 47 380)"/><ellipse cx="547" cy="365" rx="9" ry="25" transform="rotate(-35 547 365)"/><ellipse cx="577" cy="332" rx="9" ry="25" transform="rotate(35 577 332)"/></g><g fill="#ddb4ca" opacity=".35"><circle cx="36" cy="290" r="9"/><circle cx="27" cy="298" r="9"/><circle cx="45" cy="298" r="9"/><circle cx="36" cy="307" r="9"/><circle cx="560" cy="286" r="10"/><circle cx="548" cy="296" r="10"/><circle cx="572" cy="296" r="10"/></g><path d="M40 65c-35-40-43 5 0 13 35-40 43 5 0-13M558 102c-25-30-33 5 0 10 25-30 33 5 0-10" fill="#e9c88f" opacity=".22"/>',
      4:'<path d="M-20 0Q300 160 620 0" stroke="#d6b4ca" stroke-opacity=".2"/><g fill="#dea2c4" opacity=".2"><path d="m65 35 26 11-22 29zM151 62l28 6-20 28zM240 76l27 2-15 28zM333 77l28-3-10 29zM425 61l28-7-6 30zM510 35l26-11-1 31z"/></g><g fill="#ca9ac5" opacity=".15"><path d="M10 430c-10-35 25-58 50-30 5-40 56-45 70-7 30-21 58 3 52 37Z"/><path d="M420 430c-10-35 25-58 50-30 5-40 56-45 70-7 30-21 58 3 52 37Z"/></g>',
      5:'<g stroke="#d2b18d" stroke-opacity=".1" fill="none"><path d="M25 0v430M575 0v430M0 100h600M0 220h600M0 340h600"/><path d="M35 30h20v65H35zM60 20h15v75H60zM81 36h25v60H81zM525 150h18v65h-18zM550 137h14v78h-14z"/></g>',
      6:'<circle cx="520" cy="50" r="65" fill="#d8d0e6" opacity=".07"/><g stroke="#c4c6e9" stroke-opacity=".14"><path d="M0 355q150-10 300 0t300 0M40 372q120-10 240 0t280 0M0 392q160-10 320 0t280 0M60 412q130-10 260 0t250 0"/></g>'
    };
    return `<svg class="scene-decor" viewBox="0 0 600 430" preserveAspectRatio="xMidYMax slice" fill="none" aria-hidden="true">${art[n]}</svg>`;
  }
  function chapter(content) { const n=state.scene; app.innerHTML = `<section class="chapter">${journey()}<div class="chapter-grid"><div class="chapter-copy"><span class="eyebrow">0${n} / 06 · ${places[n]}</span><h2>${titles[n]}</h2><p class="description">${guidance[n]}</p>${lumi(messages(speechKeys[n]),n===2?'chef':'')}<details class="help"><summary>✧ A little help from Lumi</summary><p>${hints[n]}</p><button class="text-button" id="skip-puzzle">Let Lumi finish this challenge →</button></details></div><div><div class="game ${n===6?'moon-stage':''}">${destination(n)}${content}</div><p class="scene-note">No rush, ${esc(P.nickname)}. The stars can wait for you.</p></div></div></section>`;
    listen('#skip-puzzle','click',() => { if(n===2){state.cookie.baked=true;state.cookie.stage=5; if(!state.cookie.toppings.length) state.cookie.toppings=['heart','chip','star'];} if(n===6)state.riddle=true; complete(n); });
  }
  function render(focus = false) {
    screenCleanup(); screenCleanup=()=>{}; clearTimeout(sceneTimer);
    document.body.dataset.scene=String(state.scene);
    $('#star-count').textContent = `${state.stars.length} / 6`;
    if (state.reward) renderReward();
    else [renderIntro,renderConstellation,renderBakery,renderMemory,renderJoke,renderQuiz,renderMoon,renderFinale][state.scene]();
    if(focus) { app.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
    save();
  }
  function fly(next) { if(settings.reduced){next();return;} $('#flight').classList.add('active'); setTimeout(next,280); setTimeout(()=>$('#flight').classList.remove('active'),650); }
  function go(scene) { state.scene=scene;state.reward=0;$$('.floating-cookie').forEach(el=>el.remove());save();fly(()=>render(true)); }
  function complete(n) { if(state.reward) return; if(!state.stars.includes(n))state.stars.push(n);state.reward=n;chime('win');save();render(true);burst('✦'); }

  function renderIntro() {
    const progress = state.stars.length > 0 || state.constellation > 0 || state.cookie.stage > 0;
    const introIndex = Math.min(state.intro,P.messages.welcome.length-1);
    const invite = state.intro >= P.messages.welcome.length;
    app.innerHTML = `<section class="hero ${invite?'inviting':''}"><div class="hero-copy"><span class="eyebrow">A SMALL ADVENTURE. AN INFINITE AMOUNT OF LOVE.</span><h1>The little universe<br>that <em>loves you.</em></h1><p class="subtitle">Seven minutes of magic, made for one very special girl.</p>${invite?`<div class="intro-envelope"><h3>Dear ${esc(P.name)},</h3><p>${messages('invitation')}</p></div>`:lumi(tx(P.messages.welcome[introIndex]))}${!invite?`<div class="intro-step"><span>A MESSAGE FROM THE STARS</span><button class="text-button" id="intro-next">${state.intro===0?'Meet Lumi':'And then?'} →</button></div>`:''}<div class="actions">${progress?'<button class="primary" id="resume">Continue our adventure ✧</button>':''}<button class="${progress?'secondary':'primary'}" id="begin">Let's gooo! ♡</button><button class="text-button" id="cookie-start">Only if there are cookies 🍪</button></div><div class="hero-path">6 LITTLE CHALLENGES <span>✧</span> 1 SECRET JUST FOR YOU</div><p class="micro">${storageOK?'Your magic is saved on this device.':'Progress saving is unavailable in this browser; keep this tab open.'} Sound is optional.</p></div><div class="hero-art" aria-label="An illustrated moonlit observatory floating among pink clouds"><img src="assets/universe.svg" alt="A golden crescent moon cradles a glass observatory on a floating island, surrounded by stars and lavender clouds."><span class="cookie-meteor" aria-hidden="true">🍪</span><span class="orbital-label">a whole sky, just for ${esc(P.name)} ♡</span></div></section>`;
    listen('#intro-next','click',()=>{state.intro++;chime();render();});
    if(!invite) sceneTimer=setTimeout(()=>{if(state.scene===0){state.intro++;render();}},state.intro===0?3500:4800);
    const start = cookies => {audioStart();if(cookies)toast(P.messages.cookieEntry);go(1);};
    listen('#begin','click',()=>start(false));listen('#cookie-start','click',()=>start(true));
    listen('#resume','click',()=>{audioStart();const next=[1,2,3,4,5,6].find(n=>!state.stars.includes(n));go(next||7);});
  }

  const letterPaths = [ [[28,76],[28,30],[72,76],[72,30]], [[17,76],[17,30],[50,60],[83,30],[83,76]], [[20,76],[50,25],[80,76],[65,51],[35,51]] ];
  function renderConstellation() {
    const total=state.constellation; if(total>=14){complete(1);return;}
    const letter=total<4?0:total<9?1:2, offset=[0,4,9][letter], pts=letterPaths[letter];
    let connected=total-offset,finished=false;
    const lines=pts.slice(1,connected).map((p,i)=>`<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${p[0]}" y2="${p[1]}"/>`).join('');
    chapter(`<div class="game-header"><span>CONNECT THE CONSTELLATION</span><span>${letter+1} OF 3</span></div><div class="constellation-progress">${['N','M','A'].map((v,i)=>i<letter?`<b>${v}</b>`:v).join(' ')}</div><div class="constellation" id="star-field"><div class="mini-moon"></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>${pts.map((p,i)=>`<button class="star-point ${i<connected?'done':i===connected?'next':''}" style="left:${p[0]}%;top:${p[1]}%" data-point="${i}" aria-label="Star ${i+1}${i<connected?', connected':''}"><span class="point-glyph">✦</span><small>${i+1}</small></button>`).join('')}</div><div class="hint-inline">${connected===0?'Begin with star 1. A name is hiding here.':`Beautiful. Now find star ${connected+1}.`}</div>`);
    const connect = i => {
      if(finished)return;
      if(i!==connected){if(i>connected)toast(`Follow the glow — star ${connected+1} is next.`);return;}
      state.constellation++;connected++;chime('star',i);save();
      $$('.star-point',app).forEach((el,index)=>{el.classList.toggle('done',index<connected);el.classList.toggle('next',index===connected);el.setAttribute('aria-label',`Star ${index+1}${index<connected?', connected':''}`);});
      $('#star-field svg').innerHTML=pts.slice(1,connected).map((p,index)=>`<line x1="${pts[index][0]}" y1="${pts[index][1]}" x2="${p[0]}" y2="${p[1]}"/>`).join('');
      $('.hint-inline',app).textContent=connected===pts.length?`${['N','M','A'][letter]} — a little more of your name in the sky. ♡`:`Beautiful. Now find star ${connected+1}.`;
      if(connected===pts.length){finished=true;sceneTimer=setTimeout(()=>state.constellation>=14?complete(1):render(),settings.reduced?0:550);}
    };
    $$('.star-point',app).forEach(el=>el.addEventListener('click',()=>connect(+el.dataset.point)));
    const field=$('#star-field',app);
    let drawing=false;
    const trace=e=>{if(!drawing)return;const b=field.getBoundingClientRect();const p=letterPaths[letter][state.constellation-offset];if(!p)return;const dx=e.clientX-(b.left+b.width*p[0]/100),dy=e.clientY-(b.top+b.height*p[1]/100);if(Math.hypot(dx,dy)<29)connect(state.constellation-offset);};
    field.addEventListener('pointerdown',e=>{drawing=true;field.setPointerCapture(e.pointerId);trace(e);});
    field.addEventListener('pointermove',trace);field.addEventListener('pointerup',()=>drawing=false);field.addEventListener('pointercancel',()=>drawing=false);
  }

  function cookieSVG(shape=state.cookie.shape,toppings=state.cookie.toppings) {
    const paths={heart:'M100 165C76 143 20 108 20 64 20 20 76 10 100 49 124 10 180 20 180 64 180 108 124 143 100 165Z',moon:'M143 23A79 79 0 1 0 157 151 68 68 0 0 1 143 23Z',star:'M100 15 123 65 180 72 139 112 150 170 100 142 50 170 61 112 20 72 77 65Z'};
    const spots=[[75,75],[105,112],[125,75],[61,106],[99,60],[132,112],[83,134],[108,85],[57,74]];
    const deco=toppings.flatMap((type,i)=>[0,1,2].map(j=>{const [x,y]=spots[(i*3+j)%spots.length];if(type==='chip')return `<path d="M${x-5} ${y+4}q-2-10 5-12l6 12Z" fill="#68413b"/>`;if(type==='star')return `<text x="${x}" y="${y}" fill="#fff0a3" font-size="18" text-anchor="middle">✦</text>`;if(type==='heart')return `<text x="${x}" y="${y}" fill="#d97f9d" font-size="17" text-anchor="middle">♥</text>`;return `<path d="m${x-5} ${y} 9 3" stroke="#f8e5e7" stroke-width="5" stroke-linecap="round"/>`;})).join('');
    return `<svg class="cookie-svg" viewBox="0 0 200 190" role="img" aria-label="A ${shape} cookie with ${toppings.length} toppings"><defs><linearGradient id="dough-${shape}" x2="0.8" y2="1"><stop stop-color="#f3d298"/><stop offset="1" stop-color="#ba804b"/></linearGradient><clipPath id="cookie-clip-${shape}"><path d="${paths[shape]}"/></clipPath></defs><path d="${paths[shape]}" fill="url(#dough-${shape})" stroke="#f6ddb0" stroke-width="3"/><g clip-path="url(#cookie-clip-${shape})"><g fill="#a8764f" opacity=".35"><circle cx="68" cy="63" r="2"/><circle cx="90" cy="93" r="3"/><circle cx="123" cy="130" r="2"/><circle cx="120" cy="53" r="2"/><circle cx="49" cy="85" r="2"/></g>${deco}</g></svg>`;
  }
  const ingredients=[['sugar','✧','Stardust sugar'],['flour','☾','Moonlight flour'],['magic','♡','A drop of magic']];
  const toppings=[['heart','💗','Hearts'],['chip','🍫','Chips'],['star','✦','Stars'],['icing','〰','Icing']];
  function renderBakery() {
    const c=state.cookie;
    let inner='';
    if(c.stage===0) inner=`<h3>Every cookie starts with a wish.</h3><p>Choose a shape for your little masterpiece.</p><div class="choice-row">${['heart','moon','star'].map(s=>`<button class="shape-choice" data-shape="${s}">${cookieSVG(s,[])}<span>${s[0].toUpperCase()+s.slice(1)}</span></button>`).join('')}</div>`;
    if(c.stage===1) inner=`<h3>A pinch of something magical.</h3><p>Drag each ingredient into the bowl, or simply tap it.</p><div class="ingredients">${ingredients.map(([id,icon,label])=>`<button class="ingredient ${c.ingredients.includes(id)?'added':''}" data-ingredient="${id}" ${c.ingredients.includes(id)?'disabled':''}><span class="emoji">${icon}</span>${label}</button>`).join('')}</div><div class="mix-bowl" id="mix-bowl" aria-label="Mixing bowl"><span>${c.ingredients.length?'✧':'♡'}</span></div><div class="hint-inline">${c.ingredients.length} / 3 lovely ingredients</div>`;
    if(c.stage===2) inner=`<h3>A little swirl of love.</h3><p>Draw three circles around the bowl, or tap “Stir once” three times.</p><div class="stir-zone" id="stir-zone"><div class="mix-bowl"><span>✧</span></div><span class="spoon" id="spoon">🥄</span></div><div class="meter"><span style="width:${c.stirs/3*100}%"></span></div><button class="secondary" id="stir-once">Stir once ↻ · ${c.stirs} / 3</button>`;
    if(c.stage===3) inner=`<h3>Make it a little more you.</h3><p>Choose any three toppings. Repeats are deliciously welcome.</p><div class="cookie-display">${cookieSVG()}</div><div class="topping-row">${toppings.map(([id,icon,label])=>`<button class="topping" data-topping="${id}"><span class="emoji">${icon}</span>${label}</button>`).join('')}</div><div class="hint-inline">${c.toppings.length} / 3 sweet finishing touches</div>${c.toppings.length?'<button class="text-button" id="undo-topping">Undo last sprinkle</button>':''}`;
    if(c.stage===4) inner=`<h3>Ready for a little oven magic?</h3><p>Tap the oven when the light reaches the gold zone. Unlimited tries, always.</p><button class="oven" id="bake" aria-label="Bake cookie in the gold zone">${cookieSVG()}</button><div class="timing-track"><span class="sweet-zone"></span><span class="needle" id="bake-needle"></span></div><button class="text-button" id="easy-bake">Use a gentle, untimed bake</button><div class="hint-inline" id="bake-status">Gold means perfectly golden. ✧</div>`;
    if(c.stage>=5){complete(2);return;}
    chapter(`<div class="game-header"><span>CHEF ${esc(P.nickname)}</span><span>${c.stage+1} / 5</span></div><div class="bake-stage">${inner}</div>`);
    $$('[data-shape]',app).forEach(el=>el.addEventListener('click',()=>{c.shape=el.dataset.shape;c.stage=1;chime();render();}));
    const addIngredient=id=>{if(c.ingredients.includes(id))return;c.ingredients.push(id);chime();if(c.ingredients.length===3)c.stage=2;render();};
    $$('[data-ingredient]',app).forEach(el=>makeDraggable(el,()=>$('#mix-bowl',app),()=>addIngredient(el.dataset.ingredient),el.textContent.trim()));
    const stir=()=>{c.stirs++;chime();if(c.stirs>=3)c.stage=3;render();};listen('#stir-once','click',stir);
    const stirZone=$('#stir-zone',app);if(stirZone){let angle=null,travel=0,down=false;const getAngle=e=>{const b=stirZone.getBoundingClientRect();return Math.atan2(e.clientY-b.top-b.height/2,e.clientX-b.left-b.width/2);};stirZone.addEventListener('pointerdown',e=>{down=true;angle=getAngle(e);stirZone.setPointerCapture(e.pointerId);});stirZone.addEventListener('pointermove',e=>{if(!down)return;const a=getAngle(e);let d=a-angle;while(d>Math.PI)d-=2*Math.PI;while(d< -Math.PI)d+=2*Math.PI;travel+=Math.abs(d);angle=a;$('#spoon').style.transform=`rotate(${a*180/Math.PI}deg)`;if(travel>=Math.PI*1.65){down=false;stir();}});stirZone.addEventListener('pointerup',()=>{down=false;});}
    $$('[data-topping]',app).forEach(el=>el.addEventListener('click',()=>{c.toppings.push(el.dataset.topping);chime();if(c.toppings.length>=3)c.stage=4;render();}));
    listen('#undo-topping','click',()=>{c.toppings.pop();render();});
    if(c.stage===4){let frame,pos=0;const start=performance.now();const tick=now=>{pos=(Math.sin((now-start)/1100)+1)/2;const el=$('#bake-needle');if(el)el.style.left=`${pos*98}%`;frame=requestAnimationFrame(tick);};if(!settings.reduced)frame=requestAnimationFrame(tick);else{pos=.5;$('#bake-needle').style.left='49%';}screenCleanup=()=>cancelAnimationFrame(frame);const done=()=>{c.baked=true;c.stage=5;complete(2);};listen('#easy-bake','click',done);listen('#bake','click',()=>{if(pos>=.28&&pos<=.72)done();else{chime('soft');$('#bake-status').textContent='One more little try! Wait for the gold glow. ♡';}});}
  }
  function makeDraggable(el,target,activate,label) {
    let start=null,ghost=null,moved=false,suppress=false;
    el.addEventListener('pointerdown',e=>{if(el.disabled)return;start={x:e.clientX,y:e.clientY};moved=false;el.setPointerCapture(e.pointerId);});
    el.addEventListener('pointermove',e=>{if(!start)return;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>8){moved=true;if(!ghost){ghost=document.createElement('div');ghost.className='drag-ghost';ghost.textContent=label;document.body.append(ghost);}ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';}});
    el.addEventListener('pointerup',e=>{if(!start)return;start=null;if(ghost){ghost.remove();ghost=null;}if(moved){suppress=true;const t=target();if(t){const b=t.getBoundingClientRect();if(e.clientX>=b.left-20&&e.clientX<=b.right+20&&e.clientY>=b.top-20&&e.clientY<=b.bottom+20)activate();else toast('Bring it a little closer, or tap it instead.');}setTimeout(()=>suppress=false,0);}});
    el.addEventListener('pointercancel',()=>{start=null;if(ghost)ghost.remove();ghost=null;});
    el.addEventListener('click',()=>{if(!suppress)activate();});
  }

  function shuffled(list) {const out=[...list];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
  function renderMemory() {
    const m=state.memory;
    if(!m.deck.length)m.deck=shuffled(P.pairs.flatMap((pair,p)=>[0,1].map(side=>({pair:p,side}))));
    const cards=m.deck.map((c,i)=>{const p=P.pairs[c.pair],matched=m.matched.includes(c.pair);return `<button class="memory-card ${matched?'matched':''}" data-card="${i}" aria-label="${matched?esc(p.labels[c.side])+', matched':`Hidden card ${i+1}`}" ${matched?'disabled':''}><span class="card-inner"><span class="card-front" aria-hidden="true">✧</span><span class="card-back" aria-hidden="true">${p.icons[c.side]}<small>${esc(p.labels[c.side])}</small></span></span></button>`;}).join('');
    chapter(`<div class="game-header"><span>BEAUTIFUL THINGS BELONG TOGETHER</span><span id="pair-count">${m.matched.length} / ${P.pairs.length} PAIRS</span></div><div class="memory-grid">${cards}</div><div class="pair-guide" aria-label="Pair guide">${P.pairs.map(p=>`<span title="${esc(p.labels.join(' + '))}">${p.icons.join(' + ')}</span>`).join('')}</div><p class="pair-message" id="pair-message">A little remembering. A little magic.</p><button class="text-button" id="peek">Lumi, a little peek? ✧</button>`);
    let open=[],busy=false,timer;
    const labelHidden=el=>el.setAttribute('aria-label',`Hidden card ${+el.dataset.card+1}`);
    $$('[data-card]',app).forEach(el=>el.addEventListener('click',()=>{const i=+el.dataset.card;if(busy||open.includes(i)||m.matched.includes(m.deck[i].pair))return;el.classList.add('revealed');el.setAttribute('aria-label',P.pairs[m.deck[i].pair].labels[m.deck[i].side]);open.push(i);chime('star',open.length);if(open.length<2)return;const [a,b]=open.map(v=>m.deck[v]);if(a.pair===b.pair){m.matched.push(a.pair);save();open.forEach(v=>{const card=$(`[data-card="${v}"]`,app);card.classList.add('matched');card.disabled=true;card.setAttribute('aria-label',P.pairs[m.deck[v].pair].labels[m.deck[v].side]+', matched');});$('#pair-count').textContent=`${m.matched.length} / ${P.pairs.length} PAIRS`;$('#pair-message').textContent=personalize(P.pairs[a.pair].message);announce(P.pairs[a.pair].message);open=[];chime('win');if(m.matched.length===P.pairs.length){busy=true;timer=setTimeout(()=>complete(3),1300);}}else{busy=true;$('#pair-message').textContent='A lovely pair of possibilities. Try another little combination.';timer=setTimeout(()=>{open.forEach(v=>{const card=$(`[data-card="${v}"]`,app);card.classList.remove('revealed');labelHidden(card);});open=[];busy=false;},1050);}}));
    listen('#peek','click',()=>{if(busy)return;busy=true;$$('[data-card]',app).forEach(el=>{el.classList.add('revealed');const card=m.deck[+el.dataset.card];el.setAttribute('aria-label',P.pairs[card.pair].labels[card.side]);});announce('A little peek: '+m.deck.map(c=>P.pairs[c.pair].labels[c.side]).join(', '));timer=setTimeout(()=>{$$('[data-card]',app).forEach(el=>{if(!open.includes(+el.dataset.card)){el.classList.remove('revealed');if(!m.matched.includes(m.deck[+el.dataset.card].pair))labelHidden(el);}});busy=false;},2200);});
    screenCleanup=()=>clearTimeout(timer);
    if(m.matched.length===P.pairs.length)complete(3);
  }

  function jokePieces() {
    if(P.insideJoke==='Wjiiiiii')return ['W','j','iii','iii'];
    const letters=Array.from(P.insideJoke);return [letters.shift()||'♡',letters.shift()||'♡',letters.splice(0,Math.ceil(letters.length/2)).join('')||'♡',letters.join('')||'♡'];
  }
  function renderJoke() {
    const j=state.joke,pieces=jokePieces();
    if(j.order.length<4){
      const positions=[[5,30],[72,72],[29,85],[51,12]];
      chapter(`<div class="game-header"><span>THE LEGENDARY WJIIIIII CHALLENGE</span><span>${j.order.length} / 4</span></div><div class="fragment-sky"><span class="cloud-face" aria-hidden="true">☁️</span>${[2,0,3,1].map((index,position)=>`<button class="fragment ${j.order.includes(index)?'used':''} ${index===1&&!j.caught?'moving':''}" data-fragment="${index}" style="left:${positions[position][0]}%;top:${positions[position][1]}px" aria-label="${index===1&&!j.caught?'Catch moving piece':'Place piece'} ${esc(pieces[index])}">${esc(pieces[index])}</button>`).join('')}</div><p class="word-target">Our secret word: <strong>${esc(P.insideJoke)}</strong>${!j.caught?' · First, catch the wandering “'+esc(pieces[1])+'”.':''}</p><div class="word-slots">${pieces.map((p,i)=>`<div class="word-slot ${j.order.length>i?'filled':''}" data-slot="${i}" aria-label="Word position ${i+1}">${j.order.length>i?esc(pieces[j.order[i]]):'<span aria-hidden="true">·</span>'}</div>`).join('')}</div><div class="hint-inline">${j.caught?'Tap pieces in order, or drag them into the next space.':'Tap the moving piece to catch it. Keyboard works too.'}</div>`);
      $$('[data-fragment]',app).forEach(el=>{const index=+el.dataset.fragment;const activate=()=>{if(index===1&&!j.caught){j.caught=true;chime();toast('Caught you, little runaway! Now let’s spell our word.');render();return;}if(!j.caught){toast('Catch the wandering piece first — it’s the one dancing around.');return;}if(j.order.includes(index))return;const expected=pieces[j.order.length];if(pieces[index]!==expected){toast('Almost! Follow our secret word, one little piece at a time.');return;}j.order.push(index);chime('star',j.order.length);render();};makeDraggable(el,()=>$(`[data-slot="${j.order.length}"]`,app),activate,pieces[index]);});
    } else {
      if(j.beats>=3){complete(4);return;}
      chapter(`<div class="game-header"><span>GIVE OUR SECRET A HEARTBEAT</span><span>${j.beats} / 3</span></div><p class="joke-burst">${esc(P.insideJoke)}</p><p class="word-target">Tap each heart when its golden light appears.<br>The next little beat always comes around again.</p><div class="rhythm-row">${[0,1,2].map(i=>`<button class="rhythm-heart ${i<j.beats?'hit':''}" data-heart="${i}" aria-label="Heart ${i+1}${i<j.beats?', complete':''}" ${i<j.beats?'disabled':''}>♡</button>`).join('')}</div><p class="hint-inline" id="rhythm-status">Follow the glow, one lovely beat at a time.</p><div style="text-align:center"><button class="text-button" id="easy-rhythm">Use gentle, untimed heart taps</button></div>`);
      let frame,untimed=settings.reduced||j.untimed,lit=!!untimed;const origin=performance.now();
      const tick=now=>{lit=untimed||((now-origin)%1700)>350;const heart=$(`[data-heart="${j.beats}"]`,app);if(heart){heart.classList.toggle('active',lit);heart.setAttribute('aria-label',`Heart ${j.beats+1}${lit?', glowing — tap now':''}`);}frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);screenCleanup=()=>cancelAnimationFrame(frame);
      listen('#easy-rhythm','click',()=>{untimed=true;j.untimed=true;lit=true;save();$('#rhythm-status').textContent='Take your time. Each heart is ready whenever you are.';});
      $$('[data-heart]',app).forEach(el=>el.addEventListener('click',()=>{if(+el.dataset.heart!==j.beats){toast('The next glowing heart is waiting for you.');return;}if(!lit){$('#rhythm-status').textContent='Nearly! Tap when this heart lights up. ♡';return;}j.beats++;chime('star',j.beats);save();if(j.beats===3)complete(4);else render();}));
    }
  }
  function certificate() {return `<div class="book"><div class="certificate"><span class="eyebrow">OFFICIAL UNIVERSE RESULTS</span><span class="seal">✧</span><h3>One of a kind.</h3><dl><dt>Name</dt><dd>${esc(P.name)}</dd><dt>Secret identity</dt><dd>${esc(P.nickname)}</dd><dt>Favorite treasure</dt><dd>${esc(P.favoriteTreat)} 🍪</dd><dt>Secret power</dt><dd>${esc(P.insideJoke)}</dd><dt>Cuteness level</dt><dd>Beyond scientific measurement</dd><dt>Rarity</dt><dd>1 in the entire universe</dd></dl><span class="eyebrow" style="margin:20px 0 0">CERTIFIED WITH LOVE BY LUMI ♡</span></div></div>`;}
  function renderQuiz() {
    const q=state.quiz;
    if(q.index>=P.quiz.length){complete(5);return;}
    const question=P.quiz[q.index],answer=question.answers[q.answers[q.index]];
    chapter(`<div class="book"><div class="game-header"><span>THE VERY SECRET BOOK OF ${esc(P.nickname)}</span><span>${q.index+1} / ${P.quiz.length}</span></div>${q.reaction&&answer?`<div class="quiz-reaction"><span class="quiz-creature" aria-hidden="true">${esc(answer.icon)}</span><p>${tx(answer.reaction)}</p><button class="primary" id="quiz-next">${q.index===P.quiz.length-1?'Reveal my results ✧':'Turn the page →'}</button></div>`:`<h3>${tx(question.question)}</h3><div class="quiz-answers">${question.answers.map((a,i)=>`<button class="quiz-answer" data-answer="${i}"><b>${String.fromCharCode(65+i)}</b><span>${tx(a.text)}</span></button>`).join('')}</div>`}</div>`);
    $$('[data-answer]',app).forEach(el=>el.addEventListener('click',()=>{q.answers[q.index]=+el.dataset.answer;q.reaction=true;chime('win');render();if(q.index===2&&+el.dataset.answer===1){burst('🍪');chime('silly');}}));
    listen('#quiz-next','click',()=>{q.index++;q.reaction=false;render();});
  }
  function renderMoon() {
    if(state.riddle){complete(6);return;}
    chapter(`<div class="game-header"><span>ONE LAST LITTLE SECRET</span><span>♡</span></div><div class="crystal" aria-hidden="true">♡${[-100,-55,0,55,100].map((x,i)=>`<span class="orbit-star" style="--x:${x}px;--y:${[70,20,0,20,70][i]}px">✦</span>`).join('')}</div><p class="riddle">${messages('riddle')}</p><div class="riddle-choices"><button data-riddle="message">A secret message 💌</button><button data-riddle="cookie">A magical cookie 🍪</button><button data-riddle="moon">A sleepy moon 🌙</button></div><p class="hint-inline" id="riddle-reaction"></p><div class="lake" aria-hidden="true"></div>`);
    $$('[data-riddle]',app).forEach(el=>el.addEventListener('click',()=>{if(el.dataset.riddle==='message'){state.riddle=true;complete(6);}else{const text=el.dataset.riddle==='cookie'?'An excellent snack-shaped theory. But this secret is made of words. 🍪':'The moon sends a very sleepy wink. This secret fits inside an envelope. 🌙';$('#riddle-reaction').textContent=text;announce(text);chime('soft');}}));
  }
  function renderReward() {
    const n=state.reward;
    const key=['','wonder','sweetness','connection','laughter','uniqueness','secret'][n];
    const winKey=['','starsWin','bakeryWin','pairsWin','jokeWin','',''][n];
    let special='';
    if(n===1)special=`<h2>${esc(P.name.toUpperCase())} ♡</h2><p class="nickname-reveal">${esc(P.nickname.toUpperCase())} 💗</p>`;
    if(n===2)special=`<div class="cookie-display">${cookieSVG()}<span class="cookie-inscription">${esc(P.name)}'s smile.</span></div><span class="badge">GALACTIC COOKIE QUEEN 👑🍪</span>`;
    if(n===3)special='<h2 style="color:var(--blush);font-size:70px">♡</h2>';
    if(n===4)special=`<div class="sunglass-moon" aria-hidden="true">🌝🕶️</div><button class="joke-burst" id="joke-secret" aria-label="${esc(P.insideJoke)}, tap for more magic">WJIIIIIIIIIIII!!! 💗✨</button><p class="micro">Psst… our secret word has three more little surprises.</p><div id="secret-award">${state.joke.secret?'<span class="secret-cookie">🍪</span><p class="micro">Dancing cookie discovered!</p>':''}</div>`;
    if(n===5)special=certificate();
    if(n===6)special=`<div class="envelope" aria-hidden="true"></div><p class="envelope-label">For ${esc(P.name)}, my ${esc(P.nickname)} 💗</p>`;
    app.innerHTML=`<section class="chapter">${journey()}<div class="reward"><span class="reward-star" aria-hidden="true">✦</span><span class="eyebrow">THE ${['','FIRST','SECOND','THIRD','FOURTH','FIFTH','SIXTH'][n]} STAR · ${rewards[n].toUpperCase()}</span>${special}<p class="romantic">${tx(P.compliments[key])}</p>${winKey?lumi(messages(winKey),n===4?'dance':''):''}<div class="actions">${n===2?'<button class="secondary" id="save-cookie">Save my cookie 🍪</button>':''}<button class="primary" id="next-scene">${n===6?'OPEN YOUR SECRET 💌':'Follow the stars →'}</button></div></div></section>`;
    listen('#next-scene','click',()=>go(n+1));
    listen('#save-cookie','click',()=>{state.cookie.baked=true;save();toast('Your masterpiece is tucked into your keepsakes. 🍪');openKeepsakes();});
    if(n===4){burst('🍪');chime('silly');let taps=0;listen('#joke-secret','click',()=>{taps++;chime('silly');burst('🍪');if(taps>=3){state.joke.secret=true;save();toast(P.messages.easterEgg);$('#secret-award').innerHTML='<span class="secret-cookie">🍪</span><p class="micro">Dancing cookie discovered! Saved in your keepsakes.</p>';}});}
  }
  function renderFinale() {
    if(state.finale===0){
      app.innerHTML=`<section class="finale"><span class="eyebrow">SOME WORDS ARE MEANT FOR ONE PERSON ONLY</span><h2>To my ${esc(P.nickname)},<br><em>${esc(P.name)}… 💌</em></h2><button class="envelope" id="open-letter" aria-label="Open your letter"></button><p class="envelope-label">A whole little universe. One very special you.</p><p class="micro">Tap the heart-shaped seal to unfold your secret.</p><div class="garden-flowers" aria-hidden="true"><span>✿</span><span>❀</span><span>✿</span><span>❀</span><span>✿</span></div></section>`;
      listen('#open-letter','click',()=>{chime('win');audioStart();$('#open-letter').classList.add('opening');sceneTimer=setTimeout(()=>{state.finale=1;render(true);},settings.reduced?0:650);});
    }else if(state.finale===1){
      const paragraphs=P.closingMessage.split(/\n\s*\n/).filter(Boolean);
      app.innerHTML=`<section class="finale"><span class="eyebrow">A LETTER ONLY FOR YOU</span><h2>To my ${esc(P.nickname)},<br><em>${esc(P.name)}… 💌</em></h2><article class="letter-paper" aria-label="Your love letter">${P.personalLetter.trim()?`<div class="personal-letter">${esc(P.personalLetter.trim())}</div>`:''}${paragraphs.map((p,i)=>`<p style="--i:${i}">${esc(p)}</p>`).join('')}</article><p class="micro">Stay here as long as you like. There's one more little surprise.</p><div class="actions"><button class="primary" id="final-surprise">One last little wish ✧</button></div></section>`;
      listen('#final-surprise','click',()=>{state.finale=2;fly(()=>{render(true);chime('win');});});
    }else{
      app.innerHTML=`<section class="finale"><div class="closing-sky"><div class="chapter-orbit" aria-hidden="true"></div><span class="eyebrow">EVERY LITTLE STAR LED BACK TO YOU</span><div class="seven-stars" aria-label="Seven golden stars">✦✧✦✧✦✧✦</div><h1 class="final-name">${esc(P.name.toUpperCase())} ♡</h1><p class="final-line">${messages('lastLine')}</p><div class="garden-flowers" aria-hidden="true"><span>✿</span><span>❀</span><span>✿</span><span>❀</span><span>✿</span></div><button class="final-cookie" id="final-cookie" aria-label="A tiny cookie with a final secret">🍪</button></div><div id="ps"></div>${lumi('For you? Always room for one more cookie. ♡')}<div class="actions"><button class="secondary" id="read-again">Read Again 💌</button><button class="secondary" id="replay">Replay Our Adventure ✨</button><button class="primary" id="feed-lumi">Give Lumi a Cookie 🍪</button></div></section>`;
      listen('#final-cookie','click',()=>{$('#ps').innerHTML=`<p class="ps">${messages('ps')}</p>`;chime('win');});
      listen('#read-again','click',()=>{state.finale=1;render(true);});
      listen('#replay','click',()=>{state=fresh();save();fly(()=>render(true));});
      let feeds=0;listen('#feed-lumi','click',()=>{feeds++;const star=$('.lumi',app);star.classList.remove('eating');void star.offsetWidth;star.classList.add('eating');$('.lumi-dialogue p',app).innerHTML='<strong>LUMI, VERY HAPPILY MUNCHING</strong>'+['Nom nom… I think I just tasted a little bit of love. 🍪','Wjiiiiii! Five-star service. Six-star cookie. ✨','You may now officially adopt this very well-fed star. ♡'][(feeds-1)%3];chime('silly');burst('♡');});
    }
  }

  function openKeepsakes() {
    $('#keepsake-content').innerHTML=`<span class="eyebrow">YOUR LITTLE TREASURES</span><h2 id="keepsakes-title">A pocketful of magic.</h2><div class="keepsake-grid">${rewards.slice(1).map((r,i)=>`<div class="keepsake ${state.stars.includes(i+1)?'':'locked'}"><span>✦</span>${r}${state.stars.includes(i+1)?'':'<br><small>Still in the stars</small>'}</div>`).join('')}</div>${state.cookie.baked?`<div class="collection-cookie">${cookieSVG()}<p class="micro">Your very own ${state.cookie.shape} cookie · Galactic Cookie Queen</p><button class="text-button" id="download-cookie">Save cookie artwork to this device ↓</button></div>`:''}${state.joke.secret?'<div class="collection-cookie"><span class="secret-cookie">🍪</span><p class="micro">The secret dancing cookie</p></div>':''}<p class="micro">${storageOK?'Saved only in this browser on this device.':'This browser cannot save progress. Keep this tab open.'}</p>`;
    listen('#download-cookie','click',()=>{const svg=cookieSVG().replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ');const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download='Nmas-magical-cookie.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},$('#keepsakes'));
    if(!$('#keepsakes').open)$('#keepsakes').showModal();
  }
  $('#collection-button').addEventListener('click',openKeepsakes);
  $('#keepsakes .close').addEventListener('click',()=>$('#keepsakes').close());
  $('#keepsakes').addEventListener('click',e=>{if(e.target===$('#keepsakes')){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)e.target.close();}});
  $('#home').addEventListener('click',e=>{e.preventDefault();go(0);});
  $('#footer-name').textContent=P.nickname.toUpperCase();
  Object.entries(P.colors).forEach(([key,value])=>document.documentElement.style.setProperty(key==='background'?'--bg':'--'+key,value));
  function applySettings(){document.body.classList.toggle('reduced',settings.reduced);document.body.classList.toggle('motion-enabled',!settings.reduced);$('#motion-button').setAttribute('aria-pressed',String(settings.reduced));$('#motion-button span').textContent=settings.reduced?'Motion reduced':'Gentle motion';$('#motion-button').setAttribute('aria-label',settings.reduced?'Reduced motion on; enable animation':'Reduce motion');$('#music-button').setAttribute('aria-pressed',String(settings.music));$('#music-button span').textContent=settings.music?'Sound on':'Sound off';}
  $('#motion-button').addEventListener('click',()=>{settings.reduced=!settings.reduced;applySettings();saveSettings();render();drawStars(performance.now());});
  let audioContext=null,master=null,musicTimer=null,musicStep=0;
  function audioStart(){if(!settings.music)return;try{if(!audioContext){audioContext=new (window.AudioContext||window.webkitAudioContext)();master=audioContext.createGain();master.gain.value=Math.min(.3,Math.max(0,P.music.volume));master.connect(audioContext.destination);}audioContext.resume();if(!musicTimer){playMusic();musicTimer=setInterval(playMusic,60000/Math.max(40,P.music.tempo));}}catch{settings.music=false;applySettings();toast('This browser cannot play the little melody. The adventure is ready to continue.');}}
  function note(frequency,duration=.7,delay=0,type='sine',volume=.25){if(!audioContext||!settings.music||document.hidden)return;const t=audioContext.currentTime+delay;const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,t);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(volume,t+.025);gain.gain.exponentialRampToValueAtTime(.001,t+duration);osc.connect(gain);gain.connect(master);osc.start(t);osc.stop(t+duration+.05);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
  function playMusic(){const melody=[523.25,659.25,783.99,987.77,783.99,659.25,587.33,783.99,880,1174.66,880,783.99,440,659.25,880,659.25];note(melody[musicStep%melody.length],1.8,0,'sine',.12);if(musicStep%4===0)note([130.81,146.83,110,130.81][Math.floor(musicStep/4)%4],3.5,0,'sine',.12);musicStep++;}
  function chime(kind='soft',index=0){if(!settings.music)return;audioStart();if(kind==='win'){[523.25,659.25,783.99,1046.5].forEach((f,i)=>note(f,.8,i*.09,'sine',.25));}else if(kind==='silly'){[440,880,660,1320].forEach((f,i)=>note(f,.15,i*.075,'triangle',.2));}else note(kind==='star'?[523,587,659,784,880][index%5]:660,.35,0,'sine',.15);}
  $('#music-button').addEventListener('click',()=>{settings.music=!settings.music;if(settings.music)audioStart();else{clearInterval(musicTimer);musicTimer=null;if(audioContext)audioContext.suspend();}applySettings();saveSettings();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(audioContext)audioContext.suspend();}else if(settings.music&&audioContext)audioContext.resume();});
  function burst(symbol='✦'){if(settings.reduced)return;const count=Math.max(0,Math.min(28,P.effects.particles,60-$$('.floating-cookie').length));for(let i=0;i<count;i++){const el=document.createElement('span');el.className='floating-cookie';el.setAttribute('aria-hidden','true');el.textContent=symbol;el.style.left=Math.random()*95+'%';el.style.animationDelay=Math.random()*.65+'s';el.style.color=i%2?'var(--gold)':'var(--blush)';document.body.append(el);setTimeout(()=>el.remove(),3500);}}
  const canvas=$('#cosmos'),ctx=canvas.getContext('2d');let stars=[],width=0,height=0,starsFrame=0,lastDraw=0;
  function sizeStars(){width=window.innerWidth;height=window.innerHeight;const dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:Math.min(160,P.effects.stars)},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.2+.25,phase:Math.random()*6.28}));drawStars(performance.now());}
  function drawStars(time){cancelAnimationFrame(starsFrame);if(time-lastDraw>45||settings.reduced){lastDraw=time;ctx.clearRect(0,0,width,height);for(const star of stars){ctx.beginPath();ctx.fillStyle=`rgba(239,216,226,${settings.reduced?.5:.25+(Math.sin(time*.0007+star.phase)+1)*.23})`;ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill();}}if(!settings.reduced&&!document.hidden)starsFrame=requestAnimationFrame(drawStars);}
  window.addEventListener('resize',sizeStars);document.addEventListener('visibilitychange',()=>{if(!document.hidden)drawStars(performance.now());});
  applySettings();sizeStars();render();
  // Direct file opening needs no server. When hosted, cache this same package for later offline visits.
  if('serviceWorker' in navigator && ['http:','https:'].includes(location.protocol)) {
    navigator.serviceWorker.register('service-worker.js').catch(()=>{});
  }
})();
