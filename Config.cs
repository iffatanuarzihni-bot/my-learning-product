/* ---------- Settings you can change ---------- */
const ADMIN_PASS = "admin123";   // change this before sharing!

/* Lessons for Murid. Add your own: {id, title, subject, text, q:[{q, o:[options], a:indexOfCorrect}]} */
const LESSONS = [
 {id:"m1",title:"Tambah (Addition)",subject:"Maths",
  text:"Addition means putting numbers together. If you have 5 apples and get 3 more, you count 5 + 3 = 8 apples.",
  q:[{q:"4 + 6 = ?",o:["8","10","12"],a:1},{q:"7 + 5 = ?",o:["11","12","13"],a:1},{q:"9 + 9 = ?",o:["17","18","19"],a:1}]},
 {id:"s1",title:"Tumbuhan (Plants)",subject:"Science",
  text:"Plants need sunlight, water and air to make their own food. Roots take in water from the soil. Leaves use sunlight to make food.",
  q:[{q:"Which part takes in water?",o:["Roots","Leaves","Flower"],a:0},{q:"Which part makes food using sunlight?",o:["Roots","Leaves","Stem"],a:1},{q:"What do plants need to make food?",o:["Sunlight","Sugar","Plastic"],a:0}]},
 {id:"e1",title:"Nouns",subject:"English",
  text:"A noun is the name of a person, a place or a thing. Teacher is a person. Kuala Lumpur is a place. Book is a thing.",
  q:[{q:"Which word is a noun?",o:["Run","Teacher","Quickly"],a:1},{q:"Kuala Lumpur is a...",o:["person","place","thing"],a:1},{q:"Which word is a thing?",o:["Book","Sing","Happy"],a:0}]}
];
