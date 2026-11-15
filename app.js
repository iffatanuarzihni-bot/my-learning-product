/* ---------- Data (saved in this browser; see note in README) ---------- */
const KEY="belajar_digital_v1";
let db;try{db=JSON.parse(localStorage.getItem(KEY))}catch(e){}
db=db||{teachers:[],students:[]};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}};
const uid=()=>Math.random().toString(36).slice(2,10);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=s=>document.querySelector(s);

let S=null;try{S=JSON.parse(sessionStorage.getItem("bd_s"))}catch(e){}
let loginRole=null,lesson=null,result=null,msg="";
function setS(v){S=v;try{v?sessionStorage.setItem("bd_s",JSON.stringify(v)):sessionStorage.removeItem("bd_s")}catch(e){}render()}
const note=()=>msg?`<div class="err" role="alert">${esc(msg)}</div>`:"";

/* ---------- Screens ---------- */
const ROLES=[
 ["admin","Admin","🛠️","#17233a","#fff","Set up the school and add Guru"],
 ["guru","Guru (Teacher)","👩‍🏫","#2b5fd9","#fff","Add Murid, organise classes, see progress"],
 ["murid","Murid (Student)","🎒","#ffc933","#17233a","Learn lessons and take quizzes"]];

function home(){
 return `<h1>Belajar Digital</h1><p class="mut">Choose who you are to continue.</p><div class="roles">`+
 ROLES.map(r=>`<button class="role" onclick="pick('${r[0]}')"><b style="background:${r[3]};color:${r[4]}">${r[2]}</b><span><strong>${r[1]}</strong><span class="mut" style="padding:0">${r[5]}</span></span></button>`).join("")+`</div>`;
}
function loginView(){
 const r=ROLES.find(x=>x[0]===loginRole);
 return `<button class="ghost" onclick="back()">Back</button><div class="card" style="max-width:420px;margin:1.5rem auto"><h2>${r[1]} sign in</h2>${note()}
 <form onsubmit="login(event)">${loginRole==="admin"?"":`<div class="q"><label for="u">Username</label><input id="u" name="u" autocomplete="username" required></div>`}
 <div class="q"><label for="p">Password</label><input id="p" name="p" type="password" autocomplete="current-password" required></div>
 <button type="submit">Sign in</button></form></div>`;
}
function topBar(title,sub){
 return `<div class="top"><div><h1 style="font-size:2rem">${esc(title)}</h1><div class="mut">${esc(sub)}</div></div><button class="ghost" onclick="logout()">Sign out</button></div>`;
}
const pct=s=>Math.round(Object.keys(s.p).length/LESSONS.length*100);
const avg=s=>{let a=0,b=0;for(const k in s.p){a+=s.p[k].s;b+=s.p[k].t}return b?Math.round(a/b*100)+"%":"No quizzes yet"};

