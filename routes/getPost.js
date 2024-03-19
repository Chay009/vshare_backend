const express = require('express');
const router = express.Router();
const Post = require("../model/Posts");




router.get('/get-posts', async (req, res) => {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;
  console.log("hell")
      // Fetch products from the database based on offset and limit
      const foundPosts= await Post.find().sort({createdAt:-1}).skip(offset).limit(limit);
      console.log(foundPosts);
         // Get the total count of posts
    const totalPostCount = await Post.countDocuments();
  
      res.json({foundPosts,totalPostCount, nextPage: offset + limit < totalPostCount ? offset + limit : null});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;