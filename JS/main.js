
const $=s=>document.querySelector(s),v=$('#v'),hero=$('#hero'),nav=$('#nav');
let target=0,cur=0,dur=10,ready=false;
v.pause();
v.addEventListener('loadedmetadata',()=>{dur=v.duration||10;ready=true;v.currentTime=0});
v.load();
function prog(){const r=hero.getBoundingClientRect(),h=hero.offsetHeight-innerHeight;return Math.min(1,Math.max(0,-r.top/h))}
let near=true;
new IntersectionObserver(e=>{near=e[0].isIntersecting},{rootMargin:'200px'}).observe(hero);
function tick(){if(!hero.offsetHeight){nav.classList.add('s');requestAnimationFrame(tick);return}
 const r0=hero.getBoundingClientRect();target=Math.min(1,prog()/.88);const lv=Math.min(1,Math.max(0,1-r0.bottom/innerHeight));v.style.transform='translateY('+(-lv*7)+'vh) scale('+(1+lv*.05)+')';v.style.opacity=1-lv*.55;$('.bar').style.opacity=1-lv*3;cur+=(target-cur)*.09;if(Math.abs(target-cur)<.0004)cur=target;
 if(near&&ready){const t=cur*(dur-.05);if(Math.abs(v.currentTime-t)>.012&&!v.seeking)v.currentTime=t}
 $('#pb').style.width=cur*100+'%';
 const f=Math.max(0,1-cur*5);$('#ht').style.opacity=f;$('#hb').style.opacity=f;$('#ht').style.transform='translateY('+(-cur*60)+'px)';
 nav.classList.toggle('s',scrollY>40);
 document.querySelectorAll('[data-s]').forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom>-200&&r.top<innerHeight+200)el.style.transform='translateY('+((r.top+r.height/2-innerHeight/2)*el.dataset.s)+'px)'});
 requestAnimationFrame(tick)}
tick();

