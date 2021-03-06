path = require('path')

module.exports =
    root: path.resolve(path.join(__dirname, '../'))
    "libs/wsocket": path.resolve(path.join(__dirname, '../libs/wsocket'))
    "libs/router": path.resolve(path.join(__dirname, '../libs/router'))
    "libs/pages": path.resolve(path.join(__dirname, '../libs/pages'))
    fkp: path.resolve(path.join(__dirname, '../public/js/fkp'))
    css: path.resolve(path.join(__dirname, '../public/css'))
    libs: path.resolve(path.join(__dirname, '../libs/libs_client'))
    ajax: path.resolve(path.join(__dirname, '../libs/ajax')),
    component: path.resolve(path.join(__dirname, '../component'))
