const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const upload  = require('../config/cloudinary');
const Project = require('../models/Project');
const Page = require('../models/Page');


/* ---------- CRUD projects ---------- */
router.get('/projects', auth, async (req,res)=>{
  const projects = await Project.find().sort({createdAt:-1});
  res.render('admin/projects', { projects });
});

router.get('/projects/new', auth, (req,res)=> res.render('admin/newProject'));

router.post('/projects', auth, upload.single('image'), async (req,res)=>{
  const {title, description, tech, link} = req.body;
  await Project.create({ title, description, tech:tech.split(',').map(t=>t.trim()), link, image:req.file.path });
  res.redirect('/api/admin/projects');
});

router.get('/projects/edit/:id', auth, async (req,res)=>{
  const project = await Project.findById(req.params.id);
  res.render('admin/editProject', { project });
});

router.put('/projects/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tech, link } = req.body;

    const updates = {
      title,
      description,
      tech: tech ? tech.split(',').map(t => t.trim()).filter(Boolean) : [],
      link
    };

    if (req.file) {
      updates.image = req.file.path;
    }

    await Project.findByIdAndUpdate(req.params.id, updates);
    res.redirect('/api/admin/projects'); // or better: res.redirect('back')
  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed');
  }
});

router.delete('/projects/:id', auth, async (req,res)=>{
  await Project.findByIdAndDelete(req.params.id);
  res.redirect('/api/admin/projects');
});

router.get('/analytics', auth, async (req,res)=>{
  res.render('admin/analytics');
});



/* ----------- list ----------- */
router.get('/pages', auth, async (req,res)=>{
  const pages = await Page.find().sort({ title: 1 });
  res.render('admin/pages', { pages });
});

/* ----------- create ----------- */
router.get('/pages/new', auth, (req,res)=> res.render('admin/newPage'));
router.post('/pages', auth, async (req,res)=>{
  const {title, slug, description, keywords, sub, body} = req.body;
  const blocks = [];
  for(let i=0;i<sub.length;i++) if(sub[i]&&body[i]) blocks.push({sub:sub[i], body:body[i]});
  await Page.create({ title, slug, blocks, meta:{description,keywords} });
  res.redirect('/api/admin/pages');
});

/* ----------- edit ----------- */
router.get('/pages/edit/:id', auth, async (req,res)=>{
  const page = await Page.findById(req.params.id);
  res.render('admin/editPage', { page });
});
router.put('/pages/:id', auth, async (req,res)=>{
  const {title, slug, description, keywords, sub, body} = req.body;
  const blocks = [];
  for(let i=0;i<sub.length;i++) if(sub[i]&&body[i]) blocks.push({sub:sub[i], body:body[i]});
  await Page.findByIdAndUpdate(req.params.id, { title, slug, blocks, meta:{description,keywords} });
  res.redirect('/api/admin/pages');
});

/* ----------- delete ----------- */
router.delete('/pages/:id', auth, async (req,res)=>{
  await Page.findByIdAndDelete(req.params.id);
  res.redirect('/api/admin/pages');
});


module.exports = router;