const M={rose:['#f6d2b8','#c48465','#6e3f2a'],steel:['#f7f9fb','#a3aab1','#454c52'],gold:['#f8e6b0','#c9a14e','#6b501c'],black:['#6a6d72','#2b2d30','#0c0d0e']};
function W(i,o){const m=M[o.m],id='g'+i,p=(a,L)=>[(200+L*Math.sin(a*Math.PI/180)).toFixed(1),(250-L*Math.cos(a*Math.PI/180)).toFixed(1)];
let s=`<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m[0]}"/><stop offset=".5" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[2]}"/></linearGradient><linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="${o.sc||'#222'}"/><stop offset=".5" stop-color="${o.sc||'#222'}" stop-opacity=".75"/><stop offset="1" stop-color="${o.sc||'#222'}"/></linearGradient><radialGradient id="${id}d" cx=".35" cy=".3" r="1"><stop offset="0" stop-color="${o.d[0]}"/><stop offset="1" stop-color="${o.d[1]}"/></radialGradient><filter id="${id}b"><feGaussianBlur stdDeviation="9"/></filter></defs><ellipse cx="200" cy="468" rx="120" ry="12" fill="#000" opacity=".55" filter="url(#${id}b)"/>`;
for(const y0 of [-10,352]){if(o.s==='l'){s+=`<rect x="152" y="${y0}" width="96" height="${y0<0?160:160}" rx="8" fill="url(#${id}s)"/><path d="M160 ${y0+4}V${y0+156}M240 ${y0+4}V${y0+156}" stroke="${m[0]}" stroke-opacity=".45" stroke-dasharray="3 4" fill="none"/>`}else for(let k=0;k<6;k++){s+=`<rect x="152" y="${y0+k*26}" width="96" height="23" rx="3" fill="url(#${id}m)"/><rect x="${k%2?188:164}" y="${y0+k*26+3}" width="${k%2?24:72}" height="2" fill="#fff" opacity=".22"/>`}}
s+=`<rect x="306" y="241" width="22" height="18" rx="3" fill="url(#${id}m)"/><g transform="rotate(-30 200 250)"><rect x="304" y="243" width="20" height="14" rx="3" fill="url(#${id}m)"/></g><g transform="rotate(30 200 250)"><rect x="304" y="243" width="20" height="14" rx="3" fill="url(#${id}m)"/></g><circle cx="200" cy="250" r="116" fill="url(#${id}m)"/><circle cx="200" cy="250" r="104" fill="${o.b||m[2]}" stroke="${m[0]}" stroke-opacity=".6"/><circle cx="200" cy="250" r="92" fill="url(#${id}d)"/>`;
const tc=o.t||m[0];
for(let k=0;k<60;k++){const a=k*6,h=k%5==0,q=p(a,89),r=p(a,h?81:85);s+=`<line x1="${q[0]}" y1="${q[1]}" x2="${r[0]}" y2="${r[1]}" stroke="${tc}" stroke-width="${h?1.6:.6}" opacity=".85"/>`}
const R=['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];
for(let k=0;k<12;k++){const q=p(k*30,69);if(o.n==='r')s+=`<text x="${q[0]}" y="${+q[1]+4}" text-anchor="middle" font-family="Georgia,serif" font-size="12" fill="${tc}">${R[k]}</text>`;else if(o.n==='a'&&k%3==0)s+=`<text x="${q[0]}" y="${+q[1]+5}" text-anchor="middle" font-family="Jost,sans-serif" font-size="15" fill="${tc}">${k?k:12}</text>`;else{const a=p(k*30,76),b=p(k*30,61);s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${tc}" stroke-width="${k%3?3:5}"/>`}}
s+=`<text x="200" y="212" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="9" letter-spacing="3" fill="${tc}">AURELIS</text>`;
if(o.c)for(const [x,y] of [[170,244],[230,244],[200,288]])s+=`<circle cx="${x}" cy="${y}" r="19" fill="#000" fill-opacity=".28" stroke="${tc}" stroke-width=".8"/><line x1="${x}" y1="${y}" x2="${x+9}" y2="${y-9}" stroke="${tc}" stroke-width="1.2"/>`;
const H=p(304,46),Mi=p(48,70),S=p(190,76);
s+=`<g stroke="${o.h||m[0]}" stroke-linecap="round"><line x1="200" y1="250" x2="${H[0]}" y2="${H[1]}" stroke-width="5"/><line x1="200" y1="250" x2="${Mi[0]}" y2="${Mi[1]}" stroke-width="3.4"/></g><line x1="200" y1="250" x2="${S[0]}" y2="${S[1]}" stroke="#d9534f" stroke-width="1"/><circle cx="200" cy="250" r="4" fill="${m[1]}"/><path d="M118 215A92 92 0 0 1 262 165L150 330Z" fill="#fff" opacity=".07" clip-path="circle(92px at 82px 130px)"/><path d="M120 190A92 92 0 0 1 250 168" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/></svg>`;return s}
let P=[['AURELIS Nocturne','Automatic','$4,850',{m:'black',s:'b',d:['#17181a','#030303'],t:'#d9a07f',h:'#d9a07f',n:'i',b:'#111'}],
['AURELIS Chronograph','Chronograph','$6,200',{m:'rose',s:'l',sc:'#5a2e22',d:['#1b1b1d','#050506'],c:1,n:'r'}],
['AURELIS Classic','Automatic','$3,950',{m:'steel',s:'b',d:['#eceff2','#b9c0c6'],t:'#2a2d30',h:'#2a2d30',n:'i'}],
['AURELIS Signature','Dress','$7,400',{m:'rose',s:'l',sc:'#3b2118',d:['#2a2523','#0e0c0b'],n:'r'}],
['AURELIS Obsidian','Automatic','$5,800',{m:'black',s:'l',sc:'#111',d:['#202123','#050505'],t:'#e9e4dc',h:'#e9e4dc',n:'a',b:'#0b0b0c'}],
['AURELIS Élégance','Dress','$4,600',{m:'gold',s:'l',sc:'#7a4a2a',d:['#f1e6cc','#cdb98d'],t:'#3b2d14',h:'#2a2110',n:'r'}],
['AURELIS Mariner','Sport','$5,250',{m:'steel',s:'b',d:['#17406f','#061427'],n:'i',b:'#0e2a4d'}],
['AURELIS Imperial','Limited','$9,800',{m:'rose',s:'b',d:['#22365e','#0a1426'],c:1,n:'i'}]];

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));
document.querySelectorAll('.mg').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});
$('#bg').onclick=()=>$('#lk').classList.toggle('o');
document.querySelectorAll('#lk a').forEach(a=>a.onclick=()=>$('#lk').classList.remove('o'));

