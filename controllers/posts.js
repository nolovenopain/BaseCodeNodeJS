const express = require('express');
const route = express.Router();
const Post = require('../models/Post');

// GET BACK ALL THE POSTS
route.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.json({ message: error });
    }
})

// SUBMIT A POST
route.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const savePost = post.save();
        res.json(savePost);
    } catch (error) {
        res.json({ message: error });
    }     
})

// SPECIFIC POST
route.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch (error) {
        res.json({ message: error });
    }
})

// DELETE POST
route.delete('/:postId', async (req, res) => {
    try {
        const removePost = await Post.deleteOne({ _id: req.params.postId });
        res.json(removePost);
    } catch (error) {
        res.json({ message: error });
    }
})

// UPDATE POST
route.patch('/:postId', async (req, res) => {
    try {
        const updatePost = await Post.updateOne(
            { _id: req.params.postId }, 
            { $set: { title: req.body.title, description: req.body.description } }
        );
        res.json(updatePost);
    } catch (error) {
        res.json({ message: error });
    }
})

module.exports = route;