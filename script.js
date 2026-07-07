/* CLIVO Automation — Main Script */
document.addEventListener('DOMContentLoaded',()=>{
const page=(()=>{let p=location.pathname.split('/').pop()||'index.html';if(p==='products.html')return'products';if(p==='contact.html')return'contact';return'index'})();
let D=null;

async function loadData(){
 try{
  const r=await fetch('products.json');
  D=await r.json();
  buildDropdown();
  renderFooterProducts();
  if(page==='index'){renderIndustries();renderWhy();renderStats();renderCerts();}
  if(page==='products'){renderTabs();}
 }catch(e){console.error('Failed to load:',e);}
}

// ====== THEME ======
const tb=document.getElementById('themeBtn');
const h=document.documentElement;
function gT(){let s=localStorage.getItem('clivo-theme');if(s==='dark'||s==='light')return s;return window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}
function sT(t){h.setAttribute('data-theme',t);localStorage.setItem('clivo-theme',t)}
sT(gT());
if(tb)tb.addEventListener('click',()=>sT(h.getAttribute('data-theme')==='dark'?'light':'dark'));

// ====== MOBILE MENU ======
const ham=document.getElementById('ham');
const nav=document.getElementById('nav');
if(ham&&nav){
 ham.addEventListener('click',()=>{ham.classList.toggle('active');nav.classList.toggle('open')});
 nav.querySelectorAll('.nav-l>li>a').forEach(l=>{l.addEventListener('click',()=>{ham.classList.remove('active');nav.classList.remove('open');document.querySelectorAll('.nav-has-dd,.has-sub').forEach(i=>i.classList.remove('active-mobile'))})});
 // Mobile accordion for dropdowns
 document.querySelectorAll('.nav-has-dd>.nav-l>a, .nav-has-dd>a').forEach(l=>{
  l.addEventListener('click',function(e){if(window.innerWidth<=768){e.preventDefault();this.parentElement.classList.toggle('active-mobile')}})
 });
 // Also for .has-sub items
 document.addEventListener('click',function(e){
  if(window.innerWidth<=768&&e.target.closest('.has-sub>a')){
   e.preventDefault();e.target.closest('.has-sub').classList.toggle('active-mobile');
  }
 });
}

// ====== SCROLL TOP ======
const st=document.getElementById('stp');
if(st){window.addEventListener('scroll',()=>st.classList.toggle('show',window.scrollY>350));st.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}))}

// ====== COUNTERS ======
function animC(){
 document.querySelectorAll('.h-stat-n[data-count]').forEach(el=>{
  const t=parseInt(el.dataset.count,10),st=40,inc=t/st;let i=0;
  const ti=setInterval(()=>{i++;el.textContent=Math.min(Math.round(inc*i),t);if(i>=st){el.textContent=t;clearInterval(ti)}},35);
 })
}

// ====== FADE IN ======
const fo=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');fo.unobserve(e.target)}})},{threshold:.08});
function ob(el){if(!el)return;Array.from(el.children).forEach((c,i)=>{c.classList.add('fi');c.style.transitionDelay=i*.06+'s';fo.observe(c)})}

