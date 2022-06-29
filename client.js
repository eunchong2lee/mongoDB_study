// 제일 비효율적 상황
console.log("client cod running123")

const axios = require('axios')
const URI = "http://localhost:3000"
// 비효율 적인 방법 : 6초 초반
//             - blogLimit 20일 때 : 6초 초반
//             - blogLimit 50일 때 : 16초 초반

// populate 사용하는 방법 : 
//             - blogLimit 20일 때 : 0.8초
//             - blogLimit 50일 때 : 0.7~0.8초
//             - blogLimit 200일 떄 : 2초

// Nesting 사용하는 방법 : 
//             - blogLimit 20일 때 : 0.1초
//             - blogLimit 50일 때 : 0.2~3초
//             - blogLimit 200일 떄 : 0.3초

const test = async () => {
    console.time("loading time: ")
    let { data: { blogs }, } = await axios.get(`${URI}/blog`)
    // console.dir(blogs[3], { depth: 10 })
    // blogs = await Promise.all(blogs.map(async blog => {
    //     const [res1, res2] = await Promise.all([axios.get(`${URI}/user/${blog.user}`), axios.get(`${URI}/blog/${blog._id}/comment`)])

    //     blog.user = res1.data.user;
    //     blog.comments = await Promise.all(res2.data.comments.map(async comment => {
    //         const { data: { user } } = await axios.get(`${URI}/user/${comment.user}`)
    //         comment.user = user;
    //         return comment;
    //     }))
    //     return blog
    // }))
    // // console.dir(blogs[0], { depth: 10 })
    // // 검색

    console.timeEnd("loading time: ")
}

const testGroup = async () => {
    await test()
    await test()
    await test()
    await test()
    await test()
    await test()
}
testGroup();