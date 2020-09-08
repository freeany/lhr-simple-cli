const  ora = require('ora')

async function sleep(n) {
    return new Promise(resolve => setTimeout(resolve, n))
}

async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message)
    spinner.start()

    // 比如网络失败
    try {
        let repos = await fn(...args) 
        spinner.succeed()
        return repos
    }catch(e) {
        spinner.fail('request failed, refetch')
        await sleep(1000)
        return wrapLoading(fn, message, ...args)
    }
}

module.exports = {
    wrapLoading
}