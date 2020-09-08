const axios = require('axios')

axios.interceptors.response.use(res => {
    return res.data
})

async function fetchRepoList() {
    // 可以通过配置文件， 拉取不同的仓库对应的用户下的文件
    const result =  await axios.get('https://api.github.com/users/freeany/repos')
    return result
}

async function fetchTagList(repo) {
    return axios.get(`https://api.github.com/repos/freeany/${repo}/tags`)
}

module.exports = {
    fetchRepoList,
    fetchTagList
}