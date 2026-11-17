/* ======================================================================
   POKÉMON LANGUAGE ADVENTURE: LINGUA REGION
   DLO Bahasa Melayu Tahun 4 (KSSR 5.2: pembentukan kata)
   Bergantung pada index.html: LESSONS (bank soalan), S, db, save, render.
   Simpanan: localStorage "lingua_v1_<id murid>"
   ====================================================================== */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{const r=a.slice();for(let i=r.length-1;i>0;i--){const k=Math.floor(Math.random()*(i+1));[r[i],r[k]]=[r[k],r[i]]}return r};
const U=()=>Math.random().toString(36).slice(2,9);

/* ---------- DATA POKÉMON ---------- */
const SP={};
const sp=(id,n,t,hp,e,l,x)=>{SP[id]=Object.assign({n,t,hp,e,l},x||{})};
sp(1,"Bulbasaur","Rumput",40,"🌱","Kata berimbuhan: ber + main = bermain.",{evo:[5,2]});
sp(2,"Ivysaur","Rumput",52,"🌿","Kata berimbuhan: makan + an = makanan.",{evo:[10,3]});
sp(3,"Venusaur","Rumput",65,"🌳","Apitan: per + main + an = permainan.");
sp(4,"Charmander","Api",38,"🔥","Kata ganda penuh: buku-buku.",{evo:[5,5]});
sp(5,"Charmeleon","Api",50,"🔥","Kata ganda separa: pepohon.",{evo:[10,6]});
sp(6,"Charizard","Api",64,"🐉","Kata ganda: tetamu, lelaki.");
sp(7,"Squirtle","Air",40,"💧","Kata majmuk: kapal terbang.",{evo:[5,8]});
sp(8,"Wartortle","Air",52,"💧","Kata majmuk bebas: meja makan.",{evo:[10,9]});
sp(9,"Blastoise","Air",66,"🐢","Kata majmuk mantap: matahari.");
sp(10,"Caterpie","Serangga",30,"🐛","Awalan di-: dimakan.");
sp(16,"Pidgey","Terbang",32,"🐦","Kata majmuk bebas: kapal terbang.");
sp(19,"Rattata","Biasa",28,"🐭","Kata ganda penuh: kuda-kuda.");
sp(25,"Pikachu","Elektrik",35,"⚡","Kata majmuk bebas: kereta api.",{stone:26});
sp(26,"Raichu","Elektrik",55,"⚡","Kata majmuk mantap: kerjasama.");
sp(39,"Jigglypuff","Biasa",45,"🎤","Akhiran -an: lukisan.");
sp(41,"Zubat","Racun",30,"🦇","Akhiran -kan: ambilkan.");
sp(43,"Oddish","Rumput",34,"🌿","Akhiran -i: dekati.");
sp(52,"Meowth","Biasa",32,"🐱","Kata majmuk: buku teks.");
sp(53,"Persian","Biasa",55,"🐱","Kata ganda penuh: meja-meja.");
sp(65,"Alakazam","Psikik",55,"🔮","Gabungan semua jenis pembentukan kata.");
sp(66,"Machop","Lawan",40,"💪","Kata ganda separa: lelaki.");
sp(69,"Bellsprout","Rumput",34,"🌱","Apitan: kegembiraan.");
sp(74,"Geodude","Batu",40,"🪨","Kata ganda penuh: anak-anak.");
sp(81,"Magnemite","Elektrik",32,"🧲","Kata majmuk bebas: lampu isyarat.");
sp(95,"Onix","Batu",55,"🪨","Kata ganda separa: tetamu.");
sp(100,"Voltorb","Elektrik",32,"⚪","Kata majmuk mantap: tanggungjawab.");
sp(133,"Eevee","Biasa",40,"✨","Awalan se-: sekelas.",{stone:136});
sp(136,"Flareon","Api",60,"🔥","Kata ganda penuh: guru-guru.");
sp(149,"Dragonite","Naga",90,"🐲","Penguasa semua jenis kata!");
const STARTERS=[1,4,7,25];
const stage=id=>{for(const k in SP){const s=SP[k];if((s.evo&&s.evo[1]==id)||s.stone==id)return 1+stage(+k)}return 1};
const spr=(id,w)=>`<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" width="${w||96}" height="${w||96}" alt="${esc(SP[id]?SP[id].n:"Pokémon")}" onerror="this.outerHTML='<span class=&quot;lg-fbk&quot;>${SP[id]?SP[id].e:"🐾"}</span>'">`;

/* ---------- WILAYAH ---------- */
const RG={
 g1:{n:"Hutan Rumput",top:"Kata Berimbuhan",t:"imbuhan",leader:"Flora",badge:"Lencana Alam (Nature Badge)",bg:"lg-g1",pool:[10,16,43,69],gym:{id:43,lv:8},deco:"🌳🌿🍃🌲🌸",lines:"Pokémon di sini lupa cara menggunakan imbuhan. Bantu mereka!"},
 g2:{n:"Bandar Metro",top:"Kata Majmuk",t:"majmuk",leader:"Volt",badge:"Lencana Pengetahuan (Knowledge Badge)",bg:"lg-g2",pool:[81,100,19,52],gym:{id:26,lv:14},deco:"🏙️🚆🚦💡🛰️",lines:"Teka-teki kata majmuk bertaburan di seluruh bandar. Gabungkan kata dengan betul!"},
 g3:{n:"Gua Gunung",top:"Kata Ganda",t:"ganda",leader:"Rocky",badge:"Lencana Penguasaan (Mastery Badge)",bg:"lg-g3",pool:[74,41,66,95],gym:{id:95,lv:20},deco:"⛰️🪨💎🕯️🦇",lines:"Gua ini bergema dengan kata yang diulang-ulang. Kenal pasti jenis kata ganda!"}
};
const ORDER=["g1","g2","g3"];

/* ---------- PANGKALAN PENGETAHUAN PROFESOR BAHASA (tiada AI sebenar) ---------- */
const KB={
 imbuhan:{t:"Kata Berimbuhan",d:"Kata akar yang ditambah imbuhan. Awalan di hadapan (ber-, me-, di-, ter-, se-), akhiran di belakang (-an, -kan, -i), apitan di hadapan dan belakang serentak (per-an, ke-an, pe-an).",ex:"ber + main = bermain; makan + an = makanan; ke + gembira + an = kegembiraan",hint:"Cari kata akar dahulu. Kemudian lihat imbuhan: di hadapan, di belakang atau kedua-duanya?"},
 majmuk:{t:"Kata Majmuk",d:"Gabungan dua kata atau lebih yang membawa satu makna. Majmuk bebas ditulis berasingan; majmuk mantap ditulis rapat.",ex:"kereta api, meja makan (bebas); matahari, kerjasama (mantap)",hint:"Adakah dua kata bergabung menjadi satu makna? Jika ditulis rapat, ia majmuk mantap."},
 ganda:{t:"Kata Ganda",d:"Kata yang diulang. Ganda penuh mengulang seluruh kata akar dengan sempang; ganda separa mengulang sebahagian kata akar.",ex:"buku-buku, kanak-kanak (penuh); pepohon, lelaki, tetamu (separa)",hint:"Adakah kata diulang? Seluruhnya = penuh. Sebahagian sahaja = separa."},
 campuran:{t:"Campuran",d:"Gabungan imbuhan, majmuk dan ganda.",ex:"makanan, kereta api, buku-buku",hint:"Tanya diri: ada imbuhan, dua kata bergabung, atau kata diulang?"}
};
const FAQ=[
 ["Apakah beza awalan, akhiran dan apitan?","Awalan di hadapan kata akar (bermain). Akhiran di belakang (makanan). Apitan ada di hadapan dan di belakang serentak (permainan)."],
 ["Apakah beza majmuk bebas dan mantap?","Majmuk bebas ditulis berasingan (kereta api). Majmuk mantap ditulis rapat dan maknanya tetap (matahari)."],
 ["Apakah beza ganda penuh dan separa?","Ganda penuh mengulang seluruh kata akar (buku-buku). Ganda separa mengulang sebahagian (pepohon)."],
 ["Bagaimana mencari kata akar?","Buang imbuhan dahulu. Contoh: bermain → main, makanan → makan, permainan → main."],
 ["Mengapa me- menjadi mem- dalam membaca?","Me- berubah mengikut huruf pertama kata akar. Sebelum huruf b, me- menjadi mem-: me + baca = membaca."],
 ["Saya salah jawab. Apa perlu dibuat?","Tidak mengapa! Baca penjelasan, ingat contoh, kemudian cuba lagi. Anda boleh ulang soalan di Pusat Pokémon."]
];