// ====== BUILD DROPDOWN (3-level: Category → Series → Products) ======
function buildDropdown(){
 const dd=document.getElementById('prodDD');
 if(!dd||!D)return;
 dd.innerHTML=D.categories.map(c=>`
  <li class="has-sub">
   <a href="products.html">${c.icon} ${c.name}</a>
   <ul class="dd-sub">
    ${c.series.map(s=>`
     <li class="has-sub-sub">
      <a href="products.html">${s.name}</a>
      <ul class="dd-sub-sub">
       ${s.products.map(p=>`<li><a href="products.html">${p}</a></li>`).join('')}
      </ul>
     </li>
    `).join('')}
   </ul>
  </li>
 `).join('');
 // Smart positioning + hover management (class-based, no CSS :hover conflict)
 const subs=dd.querySelectorAll('.has-sub,.has-sub-sub');
 subs.forEach(item=>{
  const sub=item.querySelector('.dd-sub')||item.querySelector('.dd-sub-sub');
  if(!sub)return;
  let hideTimer;

  const show=()=>{
   clearTimeout(hideTimer);
   const r=item.getBoundingClientRect();
   const w=parseInt(getComputedStyle(sub).minWidth)||320;
   sub.classList.toggle('dd-left',r.right+w>window.innerWidth);
   sub.classList.add('sub-show');
  };
  const hide=()=>{
   hideTimer=setTimeout(()=>sub.classList.remove('sub-show'),120);
  };

  item.addEventListener('mouseenter',show);
  item.addEventListener('mouseleave',hide);
  sub.addEventListener('mouseenter',()=>clearTimeout(hideTimer));
  sub.addEventListener('mouseleave',()=>sub.classList.remove('sub-show'));
 });

 // Mobile clicks for all levels
 if(window.innerWidth<=768){
  dd.querySelectorAll('.has-sub>a, .has-sub-sub>a').forEach(a=>{
   a.addEventListener('click',function(e){
    const p=this.parentElement;
    if(p.classList.contains('has-sub')||p.classList.contains('has-sub-sub')){
     e.preventDefault();p.classList.toggle('active-mobile');
    }
   });
  });
 }
}

// ====== FOOTER PRODUCTS ======
function renderFooterProducts(){
 const el=document.getElementById('fp');
 if(!el||!D)return;
 el.innerHTML=D.categories.flatMap(c=>
  c.series.flatMap(s=>s.products.map(p=>`<li><a href="products.html">${p}</a></li>`))
 ).join('');
}

// ====== INDUSTRIES ======
function renderIndustries(){
 const g=document.getElementById('ig');if(!g||!D)return;
 g.innerHTML=D.industries.map(i=>`<div class="ic"><div class="ic-bg"><img src="images/${i.image}" alt="${i.name}" loading="lazy"></div><div class="ic-bd"><h3>${i.name}</h3><p>${i.description}</p></div></div>`).join('');
 ob(g);
}

// ====== WHY ======
function renderWhy(){
 const g=document.getElementById('wg');if(!g)return;
 const items=[
  {i:'🔬',t:'R&D & Innovation',d:'Continuous investment in RD to bring cutting-edge valve technology to industrial automation.'},
  {i:'✅',t:'Quality Throughout',d:'ISO 9001:2015 certified quality management ensuring every product meets stringent international standards.'},
  {i:'🏭',t:'State of Art Facility',d:'Modern facility with CNC machines, automated testing rigs, and precision calibration equipment.'},
  {i:'📦',t:'Flexibility & Timely Shipment',d:'Agile processes enabling customized solutions with reliable on-time delivery worldwide.'},
  {i:'💰',t:'Competitive Pricing',d:'Economies of scale and lean manufacturing pass cost advantages directly to you.'},
  {i:'📋',t:'Lean Manufacturing',d:'Six Sigma and Kaizen-driven processes minimizing waste and maximizing value.'},
 ];
 g.innerHTML=items.map(x=>`<div class="wc"><div class="wi">${x.i}</div><h3>${x.t}</h3><p>${x.d}</p></div>`).join('');
 ob(g);
}

// ====== STATS ======
function renderStats(){
 const g=document.getElementById('sg');if(!g||!D)return;
 const s=D.stats;
 g.innerHTML=`<div class="sc"><div class="sn">${s.products}+</div><div class="sl">Products</div></div><div class="sc"><div class="sn">${s.happyClients}+</div><div class="sl">Happy Clients</div></div><div class="sc"><div class="sn">${s.certificates}</div><div class="sl">Certificates</div></div><div class="sc"><div class="sn">${s.awards}+</div><div class="sl">Awards</div></div>`;
 ob(g);
}

// ====== CERTS ======
function renderCerts(){
 const g=document.getElementById('cg');if(!g||!D)return;
 g.innerHTML=D.certifications.map(c=>`<div class="cc"><img src="images/${c.image}" alt="${c.name}" loading="lazy"><div class="cn">${c.name}</div><div class="cb">${c.by}</div></div>`).join('');
 ob(g);
}

