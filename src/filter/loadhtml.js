/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , glob = require('glob')
    , minify = require('html-minifier').minify
    , dirname = require('path').dirname
    , foreach = require('boor').foreach
    , filter = require('arduinodk-filter')

module.exports = {

    /**
     *
     */
    selector: filter.selector('loadhtml'),

    /**
     *
     * @param sketch
     */
    onBeforeVerify: function (sketch) {
        return this.processBefore(sketch)
    },

    /**
     *
     * @param sketch
     * @returns {*}
     */
    onAfterVerify: function (sketch) {
        return this.processAfter(sketch)
    },

    /**
     *
     * @param sketch
     */
    processBefore: function (sketch) {
        var files = glob.sync('**/*.{ino,h}', { cwd: sketch.path, absolute: true })

        foreach(files, (file) => {
            var code = fu.readFile(file)
            if (code.match(this.selector)) {
                fu.writeFile(file + '.loadhtml', code)
                fu.writeFile(file, this.processSelectors(dirname(file), code))
            }
        })
    },

    /**
     *
     * @param sketch
     */
    processAfter: function (sketch) {
        var files = glob.sync('**/*.loadhtml', { cwd: sketch.path, absolute: true })

        foreach(files, function(file) {
            var code = fu.readFile(file)
            fu.writeFile(file.slice(0, -9), code)
            fu.unlink(file)
        });
    },

    /**
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processSelectors: function (path, code) {
        return code.replace(this.selector, function (token, file) {
            file = path + '/' + file;
            if (fu.fileExists(file)) {
                return '"' + minify(fu.readFile(file), {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: false,
                    collapseInlineTagWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeTagWhitespace: true,
                    processScripts: ['text/ng-template'],
                    minifyCSS: true,
                    minifyJS: { mangle: false }
                }).replace(/"/, '\\"') + '"'
            }
        })
    }
}