/* ---------- BANK PERKATAAN UNTUK TEKA-TEKI ---------- */
const W=[
 {w:"bermain",t:"imbuhan",n:"awalan ber-"},{w:"makanan",t:"imbuhan",n:"akhiran -an"},{w:"permainan",t:"imbuhan",n:"apitan per-an"},
 {w:"dibaca",t:"imbuhan",n:"awalan di-"},{w:"kegembiraan",t:"imbuhan",n:"apitan ke-an"},{w:"ambilkan",t:"imbuhan",n:"akhiran -kan"},
 {w:"kereta api",t:"majmuk",n:"majmuk bebas"},{w:"matahari",t:"majmuk",n:"majmuk mantap"},{w:"meja makan",t:"majmuk",n:"majmuk bebas"},
 {w:"kerjasama",t:"majmuk",n:"majmuk mantap"},{w:"kapal terbang",t:"majmuk",n:"majmuk bebas"},{w:"tanggungjawab",t:"majmuk",n:"majmuk mantap"},
 {w:"buku-buku",t:"ganda",n:"ganda penuh"},{w:"pepohon",t:"ganda",n:"ganda separa"},{w:"kanak-kanak",t:"ganda",n:"ganda penuh"},
 {w:"tetamu",t:"ganda",n:"ganda separa"},{w:"lelaki",t:"ganda",n:"ganda separa"},{w:"meja-meja",t:"ganda",n:"ganda penuh"}
];
const TN={imbuhan:"Kata Berimbuhan",majmuk:"Kata Majmuk",ganda:"Kata Ganda"};
const PZ={
 g1:{s:[{p:["ber","main"],j:"",a:"bermain",n:"ber- + main"},{p:["makan","an"],j:"",a:"makanan",n:"makan + -an"},{p:["per","main","an"],j:"",a:"permainan",n:"per- + main + -an"},{p:["ke","gembira","an"],j:"",a:"kegembiraan",n:"ke- + gembira + -an"}],
     l:[{s:"Adik sedang ___ buku cerita.",o:["membaca","bacaan","pembaca"],a:0,n:"Kata kerja aktif: me- + baca = membaca."},{s:"Ayah ___ kereta ke pejabat.",o:["pandukan","memandu","dipandu"],a:1,n:"Me- + pandu = memandu."},{s:"Kuih itu ___ oleh adik.",o:["dimakan","makanan","memakan"],a:0,n:"Di- + makan = dimakan (perbuatan dikenakan)."}]},
 g2:{s:[{p:["kereta","api"],j:" ",a:"kereta api",n:"majmuk bebas ditulis berasingan"},{p:["mata","hari"],j:"",a:"matahari",n:"majmuk mantap ditulis rapat"},{p:["meja","makan"],j:" ",a:"meja makan",n:"majmuk bebas"},{p:["kerja","sama"],j:"",a:"kerjasama",n:"majmuk mantap"}],
     l:[{s:"Kami menaiki ___ ke bandar.",o:["kereta api","berlari","makanan"],a:0,n:"Kereta api ialah kata majmuk bebas."},{s:"___ terbit di timur.",o:["Mata hari","Matahari","Harimata"],a:1,n:"Majmuk mantap ditulis rapat: matahari."},{s:"Pemandu berhenti di ___ merah.",o:["lampu isyarat","bersinar","cahaya-cahaya"],a:0,n:"Lampu isyarat ialah majmuk bebas."}]},
 g3:{s:[{p:["buku","buku"],j:"-",a:"buku-buku",n:"ganda penuh guna sempang"},{p:["pe","pohon"],j:"",a:"pepohon",n:"ganda separa: pe + pohon"},{p:["te","tamu"],j:"",a:"tetamu",n:"ganda separa: te + tamu"},{p:["kanak","kanak"],j:"-",a:"kanak-kanak",n:"ganda penuh"}],
     l:[{s:"___ itu bermain di padang. (ramai)",o:["Kanak-kanak","Kanak","Kanakan"],a:0,n:"Kanak-kanak ialah ganda penuh."},{s:"___ di taman itu rendang.",o:["Pohon pohon","Pepohon","Pohonan"],a:1,n:"Pepohon ialah ganda separa."},{s:"___ itu dijemput masuk.",o:["Tetamu","Tamuan","Tamu tamu"],a:0,n:"Tetamu ialah ganda separa."}]}
};

/* ---------- KEADAAN & SIMPANAN ---------- */
let G=null,key="",BT=null,CF=null,PU=null;
const fresh=name=>({v:1,name,xp:0,coins:100,mons:[],team:[],items:{ball:5,great:0,potion:3,super:0,stone:1},badges:[],prog:{},mis:0,ach:{},learn:{imbuhan:[],majmuk:[],ganda:[],campuran:[]},stats:{ok:0,t:0,wins:0},wrong:[],seen:[],caught:[],set:{mus:.5,sfx:.7,mute:false},rocket:false,master:false,elite:false,intro:false});
/* Semak & baiki data simpanan supaya data rosak/lama tidak menyebabkan ralat */
function sanitize(o,name){
 const f=fresh(name);if(!o||typeof o!=="object"||o.v!==1)return null;
 const g=Object.assign(f,o);
 ["items","prog","ach","learn","stats","set"].forEach(k=>{g[k]=Object.assign(f[k],o[k]&&typeof o[k]==="object"?o[k]:{})});
 Object.keys(g.learn).forEach(k=>{if(!Array.isArray(g.learn[k]))g.learn[k]=[]});
 ["mons","team","badges","wrong","seen","caught"].forEach(k=>{if(!Array.isArray(g[k]))g[k]=[]});
 g.mons=g.mons.filter(m=>m&&SP[m.id]).map(m=>({u:String(m.u||U()),id:m.id,lv:Math.max(1,+m.lv||1),xp:+m.xp||0,hp:Math.max(0,+m.hp||0)}));
 g.team=g.team.filter(u=>g.mons.some(m=>m.u===u)).slice(0,6);
 g.badges=g.badges.filter(b=>RG[b]);
 ["xp","coins","mis"].forEach(k=>{g[k]=Math.max(0,+g[k]||0)});
 return g;
}
const persist=()=>{try{if(G&&key)localStorage.setItem(key,JSON.stringify(G))}catch(e){}};
const sid=()=>(typeof S!=="undefined"&&S&&S.id)||"tetamu";
const sname=()=>{try{const m=db.students.find(s=>s.id===sid());return m?m.n:"Jurulatih"}catch(e){return "Jurulatih"}};
const readSave=()=>{try{return sanitize(JSON.parse(localStorage.getItem(key)),sname())}catch(e){return null}};
const mon=u=>G.mons.find(m=>m.u===u);
const mhp=m=>SP[m.id].hp+m.lv*6;
const tl=()=>1+Math.floor(G.xp/100);
const prog=()=>G.badges.length*25+(G.master?25:0);
function addMon(id,lv){const m={u:U(),id,lv,xp:0,hp:0};m.hp=mhp(m);G.mons.push(m);if(G.team.length<6)G.team.push(m.u);if(!G.seen.includes(id))G.seen.push(id);if(!G.caught.includes(id))G.caught.push(id);return m}
const alive=()=>G.team.map(mon).filter(m=>m&&m.hp>0);
/* Sinkron kemajuan ke dashboard guru (jika wujud) */
function sync(lid,s,t){try{const me=db.students.find(x=>x.id===sid());if(me){const o=me.p[lid];if(!o||s>o.s)me.p[lid]={s,t};save()}}catch(e){}}