// ====== PRODUCT TABS + GRID ======
function renderTabs(){
 const ct=document.getElementById('ct');const pg=document.getElementById('pg');
 if(!ct||!pg||!D)return;
 ct.innerHTML=D.categories.map((c,i)=>`<button class="ctb ${i===0?'active':''}" data-c="${c.id}">${c.icon} ${c.name}</button>`).join('');
 showProducts(D.categories[0]?.id);
 ct.querySelectorAll('.ctb').forEach(t=>{t.addEventListener('click',()=>{ct.querySelectorAll('.ctb').forEach(x=>x.classList.remove('active'));t.classList.add('active');showProducts(t.dataset.c)})});
}
function showProducts(id){
 const pg=document.getElementById('pg');if(!pg||!D)return;
 const cat=D.categories.find(c=>c.id===id);
 if(!cat||!cat.series||!cat.series.length){pg.innerHTML='<p style="text-align:center;grid-column:1/-1;padding:32px;color:var(--gray-400);">No products in this category.</p>';return}
 // Flatten series into individual products
 const allProducts=[];
 cat.series.forEach(s=>s.products.forEach(p=>allProducts.push({name:p,series:s.name})));
 if(!allProducts.length){pg.innerHTML='<p style="text-align:center;grid-column:1/-1;padding:32px;color:var(--gray-400);">No products in this category.</p>';return}
 pg.innerHTML=allProducts.map(p=>`<div class="pc"><img src="images/placeholder-product.svg" alt="${p.name}" loading="lazy"><div class="pc-bd"><h3>${p.name}</h3><span class="pb">${p.series}</span></div></div>`).join('');
 ob(pg);
}

// ====== CONTACT FORM ======
(function(){
 const f=document.getElementById('cf');if(!f)return;
 f.setAttribute('action','https://formsubmit.co/sanchitawork31@gmail.com');
 f.setAttribute('method','POST');
 if(!f.querySelector('input[name="_captcha"]')){const i=document.createElement('input');i.type='hidden';i.name='_captcha';i.value='false';f.appendChild(i)}
 f.addEventListener('submit',async(e)=>{
  e.preventDefault();const btn=f.querySelector('button[type="submit"]'),orig=btn.textContent;
  btn.textContent='Sending...';btn.disabled=true;
  try{
   const fd=new FormData(f),data=new URLSearchParams();
   fd.forEach((v,k)=>data.append(k,v));
   const r=await fetch(f.getAttribute('action'),{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data.toString()});
   if(r.ok||r.status===200){
    toast('✅ Message sent! We\'ll respond within 24 hours.','s');f.reset();
    const w=f.parentElement,su=document.createElement('div');
    su.className='fsu show';su.innerHTML='<div class="fsu-ic">✅</div><h3>Thank You!</h3><p>Your message has been sent. We\'ll respond within 24 business hours.</p>';
    f.style.display='none';w.appendChild(su);
   }else throw Error('HTTP '+r.status);
  }catch(e){toast('❌ Could not send. Email us at sales@clivo.in','e')}
  finally{btn.textContent=orig;btn.disabled=false}
 });
})();

// ====== NEWSLETTER ======
(function(){
 const f=document.getElementById('nf');if(!f)return;
 f.addEventListener('submit',e=>{e.preventDefault();const i=f.querySelector('input');if(!i.value.trim())return;toast('✅ Thank you for subscribing!','s');i.value=''});
})();

// ====== TOAST ======
function toast(m,t='s'){
 const o=document.querySelector('.toast');if(o)o.remove();
 const e=document.createElement('div');e.className='toast '+t;e.textContent=m;
 document.body.appendChild(e);
 requestAnimationFrame(()=>e.classList.add('show'));
 setTimeout(()=>{e.classList.remove('show');setTimeout(()=>e.remove(),300)},4200);
}

// ====== INIT ======
if(page==='index')setTimeout(animC,500);
loadData();
});