const $$=s=>[...document.querySelectorAll(s)],MN={rose:'rose gold',steel:'stainless steel',gold:'yellow gold',black:'black ceramic'};
const num=x=>+x[2].replace(/\D/g,''),fmt=n=>'$'+n.toLocaleString('en-US');
const card=(x,i)=>`<a class="card rv" href="#/product/${i}"><div class="im">${V(i,x)}<span class="btn">Explore</span></div><div class="meta"><div><h3 class="serif">${x[0]}</h3><div class="cat">${x[1]}${x[4]&&x[4].stock<=0?' · Sold out':''}</div></div><div class="pr">${x[2]}</div></div></a>`;
const obs=()=>$$('.rv:not(.in)').forEach(e=>io.observe(e));
const save=(k,v)=>{try{localStorage[k]=JSON.stringify(v)}catch(e){}},load=(k,d)=>{try{return JSON.parse(localStorage[k])??d}catch(e){return d}};
let cart=load('cart',[]),user=load('user',null),route='home';
function toast(m){const e=$('#ts');e.textContent=m;e.classList.add('o');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('o'),2600)}
function closeAll(){['ov','dr','sr'].forEach(i=>$('#'+i).classList.remove('o'))}
function openC(){closeAll();drw();$('#dr').classList.add('o');$('#ov').classList.add('o')}
function openS(){closeAll();$('#sr').classList.add('o');setTimeout(()=>$('#q').focus(),100);rq()}
function drw(){cart=cart.filter(c=>P[c.i]);const n=cart.reduce((a,c)=>a+c.q,0),b=$('#cb');b.textContent=n;b.style.display=n?'block':'none';
 $('#di').innerHTML=cart.length?cart.map(c=>{const x=P[c.i];return `<div class="ln"><div class="im">${V(c.i,x)}</div><div><h4>${x[0]}</h4><div class="qb" style="margin:6px 0"><button onclick="chg(${c.i},-1)">−</button><span>${c.q}</span><button onclick="chg(${c.i},1)">+</button></div><small onclick="rem(${c.i})">Remove</small></div><div class="pr">${fmt(num(x)*c.q)}</div></div>`}).join(''):'<div class="em">Your bag is empty.</div>';
 $('#st').textContent=fmt(cart.reduce((a,c)=>a+num(P[c.i])*c.q,0));save('cart',cart)}
function add(i,q=1){const st=P[i]&&P[i][4];if(st&&st.stock<=0)return toast('This watch is currently sold out');const c=cart.find(c=>c.i==i);c?c.q+=q:cart.push({i,q});drw();toast(P[i][0]+' added to your bag');openC()}
function chg(i,d){const c=cart.find(c=>c.i==i);c.q+=d;if(c.q<1)rem(i);else drw()}
function rem(i){cart=cart.filter(c=>c.i!=i);drw()}
function find(q){const t=q.toLowerCase().split(/\s+/).filter(Boolean);return PL().filter(([x])=>{const h=(x[4]?[x[0],x[1],x[2],x[4].coll,x[4].desc,x[4].specs.map(a=>a.join(' ')).join(' ')].join(' '):x[0]+' '+x[1]+' '+MN[x[3].m]+' '+(x[3].s=='l'?'leather strap':'metal bracelet steel')+(x[3].c?' chronograph':'')+' '+x[2]).toLowerCase();return t.length&&t.every(w=>h.includes(w))})}
function rq(){const q=$('#q').value,r=find(q);$('#qr').innerHTML=q.trim()?(r.length?'<div class="sg">'+r.map(([x,i])=>`<a href="#/product/${i}"><div class="im">${V(i,x)}</div><h4>${x[0]}</h4><small>${x[1]} · ${x[2]}</small></a>`).join('')+'</div>':'<div class="em">No watches match “'+q.replace(/</g,'&lt;')+'”.</div>'):'<div class="em">Try “chronograph”, “rose gold”, “leather” or “diver”.</div>'}
$('#q').oninput=rq;$('#q').onkeydown=e=>{if(e.key==='Enter'&&$('#q').value.trim()){location.hash='#/search/'+encodeURIComponent($('#q').value.trim());closeAll()}};
addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
const PL=()=>P.map((x,i)=>[x,i]).filter(([x])=>x);
function filt(c){$('#ch').innerHTML=['All',...new Set(PL().map(([x])=>x[1]))].map(k=>`<button class="${k==c?'a':''}" onclick="filt('${k}')">${k}</button>`).join('');$('#gr2').innerHTML=PL().filter(([x])=>c=='All'||x[1]==c).map(([x,i])=>card(x,i)).join('');obs()}
function showP(i){const x=P[i];if(!x){location.hash='#/collection';return}const o=x[3];window.qn=1;
 $('#pp').innerHTML=`<div class="pd"><div><div class="im" id="mi">${V(i,x)}</div>${TH(x)}</div><div><div class="eb">${x[1]}</div><h2 class="serif">${x[0]}</h2><div class="pr">${x[2]}</div><p>${DS(x)}</p><ul class="spec">${SP(x)}</ul><div class="qty"><div class="qb"><button onclick="qn=Math.max(1,qn-1);$('#qv').textContent=qn">−</button><span id="qv">1</span><button onclick="qn++;$('#qv').textContent=qn">+</button></div><button class="btn" onclick="add(${i},qn)">Add to Bag</button></div><div class="qty" style="margin-top:18px"><button class="btn" onclick="tw(${i})">♡ Add to Wishlist</button><button class="btn" onclick="cart=[{i:${i},q:qn}];drw();checkout()">Buy Now</button></div><p class="tr">Complimentary insured shipping · 5-year international warranty · 30-day returns · Secure payment by Stripe</p></div></div><div class="rel"><div class="eb">You may also like</div><div class="grid" style="margin-top:30px">${PL().filter(([y,j])=>j!=i).slice(0,4).map(([y,j])=>card(y,j)).join('')}</div></div>`}
