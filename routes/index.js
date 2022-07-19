var express = require('express');
var router = express.Router();
var Post=require('../models/Post');
const User = require('../models/User');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const posts=await Post.find({}).populate('user')
  res.render('index',{user:req.user,posts:posts,isAuthenticated:req.isAuthenticated()});
});
router.get('/create', function(req, res, next) {
  res.render('postForm');
});
router.get('/membership', function(req, res, next) {
  res.render('membership');
});
router.post('/membership', async function(req, res, next) {
  if(req.isAuthenticated())
  {
    if(req.body.memberpass!= process.env.MEMBERSHIP_PASSCODE)
    {
      res.render('membership',{error:'Wrong membership Password'});
    }
    else
    {
    const user =await User.findById(req.user.id)
    user.isMember=true
    await user.save()
    res.redirect('/')
    }
  }  
  else
  {
    res.redirect('/login');
  }

});

router.get('/admin', function(req, res, next) {
  res.render('admin');
});
router.post('/admin', async function(req, res, next) {
  if(req.isAuthenticated())
  {
    if(req.body.adminpass!= process.env.ADMIN_PASSCODE)
    {
      res.render('admin',{error:'Wrong Admin Password'});
    }
    else
    {
    const user =await User.findById(req.user.id)
    user.isadmin=true
    await user.save()
    res.redirect('/')
    }
  }  
  else
  {
    res.redirect('/login');
  }

});
router.get('/:id/delete', async  function(req, res, next) {
if(req.isAuthenticated() && req.user.isadmin==true)
{
await Post.findByIdAndDelete(req.params.id)
res.redirect('/') 
}
else
{
  res.redirect('/login') 
 
}
})

module.exports = router;