function adminView(){
 const rows=db.teachers.map(t=>`<tr><td>${esc(t.n)}</td><td>${esc(t.u)}</td><td>${db.students.filter(s=>s.t===t.id).length}</td><td><button class="ghost" onclick="delT('${t.id}')">Remove</button></td></tr>`).join("")
  ||`<tr><td colspan="4" class="mut">No Guru yet. Add the first one above.</td></tr>`;
 return topBar("Admin","Manage the Guru in your school")+note()+
 `<div class="card"><h2>Add Guru</h2><form onsubmit="addT(event)" class="grid">
 <div><label for="n">Full name</label><input id="n" name="n" required></div>
 <div><label for="u">Username</label><input id="u" name="u" required></div>
 <div><label for="p">Password</label><input id="p" name="p" required></div>
 <button type="submit">Add Guru</button></form></div>
 <div class="card"><h2>Guru in your school</h2><div class="scroll"><table><tr><th>Name</th><th>Username</th><th>Murid</th><th></th></tr>${rows}</table></div></div>`;
}
function guruView(){
 const me=db.teachers.find(t=>t.id===S.id);if(!me){setTimeout(logout);return ""}
 const mine=db.students.filter(s=>s.t===me.id);
 const classes=[...new Set(mine.map(s=>s.c))].sort();
 const blocks=classes.map(c=>{
  const rows=mine.filter(s=>s.c===c).map(s=>`<tr><td>${esc(s.n)}</td><td>${esc(s.u)} / ${esc(s.p0)}</td>
  <td><div class="bar" title="${pct(s)}%"><i style="width:${pct(s)}%"></i></div><small class="mut">${Object.keys(s.p).length}/${LESSONS.length} lessons</small></td>
  <td>${avg(s)}</td><td><button class="ghost" onclick="delS('${s.id}')">Remove</button></td></tr>`).join("");
  return `<div class="card"><h2>Class ${esc(c)} <span class="tag">${mine.filter(s=>s.c===c).length} murid</span></h2><div class="scroll"><table><tr><th>Name</th><th>Username / password</th><th>Progress</th><th>Quiz score</th><th></th></tr>${rows}</table></div></div>`}).join("")
  ||`<div class="card mut">No murid yet. Add your first murid above and give them a class.</div>`;
 return topBar("Cikgu "+me.n,"Your classes and your murid")+note()+
 `<div class="card"><h2>Add Murid</h2><form onsubmit="addS(event)" class="grid">
 <div><label for="n">Full name</label><input id="n" name="n" required></div>
 <div><label for="u">Username</label><input id="u" name="u" required></div>
 <div><label for="p">Password</label><input id="p" name="p" required></div>
 <div><label for="c">Class</label><input id="c" name="c" list="cls" placeholder="e.g. 4 Bestari" required><datalist id="cls">${classes.map(c=>`<option value="${esc(c)}">`).join("")}</datalist></div>
 <button type="submit">Add Murid</button></form></div>`+blocks;
}
function muridView(){
 const me=db.students.find(s=>s.id===S.id);if(!me){setTimeout(logout);return ""}
 const cards=LESSONS.map(l=>{const p=me.p[l.id];return `<div class="card"><div class="top" style="margin:0"><div><h2>${esc(l.title)}</h2><span class="tag">${esc(l.subject)}</span> ${p?`<span class="tag ok">Best score ${p.s}/${p.t}</span>`:""}</div><button onclick="openL('${l.id}')">${p?"Try again":"Start lesson"}</button></div></div>`}).join("");
 return topBar("Hello, "+me.n,"Class "+me.c)+`<div class="card"><b>Your progress: ${pct(me)}%</b><div class="bar" style="margin-top:.5rem"><i style="width:${pct(me)}%"></i></div></div>`+cards;
}
function lessonView(){
 const L=LESSONS.find(l=>l.id===lesson);
 if(result!==null)return `<div class="card" style="text-align:center"><h2>${esc(L.title)}</h2><div class="big">${result}/${L.q.length}</div><p>${result===L.q.length?"Perfect! Well done.":"Good try. Read the lesson again and try once more."}</p><button onclick="closeL()">Back to lessons</button></div>`;
 return `<button class="ghost" onclick="closeL()">Back</button><div class="card" style="margin-top:1rem"><h2>${esc(L.title)}</h2><p>${esc(L.text)}</p></div>
 <form class="card" onsubmit="submitQ(event)"><h2>Quiz</h2>`+L.q.map((q,i)=>`<div class="q"><label>${i+1}. ${esc(q.q)}</label>`+q.o.map((o,j)=>`<label class="opt"><input type="radio" name="q${i}" value="${j}" required> ${esc(o)}</label>`).join("")+`</div>`).join("")+`<button type="submit">Check answers</button></form>`;
}

/* ---------- Actions ---------- */
function render(){
 const a=$("#app");
 if(!S)a.innerHTML=loginRole?loginView():home();
 else if(S.role==="admin")a.innerHTML=adminView();
 else if(S.role==="guru")a.innerHTML=guruView();
 else a.innerHTML=lesson?lessonView():muridView();
 msg="";
}
const pick=r=>{loginRole=r;msg="";render()};
const back=()=>{loginRole=null;render()};
const logout=()=>{loginRole=null;lesson=null;result=null;setS(null)};
function login(e){
 e.preventDefault();const f=e.target,p=f.p.value,u=f.u?f.u.value.trim().toLowerCase():"";
 if(loginRole==="admin"){if(p===ADMIN_PASS)return setS({role:"admin"})}
 else{const x=(loginRole==="guru"?db.teachers:db.students).find(t=>t.u===u&&t.p0===p);if(x)return setS({role:loginRole,id:x.id})}
 msg="Wrong username or password. Check and try again.";render();
}
function addT(e){
 e.preventDefault();const f=e.target,u=f.u.value.trim().toLowerCase();
 if(db.teachers.some(t=>t.u===u)){msg="That username is already used by another Guru. Choose a different one.";return render()}
 db.teachers.push({id:uid(),n:f.n.value.trim(),u,p0:f.p.value});save();render();
}
function delT(id){
 if(!confirm("Remove this Guru and all of their Murid?"))return;
 db.teachers=db.teachers.filter(t=>t.id!==id);db.students=db.students.filter(s=>s.t!==id);save();render();
}
function addS(e){
 e.preventDefault();const f=e.target,u=f.u.value.trim().toLowerCase();
 if(db.students.some(s=>s.u===u)){msg="That username is already used by another Murid. Choose a different one.";return render()}
 db.students.push({id:uid(),t:S.id,n:f.n.value.trim(),u,p0:f.p.value,c:f.c.value.trim(),p:{}});save();render();
}
function delS(id){
 const s=db.students.find(x=>x.id===id);if(!s||s.t!==S.id)return;
 if(!confirm("Remove this Murid?"))return;
 db.students=db.students.filter(x=>x.id!==id);save();render();
}
const openL=id=>{lesson=id;result=null;render();window.scrollTo(0,0)};
const closeL=()=>{lesson=null;result=null;render()};
function submitQ(e){
 e.preventDefault();const L=LESSONS.find(l=>l.id===lesson);let sc=0;
 L.q.forEach((q,i)=>{const c=e.target.querySelector(`input[name=q${i}]:checked`);if(c&&+c.value===q.a)sc++});
 const me=db.students.find(s=>s.id===S.id),old=me.p[L.id];
 if(!old||sc>old.s)me.p[L.id]={s:sc,t:L.q.length};
 save();result=sc;render();window.scrollTo(0,0);
}
render();
Cari bahagian paling bawah:

