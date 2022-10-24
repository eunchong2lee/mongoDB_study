const express = require("express");
const app = express();
const { userRouter } = require('../routes/userRoute')
const { blogRouter } = require('../routes/blogRoute')
const { commentRouter } = require('../routes/commetRouter')
const mongoose = require('mongoose')
const { generateFakeData } = require("../faker2")


const MONGO_URI = ''

const server = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        // mongoose.set('debug', true)
        // generateFakeData(100, 10, 300);
        app.use(express.json());

        app.use('/user', userRouter)
        app.use('/blog', blogRouter)
        app.use('/blog/:blogId/comment', commentRouter)

        app.listen(3000, async () => {
            console.log("서버가 실행되었습니다.")
            // console.time("insert time : ")
            // await generateFakeData(10, 2, 10);
            // console.timeEnd("insert time : ")
        })
    } catch (err) {
        console.log(err)
    }

}

server();
