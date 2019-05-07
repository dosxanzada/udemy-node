const express = require('express');
const router = new express.Router();
const User = require('../models/User');

// new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email, 
            req.body.password
        );
        res.send(user);
    } catch (e){
        console.log(e.message);
        // res.status(400).send(err);
    }
});

// get users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(500).send();
    }
});

// get user 
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    } catch (err) {
        res.status(500).send();
    }
});

// update user
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if(!isValidOperation){
        return res.status(400).send({error: 'Ошибка обновления'});
    }

    try {
        const user = await User.findById(req.params.id);

        updates.forEach((update) => {
            user[update] = req.body[update]
        });
        
        await user.save();

        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user){
            return res.status(404).send();
        }

        res.send(user);
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router