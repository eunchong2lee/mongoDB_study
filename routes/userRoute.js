const { Router } = require('express')
const userRouter = Router();
const mongoose = require('mongoose');
const { Blog, User, Comment } = require('../models');


userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        return res.send({ users })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ err: err.message })
    }

})

userRouter.get('/:userId', async (req, res) => {

    try {
        const { userId } = req.params
        // object id가 맞으면 true 아니면 false 출력
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
        const user = await User.findOne({ _id: userId })
        return res.send({ user })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ err: err.message })
    }
});


userRouter.post('/', async (req, res) => {
    try {
        let { username, name } = req.body;
        if (!username) return res.status(400).send({ err: "username is required" })
        if (!name || !name.first || !name.last) return res.status(400).send({ err: "Both first and last names are required" })
        const user = new User(req.body)
        await user.save();
        return res.send({ user })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ err: err.message })
    }
})

userRouter.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        // object id가 맞으면 true 아니면 false 출력
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
        const [user] = await Promise.all([
            User.findOneAndDelete({ _id: userId }),
            Blog.deleteMany({ "user._id": userId }),
            Blog.updateMany({ "comments.user": userId }, { $pull: { comments: { user: userId } } }),
            Comment.deleteMany({ user: userId })

        ])
        return res.send({ user })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ err: err.message })
    }
})

userRouter.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        // object id가 맞으면 true 아니면 false 출력
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
        const { age, name } = req.body
        if (!age && !name) return res.status(400).send({ err: "age or name is required" })
        if (age && typeof age !== 'number') return res.status(400).send({ err: "age is not number" })
        if (name && typeof name.first !== 'string' && typeof name.last !== 'string') return res.status(400).send({ err: "first and last name are must be string" })

        // const user = await User.findOneAndUpdate({ _id: userId }, { age, name }, { new: true })

        let user = await User.findOne({ _id: userId })
        console.log({ userBerfore: user })
        if (age) user.age = age;
        if (name) {
            user.name = name;
            await Promise.all([
                Blog.updateMany({ "user._id": userId }, { "user.name": name }),
                await Blog.updateMany(
                    {},
                    { "comments.$[comment].userFullName": `${name.first} ${name.last}` },
                    { arrayFilters: [{ "comment.user": userId }] }
                )
            ])
        }
        await user.save();

        console.log({ userAfter: user })
        return res.send({ user })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ err: err.message })
    }
})

module.exports = {
    userRouter
}