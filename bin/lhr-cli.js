#!/usr/bin/env node
// console.log('lhr-cli')

/* 
    1） 配置可执行文件  commander
    2）实现脚手架，需要先做一个命令行交互的功能  inquirer
    3） 将模版下载下来  download-git-repo
    4） 根据用户的选择动态生成内容  metalsmith
*/

const program = require('commander')
const chalk = require('chalk')

const cleanArgs = cmd => {
    const args = {}

    cmd.options.forEach(o => {
        const key = o.long.slice(2)
        if(cmd[key]) {
            args[key] = cmd[key]
        }
    })
    return args
}

program
    .command(`create <app-name>`)
    .description(`create a new project`) // -h 后的终端描述
    .option('-f, --force', 'overwrite target directory if it exists')
    .action((name, cmd) => {
        // console.log(name, cleanArgs(cmd)) // 需要提取是否添加了-f， 防止重名发生
        // 调用create 模块。
        require('../lib/create')(name, cleanArgs(cmd))
    })
    
program
    .command('config [value]')
    .description(`inspect and modify the config`)
    .option('-g, --get <path>','get value from option' )
    .option('-s, --set <path> <value>')
    .option('-d, --delete <path>', `delete option from config`)
    // value代表 第一个参数[value],  而<value> 代表第二个参数
    .action((value, cmd) => {
        console.log(value, cleanArgs(cmd)) // 获取这个操作的描述符
        //
    })

program
    .command('ui')
    .description('start and open lhr-cli ui')
    .option('-p, --port <port>', 'port used for the ui server')
    .action(cmd => {
        console.log(cleanArgs(cmd))
    })

// 使用方式 cli(package.json中的name属性)  cli --version  cli -h/--help
program
    .version(`lhr-cli@${require('../package.json').version}`)
    .usage(`<command> [option]`)


program.on('--help', () => {
    console.log()
    console.log(`Run ${chalk.cyan(`lhr-cli <command> --help`)} show details`)
    console.log()
})
// 解析用户执行命令传入的参数
program.parse(process.argv)