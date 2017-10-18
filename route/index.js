const comment = require('../model/comment')
const blog = require('../model/blog')


var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    path = 'template/' + path
    fs.readFile(path, options, function(err, data){
        // console.log(`读取的html文件 ${path} 内容是`, data)
        // 替换参数
        response.send(data)
    })
}

var index = {
    path: '/',
    method: 'get',
    func: function(request, response) {
        var path = 'blog_index.html'
        sendHtml(path, response)
    }
}


var blogDetail = {
    path: '/blog/:id',
    method: 'get',
    func: function(request, response) {
        var blog_id = request.params.id
        var path = 'blog_detail.html'
        var fs = require('fs')
        var options = {
            encoding: 'utf-8'
        }
        path = 'template/' + path
        fs.readFile(path, options, function(err, data){
            // console.log(`读取的html文件 ${path} 内容是`, data)
            // 替换参数
            data = data.replace('{{blog_id}}', blog_id)
            response.send(data)
        })
    }
}

var routes = [
    index,
    blogDetail,
]

module.exports.routes = routes
