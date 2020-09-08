const path = require('path')
const fs = require('fs-extra')
const Inquirer = require('inquirer')
const Creator = require('./Creator')
module.exports = async function(projectName, options) {
    // console.log(projectName, options)
    const cwd = process.cwd() // 获取当前命令执行是的工作目录
    const targetDir = path.join(cwd, projectName) // 目标目录

    if(fs.existsSync(targetDir)) {
        if(options.force) {     // 如果强制创建，就删除已有的
            await fs.remove(targetDir)
        }else {
            // 提示用户是否确定要覆盖
            let { action } = await Inquirer.prompt([ // 配置询问的方式
                {
                    name: 'action',  // 选择动作和结果
                    type: 'list',   // 展示的类型
                    message: 'Target directory already exists Pick an action',// 描述消息
                    choices: [
                        {name: 'Overwrite', value: 'overwrite'},
                        {name: 'Cancel', value: false}
                    ]
                }
            ])

            // console.log(action)
            if(!action) {
                return 
            }else if(action === 'overwrite') {
                console.log(`\r\nRemoving...`)
                await fs.remove(targetDir)
            }
        }
    }


    // 创建项目
    const creator = new Creator(projectName, targetDir)
    creator.create()
}