const addSum = (a, b) => {
    return new Promise((reslove, reject) => {
        setTimeout(() => {
            if (typeof a !== 'number' || typeof b !== 'number') {
                reject('a,b must be numbers');
            }
            reslove(a + b)
        }, 1000)
    })
}



const totalSum = async () => {
    try {
        let sum = await addSum(10, 10)
        let sum2 = await addSum(sum, 10)
        console.log({ sum, sum2 })

    } catch (error) {
        console.log(error)
    }

}
totalSum()