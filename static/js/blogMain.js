var log = console.log.bind(console)

var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if(r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

var blogTemplate = function(blog) {
    var id = blog.id
    var title = blog.title
    var author = blog.author
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString()
    var t = `
    <div class="gua-blog-cell">
        <div class="">
            <a class="blog-title" href="/blog/${id}" data-id="${id}">
                ${title}
            </a>
        </div>
        <div class="">
            <span>${author}</span> @ <time>${time}</time>
        </div>
        <div class="blog-comments">
            <div class='new-comment'>
                <input class='comment-blog-id' type=hidden value="${id}">
                <input class='comment-author' value="">
                <input class='comment-content' value="">
                <button class='comment-add'>添加评论</button>
            </div>
        </div>
    </div>
    `
    return t
}

var insertBlogAll = function(blogs) {
    var html = ''
    for (var i = 0; i < blogs.length; i++) {
        var b = blogs[i]
        var t = blogTemplate(b)
        html += t
    }
    var div = document.querySelector('.gua-blogs')
    div.innerHTML = html
}

var blogAll = function() {
    var request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var blogs = JSON.parse(response)
            window.blogs = blogs
            insertBlogAll(blogs)
        }
    }
    ajax(request)
}

var blogNew = function(form) {
    // var form = {
    //     title: "测试标题",
    //     author: "gua",
    //     content: "测试内容",
    // }
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/blog/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var res = JSON.parse(response)
        }
    }
    ajax(request)
}

var commentNew = function(form, callback) {
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/comment/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            var c = JSON.parse(response)
            callback(c)
        }
    }
    ajax(request)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var actionCommentAdd = event => {
    var self = event.target
    var form = self.closest('.new-comment')
    var blogId = form.querySelector('.comment-blog-id').value
    var author = form.querySelector('.comment-author').value
    var content = form.querySelector('.comment-content').value
    var f = {
        blog_id: blogId,
        author: author,
        content: content,
    }
    commentNew(f, function(comment) {
        log('新评论', comment)
    })
}

var bindEvents = function() {
    // 绑定发表新博客事件
    var button = e('#id-button-submit')
    button.addEventListener('click', function(event){
        console.log('click new')
        // 得到用户填写的数据
        var form = {
            title: e('#id-input-title').value,
            author: e('#id-input-author').value,
            content: e('#id-input-content').value,
        }
        // 用这个数据调用 blogNew 来创建一篇新博客
        blogNew(form)
    })

    // 绑定发表评论功能
    document.body.addEventListener('click', function (event) {
        var self = event.target
        if(self.classList.contains('comment-add')){
            actionCommentAdd(event)
        }
    })
}

var __main = function() {
    // 载入博客列表
    blogAll()
    // 绑定事件
    bindEvents()
}

__main()
