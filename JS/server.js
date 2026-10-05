// AURELIS server — zero dependencies (Node 18+). Secrets come only from environment variables.
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
try{for(const l of fs.readFileSync('.env','utf8').split('\n')){const m=l.match(/^\s*([A-Z0-9_]+)\s*=\s*([^#]*?)\s*(#.*)?$/);if(m&&!(m[1] in process.env))process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch{}
const E=process.env,PORT=+E.PORT||3000,BASE=E.BASE_URL||`http://localhost:${PORT}`,SEC=BASE.startsWith('https');
const KEY=E.SESSION_SECRET||(console.warn('! SESSION_SECRET not set: sessions reset on restart'),crypto.randomBytes(32).toString('hex'));
const PF=path.join(__dirname,'data','products.json');let PS;
try{PS=JSON.parse(fs.readFileSync(PF))}catch{const sd=JSON.parse(fs.readFileSync(path.join(__dirname,'seed-products.json')));PS={next:sd.length,items:sd.map((p,i)=>({...p,id:i,images:[],featured:i<2,status:'published',created:Date.now()}))}}
const saveP=()=>{fs.mkdirSync(path.dirname(PF),{recursive:true});fs.writeFileSync(PF,JSON.stringify(PS,null,1))};
const prod=i=>PS.items.find(p=>p.id===+i),LKD={m:'steel',s:'l',sc:'#3b2118',d:['#1b1b1d','#050506'],n:'i'};
const pubP=p=>({id:p.id,name:p.name,price:p.price,category:p.category,collection:p.collection,description:p.description,specs:p.specs,stock:p.stock,images:p.images,featured:p.featured,look:p.look||LKD});
const tries=new Map(),eqs=(a,b)=>crypto.timingSafeEqual(crypto.createHash('sha256').update(String(a)).digest(),crypto.createHash('sha256').update(String(b)).digest());
const admOK=q=>{const c=cookies(q).a;if(!c)return false;const[x,e,sg]=c.split('.');return x=='adm'&&sg===hm('adm.'+e)&&+e>Date.now()};
function norm(b,p){const e=[],cl=(v,n)=>String(v??'').trim().slice(0,n);
 if('name' in b){p.name=cl(b.name,100).replace(/[<>]/g,'');if(!p.name)e.push('Name is required')}
 if('price' in b){const v=Math.round(+b.price);if(!(v>=1&&v<=1e7))e.push('Price must be a positive number');else p.price=v}
 if('stock' in b){const v=Math.floor(+b.stock);if(!(v>=0&&v<=1e5))e.push('Stock must be 0 or more');else p.stock=v}
 for(const k of['category','collection'])if(k in b)p[k]=cl(b[k],40).replace(/['"<>\\]/g,'');
 if('description' in b)p.description=cl(b.description,4000);
 if('specs' in b)p.specs=(Array.isArray(b.specs)?b.specs:[]).slice(0,40).map(x=>[cl(x[0],60),cl(x[1],200)]).filter(x=>x[0]&&x[1]);
 if('images' in b){const im=(Array.isArray(b.images)?b.images:[]).slice(0,12);if(im.some(x=>!/^\/uploads\/[a-f0-9]{24}\.jpg$/.test(x)))e.push('Invalid image');else p.images=im}
 if('featured' in b)p.featured=!!b.featured;
 if('status' in b){if(!['published','draft','archived'].includes(b.status))e.push('Invalid status');else p.status=b.status}
 return e}
const DBF=path.join(__dirname,'data','db.json');let db={users:[],orders:[],tokens:[]};try{db=JSON.parse(fs.readFileSync(DBF))}catch{}
const save=()=>{fs.mkdirSync(path.dirname(DBF),{recursive:true});fs.writeFileSync(DBF,JSON.stringify(db,null,1))};
const rnd=n=>crypto.randomBytes(n).toString('hex'),hm=s=>crypto.createHmac('sha256',KEY).update(s).digest('hex');
const hash=(p,s=rnd(16))=>s+':'+crypto.scryptSync(p,s,64).toString('hex');
const chk=(p,h)=>{const[s,x]=h.split(':');return crypto.timingSafeEqual(Buffer.from(hash(p,s).split(':')[1],'hex'),Buffer.from(x,'hex'))};
const J=(r,c,o,h={})=>{r.writeHead(c,{'Content-Type':'application/json',...h});r.end(JSON.stringify(o))};
const cookies=q=>Object.fromEntries((q.headers.cookie||'').split(/;\s*/).filter(Boolean).map(c=>{const i=c.indexOf('=');return[c.slice(0,i),decodeURIComponent(c.slice(i+1))]}));
const ck=(n,v,age)=>`${n}=${encodeURIComponent(v)}; Path=/; HttpOnly; SameSite=Lax;${SEC?' Secure;':''} Max-Age=${age}`;
const sess=(q)=>{const c=cookies(q).s;if(!c)return null;const[u,t,sg]=c.split('.');if(!sg||sg!==hm(u+'.'+t)||+t<Date.now())return null;return db.users.find(x=>x.id===u)||null};
const login=(r,u,remember)=>{const t=Date.now()+(remember?30:1)*864e5;return ck('s',`${u.id}.${t}.${hm(u.id+'.'+t)}`,remember?2592000:86400)};
const pub=u=>({id:u.id,first:u.first,last:u.last,email:u.email,verified:u.verified,provider:u.provider||'email'});
const body=(q,raw,max=1e6)=>new Promise((ok,no)=>{const b=[];let n=0;q.on('data',c=>{n+=c.length;if(n>max){q.destroy();no()}b.push(c)});q.on('end',()=>{const s=Buffer.concat(b);ok(raw?s:(()=>{try{return JSON.parse(s)}catch{return{}}})())})});
async function mail(to,subject,text){if(!E.RESEND_API_KEY){console.log(`[mail not configured] To:${to} | ${subject}\n${text}\n`);return}
 try{await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+E.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:E.MAIL_FROM,to,subject,text})})}catch(e){console.error('mail failed',e.message)}}
const tok=(uid,type,ttl)=>{const t=rnd(24);db.tokens.push({t:hm(t),uid,type,exp:Date.now()+ttl});save();return t};
const useTok=(t,type)=>{const i=db.tokens.findIndex(x=>x.t===hm(t||'')&&x.type===type&&x.exp>Date.now());if(i<0)return null;const[x]=db.tokens.splice(i,1);save();return db.users.find(u=>u.id===x.uid)};
const OA={google:{auth:'https://accounts.google.com/o/oauth2/v2/auth',tok:'https://oauth2.googleapis.com/token',info:'https://openidconnect.googleapis.com/v1/userinfo',id:'GOOGLE_CLIENT_ID',sec:'GOOGLE_CLIENT_SECRET',scope:'openid email profile'},
 facebook:{auth:'https://www.facebook.com/v19.0/dialog/oauth',tok:'https://graph.facebook.com/v19.0/oauth/access_token',info:'https://graph.facebook.com/me?fields=id,first_name,last_name,email',id:'FACEBOOK_APP_ID',sec:'FACEBOOK_APP_SECRET',scope:'email public_profile'}};
const back=(r,e,h={})=>{r.writeHead(302,{Location:'/'+(e?'?autherr='+encodeURIComponent(e):'')+'#/login',...h});r.end()};
async function oauth(q,r,p,cb,url){const o=OA[p];if(!o)return J(r,404,{error:'Unknown provider'});
 if(!E[o.id]||!E[o.sec])return back(r,`${p[0].toUpperCase()+p.slice(1)} sign-in is not configured yet (set ${o.id} and ${o.sec}).`);
 const ru=`${BASE}/auth/${p}/callback`;
 if(!cb){const st=rnd(16);r.writeHead(302,{Location:o.auth+'?'+new URLSearchParams({client_id:E[o.id],redirect_uri:ru,response_type:'code',scope:o.scope,state:st}),'Set-Cookie':ck('st',st,600)});return r.end()}
 if(url.searchParams.get('error')||!url.searchParams.get('code')||url.searchParams.get('state')!==cookies(q).st)return back(r,'Sign-in was cancelled or failed.');
 try{const t=await(await fetch(o.tok,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:E[o.id],client_secret:E[o.sec],code:url.searchParams.get('code'),redirect_uri:ru,grant_type:'authorization_code'})})).json();
  if(!t.access_token)throw 0;const i=await(await fetch(p=='facebook'?o.info+'&access_token='+t.access_token:o.info,{headers:{Authorization:'Bearer '+t.access_token}})).json();
  const em=(i.email||'').toLowerCase();if(!em)return back(r,'Your account did not share an email address.');
  let u=db.users.find(x=>x.email===em);if(!u){u={id:rnd(8),email:em,first:i.given_name||i.first_name||'',last:i.family_name||i.last_name||'',verified:true,provider:p,wl:[],created:Date.now()};db.users.push(u)}else u.verified=true;save();
  back(r,'',{'Set-Cookie':[login(r,u,true),ck('st','',0)]})}catch{back(r,'Sign-in failed. Please try again.')}}