function showS(q){const r=find(q);$('#sh').textContent=r.length+' result'+(r.length==1?'':'s')+' for “'+q+'”';$('#gr3').innerHTML=r.map(([x,i])=>card(x,i)).join('')}
const FQ=[['How long does delivery take?','Insured, tracked delivery takes 2–4 business days within Europe and 4–7 internationally. Every watch ships in its presentation box.'],['What is the warranty?','Every AURELIS watch carries a five-year international warranty covering the movement and case against manufacturing defects.'],['Can I return a watch?','Yes. Unworn watches with their seals and packaging can be returned within 30 days for a full refund.'],['How often should I service my watch?','We recommend a full service every five years. Our Geneva atelier can handle it, and we offer a complimentary first inspection.'],['Is the strap interchangeable?','Yes. All straps and bracelets use a quick-release spring bar, so you can change them without tools.'],['How do I contact the atelier?','Write to hello@aurelis.com or call +41 22 555 01 42, Monday to Saturday.'],['Privacy and terms','We use your details only to process orders and enquiries, and never sell them. Full terms are available on request from our team.']];
$('#fq').innerHTML=FQ.map(f=>`<div class="fa"><button onclick="this.parentNode.classList.toggle('o')">${f[0]}</button><div>${f[1]}</div></div>`).join('');
function sendC(f){f.reset();toast('Thank you — we will reply within one business day (demo)');return false}
let tab='in';

const api=(u,m='GET',b)=>fetch(u,{method:m,headers:b?{'Content-Type':'application/json'}:{},body:b?JSON.stringify(b):undefined,credentials:'same-origin'}).then(async r=>({ok:r.ok,s:r.status,d:await r.json().catch(()=>({}))})).catch(()=>({ok:false,s:0,d:{error:'Server not reachable. Run “npm start” and open http://localhost:3000'}}));
let wl=load('wl',[]);
async function me(){const r=await api('/api/me');if(r.ok){user=r.d.user;if(user){wl=[...new Set([...wl,...r.d.wishlist])];save('wl',wl);api('/api/wishlist','PUT',{items:wl})}}if(route=='login')lgr()}
function tw(i){wl=wl.includes(i)?wl.filter(x=>x!=i):[...wl,i];save('wl',wl);if(user)api('/api/wishlist','PUT',{items:wl});toast(wl.includes(i)?'Saved to wishlist':'Removed from wishlist');if(route=='wishlist')wlr()}
function wlr(){$('#gw').innerHTML=wl.length?wl.filter(i=>P[i]).map(i=>`<div>${card(P[i],i)}<div class="qty" style="margin-top:14px"><button class="btn" onclick="tw(${i});add(${i})">Move to Bag</button><button class="btn" onclick="tw(${i})">Remove</button></div></div>`).join(''):'<div class="em">No saved watches yet.</div>';$('#wn').textContent=user?'':'Sign in to keep your wishlist across devices.';obs()}
async function checkout(){if(!cart.length)return toast('Your bag is empty');const r=await api('/api/checkout','POST',{items:cart.map(c=>({id:c.i,qty:c.q}))});if(r.ok&&r.d.url)location.href=r.d.url;else toast(r.d.error||'Checkout unavailable')}
async function cfr(id){const c=$('#cf');c.innerHTML='<div class="em">Confirming your order…</div>';let r;for(let n=0;n<6;n++){r=await api('/api/orders/'+id);if(r.ok&&r.d.status=='paid')break;if(!r.ok)break;await new Promise(z=>setTimeout(z,2000));if(route!='confirmation')return}
 if(!r.ok){c.innerHTML='<div class="eb">Order</div><h2 class="serif">Order not found</h2><p style="margin:20px 0 30px;color:var(--mu)">'+(r.d.error||'')+'</p><a class="btn" href="#/collection">Continue Shopping</a>';return}
 const o=r.d,pd=o.status=='paid';if(pd){cart=[];drw()}
 c.innerHTML=`<div class="eb">${pd?'Payment received':'Awaiting payment confirmation'}</div><h2 class="serif">${pd?'THANK YOU':'ALMOST THERE'}</h2><p style="margin:18px 0 30px;color:var(--mu)">${pd?'Your AURELIS order has been confirmed.':'We have not yet received confirmation from the payment provider. Refresh in a moment — your order is never marked paid without it.'}</p><div class="ci"><span>Order</span>${o.id}</div>${o.email?`<div class="ci"><span>Email</span>${o.email}</div>`:''}<div class="ci"><span>Summary</span>${o.items.map(i=>i.qty+' × '+i.name).join('<br>')}</div><div class="ci"><span>Total</span>${fmt(o.total)}</div><div class="ci"><span>Estimated delivery</span>2–4 business days (Europe) · 4–7 (worldwide), insured</div><div class="qty" style="margin-top:34px"><a class="btn" href="#/login">View Order</a><a class="btn" href="#/collection">Continue Shopping</a></div>`}