seedDemo();
render();

Gantikan dengan:

/* ================================
   AKTIVITI POKÉMON LATAR
================================ */

const BG_POKEMON_ACTIVITY = {
  "bg-pikachu": {
    message: "Pikachu menggunakan Thunder Shock! ⚡",
    className: "activity-bounce",
    sound: 880
  },

  "bg-jigglypuff": {
    message: "Jigglypuff menyanyi untuk anda! 🎵",
    className: "activity-spin",
    sound: 660
  },

  "bg-eevee": {
    message: "Eevee sedang bergembira! ✨",
    className: "activity-wiggle",
    sound: 520
  }
};

function showPokemonBubble(element, message) {
  const oldBubble = document.querySelector(".pokemon-bubble");

  if (oldBubble) {
    oldBubble.remove();
  }

  const bubble = document.createElement("div");
  bubble.className = "pokemon-bubble";
  bubble.textContent = message;
  document.body.appendChild(bubble);

  const rect = element.getBoundingClientRect();
  const bubbleWidth = 220;

  let left = rect.left + rect.width / 2 - bubbleWidth / 2;
  let top = rect.top - 60;

  left = Math.max(8, Math.min(left, window.innerWidth - bubbleWidth - 8));
  top = Math.max(8, top);

  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;

  setTimeout(() => {
    bubble.remove();
  }, 2300);
}

function createPokemonSparks(element) {
  const rect = element.getBoundingClientRect();
  const symbols = ["✦", "✧", "⚡", "★", "✨"];

  for (let i = 0; i < 5; i++) {
    const spark = document.createElement("span");

    spark.className = "pokemon-spark";
    spark.textContent = symbols[i % symbols.length];
    spark.style.left = `${rect.left + rect.width / 2}px`;
    spark.style.top = `${rect.top + rect.height / 2}px`;
    spark.style.setProperty("--spark-x", `${(Math.random() - .5) * 130}px`);
    spark.style.setProperty("--spark-y", `${-30 - Math.random() * 90}px`);

    document.body.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 900);
  }
}

function activateBackgroundPokemon(element) {
  const activity = BG_POKEMON_ACTIVITY[element.id];

  if (!activity) {
    return;
  }

  element.classList.remove(
    "activity-bounce",
    "activity-spin",
    "activity-wiggle"
  );

  /*
   * Paksa browser memulakan animasi semula setiap kali Pokémon diklik.
   */
  void element.offsetWidth;

  element.classList.add(activity.className);

  showPokemonBubble(element, activity.message);
  createPokemonSparks(element);

  /*
   * Fungsi bip() telah tersedia dalam kod asal anda.
   */
  if (typeof bip === "function") {
    bip(activity.sound, .14);
  }

  setTimeout(() => {
    element.classList.remove(activity.className);
  }, 950);
}

function setupBackgroundPokemon() {
  document.querySelectorAll(".bg-pokemon").forEach(element => {
    element.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      activateBackgroundPokemon(element);
    });

    element.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        activateBackgroundPokemon(element);
      }
    });
  });
}

seedDemo();
setupBackgroundPokemon();
render();