/* ---------- AUDIO (WebAudio; tiada fail luar, jadi tiada ralat 404) ---------- */
let ac=null,mT=null,cur="";
const ctx=()=>{if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(ac&&ac.state==="suspended")ac.resume();return ac};
function tone(f,d,type,v,delay){const c=ctx();if(!c)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+(delay||0);o.type=type||"square";o.frequency.value=f;g.gain.setValueAtTime(Math.max(.0002,v),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.02)}
const SFX={click:[[700,.05]],ok:[[660,.08],[880,.12,.08]],no:[[220,.2,0,"sawtooth"]],ball:[[500,.08],[420,.08,.25],[500,.08,.5]],atk:[[300,.1,0,"sawtooth"],[180,.12,.09,"sawtooth"]],enc:[[400,.08],[600,.08,.08],[800,.12,.16]],lvl:[[523,.1],[659,.1,.1],[784,.1,.2],[1047,.25,.3]],badge:[[784,.12],[988,.12,.12],[1175,.12,.24],[1568,.4,.36]],evo:[[440,.12],[554,.12,.12],[659,.12,.24],[880,.12,.36],[1108,.3,.48]],win:[[523,.12],[659,.12,.12],[784,.12,.24],[1047,.4,.36]]};
function snd(n){if(!G||G.set.mute)return;(SFX[n]||[]).forEach(a=>tone(a[0],a[1],a[3],G.set.sfx*.12,a[2]))}
const MUS={menu:[392,0,523,0,659,0,523,0],battle:[330,330,392,330,440,392,330,262],win:[523,659,784,1047,784,659]};
function music(n){cur=n;if(mT){clearInterval(mT);mT=null}if(!n||!G||G.set.mute||G.set.mus<=0)return;let i=0;const p=MUS[n];mT=setInterval(()=>{const f=p[i++%p.length];if(f)tone(f,.16,"square",G.set.mus*.05)},n==="battle"?170:300)}