const form=o=>{const p=new URLSearchParams();(function f(x,k){if(x&&typeof x=='object')for(const a in x)f(x[a],k?`${k}[${a}]`:a);else p.append(k,x)})(o);return p};
async function api(q,r,u,url){const m=q.method,s=sess(q);
 if(u=='/api/stripe-webhook'){const raw=await body(q,1),h=Object.fromEntries((q.headers['stripe-signature']||'').split(',').map(x=>x.split('=')));
  if(!E.STRIPE_WEBHOOK_SECRET)return J(r,503,{error:'Webhook secret not configured'});
  const ex=crypto.createHmac('sha256',E.STRIPE_WEBHOOK_SECRET).update(h.t+'.'+raw).digest('hex');
  if(!h.v1||h.v1.length!==ex.length||!crypto.timingSafeEqual(Buffer.from(h.v1),Buffer.from(ex))||Math.abs(Date.now()/1e3-h.t)>600)return J(r,400,{error:'Bad signature'});
  const ev=JSON.parse(raw),x=ev.data&&ev.data.object;
  if(ev.type=='checkout.session.completed'&&x.payment_status=='paid'){const o=db.orders.find(o=>o.id===(x.metadata||{}).order_id);if(o&&o.status!='paid'){o.status='paid';o.paid=Date.now();o.email=x.customer_details&&x.customer_details.email||o.email;o.ship=x.shipping_details||x.collected_information&&x.collected_information.shipping_details||null;o.pi=x.payment_intent;save();for(const it of o.items){const p=prod(it.pid);if(p)p.stock=Math.max(0,p.stock-it.qty)}saveP();
   mail(o.email,`AURELIS order ${o.id} confirmed`,`Thank you. Your AURELIS order ${o.id} is confirmed.\n\n${o.items.map(i=>`${i.qty} × ${i.name}`).join('\n')}\nTotal: $${o.total.toLocaleString('en-US')}\n\nEstimated delivery: 2–7 business days, insured.`)}}
  return J(r,200,{received:true})}
 if(m!='GET'&&!/json/.test(q.headers['content-type']||''))return J(r,415,{error:'JSON required'});
 const b=m!='GET'?await body(q,0,u=='/api/admin/upload'?8e6:1e6):{};
 if(u=='/api/me')return J(r,200,{user:s&&pub(s),wishlist:s?s.wl||[]:[]});
 if(u=='/api/register'&&m=='POST'){const em=String(b.email||'').trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(em)||String(b.password||'').length<8||!b.first)return J(r,400,{error:'Enter your name, a valid email and a password of at least 8 characters.'});
  if(db.users.some(x=>x.email===em))return J(r,409,{error:'An account with this email already exists.'});
  const n=x=>String(x||'').slice(0,60),w={id:rnd(8),email:em,first:n(b.first),last:n(b.last),hash:hash(b.password),verified:false,wl:[],created:Date.now()};db.users.push(w);save();
  mail(em,'Verify your AURELIS account',`Welcome to AURELIS.\nVerify your email: ${BASE}/api/verify?token=${tok(w.id,'verify',864e5*3)}`);
  return J(r,200,{message:'Account created. Please check your email to verify it.'},{'Set-Cookie':login(r,w,false)})}
 if(u=='/api/verify'){const w=useTok(url.searchParams.get('token'),'verify');if(w){w.verified=true;save()}return back(r,w?'':'Verification link is invalid or expired.')}
 if(u=='/api/login'&&m=='POST'){const w=db.users.find(x=>x.email===String(b.email||'').trim().toLowerCase());
  if(!w||!w.hash||!chk(String(b.password||''),w.hash))return J(r,401,{error:'Incorrect email or password.'});return J(r,200,{message:'Signed in'},{'Set-Cookie':login(r,w,!!b.remember)})}
 if(u=='/api/logout'&&m=='POST')return J(r,200,{ok:1},{'Set-Cookie':ck('s','',0)});
 if(u=='/api/forgot'&&m=='POST'){const w=db.users.find(x=>x.email===String(b.email||'').trim().toLowerCase());if(w&&w.hash)mail(w.email,'Reset your AURELIS password',`Reset link (valid 1 hour): ${BASE}/#/login/${tok(w.id,'reset',36e5)}`);return J(r,200,{ok:1})}
 if(u=='/api/reset'&&m=='POST'){if(String(b.password||'').length<8)return J(r,400,{error:'Password must be at least 8 characters.'});const w=useTok(b.token,'reset');if(!w)return J(r,400,{error:'Reset link is invalid or expired.'});w.hash=hash(b.password);save();return J(r,200,{message:'Password updated. You can sign in.'})}
 if(u=='/api/wishlist'){if(!s)return J(r,401,{error:'Sign in required'});if(m=='PUT'){s.wl=[...new Set((b.items||[]).map(Number).filter(i=>prod(i)))];save()}return J(r,200,{items:s.wl||[]})}
 if(u=='/api/orders'&&m=='GET'){if(!s)return J(r,401,{error:'Sign in required'});return J(r,200,{orders:db.orders.filter(o=>o.uid===s.id).map(o=>({id:o.id,date:o.created,items:o.items,total:o.total,status:o.status})).reverse()})}
 const mo=u.match(/^\/api\/orders\/(AUR-[A-Z0-9]+)$/);if(mo){const o=db.orders.find(x=>x.id===mo[1]);if(!o||(o.uid&&(!s||s.id!==o.uid)))return J(r,404,{error:'Order not found'});return J(r,200,{id:o.id,status:o.status,items:o.items,total:o.total,email:s?o.email:undefined})}
 if(u=='/api/checkout'&&m=='POST'){
  if(!E.STRIPE_SECRET_KEY)return J(r,503,{error:'Payments are not configured yet. Add STRIPE_SECRET_KEY to the server .env file.'});
  const items=(Array.isArray(b.items)?b.items:[]).map(i=>({c:prod(i.id),qty:Math.min(5,Math.max(1,+i.qty|0))})).filter(i=>i.c&&i.c.status==='published');if(!items.length)return J(r,400,{error:'Your bag is empty or contains unavailable watches.'});const bad=items.find(i=>i.c.stock<i.qty);if(bad)return J(r,400,{error:bad.c.name+' is not available in the requested quantity.'});
  const id='AUR-'+rnd(3).toUpperCase(),total=items.reduce((a,i)=>a+i.c.price*i.qty,0);
  const sp={mode:'payment',success_url:`${BASE}/#/confirmation/${id}`,cancel_url:`${BASE}/#/collection`,'metadata':{order_id:id},phone_number_collection:{enabled:true},shipping_address_collection:{allowed_countries:['US','GB','DE','FR','IT','CH','AE','PK','CA','AU']},
   line_items:items.map(i=>({quantity:i.qty,price_data:{currency:'usd',unit_amount:i.c.price*100,product_data:{name:i.c.name}}}))};if(s)sp.customer_email=s.email;
  try{const R=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:'Bearer '+E.STRIPE_SECRET_KEY,'Content-Type':'application/x-www-form-urlencoded'},body:form(sp)}),d=await R.json();
   if(!R.ok)return J(r,502,{error:'Payment provider error: '+(d.error&&d.error.message||R.status)});
   db.orders.push({id,uid:s&&s.id,email:s&&s.email,items:items.map(i=>({pid:i.c.id,name:i.c.name,qty:i.qty,price:i.c.price})),total,status:'pending',session:d.id,created:Date.now()});save();return J(r,200,{url:d.url})}
  catch{return J(r,502,{error:'Could not reach the payment provider.'})}}
 if(u=='/api/products'&&m=='GET')return J(r,200,{products:PS.items.filter(p=>p.status==='published').map(pubP)},{'Cache-Control':'no-store'});

 if(u.startsWith('/api/admin/')){const A=u.slice(11);
  if(A=='login'&&m=='POST'){const ip=q.socket.remoteAddress,t=tries.get(ip)||{n:0,u:0};
   if(t.n>=5&&t.u>Date.now())return J(r,429,{error:'Too many attempts. Try again in 15 minutes.'});
   if(!E.ADMIN_EMAIL||!(E.ADMIN_PASSWORD_HASH||E.ADMIN_PASSWORD))return J(r,503,{error:'Admin is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env.'});
   let ok=false;try{ok=eqs(String(b.email||'').trim().toLowerCase(),E.ADMIN_EMAIL.toLowerCase())&(E.ADMIN_PASSWORD_HASH?chk(String(b.password||''),E.ADMIN_PASSWORD_HASH):eqs(b.password||'',E.ADMIN_PASSWORD))}catch{}
   if(!ok){t.n=(t.u>Date.now()?t.n:0)+1;t.u=Date.now()+9e5;tries.set(ip,t);return J(r,401,{error:'Incorrect email or password.'})}
   tries.delete(ip);const e=Date.now()+288e5;return J(r,200,{ok:1},{'Set-Cookie':`a=${'adm.'+e+'.'+hm('adm.'+e)}; Path=/; HttpOnly; SameSite=Strict;${SEC?' Secure;':''} Max-Age=28800`})}
  if(!admOK(q))return J(r,401,{error:'Admin sign-in required'});
  if(A=='logout'&&m=='POST')return J(r,200,{ok:1},{'Set-Cookie':'a=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'});
  if(A=='products'&&m=='GET')return J(r,200,{products:PS.items},{'Cache-Control':'no-store'});
  if(A=='products'&&m=='POST'){const p={id:PS.next,name:'',price:0,category:'Automatic',collection:'',description:'',specs:[],stock:0,images:[],featured:false,status:'draft',look:LKD,created:Date.now()},e=norm(b,p);if(!p.name||!p.price)e.push('Name and price are required');if(e.length)return J(r,400,{error:e.join(' ')});PS.next++;PS.items.push(p);saveP();return J(r,200,{product:p})}
  const mp=A.match(/^products\/(\d+)$/);
  if(mp){const p=prod(mp[1]);if(!p)return J(r,404,{error:'Product not found'});
   if(m=='PUT'){const e=norm(b,p);if(e.length)return J(r,400,{error:e.join(' ')});saveP();return J(r,200,{product:p})}
   if(m=='DELETE'){PS.items=PS.items.filter(x=>x!==p);saveP();return J(r,200,{ok:1})}}
  if(A=='upload'&&m=='POST'){const mm=String(b.data||'').match(/^data:image\/jpeg;base64,([A-Za-z0-9+\/=]+)$/);if(!mm)return J(r,400,{error:'Only JPEG images are accepted.'});const buf=Buffer.from(mm[1],'base64');
   if(buf.length>6e6||buf[0]!==0xFF||buf[1]!==0xD8||buf[2]!==0xFF)return J(r,400,{error:'Invalid or too-large image (max 6 MB).'});
   const n=rnd(12)+'.jpg',d=path.join(__dirname,'public','uploads');fs.mkdirSync(d,{recursive:true});fs.writeFileSync(path.join(d,n),buf);return J(r,200,{url:'/uploads/'+n})}
 }
 J(r,404,{error:'Not found'})}
