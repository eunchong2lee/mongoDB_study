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

addSum(10, 20)
    .then(sum1 => addSum(sum1, 3))
    .then(sum1 => addSum(sum1, 3))
    .then(sum1 => addSum(sum1, 3))
    .then(sum1 => addSum(sum1, 3))
    .then(sum1 => addSum(sum1, 3))
    .then(sum2 => console.log({ sum2 }))
    .catch(error => console.log({ error }))