function lgr(tok){const l=$('#lg');
 if(tok){window.rt=tok;l.innerHTML='<div class="eb">Account</div><h2 class="serif">New password</h2><form onsubmit="return rs(this)"><input name="p" type="password" placeholder="New password (min. 8 characters)" autocomplete="new-password" required><div class="er" id="er"></div><button class="btn">Update Password</button></form>';return}
 if(user){l.innerHTML=`<div class="eb">My AURELIS</div><h2 class="serif">Welcome, ${user.first||user.email}.</h2><p style="color:var(--mu);margin:16px 0 8px">${user.email}${user.verified?'':' — email not yet verified (check your inbox)'}</p><div class="eb" style="margin-top:44px">My orders</div><div id="ol" class="em">Loading…</div><div class="qty"><a class="btn" href="#/wishlist">Wishlist</a><button class="btn" onclick="out()">Sign Out</button></div>`;
  api('/api/orders').then(r=>{$('#ol').className='';$('#ol').innerHTML=r.ok&&r.d.orders.length?r.d.orders.map(o=>`<a href="#/confirmation/${o.id}" class="ci" style="display:block"><span>${o.id} · ${new Date(o.date).toLocaleDateString()} · ${o.status}</span>${o.items.map(i=>i.qty+' × '+i.name).join(', ')} — ${fmt(o.total)}</a>`).join(''):'<div class="em" style="text-align:left;padding:14px 0">No orders yet.</div>'});return}
 l.innerHTML=`<div class="eb">My AURELIS</div><h2 class="serif">${tab=='in'?'Sign in':'Create account'}</h2><div class="oa"><a class="btn" href="/auth/google">${tab=='in'?'Continue':'Sign up'} with Google</a><a class="btn" href="/auth/facebook">${tab=='in'?'Continue':'Sign up'} with Facebook</a></div><div class="tabs"><button class="${tab=='in'?'a':''}" onclick="tab='in';lgr()">Sign in</button><button class="${tab=='up'?'a':''}" onclick="tab='up';lgr()">Register</button></div><form onsubmit="return sub(this)">${tab=='up'?'<input name="fn" placeholder="First name" autocomplete="given-name" required><input name="ln" placeholder="Last name" autocomplete="family-name" required>':''}<input name="e" type="email" placeholder="Email" autocomplete="email" required><input name="p" type="password" placeholder="Password (min. 8 characters)" autocomplete="${tab=='in'?'current-password':'new-password'}" required>${tab=='up'?'<input name="c" type="password" placeholder="Confirm password" autocomplete="new-password" required>':'<label class="rm"><input name="r" type="checkbox"> Remember me</label>'}<div class="er" id="er"></div><button class="btn" type="submit">${tab=='in'?'Sign In':'Create Account'}</button>${tab=='in'?'<a class="fg" href="#" onclick="return fgt()">Forgot password?</a>':''}</form>`}
