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
  if(page==='index'){initCarousel();renderIndustries();renderWhy();renderStats();renderCerts();}
  if(page==='products'){renderCategories();checkHash();}
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
 nav.querySelectorAll('.nav-l>li>a').forEach(l=>{l.addEventListener('click',function(){if(!this.closest('.nav-has-dd')){ham.classList.remove('active');nav.classList.remove('open');}document.querySelectorAll('.has-sub').forEach(i=>i.classList.remove('active-mobile'))})});
 // Mobile: Products link toggles dropdown; sub-items navigate via hash
 document.querySelectorAll('.nav-has-dd>a').forEach(l=>{
  l.addEventListener('click',function(e){if(window.innerWidth<=768){e.preventDefault();this.parentElement.classList.toggle('active-mobile')}})
 });
 // Sub-items (.has-sub>a, .has-sub-sub>a) navigate via their href
}

// ====== SCROLL TOP ======
const st=document.getElementById('stp');
if(st){window.addEventListener('scroll',()=>st.classList.toggle('show',window.scrollY>350));st.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}))}

// ====== COUNTERS ======
function animC(){
 document.querySelectorAll('.h-stat-n[data-count], .hs-sn[data-count]').forEach(el=>{
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
   <a href="products.html#${c.id}">${c.icon} ${c.name}</a>
   <ul class="dd-sub">
    ${c.series.map(s=>`
     <li class="has-sub-sub">
      <a href="products.html#${c.id}/${encodeURIComponent(s.name)}">${s.name}</a>
      <ul class="dd-sub-sub">
       ${s.products.map(p=>`<li><a href="products.html#${c.id}/${encodeURIComponent(s.name)}/${encodeURIComponent(p)}">${p}</a></li>`).join('')}
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
  c.series.flatMap(s=>s.products.map(p=>`<li><a href="products.html#${c.id}/${encodeURIComponent(s.name)}/${encodeURIComponent(p)}">${p}</a></li>`))
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

// ====== PRODUCT NAVIGATION (image-based) ======
const navState = { categoryId: null, seriesName: null, productName: null };

// ---- VIEW: All Categories (initial grid) ----
function renderCategories(){
 const pg=document.getElementById('pg');if(!pg||!D)return;
 navState.categoryId=null;navState.seriesName=null;navState.productName=null;
 let h=`<div class="ps-header"><div class="ps-header-icon">📋</div><div class="ps-header-text"><h2>All Products</h2><p>${D.categories.length} categories · Browse our full range</p></div></div>`;
 h+=`<div class="pg">`;
 D.categories.forEach(c=>{
   const total=c.series.reduce((t,s)=>t+s.products.length,0);
   h+=`<div class="pc" data-c="${c.id}" style="cursor:pointer;">
     <img src="images/placeholder-product.svg" alt="${c.name}" loading="lazy">
     <div class="pc-bd">
       <h3>${c.icon} ${c.name}</h3>
       <p style="font-size:.82rem;color:var(--gray-500);margin-top:4px;">${c.series.length} series · ${total} products</p>
       <span class="pb">View Products →</span>
     </div>
   </div>`;
 });
 h+=`</div>`;
 pg.innerHTML=h;
 pg.querySelectorAll('.pc[data-c]').forEach(c=>c.addEventListener('click',function(){showProducts(this.dataset.c)}));
 renderSidebar();renderBreadcrumb();
}

// ---- VIEW: Series under a Category ----
function showProducts(id){
 const pg=document.getElementById('pg');if(!pg||!D)return;
 const cat=D.categories.find(c=>c.id===id);
 if(!cat||!cat.series||!cat.series.length){pg.innerHTML='<p style="text-align:center;padding:32px;color:var(--gray-400);">No products in this category.</p>';return}
 navState.categoryId=id;navState.seriesName=null;navState.productName=null;

 let h=`<div class="ps-header"><div class="ps-header-icon">${cat.icon}</div><div class="ps-header-text"><h2>${cat.name}</h2><p>${cat.series.reduce((t,s)=>t+s.products.length,0)} products across ${cat.series.length} series</p></div></div>`;
 h+=`<button class="ps-back-btn" style="margin-bottom:14px;width:auto" onclick="renderCategories()">← All Categories</button>`;
 h+=`<div class="ps-section-title">Series in ${cat.name}</div><div class="ps-series-grid">`;
 cat.series.forEach(s=>{
   h+=`<div class="ps-series-card" data-c="${cat.id}" data-s="${s.name.replace(/'/g,"\'")}">
     <img src="images/placeholder-product.svg" alt="${s.name}" style="width:100%;height:140px;object-fit:cover;border-radius:6px;margin-bottom:10px;">
     <h3>${s.name}</h3>
     <p>${s.products.length} product${s.products.length>1?'s':''}</p>
     <span class="ps-series-count">${s.products.length} items</span>
   </div>`;
 });
 h+=`</div>`;
 pg.innerHTML=h;
 pg.querySelectorAll('.ps-series-card').forEach(c=>c.addEventListener('click',function(){showSeriesProducts(this.dataset.c,this.dataset.s)}));
 renderSidebar();renderBreadcrumb();
}

// ---- VIEW: Products in a Series ----
function showSeriesProducts(catId,seriesName){
 const pg=document.getElementById('pg');if(!pg||!D)return;
 const cat=D.categories.find(c=>c.id===catId);if(!cat)return;
 const series=cat.series.find(s=>s.name===seriesName);if(!series){showProducts(catId);return}
 navState.categoryId=catId;navState.seriesName=seriesName;navState.productName=null;

 let h=`<div class="ps-header"><div class="ps-header-icon">${cat.icon}</div><div class="ps-header-text"><h2>${series.name}</h2><p>${series.products.length} product${series.products.length>1?'s':''} in ${cat.name}</p></div></div>`;
 h+=`<button class="ps-back-btn" style="margin-bottom:14px;width:auto" onclick="showProducts('${catId}')">← Back to ${cat.name}</button>`;
 h+=`<div class="ps-section-title">Products</div><div class="pg">`;
 h+=series.products.map(p=>`<div class="pc"><img src="images/placeholder-product.svg" alt="${p}" loading="lazy"><div class="pc-bd"><h3>${p}</h3><span class="pb">${series.name}</span></div></div>`).join('');
 h+=`</div>`;
 pg.innerHTML=h;
 pg.querySelectorAll('.pc').forEach(c=>c.addEventListener('click',function(){showProductDetail(catId,seriesName,this.querySelector('h3').textContent)}));
 renderSidebar();renderBreadcrumb();
}

// ---- VIEW: Product detail (sub-images gallery) ----
function showProductDetail(catId,seriesName,productName){
 const pg=document.getElementById('pg');if(!pg||!D)return;
 const cat=D.categories.find(c=>c.id===catId);if(!cat)return;
 const series=cat.series.find(s=>s.name===seriesName);if(!series||!productName){showSeriesProducts(catId,seriesName);return}
 navState.categoryId=catId;navState.seriesName=seriesName;navState.productName=productName;

 let h=`<div class="ps-header"><div class="ps-header-icon">${cat.icon}</div><div class="ps-header-text"><h2>${productName.length>50?productName.substring(0,50)+'...':productName}</h2><p>${seriesName} · ${cat.name}</p></div></div>`;
 h+=`<button class="ps-back-btn" style="margin-bottom:14px;width:auto" onclick="showSeriesProducts('${catId}','${seriesName.replace(/'/g,"\'")}')">← Back to ${seriesName}</button>`;
 // Sub-images gallery
 h+=`<div class="ps-section-title">Product Images</div><div class="ps-img-grid">`;
 for(let i=1;i<=4;i++){h+=`<div class="ps-img-card"><img src="images/placeholder-product.svg" alt="View ${i}" loading="lazy"><span>View ${i}</span></div>`}
 h+=`</div>`;
 // Details
 h+=`<div class="ps-section-title">Product Details</div><div class="ps-detail-box">
   <p><strong>Product:</strong> ${productName}</p>
   <p><strong>Series:</strong> ${seriesName}</p>
   <p><strong>Category:</strong> ${cat.icon} ${cat.name}</p>
   <p style="margin-top:10px;">Detailed specifications and technical drawings available on request.</p>
 </div>`;
 pg.innerHTML=h;
 renderSidebar();renderBreadcrumb();
}

// ---- SIDEBAR TREE ----
function renderSidebar(){
 const tree=document.getElementById('psTree');
 if(!tree||!D)return;
 tree.innerHTML=`<li><a class="ps-home-link" href="index.html">🏠 Home</a></li>`+
   D.categories.map(c=>{
     const isActive=c.id===navState.categoryId;
     let sHtml='';
     c.series.forEach(s=>{
       const sActive=isActive&&s.name===navState.seriesName;
       const pActive=sActive&&s.products.some(p=>p===navState.productName);
       sHtml+=`<li><a class="ps-series-link${sActive?' active':''}" href="#" onclick="event.preventDefault();showSeriesProducts('${c.id}','${s.name.replace(/'/g,"\'")}')">${s.name}</a></li>`;
       if(sActive||pActive){
         s.products.forEach(p=>{
           const isPActive=sActive&&p===navState.productName;
           sHtml+=`<li><a class="ps-prod-link${isPActive?' active':''}" href="#" onclick="event.preventDefault();showProductDetail('${c.id}','${s.name.replace(/'/g,"\'")}','${p.replace(/'/g,"\'")}')">${p.length>28?p.substring(0,28)+'...':p}</a></li>`;
         });
       }
     });
     return `<li><a class="ps-cat-link${isActive?' active':''}" href="#" onclick="event.preventDefault();showProducts('${c.id}')">${c.icon} ${c.name}</a></li>`+sHtml;
   }).join('');
}

// ---- BREADCRUMB (data-attributes, no inline onclick) ----
function renderBreadcrumb(){
 const el=document.getElementById('psBreadcrumb');
 if(!el||!D)return;
 const cat=D.categories.find(c=>c.id===navState.categoryId);
 const cName=cat?cat.name:'';const cIcon=cat?cat.icon:'';
 let h=`<span class="ps-bc-item"><a href="index.html"><b>Home</b></a></span><span class="ps-bc-sep">›</span><span class="ps-bc-item"><a href="products.html"><b>Products</b></a></span>`;
 if(cName){
   h+=`<span class="ps-bc-sep">›</span><span class="ps-bc-item${navState.seriesName?'':' current'}"><a href="#" data-bc="cat">${cIcon} ${cName}</a></span>`;
 }
 if(navState.seriesName){
   const sn=navState.seriesName.length>35?navState.seriesName.substring(0,35)+'...':navState.seriesName;
   h+=`<span class="ps-bc-sep">›</span><span class="ps-bc-item${navState.productName?'':' current'}"><a href="#" data-bc="series">${sn}</a></span>`;
 }
 if(navState.productName){
   const pn=navState.productName.length>45?navState.productName.substring(0,45)+'...':navState.productName;
   h+=`<span class="ps-bc-sep">›</span><span class="ps-bc-item current">${pn}</span>`;
 }
 el.innerHTML=h;
 // Attach click handlers via data attributes
 el.querySelectorAll('a[data-bc="cat"]').forEach(a=>a.addEventListener('click',function(e){e.preventDefault();showProducts(navState.categoryId)}));
 el.querySelectorAll('a[data-bc="series"]').forEach(a=>a.addEventListener('click',function(e){e.preventDefault();showSeriesProducts(navState.categoryId,navState.seriesName)}));
}

/** Parse URL hash to navigate to category/series/product */
function checkHash(){
 const h=decodeURIComponent(location.hash.substring(1));
 if(!h)return;
 const parts=h.split('/');
 if(parts[0]){showProducts(parts[0]);}
 if(parts[1]){setTimeout(()=>{showSeriesProducts(parts[0],parts[1])},100);}
 if(parts[2]){setTimeout(()=>{showProductDetail(parts[0],parts[1],parts[2])},200);}
}

// ====== INDUSTRIES SLIDESHOW ======
let indTimer = null;
let indIdx = 0;

function initCarousel(){
 const track=document.getElementById('isTrack');
 const dots=document.getElementById('isDots');
 if(!track||!D||!D.industries)return;

 // Industry images from Unsplash
 const imgs = {
  'oil-gas':'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&q=90',
  'power-generation':'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=90',
  'food-beverage':'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1600&q=90',
  'chemical-pharma':'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1600&q=90',
  'marine':'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=90',
  'irrigation':'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1600&q=90'
 };
 const icons = {'oil-gas':'🏭','power-generation':'⚡','food-beverage':'🍺','chemical-pharma':'🧪','marine':'🚢','irrigation':'💧'};

 // Build slides
 track.innerHTML = D.industries.map((ind,i)=>`
  <div class="is-slide" style="background-image:url('${imgs[ind.id]||'https://picsum.photos/seed/'+ind.id+'/900/400'}')">
   <div class="is-slide-content">
    <span class="is-slide-icon">${icons[ind.id]||'🔧'}</span>
    <h3>${ind.name}</h3>
    <p>${ind.description}</p>
   </div>
  </div>
 `).join('');

 // Dots
 dots.innerHTML = D.industries.map((_,i)=>`<button class="is-dot${i===0?' active':''}" data-idx="${i}"></button>`).join('');
 dots.querySelectorAll('.is-dot').forEach(d=>d.addEventListener('click',function(){
  goToIndSlide(parseInt(this.dataset.idx));
 }));

 // Start 1.5s autoplay
 startIndCarousel();
}

function goToIndSlide(idx){
 const slides=document.querySelectorAll('.is-slide');
 const dots=document.querySelectorAll('.is-dot');
 const track=document.getElementById('isTrack');
 if(!slides.length)return;
 if(idx<0)idx=slides.length-1;
 if(idx>=slides.length)idx=0;
 track.style.transform = `translateX(-${idx*100}%)`;
 dots.forEach(d=>d.classList.remove('active'));
 dots[idx].classList.add('active');
 indIdx=idx;
}

function startIndCarousel(){
 stopIndCarousel();
 indTimer=setInterval(()=>{
  const slides=document.querySelectorAll('.is-slide');
  if(!slides.length)return;
  goToIndSlide(indIdx+1);
 },1500);
}
function stopIndCarousel(){if(indTimer){clearInterval(indTimer);indTimer=null;}}
function restartIndCarousel(){stopIndCarousel();startIndCarousel();}

// Pause on hover
(function(){
 const sc=document.getElementById('isShowcase');
 if(sc){sc.addEventListener('mouseenter',stopIndCarousel);sc.addEventListener('mouseleave',startIndCarousel);}
})();// ====== CONTACT FORM ======
(function(){
 const f=document.getElementById('cf');if(!f)return;
 f.setAttribute('action','https://formsubmit.co/sanchitawork31@gmail.com');
 f.setAttribute('method','POST');
 // FormSubmit required fields
 if(!f.querySelector('input[name="_captcha"]')){const i=document.createElement('input');i.type='hidden';i.name='_captcha';i.value='false';f.appendChild(i)}
 if(!f.querySelector('input[name="_next"]')){const i=document.createElement('input');i.type='hidden';i.name='_next';i.value=window.location.href.split('?')[0]+'?sent=1';f.appendChild(i)}
 // Native form submit — browser handles POST directly
 f.addEventListener('submit',function(){
  const btn=f.querySelector('button[type="submit"]');
  if(btn){btn.textContent='Sending...';btn.disabled=true;}
 });
 // Check if redirected back after successful submission
 if(window.location.search.includes('sent=1')){
  const f=document.getElementById('cf');
  if(f){
   const w=f.parentElement;
   if(!w.querySelector('.fsu')){
    const su=document.createElement('div');
    su.className='fsu show';su.innerHTML='<div class="fsu-ic">✅</div><h3>Thank You!</h3><p>Your message has been sent. We\'ll respond within 24 business hours.</p>';
    f.style.display='none';w.appendChild(su);
    // Clean URL
    window.history.replaceState({},document.title,window.location.pathname);
   }
  }
 }
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