const MT={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.mp4':'video/mp4','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json','.txt':'text/plain'};
function stat(q,r,u){if(u=='/admin'||u=='/admin/')u='/admin.html';const pub=path.join(__dirname,'public');let f=path.normalize(path.join(pub,u=='/'?'index.html':u));if(!f.startsWith(pub)||!fs.existsSync(f)||fs.statSync(f).isDirectory())return J(r,404,{error:'Not found'});
 const z=fs.statSync(f).size,h={'Content-Type':MT[path.extname(f)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':f.endsWith('.html')?'no-cache':'public,max-age=86400','X-Content-Type-Options':'nosniff'},rg=/bytes=(\d*)-(\d*)/.exec(q.headers.range||'');
 if(f.endsWith('admin.html')){h['Cache-Control']='no-store';h['X-Robots-Tag']='noindex';h['X-Frame-Options']='DENY'}
 if(rg){const a=rg[1]?+rg[1]:z-+rg[2],e=rg[1]&&rg[2]?Math.min(+rg[2],z-1):z-1;r.writeHead(206,{...h,'Content-Range':`bytes ${a}-${e}/${z}`,'Content-Length':e-a+1});return fs.createReadStream(f,{start:a,end:e}).pipe(r)}
 r.writeHead(200,{...h,'Content-Length':z});fs.createReadStream(f).pipe(r)}
http.createServer(async(q,r)=>{try{const url=new URL(q.url,BASE),u=decodeURIComponent(url.pathname);
 if(u.startsWith('/api/'))return await api(q,r,u,url);const m=u.match(/^\/auth\/(\w+)(\/callback)?$/);if(m)return await oauth(q,r,m[1],!!m[2],url);stat(q,r,u)}catch(e){console.error(e);if(!r.headersSent)J(r,500,{error:'Server error'})}}).listen(PORT,()=>console.log('AURELIS running at '+BASE+'\nStripe:'+(E.STRIPE_SECRET_KEY?'on':'OFF')+' Google:'+(E.GOOGLE_CLIENT_ID?'on':'OFF')+' Facebook:'+(E.FACEBOOK_APP_ID?'on':'OFF')));