/* ---------- ALATAN UI ---------- */
function show(html,cls){const m=$("#lgm");m.className="lg-main "+(cls||"lg-dark");m.innerHTML=html;m.scrollTop=0;persist()}
function toast(t){const d=document.createElement("div");d.className="lg-toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2700)}
const back=(to,l)=>`<button class="ghost" data-act="${to||"hub"}">⬅ ${l||"Kembali"}</button>`;
const bar=(v,m,c)=>`<div class="bar ${c||""}"><i style="width:${Math.max(0,Math.min(100,v/m*100))}%"></i></div>`;
const hpc=(h,m)=>h/m<.35?"hp low":h/m<.65?"hp mid":"hp";
/* Potret watak yang sedang bercakap (emoji besar + Pokémon pendamping) */
const PORT={"Profesor Bahasa":{e:"🧑‍🔬"},"Bos Roket":{e:"🦹",p:53},"Juara Bahasa":{e:"👑",p:149},"Flora":{e:"🌸",p:43},"Volt":{e:"⚡",p:26},"Rocky":{e:"⛏️",p:95}};
const portrait=(who,cls)=>{const P=PORT[who]||{e:"🧑"};return `<div class="lg-port ${cls||""}"><span class="lg-face">${P.e}</span>${P.p?`<span class="lg-pk">${spr(P.p,160)}</span>`:""}</div>`};
/* Dialog RPG: setiap baris boleh "teks" atau [penutur,"teks"]; klik untuk teruskan */
function dialog(lines,done,who,cls){
 let i=0,tm=null;
 const d=()=>{
  const L=lines[i],sp=Array.isArray(L)?L[0]:(who||"Profesor Bahasa"),tx=Array.isArray(L)?L[1]:L;
  show(`<div class="lg-talk"><div class="lg-stage">${portrait(sp)}</div><div class="lg-dlg" id="dl"><b class="lg-who">${esc(sp)}</b><span id="dt"></span><br><small>(klik untuk teruskan ▶ ${i+1}/${lines.length})</small></div></div>`,cls);
  const el=$("#dt");let n=0;
  tm=setInterval(()=>{n++;el.textContent=tx.slice(0,n);if(n>=tx.length){clearInterval(tm);tm=null}},22);
  $("#dl").onclick=()=>{snd("click");if(tm){clearInterval(tm);tm=null}if(n<tx.length){el.textContent=tx;n=tx.length;return}i++;i<lines.length?d():done()};
 };d();
}

/* ---------- SOALAN ---------- */
function mk(arr,n,t){return shuf(arr).slice(0,n).map(q=>{const ix=shuf(q.o.map((_,i)=>i));return{q:q.q,o:ix.map(i=>q.o[i]),a:ix.indexOf(q.a),e:q.e,x:q.x,t:t||q.t}})}
const bank=id=>LESSONS.find(l=>l.id===id).q;
const Q=(r,n)=>mk(bank(r),n,r==="c1"?"campuran":RG[r].t);
function mixed(n){const all=[];ORDER.forEach(r=>bank(r).forEach(q=>all.push(Object.assign({t:RG[r].t},q))));return mk(all,n)}
/* Rekod jawapan: kemas kini statistik, Kamus Bahasa dan senarai soalan salah */
function grade(q,r){
 G.stats.t++;const t=q.t||"campuran",L=G.learn[t]||(G.learn[t]=[]);
 G.wrong=G.wrong.filter(w=>w.q!==q.q);
 if(r){G.stats.ok++;if(!L.includes(q.x)){L.push(q.x);if(L.length>80)L.shift()}}
 else{G.wrong.unshift({q:q.q,o:q.o,a:q.a,e:q.e,x:q.x,t});if(G.wrong.length>40)G.wrong.pop()}
}
/* Paparan soalan dengan petua Prof & penjelasan; done(betul) dipanggil bila tekan Seterusnya */
function ask(q,box,done,o){
 o=o||{};let fb=null,hint=false;
 const draw=()=>{
  box.innerHTML=`<div class="card lg-q"><h3>${esc(q.q)}</h3><div class="lg-opts">${q.o.map((t,j)=>`<button data-j="${j}" class="${fb?(j===q.a?"ok":j===fb.j?"no":"dim"):""}" ${fb?"disabled":""}>${esc(t)}</button>`).join("")}</div>
  ${hint&&!fb?`<p class="lg-hint">💡 Prof. Bahasa: ${esc((KB[q.t]||KB.campuran).hint)}</p>`:""}
  ${fb?`<div class="lg-fb ${fb.r?"good":"try"}"><b>${fb.r?"🎉 Betul! Hebat!":"💪 Tidak mengapa! Mari belajar bersama."}</b>${fb.r?"":`<p>Jawapan yang betul: <b>${esc(q.o[q.a])}</b></p>`}<p>📘 ${esc(q.e)}</p><p>✏️ Contoh: <i>${esc(q.x)}</i></p><button id="lgnx">${o.next||"Seterusnya ➡"}</button></div>`:`<p><button class="ghost" id="lght">💡 Petua Prof. Bahasa</button></p>`}</div>`;
  if(fb){$("#lgnx").onclick=()=>{snd("click");done(fb.r)}}
  else{box.querySelectorAll(".lg-opts button").forEach(b=>b.onclick=()=>{const j=+b.dataset.j,r=j===q.a;fb={j,r};grade(q,r);snd(r?"ok":"no");draw();if(o.onAns)o.onAns(r)});const h=$("#lght");if(h)h.onclick=()=>{hint=true;draw()}}
 };draw();
}

/* ---------- XP, TAHAP & EVOLUSI ---------- */
function evolve(m,msgs){const s=SP[m.id];if(s.evo&&m.lv>=s.evo[0]){const o=s.n;m.id=s.evo[1];if(!G.caught.includes(m.id))G.caught.push(m.id);if(!G.seen.includes(m.id))G.seen.push(m.id);m.hp=mhp(m);msgs.push(`✨ ${o} berevolusi menjadi ${SP[m.id].n}!`);snd("evo")}}
function giveXP(m,x){const msgs=[];m.xp+=x;while(m.xp>=m.lv*20&&m.lv<50){m.xp-=m.lv*20;m.lv++;m.hp=Math.min(mhp(m),m.hp+15);msgs.push(`⬆️ ${SP[m.id].n} naik ke Tahap ${m.lv}!`);snd("lvl");evolve(m,msgs)}return msgs}
function reward(xp,coins,m){const msgs=[],l0=tl();G.xp+=xp;G.coins+=coins;if(m)msgs.push(...giveXP(m,Math.round(xp*.8)));if(tl()>l0){msgs.push(`🌟 Tahap Jurulatih naik ke ${tl()}!`);snd("lvl")}G.mis++;chk();return msgs}

/* ---------- PENCAPAIAN ---------- */
const ACH=[
 {id:"first",n:"Pokémon Pertama",d:"Miliki Pokémon pertama",c:()=>G.mons.length>=1,r:[20,20]},
 {id:"win",n:"Kemenangan Pertama",d:"Menang satu pertarungan",c:()=>G.stats.wins>=1,r:[20,20]},
 {id:"explorer",n:"Penjelajah Tatabahasa",d:"Jawab 30 soalan dengan betul",c:()=>G.stats.ok>=30,r:[40,40]},
 {id:"collector",n:"Pengumpul Pokémon",d:"Kumpul 6 Pokémon",c:()=>G.mons.length>=6,r:[50,50]},
 {id:"badges",n:"Tuan Lencana",d:"Kumpul 3 lencana",c:()=>G.badges.length>=3,r:[80,80]},
 {id:"champ",n:"Juara Bahasa",d:"Jadi Penguasa Bahasa Pokémon",c:()=>G.master,r:[150,150]}
];
function chk(){ACH.forEach(a=>{if(!G.ach[a.id]&&a.c()){G.ach[a.id]=1;G.xp+=a.r[0];G.coins+=a.r[1];snd("badge");toast(`🏆 Pencapaian: ${a.n}! +${a.r[0]} XP +${a.r[1]} syiling`)}});persist()}

/* ---------- SKRIN UTAMA ---------- */
function menu(){
 music("menu");const sv=readSave();
 show(`<div class="card" style="text-align:center"><h1 class="logo" style="font-size:1.1rem">POKÉMON LANGUAGE ADVENTURE</h1><h2>LINGUA REGION</h2><p>Bantu Profesor Bahasa memulihkan Pokédex Bahasa yang dirosakkan Pasukan Roket!</p>
 <div class="lg-row" style="justify-content:center">${sv?`<button data-act="cont">▶ Sambung Permainan</button>`:""}<button data-act="newg">🆕 Permainan Baharu</button>${sv?`<button class="danger" data-act="reset">🗑 Set Semula</button>`:""}</div>
 ${sv?`<p class="mut">Simpanan: Tahap ${1+Math.floor(sv.xp/100)}, ${sv.badges.length} lencana, ${sv.mons.length} Pokémon</p>`:""}</div>`,"lg-hub");
}
function newGame(){
 G=fresh(sname());persist();
 show(`<h2>Pilih Pokémon Pertama Anda</h2><div class="lg-grid">${STARTERS.map(id=>`<div class="card" style="text-align:center"><div class="lg-sp big">${spr(id,110)}</div><h2>${SP[id].n}</h2><span class="tag">${SP[id].t}</span><p>${esc(SP[id].l)}</p><button data-act="starter" data-a="${id}">Pilih ${SP[id].n}</button></div>`).join("")}</div>`,"lg-hub");
}
function intro(){
 dialog(["Selamat datang, "+G.name+"! Saya Profesor Bahasa. Anda dijemput menjelajah Wilayah LINGUA!","Malangnya, Pasukan Roket telah mencuri dan merosakkan data dalam Pokédex Bahasa.","Kini Pokémon di seluruh wilayah lupa cara menggunakan perkataan Bahasa Melayu dengan betul.","Tangkap Pokémon, selesaikan cabaran tatabahasa dan kumpul 3 Lencana Gim.","Akhirnya, kalahkan Pasukan Roket dan Juara Bahasa untuk menjadi PENGUASA BAHASA POKÉMON!"],()=>{G.intro=true;chk();hub()},"Profesor Bahasa","lg-hub");
}
function hub(){
 music("menu");const lv=tl(),open={g1:true,g2:G.badges.includes("g1"),g3:G.badges.includes("g2")},champ=G.badges.length>=3;
 show(`<div class="card"><div class="lg-row"><span style="font-size:2.2rem">🧢</span><div style="flex:1;min-width:180px"><b>${esc(G.name)} · Tahap ${lv}</b> <span class="tag">XP ${G.xp}</span>${bar(G.xp%100,100,"xp")}</div>
 <span class="tag">🪙 ${G.coins}</span><span class="tag">📕 ${G.caught.length} Pokémon</span><span class="tag">🏅 ${G.badges.length}/3</span><span class="tag">✅ Misi ${G.mis}</span></div>
 <div class="lg-row" style="margin-top:.5rem">${G.team.map(u=>mon(u)).filter(Boolean).map(m=>`<span class="mon" title="${SP[m.id].n} Lv${m.lv}">${spr(m.id,48)}</span>`).join("")||"<small>Tiada pasukan</small>"}</div>
 <small>Kemajuan pembelajaran: ${prog()}%</small>${bar(prog(),100)}</div>
 <h2>🗺️ Peta Lingua Region</h2><div class="lg-map">${ORDER.map(r=>{const R=RG[r];return `<button class="lg-node ${R.bg}" data-act="region" data-a="${r}" ${open[r]?"":"disabled"} style="color:#fff"><b style="font-size:1.1rem">${open[r]?"":"🔒 "}${R.n}</b><small>${R.top} · Gim ${R.leader}</small><span>${R.deco}</span>${G.badges.includes(r)?"<span>🏅 Selesai</span>":""}</button>`}).join("")}
 <button class="lg-node lg-c1" data-act="champ" ${champ?"":"disabled"} style="color:#fff"><b style="font-size:1.1rem">${champ?"":"🔒 "}Liga Juara</b><small>${champ?"Elit Empat & Peperiksaan Akhir":"Perlu 3 lencana"}</small><span>🏟️👑</span>${G.master?"<span>🏆 PENGUASA</span>":""}</button></div>
 <div class="lg-nav"><button data-act="team">👥 Pasukan</button><button data-act="dex">📕 Pokédex</button><button data-act="shop">🛒 Kedai</button><button data-act="center">🏥 Pusat Pokémon</button><button data-act="ach">🏆 Pencapaian</button><button data-act="prof">🧑‍🔬 Prof. Bahasa</button></div>`,"lg-hub");
}
function region(r){
 const R=RG[r],pr=G.prog[r]||0,can=pr>=3||G.badges.includes(r);music("menu");
 show(`${back("hub","Peta")}<h2>${R.n}</h2><p>${R.top} · Ketua Gim <b>${R.leader}</b></p><div style="font-size:2rem">${R.deco}</div>
 <div class="lg-row lg-sayrow">${portrait(R.leader,"sm")}<div class="lg-dlg" style="flex:1;min-width:220px"><b class="lg-who">${R.leader}</b>${esc(R.lines)}${pr<3&&!G.badges.includes(r)?" Selesaikan 3 aktiviti dahulu sebelum mencabar saya!":""}</div></div>
 <p>Cabaran wilayah: ${Math.min(pr,3)}/3 ${bar(Math.min(pr,3),3)}</p>
 <div class="lg-nav"><button data-act="enc" data-a="${r}">🌿 Pertemuan Liar</button><button data-act="trn" data-a="${r}">⚔️ Pertarungan Jurulatih</button><button data-act="puz" data-a="${r}">🧩 Teka-teki Pokémon</button><button data-act="hunt" data-a="${r}">🔎 Cari Kata (Pilih Terus)</button><button data-act="gym" data-a="${r}" ${can?"":"disabled"}>🏟️ Cabaran Gim ${can?"":"🔒"}</button></div>`,R.bg);
}
const hubBtn=r=>`<button data-act="region" data-a="${r}">Kembali ke ${RG[r].n}</button>`;
function done(r,msgs,extra){const m=alive()[0];return show(`<div class="card" style="text-align:center"><h2>🎉 Misi Selesai!</h2>${(msgs||[]).map(t=>`<p>${t}</p>`).join("")}${extra||""}${hubBtn(r)}</div>`,RG[r].bg)}

/* ---------- PERTEMUAN LIAR & MENANGKAP POKÉMON ---------- */
function wild(r){
 const id=rnd(RG[r].pool),lv=Math.max(2,Math.min(30,Math.round((alive()[0]||{lv:3}).lv)+Math.floor(Math.random()*3)-1));
 if(!G.seen.includes(id))G.seen.push(id);snd("enc");CF={r,w:{id,lv},throws:0};
 show(`<h2>🌿 ${SP[id].n} liar muncul!</h2><div class="card" style="text-align:center"><div class="lg-sp big float">${spr(id,130)}</div><span class="tag">${SP[id].t}</span> <span class="tag">Tahap ${lv}</span><p>Apa yang anda mahu lakukan?</p><div class="lg-row" style="justify-content:center"><button data-act="catchq">⚾ Tangkap (jawab soalan)</button><button data-act="wfight">⚔️ Bertarung</button>${hubBtn(r)}</div></div>`,RG[r].bg);
}
function catchQ(msg){
 const {r,w}=CF;show(`<h2>⚾ Menangkap ${SP[w.id].n}</h2>${msg?`<p>${msg}</p>`:""}<div class="lg-sp big">${spr(w.id,100)}</div><p>Jawab dengan betul untuk meningkatkan peluang menangkap!</p><div id="qa"></div>`,RG[r].bg);
 ask(Q(r,1)[0],$("#qa"),right=>ballSel(right),{next:"Pilih Poké Ball ➡"});
}
function ballSel(right){
 CF.right=right;const {r,w}=CF,i=G.items;
 show(`<h2>⚾ Baling Poké Ball!</h2><div class="lg-sp big">${spr(w.id,100)}</div><div class="lg-ball" id="ball"></div><p>${right?"Jawapan betul! Peluang menangkap tinggi.":"Peluang agak rendah. Anda boleh cuba soalan lain."}</p>
 <div class="lg-row" style="justify-content:center"><button data-act="throw" data-a="ball" ${i.ball>0?"":"disabled"}>Poké Ball ×${i.ball}</button><button data-act="throw" data-a="great" ${i.great>0?"":"disabled"}>Great Ball ×${i.great}</button><button class="ghost" data-act="catchq">🔄 Soalan lain</button><button class="ghost" data-act="region" data-a="${r}">🏃 Lari</button></div>${i.ball+i.great<=0?"<p>Poké Ball habis! Beli di Kedai.</p>":""}`,RG[r].bg);
}
function doThrow(k){
 const i=G.items;if(i[k]<=0)return;i[k]--;const {r,w,right}=CF,p=Math.min(.95,(k==="great"?.65:.45)+(right?.4:0));
 $("#ball").classList.add("throw");document.querySelectorAll("[data-act=throw],[data-act=catchq]").forEach(b=>b.disabled=true);snd("ball");CF.throws++;
 setTimeout(()=>{
  if(Math.random()<p){
   const m=addMon(w.id,w.lv),msgs=reward(25,20,null);snd("win");
   done(r,[`Anda berjaya menangkap <b>${SP[w.id].n}</b> (Tahap ${w.lv})! ${G.team.includes(m.u)?"Ia menyertai pasukan anda.":"Ia disimpan dalam koleksi."}`,...msgs]);G.prog[r]=(G.prog[r]||0)+1;persist();
  }else if(CF.throws>=4){toast("Pokémon itu melarikan diri...");region(r)}
  else catchQ(`Pokémon itu terlepas dari bola! Cuba lagi (${CF.throws}/4).`);
 },1900);
}

/* ---------- SISTEM PERTARUNGAN GILIRAN ---------- */
/* c:{title,bg,e:{id,lv},qs,atk,xp,coins,prog,back,onWin} */
function battle(c){
 const N=c.qs.length,need=Math.ceil(N*.7),emax=need*10;let i=0,hit=0,ehp=emax,msg=`${SP[c.e.id].n} mahu bertarung!`,cu=alive()[0];
 if(!cu){toast("Pasukan anda pengsan! Pergi ke Pusat Pokémon.");return c.back()}
 music("battle");snd("enc");
 const FX={Rumput:"🍃",Api:"🔥",Air:"💧",Elektrik:"⚡",Batu:"🪨",Psikik:"🔮",Naga:"🐲",Racun:"☠️",Terbang:"💨",Serangga:"🐛",Lawan:"👊",Biasa:"✨"};
 const sc=(an)=>{const it=G.items;$("#sc").innerHTML=`<div class="lg-scene ${c.bg}"><div class="lg-pl en"><b>${SP[c.e.id].n}</b> Tahap ${c.e.lv}${bar(ehp,emax,hpc(ehp,emax))}</div>
  <div class="lg-sp enemy ${an==="atk"?"hit":an==="hurt"?"lunge-en":""}">${spr(c.e.id,110)}</div><div class="lg-sp me ${an==="hurt"?"hit":an==="atk"?"lunge-me":""}">${spr(cu.id,100)}</div>${an==="atk"?`<span class="lg-fx to-en">${FX[SP[cu.id].t]||"✨"}</span>`:an==="hurt"?`<span class="lg-fx to-me">${FX[SP[c.e.id].t]||"✨"}</span>`:""}
  <div class="lg-pl me"><b>${SP[cu.id].n}</b> Tahap ${cu.lv}${bar(cu.hp,mhp(cu),hpc(cu.hp,mhp(cu)))}<small>${cu.hp}/${mhp(cu)} HP</small></div><div class="lg-msg">${esc(msg)}</div></div>
  <div class="lg-row"><button data-act="use" data-a="potion" ${it.potion>0&&cu.hp<mhp(cu)?"":"disabled"}>🧪 Potion ×${it.potion}</button><button data-act="use" data-a="super" ${it.super>0&&cu.hp<mhp(cu)?"":"disabled"}>💊 Super ×${it.super}</button><span class="tag">Soalan ${Math.min(i+1,N)}/${N} · Perlu ${need} betul (${hit}/${need})</span></div>`};
 BT={use:k=>{const it=G.items;if(it[k]<=0||cu.hp>=mhp(cu))return;it[k]--;cu.hp=Math.min(mhp(cu),cu.hp+(k==="super"?50:20));msg=`${SP[cu.id].n} dipulihkan!`;snd("ok");sc()}};
 const end=win=>{
  BT=null;music(win?"win":"menu");let msgs=[],extra="";
  if(win){snd("win");G.stats.wins++;msgs=reward(c.xp,c.coins,cu);if(c.prog)G.prog[c.prog]=(G.prog[c.prog]||0)+1;if(c.onWin)extra=c.onWin(hit,N)||"";persist()}
  show(`<div class="card" style="text-align:center"><h2>${win?"🏆 Kemenangan!":"💫 Belum berjaya"}</h2><div class="lg-sp big">${spr(win?cu.id:c.e.id,110)}</div>
  <p>${win?`Anda mengalahkan ${SP[c.e.id].n}! +${c.xp} XP, +${c.coins} 🪙`:"Jangan risau! Baca semula penjelasan, pulihkan Pokémon di Pusat Pokémon dan cuba lagi. Anda pasti boleh!"}</p>${msgs.map(t=>`<p>${t}</p>`).join("")}${extra}<button data-act="bk">Teruskan ➡</button></div>`,c.bg);
  BT={bk:c.back};
 };
 const q=()=>{
  if(i>=N)return end(false);
  show(`<h2>${esc(c.title)}</h2><div id="sc"></div><div id="qa"></div>`,c.bg);sc();
  ask(c.qs[i],$("#qa"),()=>{
   i++;if(hit>=need)return end(true);if(!alive().length)return end(false);if(hit+(N-i)<need)return end(false);q();
  },{onAns:r=>{
   if(r){ehp=Math.max(0,ehp-10);hit++;msg=`${SP[cu.id].n} menyerang! Serangan berjaya!`;snd("atk");sc("atk")}
   else{const d=(c.atk||10)+Math.floor(c.e.lv*1.5);cu.hp=Math.max(0,cu.hp-d);msg=`${SP[c.e.id].n} menyerang! -${d} HP`;if(cu.hp<=0){const n=alive()[0];if(n){msg+=` ${SP[cu.id].n} pengsan! ${SP[n.id].n} maju!`;cu=n}else msg+=" Semua Pokémon pengsan..."}sc("hurt")}
  },next:i+1>=N?"Lihat Keputusan 🏁":"Soalan Seterusnya ➡"});
 };
 q();
}
const avgLv=()=>{const a=alive()[0];return a?a.lv:3};
function trainer(r){
 const nm=rnd(["Ali","Mei Ling","Kumar","Aisyah","Jebat","Siti"]),e={id:rnd(RG[r].pool),lv:Math.max(2,avgLv()+rnd([-1,0,1]))};
 dialog(["Saya akan mencabar pengetahuan tatabahasa anda!"],()=>battle({title:`Jurulatih ${nm}`,bg:RG[r].bg,e,qs:Q(r,5),atk:9,xp:30,coins:30,prog:r,back:()=>region(r)}),"Jurulatih "+nm,RG[r].bg);
}
function gym(r){
 const R=RG[r];dialog([`Saya Ketua Gim ${R.n}! Tunjukkan anda memahami ${R.top.toLowerCase()}!`],()=>battle({title:`Gim ${R.n}: ${R.leader}`,bg:R.bg,e:R.gym,qs:Q(r,10),atk:12,xp:70,coins:70,back:()=>region(r),
  onWin:(h,n)=>{const first=!G.badges.includes(r);if(first){G.badges.push(r);snd("badge")}sync(r,h,n);chk();return `<p class="lg-badge">🏅 ${R.badge}${first?" diperoleh!":""}</p>`}}),R.leader,R.bg);
}
function elite(){
 battle({title:"Elit Empat: Penilaian Gabungan",bg:"lg-c1",e:{id:65,lv:25},qs:mixed(12),atk:13,xp:90,coins:100,back:champ,onWin:()=>{G.elite=true;return "<p>🏅 Elit Empat dikalahkan!</p>"}});
}
function champ(){
 music("menu");
 if(!G.rocket){
  return show(`${back("hub","Peta")}<h2>👑 Liga Juara</h2><div class="card"><p>Pasukan Roket menyekat pintu masuk Stadium!</p><div class="lg-row"><button data-act="boss">🚀 Lawan Bos Pasukan Roket</button><button data-act="elite">🏅 Elit Empat (latihan)</button></div></div>`,"lg-c1");
 }
 show(`${back("hub","Peta")}<h2>👑 Liga Juara</h2><div class="card"><p>${G.master?"Anda sudah menjadi PENGUASA BAHASA POKÉMON! Cabar semula untuk berlatih.":"Bos Roket telah tewas! Kini cabar Juara Bahasa."}</p><div class="lg-row"><button data-act="final">🏆 Cabar Juara Bahasa</button><button data-act="elite">🏅 Elit Empat</button></div></div>`,"lg-c1");
}
function boss(){
 dialog([["Bos Roket","Hahaha! Pokédex Bahasa itu milik kami!"],["Profesor Bahasa","Jawab dengan betul, "+G.name+". Kita boleh menang!"]],()=>battle({title:"Bos Pasukan Roket",bg:"lg-c1",e:{id:53,lv:28},qs:mixed(10),atk:14,xp:100,coins:100,back:champ,onWin:()=>{G.rocket=true;return "<p>🚀 Pasukan Roket dikalahkan! Data Pokédex Bahasa dipulihkan.</p>"}}),"Bos Roket","lg-c1");
}
function final(){
 dialog(["Selamat datang ke arena akhir! 20 soalan, 14 jawapan betul diperlukan.","Tunjukkan bahawa anda menguasai kata berimbuhan, kata majmuk dan kata ganda!"],()=>battle({title:"Juara Bahasa: Peperiksaan Akhir",bg:"lg-c1",e:{id:149,lv:40},qs:Q("c1",20),atk:12,xp:200,coins:200,back:champ,
  onWin:(h,n)=>{G.master=true;sync("c1",h,n);chk();return `<p class="lg-badge">🏆 PENGUASA BAHASA POKÉMON 🏆</p><p>Tahniah, ${esc(G.name)}! Anda telah memulihkan Pokédex Bahasa.</p>`}}),"Juara Bahasa","lg-c1");
}

/* ---------- TEKA-TEKI (susun, lengkapkan, padankan) ---------- */
function puzzle(r){PU={r,step:0};pz()}
function pz(){const {r,step}=PU,f=[pzSusun,pzLengkap,pzPadan][step];f?f(r):pzEnd(r)}
const pzNext=()=>{PU.step++;pz()};
function pzEnd(r){snd("win");const msgs=reward(30,25,alive()[0]);G.prog[r]=(G.prog[r]||0)+1;done(r,["🧩 Semua teka-teki selesai! +30 XP, +25 🪙",...msgs])}
function pzSusun(r){
 const it=rnd(PZ[r].s);let tray=[];const chips=shuf(it.p.map((p,i)=>({p,i})));
 const draw=(res)=>{show(`<h2>🧩 Susun Perkataan (1/3)</h2><div class="card"><p>Susun bahagian berikut menjadi satu perkataan yang betul.</p><div class="lg-tray">${tray.map(c=>esc(c.p)).join(it.j===" "?" ":it.j)||"&nbsp;"}</div>
  <p>${chips.map(c=>`<button class="lg-chip" data-i="${c.i}" ${tray.includes(c)?"disabled":""}>${esc(c.p)}</button>`).join("")}</p><div class="lg-row"><button class="ghost" id="pzc">↩ Padam</button><button id="pzk">✔ Semak</button></div>${res||""}</div>`,RG[r].bg);
  document.querySelectorAll(".lg-chip").forEach(b=>b.onclick=()=>{tray.push(chips.find(c=>c.i==b.dataset.i));snd("click");draw()});
  $("#pzc").onclick=()=>{tray=[];draw()};
  $("#pzk").onclick=()=>{const a=tray.map(c=>c.p).join(it.j);if(a===it.a){snd("ok");draw(`<div class="lg-fb good"><b>🎉 Betul! ${esc(it.a)}</b><p>📘 ${esc(it.n)}</p><button id="pzn">Seterusnya ➡</button></div>`);$("#pzn").onclick=pzNext}else{snd("no");tray=[];draw(`<div class="lg-fb try"><b>💪 Hampir! Cuba lagi.</b><p>Petua: ${esc(it.n)}</p></div>`)}};
 };draw();
}
function pzLengkap(r){
 const it=rnd(PZ[r].l);let fb=null;
 const draw=()=>{show(`<h2>🧩 Lengkapkan Ayat (2/3)</h2><div class="card"><h3>${esc(it.s)}</h3><p>${it.o.map((o,j)=>`<button class="lg-chip ${fb!==null?(j===it.a?"ok":j===fb?"no":"dim"):""}" data-j="${j}" ${fb!==null?"disabled":""}>${esc(o)}</button>`).join("")}</p>${fb!==null?`<div class="lg-fb ${fb===it.a?"good":"try"}"><b>${fb===it.a?"🎉 Betul!":"💪 Tidak mengapa! Jawapan: "+esc(it.o[it.a])}</b><p>📘 ${esc(it.n)}</p><button id="pzn">Seterusnya ➡</button></div>`:""}</div>`,RG[r].bg);
  document.querySelectorAll(".lg-chip").forEach(b=>b.onclick=()=>{fb=+b.dataset.j;snd(fb===it.a?"ok":"no");draw()});const n=$("#pzn");if(n)n.onclick=pzNext};draw();
}
function pzPadan(r){
 const ws=shuf(W).slice(0,4);const ok={};let sel=null,wrong=0;
 const draw=(msg)=>{const left=ws.filter(w=>!ok[w.w]);
  show(`<h2>🧩 Padankan Jenis Kata (3/3)</h2><div class="card"><p>Pilih perkataan, kemudian pilih jenisnya.</p><p>${ws.map(w=>`<button class="lg-chip ${ok[w.w]?"ok":sel===w.w?"go":""}" data-w="${esc(w.w)}" ${ok[w.w]?"disabled":""}>${esc(w.w)}${ok[w.w]?" ✔":""}</button>`).join("")}</p>
  <p>${Object.keys(TN).map(t=>`<button class="ghost lg-cat" data-t="${t}">${TN[t]}</button>`).join(" ")}</p>${msg?`<div class="lg-fb ${msg[0]}"><p>${msg[1]}</p></div>`:""}${left.length?"":`<button id="pzn">Selesai ➡</button>`}</div>`,RG[r].bg);
  document.querySelectorAll(".lg-chip").forEach(b=>b.onclick=()=>{sel=b.dataset.w;snd("click");draw()});
  document.querySelectorAll(".lg-cat").forEach(b=>b.onclick=()=>{if(!sel)return draw(["try","Pilih perkataan dahulu."]);const w=ws.find(x=>x.w===sel);
   if(w.t===b.dataset.t){ok[w.w]=1;sel=null;snd("ok");draw(["good",`Betul! ${esc(w.w)} ialah ${esc(w.n)}.`])}else{snd("no");draw(["try",`Tidak mengapa! ${esc(w.w)} ialah ${TN[w.t]} (${esc(w.n)}). Cuba lagi.`])}});
  const n=$("#pzn");if(n)n.onclick=pzNext};draw();
}

/* ---------- CARI KATA TERSEMBUNYI ---------- */
function hunt(r){
 /* Semua perkataan dipaparkan terus (tiada kotak tertutup). Murid ketik perkataan yang betul. */
 const t=RG[r].t,tg=shuf(W.filter(w=>w.t===t)).slice(0,4),ot=shuf(W.filter(w=>w.t!==t)).slice(0,6),tiles=shuf(tg.concat(ot).map(w=>({w,s:0})));let found=0,msg="";
 const draw=()=>{show(`${back("region","Kembali").replace('data-act="region"','data-act="region" data-a="'+r+'"')}<h2>🔎 Pilih Perkataan ${TN[t]}</h2><div class="card"><p>Ketik <b>4 perkataan ${TN[t].toLowerCase()}</b> daripada senarai di bawah. Ditemui: ${found}/4</p><div class="lg-tiles">${tiles.map((x,i)=>`<button data-i="${i}" class="${x.s===1?"got":x.s===2?"miss":""}" ${x.s?"disabled":""}>${esc(x.w.w)}${x.s===1?" ✔":""}</button>`).join("")}</div>${msg?`<div class="lg-fb ${msg[0]}"><p>${msg[1]}</p></div>`:""}${found>=4?`<button id="hk">Selesai ➡</button>`:""}</div>`,RG[r].bg);
  document.querySelectorAll(".lg-tiles button").forEach(b=>b.onclick=()=>{const x=tiles[+b.dataset.i];if(x.w.t===t){x.s=1;found++;snd("ok");msg=["good",`Betul! ${esc(x.w.w)} ialah ${esc(x.w.n)}.`]}else{x.s=2;snd("no");msg=["try",`Tidak mengapa! ${esc(x.w.w)} ialah ${TN[x.w.t]} (${esc(x.w.n)}). Teruskan memilih!`]}draw()});
  const h=$("#hk");if(h)h.onclick=()=>{const m=reward(25,30,alive()[0]);G.prog[r]=(G.prog[r]||0)+1;snd("win");done(r,["Semua kata ditemui! +25 XP, +30 🪙",...m])}};draw();
}

/* ---------- PASUKAN ---------- */
function team(){
 const inT=u=>G.team.includes(u);
 show(`${back()}<h2>👥 Pasukan & Koleksi (${G.team.length}/6 dalam pasukan)</h2><div class="lg-grid">${G.mons.map(m=>{const s=SP[m.id];return `<div class="card"><div class="lg-row"><div class="lg-sp big">${spr(m.id,72)}</div><div><b>${s.n}</b> ${G.team[0]===m.u?"⭐":""}<br><span class="tag">${s.t}</span> <span class="tag">Tahap ${m.lv}</span><br><small>Evolusi tahap ${stage(m.id)}/3 · HP ${m.hp}/${mhp(m)}</small></div></div>${bar(m.xp,m.lv*20,"xp")}<small>XP ${m.xp}/${m.lv*20}</small>
 <div class="lg-row" style="margin-top:.4rem">${inT(m.u)?`<button data-act="tmain" data-a="${m.u}">⭐ Utama</button><button class="ghost" data-act="tout" data-a="${m.u}">Keluar</button>`:`<button data-act="tin" data-a="${m.u}">➕ Pasukan</button>`}${s.stone&&G.items.stone>0?`<button data-act="tstone" data-a="${m.u}">💎 Batu</button>`:""}</div></div>`}).join("")||"<p>Belum ada Pokémon.</p>"}</div>`,"lg-dark");
}

/* ---------- POKÉDEX & KAMUS BAHASA ---------- */
function dex(tab){
 tab=tab||"p";
 const tabs=`<div class="lg-row"><button class="${tab==="p"?"":"ghost"}" data-act="dex" data-a="p">📕 Pokédex</button><button class="${tab==="l"?"":"ghost"}" data-act="dex" data-a="l">📖 Kamus Bahasa</button></div>`;
 let body="";
 if(tab==="p")body=`<p>Ditemui ${G.seen.length} · Ditangkap ${G.caught.length} / ${Object.keys(SP).length}</p><div class="lg-grid">${Object.keys(SP).map(Number).sort((a,b)=>a-b).map(id=>{const s=SP[id],sn=G.seen.includes(id),ct=G.caught.includes(id);return `<div class="card ${sn?"":"sil"}"><div class="lg-sp big" style="${sn?"":"filter:brightness(0) opacity(.4)"}">${spr(id,72)}</div><b>No.${String(id).padStart(3,"0")} ${sn?s.n:"???"}</b><br>${sn?`<span class="tag">${s.t}</span> `:""}<span class="tag ${ct?"ok":""}">${ct?"Ditangkap":sn?"Ditemui":"Belum ditemui"}</span>${ct?`<p><small>${esc(s.n)} ialah Pokémon jenis ${s.t}. 📘 ${esc(s.l)}</small></p>`:""}</div>`}).join("")}</div>`;
 else body=`<div class="lg-grid">${Object.keys(TN).map(t=>`<div class="card"><h2>${TN[t]}</h2><p><small>${esc(KB[t].d)}</small></p><p><small><b>Contoh:</b> ${esc(KB[t].ex)}</small></p><span class="tag ok">${G.learn[t].length} contoh dipelajari</span><ul>${G.learn[t].slice(-5).map(x=>`<li><small>${esc(x)}</small></li>`).join("")}</ul></div>`).join("")}</div><p>Ketepatan: ${G.stats.t?Math.round(G.stats.ok/G.stats.t*100):0}% (${G.stats.ok}/${G.stats.t})</p>`;
 show(`${back()}<h2>Pokédex</h2>${tabs}${body}`,"lg-dark");
}

/* ---------- KEDAI ---------- */
const SHOP=[["ball","⚾ Poké Ball",20],["great","🔵 Great Ball",50],["potion","🧪 Potion (+20 HP)",15],["super","💊 Super Potion (+50 HP)",35],["stone","💎 Batu Evolusi",120]];
function shop(m){
 show(`${back()}<h2>🛒 Kedai Item</h2><p>Syiling: 🪙 ${G.coins}</p>${m?`<p>${m}</p>`:""}<div class="lg-grid">${SHOP.map(s=>`<div class="card"><h2>${s[1]}</h2><p>Harga: ${s[2]} 🪙 · Dimiliki: ${G.items[s[0]]}</p><button data-act="buy" data-a="${s[0]}" ${G.coins>=s[2]?"":"disabled"}>Beli</button></div>`).join("")}</div>`,"lg-dark");
}

/* ---------- PUSAT POKÉMON ---------- */
function center(sub,idx){
 music("menu");let body="";
 if(sub==="rev")body=`<h2>📋 Semak Jawapan Salah</h2>${G.wrong.length?G.wrong.map(w=>`<div class="card"><b>${esc(w.q)}</b><p>✅ ${esc(w.o[w.a])}</p><p><small>📘 ${esc(w.e)}<br>✏️ ${esc(w.x)}</small></p></div>`).join(""):"<p>Tiada soalan salah. Hebat!</p>"}`;
 else if(sub==="rep"){
  const L=G.wrong.slice(0,5);if(!L.length)body="<p>Tiada soalan untuk diulang.</p>";
  else{const i=idx||0;if(i>=L.length){body=`<div class="card"><h2>🎉 Ulangan selesai!</h2><p>Teruskan berlatih untuk jadi lebih mahir.</p></div>`}
  else{show(`${back("center","Pusat Pokémon")}<h2>🔁 Ulang Soalan (${i+1}/${L.length})</h2><div id="qa"></div>`,"lg-dark");const w=L[i];ask({q:w.q,o:w.o,a:w.a,e:w.e,x:w.x,t:w.t},$("#qa"),()=>center("rep",i+1));return}}
 }else if(sub==="prg")body=`<h2>📊 Kemajuan Pembelajaran</h2><div class="card"><p>Ketepatan: ${G.stats.t?Math.round(G.stats.ok/G.stats.t*100):0}% (${G.stats.ok}/${G.stats.t})</p>${Object.keys(TN).map(t=>`<p>${TN[t]}: ${G.learn[t].length} contoh dipelajari</p>`).join("")}<p>Lencana: ${G.badges.length}/3 · Pertarungan menang: ${G.stats.wins} · Kemajuan keseluruhan ${prog()}%</p>${bar(prog(),100)}</div>`;
 else body=`<h2>🏥 Pusat Pokémon</h2><p>Selamat datang! Pulihkan Pokémon anda dan ulang kaji pelajaran di sini.</p><div class="lg-nav"><button data-act="heal">💖 Pulihkan Semua Pokémon</button><button data-act="cen" data-a="rev">📋 Semak Jawapan Salah (${G.wrong.length})</button><button data-act="cen" data-a="rep">🔁 Ulang Soalan Salah</button><button data-act="cen" data-a="prg">📊 Kemajuan</button></div>`;
 show(`${back(sub?"center":"hub",sub?"Pusat Pokémon":"Peta")}${body}`,"lg-dark");
}

/* ---------- PENCAPAIAN & PROFESOR ---------- */
function achv(){show(`${back()}<h2>🏆 Pencapaian</h2><div class="lg-grid">${ACH.map(a=>`<div class="card"><h2>${G.ach[a.id]?"🏆":"🔒"} ${a.n}</h2><p>${a.d}</p><span class="tag ${G.ach[a.id]?"ok":""}">${G.ach[a.id]?"Dicapai":`Ganjaran: ${a.r[0]} XP, ${a.r[1]} 🪙`}</span></div>`).join("")}</div>`,"lg-dark")}
function prof(i){
 show(`${back()}<h2>🧑‍🔬 Profesor Bahasa</h2><p class="mut">Pembantu ini menggunakan pangkalan pengetahuan dan jawapan yang telah ditetapkan. Ia bukan AI sebenar.</p>
 <div class="lg-grid">${["imbuhan","majmuk","ganda"].map(t=>`<div class="card"><h2>${KB[t].t}</h2><p>${esc(KB[t].d)}</p><p><b>Contoh:</b> ${esc(KB[t].ex)}</p><p><i>💡 ${esc(KB[t].hint)}</i></p></div>`).join("")}</div>
 <h2>Soalan Lazim</h2><div class="lg-nav">${FAQ.map((f,j)=>`<button class="${i==j?"":"ghost"}" data-act="prof" data-a="${j}">${esc(f[0])}</button>`).join("")}</div>${i!==undefined&&FAQ[i]?`<div class="lg-row lg-sayrow">${portrait("Profesor Bahasa","sm")}<div class="lg-dlg" style="flex:1;min-width:220px"><b class="lg-who">Profesor Bahasa</b>${esc(FAQ[i][1])}</div></div>`:""}`,"lg-dark");
}

/* ---------- TETAPAN AUDIO ---------- */
function settings(){
 const m=document.createElement("div");m.className="lg-modal";m.innerHTML=`<div class="card"><h2>🔊 Tetapan Bunyi</h2><label><input type="checkbox" id="smu" ${G&&G.set.mute?"checked":""}> Senyap</label><label>Muzik <input type="range" id="smus" min="0" max="1" step=".1" value="${G?G.set.mus:.5}"></label><label>Kesan bunyi <input type="range" id="ssfx" min="0" max="1" step=".1" value="${G?G.set.sfx:.7}"></label><button id="sok">Tutup</button></div>`;
 document.body.appendChild(m);
 m.querySelector("#sok").onclick=()=>m.remove();
 if(G){m.querySelector("#smu").onchange=e=>{G.set.mute=e.target.checked;music(G.set.mute?"":cur||"menu");persist()};
  m.querySelector("#smus").oninput=e=>{G.set.mus=+e.target.value;music(cur||"menu");persist()};
  m.querySelector("#ssfx").oninput=e=>{G.set.sfx=+e.target.value;snd("ok");persist()}}
}

/* ---------- PENGENDALI KLIK (satu tempat untuk semua butang data-act) ---------- */
const ACT={
 hub,region,champ,team,dex,shop,center:()=>center(),ach:achv,prof,
 cont:()=>{G=readSave();if(!G){toast("Simpanan rosak. Mulakan permainan baharu.");return menu()}G.intro?hub():intro()},newg:()=>{if(readSave()&&!confirm("Permainan baharu akan menggantikan simpanan lama. Teruskan?"))return;newGame()},
 reset:()=>{if(confirm("Set semula SEMUA kemajuan? Ini tidak boleh dibatalkan.")){try{localStorage.removeItem(key)}catch(e){}G=null;menu()}},
 starter:id=>{addMon(+id,5);chk();intro()},
 enc:wild,wfight:()=>{const {r,w}=CF;battle({title:`${SP[w.id].n} liar`,bg:RG[r].bg,e:w,qs:Q(r,5),atk:8,xp:30,coins:20,prog:r,back:()=>region(r)})},
 catchq:()=>catchQ(),throw:doThrow,trn:trainer,gym,puz:puzzle,hunt,boss,elite,final,
 use:k=>BT&&BT.use&&BT.use(k),bk:()=>BT&&BT.bk&&BT.bk(),
 tmain:u=>{G.team=[u].concat(G.team.filter(x=>x!==u));team()},
 tout:u=>{if(G.team.length<=1)return toast("Pasukan perlu sekurang-kurangnya 1 Pokémon.");G.team=G.team.filter(x=>x!==u);team()},
 tin:u=>{if(G.team.length>=6)return toast("Pasukan penuh (maksimum 6).");G.team.push(u);team()},
 tstone:u=>{const m=mon(u),s=SP[m.id];if(!s.stone||G.items.stone<1)return;G.items.stone--;const o=s.n;m.id=s.stone;if(!G.caught.includes(m.id))G.caught.push(m.id);if(!G.seen.includes(m.id))G.seen.push(m.id);m.hp=mhp(m);snd("evo");toast(`✨ ${o} berevolusi menjadi ${SP[m.id].n}!`);team()},
 buy:k=>{const s=SHOP.find(x=>x[0]===k);if(!s||G.coins<s[2])return;G.coins-=s[2];G.items[k]++;snd("ok");shop(`Dibeli: ${s[1]}`)},
 heal:()=>{G.mons.forEach(m=>m.hp=mhp(m));snd("lvl");toast("Semua Pokémon telah pulih! 💖");center()},
 cen:s=>center(s,0)
};
function onClick(e){
 const b=e.target.closest("[data-act]");if(!b||b.disabled)return;
 const f=ACT[b.dataset.act];if(!f)return;
 if(!["throw","use"].includes(b.dataset.act))snd("click");
 try{f(b.dataset.a)}catch(err){console.error(err);toast("Ralat kecil berlaku. Kembali ke peta.");try{hub()}catch(e2){}}
}

/* ---------- API AWAM ---------- */
function build(){
 if($("#lg"))return;
 const d=document.createElement("div");d.id="lg";d.className="lg";
 d.innerHTML=`<div class="lg-top"><b>LINGUA REGION</b><span><button class="ghost" id="lgs">🔊</button> <button class="ghost" id="lgh">🏠</button> <button class="danger" id="lgx">✖ Tutup</button></span></div><div id="lgm" class="lg-main"></div>`;
 document.body.appendChild(d);d.addEventListener("click",onClick);
 $("#lgx").onclick=close;$("#lgs").onclick=settings;$("#lgh").onclick=()=>{if(G&&G.intro)hub();else menu()};
}
function open(){
 build();key="lingua_v1_"+sid();G=null;$("#lg").classList.add("on");ctx();menu();
}
function close(){
 persist();music("");BT=null;const d=$("#lg");if(d)d.classList.remove("on");G=null;
 try{render()}catch(e){}
}
window.LinguaGame={open,close};
})();
