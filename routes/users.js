var express = require('express');
var router = express.Router();
var Post=require('../models/Post')
/* GET users listing. */
router.get('/post', function(req, res, next) {
  if(req.isAuthenticated())
  {
  res.render('postForm',{user:req.user});
  }
  else
  {
    res.redirect('/login');
  }
});
router.post('/post',async function(req, res, next) {
  if(req.isAuthenticated())
  {
    const post=await Post.create({
    title: req.body.title, 
    content: req.body.content,
    user:req.user.id
    }) 
    res.redirect('/')
  }
  else
  {
    res.redirect('/login');
  }
});

module.exports = router;
