const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

//Create new post
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

//Update existing post
router.put('/:id', withAuth, async (req, res)=> {

    try {
      const editPost = await Post.update(
        {
          title: req.body.title,
          post: req.body.post,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json(editPost);
    } catch (err) {
      res.status(500).json(err);
    }
  })


  // Delete existing post
router.delete('/:id', withAuth, async (req, res) => {
  console.log('data is here')
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
