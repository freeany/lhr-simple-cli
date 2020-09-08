const { fetchRepoList, fetchTagList } = require('./request')
const Inquire = require('inquirer')
const downloadGitRepo = require('download-git-repo') // 不支持promise 
const { wrapLoading } = require('./utils')
const util = require('util')

class Creator {
    constructor(projectName, targetDir) {
        this.name = projectName
        this.target = targetDir

        this.downloadGitRepo = util.promisify(downloadGitRepo) // 将非promise方法转换为promise方法
    }
    async fetchRepo () {
        let repos = await wrapLoading(fetchRepoList, 'wating fetch template')
        if (!repos) return
        // repos = repos.map(item =>item.name) // 所有的名字
        repos = repos.filter(item => item.name.indexOf('template') > -1) // 对名称进行过滤
        let { repo } = await Inquire.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'please choice a template to create project'
        })
        // console.log(repo) // 获取到了 模版仓库。
        return repo

    }
    async fetchTag (repo) {
        let tags = await wrapLoading(fetchTagList, 'wating fetch tag', repo)
        if (!tags) return
        tags = tags.map(item => item.name)
        let { tag } = await Inquire.prompt({
            name: 'tag',
            type: 'list',
            choices: tags,
            message: 'please choice a tag to create project'
        })
        return tag
    }
    async download (repo, tag) {
        // 需要拼接下载路径
        let requestUrl = `freeany/${repo}${tag ? '#' + tag : ''}`
        // 把资源下载到某个路径上。（后续可以增加缓存功能, 应该下载到系统目录中，稍等可以在使用ejs、handlerbar去渲染模版，最后生成结果写入）

        // 放到系统文件中，--》 模版 和用户的其他选择 --》 生成结果 放到目录下。比如用户下载的package.json或readme.md文件可以用ejs模版根据用户的输入进行替换
        await wrapLoading(this.downloadGitRepo, `wating download template of ${repo}${tag ? '#' + tag : ''}`, requestUrl, this.target)
        return this.target
    }
    async create () { // 开始真正创建这个项目
        // 采用远程拉取的方式， github
        // 先去拉取模版
        let repo = await this.fetchRepo()
        // 再通过模版找到版本号
        let tag = await this.fetchTag(repo)
        // console.log(repo, tag) // 拿到项目名和版本号

        // 下载
        await this.download(repo, tag)
        // 2) 我们要实现 脚手架先做一个命令行交互的功能 inquire
        // 3）将模版下载下来，download-git-repo
        // 4）根据用户的选择动态的生成内容，metalsmith
    }
}

module.exports = Creator