async function sub(f){const er=$('#er');er.textContent='';let r;
 if(tab=='up'){if(f.p.value!==f.c.value){er.textContent='Passwords do not match.';return false}r=await api('/api/register','POST',{first:f.fn.value,last:f.ln.value,email:f.e.value,password:f.p.value})}
 else r=await api('/api/login','POST',{email:f.e.value,password:f.p.value,remember:f.r.checked});
 if(!r.ok){er.textContent=r.d.error||'Something went wrong';return false}toast(r.d.message||'Signed in');await me();lgr();return false}
async function rs(f){const r=await api('/api/reset','POST',{token:window.rt,password:f.p.value});if(!r.ok){$('#er').textContent=r.d.error;return false}toast(r.d.message);location.hash='#/login';return false}
function fgt(){const e=prompt('Your email address');if(e)api('/api/forgot','POST',{email:e}).then(r=>toast(r.ok?'If the account exists, a reset link has been sent.':r.d.error));return false}
async function out(){await api('/api/logout','POST',{});user=null;lgr();toast('Signed out')}
const ae=new URLSearchParams(location.search).get('autherr');if(ae)toast(ae);
me();loadP();
const T={home:'AURELIS — Time, Engineered to Perfection',collection:'Collection',about:'About',faq:'FAQ',contact:'Contact',login:'Account',product:'Watch',wishlist:'Wishlist',confirmation:'Order',search:'Search'};
function go(){const p=location.hash.replace(/^#\/?/,'').split('/'),k=Object.keys(T).includes(p[0])?p[0]:'home',a=decodeURIComponent(p[1]||'');route=k;
 $$('[data-page]').forEach(e=>e.classList.toggle('on',e.dataset.page===k));
 if(k=='collection')filt('All');if(k=='product')showP(+a);if(k=='search')showS(a);if(k=='login')lgr(a);if(k=='wishlist')wlr();if(k=='confirmation')cfr(a);
 document.title=k=='home'?T.home:'AURELIS — '+T[k];closeAll();scrollTo(0,0);obs()}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LK={m:'steel',s:'l',sc:'#3b2118',d:['#1b1b1d','#050506'],n:'i'};
const V=(i,x)=>x[4]&&x[4].img?`<img src="${x[4].img}" alt="${x[0]} — ${x[1]} watch" loading="lazy">`:W(i,x[3]);
const TH=x=>x[4]&&x[4].imgs.length>1?'<div class="th">'+x[4].imgs.map(u=>`<img src="${u}" alt="" loading="lazy" onclick="sw(this)">`).join('')+'</div>':'';
function sw(e){$('#mi').innerHTML=`<img src="${e.src}" alt="">`}
const DS=x=>x[4]?x[4].desc:`A ${MN[x[3].m]} case on a ${x[3].s=='l'?'hand-stitched leather strap':'integrated metal bracelet'}, powered by the in-house automatic movement and finished in our Geneva atelier.`;
const SP=x=>x[4]&&x[4].specs.length?x[4].specs.map(s=>`<li>${s[0]}<span>${s[1]}</span></li>`).join(''):`<li>Movement<span>Automatic, 42 h reserve</span></li><li>Case<span>41 mm ${MN[x[3].m]}</span></li><li>Crystal<span>Sapphire</span></li><li>Water resistance<span>100 m</span></li>`;
function hm(){const L=PL().sort((a,b)=>(b[0][4]&&b[0][4].feat?1:0)-(a[0][4]&&a[0][4].feat?1:0)).slice(0,4);$('#gr').innerHTML=L.map(([x,i])=>card(x,i)).join('');obs()}hm();
async function loadP(){const r=await api('/api/products');if(!r.ok||!Array.isArray(r.d.products))return;const n=[];
 r.d.products.forEach(p=>{const im=(p.images||[]).filter(u=>/^\/uploads\//.test(u));n[p.id]=[esc(p.name),esc(p.category),'$'+p.price.toLocaleString('en-US'),p.look||LK,{img:im[0]||'',imgs:im,desc:esc(p.description),specs:(p.specs||[]).map(s=>[esc(s[0]),esc(s[1])]),stock:p.stock,feat:p.featured,coll:esc(p.collection)}]});
 for(let i=0;i<n.length;i++)n[i]=n[i]||null;P=n;hm();drw();const h=location.hash.replace(/^#\/?/,'').split('/');
 if(route=='collection')filt('All');else if(route=='product')showP(+h[1]);else if(route=='wishlist')wlr();else if(route=='search')showS(decodeURIComponent(h[1]||''));obs()}
addEventListener('hashchange',go);drw();go();
