const { Router } = require("express")
const commentRouter = Router({ mergeParams: true })
const { Blog, Comment, User } = require("../models")
const { isValidObjectId, startSession } = require("mongoose")

commentRouter.post('/', async (req, res) => {
    // const session = await startSession();
    let comment;
    try {
        // await session.withTransaction(async () => {
        const { blogId } = req.params
        const { content, userId } = req.body;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "blogId is invalid" })
        if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" })
        if (typeof content !== 'string') return res.status(400).send({ err: "content is required" })

        const [blog, user] = await Promise.all([
            Blog.findOne({ _id: blogId }, {}, { session }),
            User.findOne({ _id: userId }, {}, { session })
        ])
        if (!blog.islive) return res.status(400).send({ err: "blog is not islive" })
        if (!blog || !user) return res.status(400).send({ err: "blog or user does not exist" })

        comment = new Comment({ content, user, userFullName: `${user.name.first} ${user.name.last}`, blog: blogId });
        // await Promise.all([
        //     comment.save(),
        //     Blog.updateOne({ _id: blogId }, { $push: { comments: comment } })
        // ])


        // await session.abortTransaction()

        // blog.commentsCount++;
        // blog.comments.push(comment);
        // if (blog.commentsCount > 3) blog.comments.shift();

        // await Promise.all([
        //     comment.save({ session }),
        //     blog.save(),
        //     //  Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } })
        // ])

        await Promise.all([
            comment.save(),
            Blog.updateOne({ _id: blogId }, { $inc: { commentCount: 1 }, $push: { comments: { $each: [comment], $slice: -3 } } })
            // https://jira.mongodb.org/browse/SERVER-1243
        ])


        // })
        return res.send({ comment })


    } catch (err) {
        console.log(err)
        return res.status(500).send({ err: err.message })
    }
    // finally {
    //     await session.endSession();
    // }
});

commentRouter.get('/', async (req, res) => {
    try {
        let { page = 0 } = req.query;
        page = parseInt(page)
        console.log(page)
        const { blogId } = req.params;
        console.log(blogId)
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "blogId is invalid" })

        const comments = await Comment.find({ blog: blogId }).sort({ createdAt: -1 }).skip(page * 3).limit(3);
        return res.send({ comments });

    } catch (err) {
        console.log(err)
        return res.status(400).send({ err: err.message })
    }
})

commentRouter.patch("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    console.log(commentId)
    const { content } = req.body;
    if (typeof content !== "string") return res.status(400).send({ err: "content is required" })

    const [comment] = await Promise.all([
        Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
        Blog.updateOne({ 'comments._id': commentId }, { "comments.$.content": content })
    ])

    return res.send({ comment })
})

commentRouter.delete("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findOneAndDelete({ _id: commentId })
    await Blog.updateOne({ "comments._id": commentId }, { $pull: { comments: { _id: commentId } } })

    // $elemMatch 둘다 해당 되는거 삭제 하고 싶을 때 사용

    return res.send({ comment })
})

module.exports = { commentRouter }

