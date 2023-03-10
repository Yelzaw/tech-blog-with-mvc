const router = require('express').Router();
const { Op } = require("sequelize");
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');


//Route to show all posts in Homepage
router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Route to show individual post with comments
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const post = postData.get({ plain: true });
    const commentData = await Comment.findAll(
      {
        where:{
          post_id: req.params.id,                
        },   
      }
    )

    const dbComment = [];
    for(let i=0; i< commentData.length; i++){
      dbComment.push(commentData[i].dataValues)
    }

    // console.log(dbComment)
    // console.log(dbComment[0].user_id)

    const userData = await User.findAll(
      {
      attributes: {exclude:["password", "email"]}
     }
    );        
    const dbUser = [];
    for(let i=0; i< userData.length; i++){
      dbUser.push(userData[i].dataValues)
    }
    // console.log(dbUser)

    for(let i=0; i< dbComment.length; i++){
      for(let j=0; j<dbUser.length; j++){
        if(dbComment[i].user_id===dbUser[j].id){
          dbComment[i].user_name = dbUser[j].name;
        }
      }
    }
    // console.log(dbComment)

    post['comments'] = dbComment;
    // console.log(post)

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
// Route to User's own dashboard
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });
// console.log(user)
    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to Newpost Page for user to create the post
router.get('/newpost', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });
    res.render('newpost', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to Editpost Page for user to update or delete the post
router.get('/editpost/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id','name'],
        },
      ],
    });

    const toEditPost = postData.get({ plain: true });
    // console.log(toEditPost)
    // console.log(toEditPost.user.id)
    // console.log(req.session.user_id)
    if(toEditPost.user.id===req.session.user_id){
    res.render('editpost', {
      ...toEditPost,
      logged_in: req.session.logged_in
    });
  }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
 res.render('signup', {})
})

module.exports = router;
