/*!
 * Sketches
 * Copyright(c) 2016-2019 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , join = require('path').join
    , basename = require('path').basename
    , realpath = require('fs').realpathSync
    , exec = require('child_process').execSync
    , foreach = require('boor').foreach
    , preferencesApi = require('../api/preferences-api')
    , indexApi = require('../api/index-api')
    , util = require('../util')

module.exports = {

    /**
     * Install sketches dependencies.
     *
     * @param args
     */
    run: function (cliz, task, args, cb) {
        let projectPath = task.options.cwd,
            projectName = cliz.command(args)

        if (projectName && !projectName.match(/^[a-z][a-z0-9_-]*$/i)) {
            return cliz.fatal("Invalid project name.", cb)
        }

        if (!projectName) {
            projectName = basename(realpath(task.options.cwd))
        } else {
            projectPath = join(task.options.cwd, projectName)
            fu.mkdir(projectPath)
        }

        console.log(`Initializing '${projectName}' project...`)

        //util.info('Generate directories')
        //fu.mkdir(join(projectPath, 'build'))
        //fu.mkdir(join(projectPath, 'filters'))
        //fu.mkdir(join(projectPath, 'includes'))
        //fu.mkdir(join(projectPath, 'libraries'))
        fu.mkdir(join(projectPath, 'sketches', projectName))

        //util.info('Generate project files')
        util.createFile(join(projectPath, 'Sketches.yml'), 'Sketches.tpl.yml', projectName)
        util.createFile(join(projectPath, 'sketches', projectName, projectName + '.ino'), 'sketch.tpl.ino', projectName)
        util.createFile(join(projectPath, 'sketches', projectName, projectName + '.h'), 'sketch.tpl.h', projectName)
        //util.createFile(join(projectPath, 'filters', projectName + '.js'), 'filter.tpl.js', projectName)
        util.createFile(join(projectPath, '.gitignore'), '.gitignore.tpl', projectName, true)

        console.log('Done.')
    }
};
