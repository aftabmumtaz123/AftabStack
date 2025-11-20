require('dotenv').config({path:require('path').resolve(__dirname,'../.env')});
const mongoose = require('mongoose');
const Page = require('../models/Page');

mongoose.connect(process.env.MONGO_URI);

const seed = async ()=>{
  await Page.deleteMany();
  await Page.create([
    {slug:'home',title:'Home',blocks:[
      {sub:'Welcome',body:'<p class="text-xl">I build fast, beautiful web experiences.</p>'}
    ],meta:{description:'AftabStack portfolio',keywords:'developer,nodejs,react'}},
    {slug:'about',title:'About',blocks:[
      {sub:'My Story',body:'<p>I started coding in 2018 and fell in love with JavaScript.</p>'}
    ],meta:{description:'About Aftab',keywords:'about,developer'}},
    {slug:'services',title:'Services',blocks:[
      {sub:'Web Development',body:'<ul><li>MERN stack</li><li>Responsive UI</li></ul>'},
      {sub:'Consulting',body:'<p>Architecture reviews, performance audits, team training.</p>'}
    ],meta:{description:'Services by Aftab',keywords:'services,nodejs,react'}}
  ]);
  console.log('Default pages seeded'); process.exit();
};
seed();