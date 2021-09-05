$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }

    // 定义一个查询的参数对象
    var q = {
        pagenum: 1, // 页码值，默认为1
        pagesize: 2, // 每页显示几条数据，默认为2
        cate_id: "", //文章分类的 Id
        state: "", //文章的状态
    };
    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }
                // 使用模板引擎渲染数据
                var htmlStr = template("tpltable", res);
                $("tbody").html(htmlStr);
                // 调用渲染分页的方法
                // res.total-总的数据条数
                renderPage(res.total);
            },
        });
    }
    initCate();
    // 初始化文章分类的函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }

                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 通过layui重新渲染表单区域的ui及ui结构
                form.render();
            },
        });
    }

    // 实现筛选功能
    $("#form_search").on("submit", function(e) {
        e.preventDefault();
        // 拿到表单中的值
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染表单数据
        initTable();
    });
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render方法渲染页面结构
        laypage.render({
            elem: "pageBox", // 分页容器的id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页几条数据
            curr: q.pagenum, // 默认选中哪一页
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候触发jump回调
            // 触发jump回调的方式有两种
            // 1.通过点击页码值来触发回调
            // 2.只要调用laypage.render就会触发jump回调
            jump: function(obj, first) {
                // 可以通过first的值来判断是通过哪种方式触发的jump回调,
                // 如果first的值为true证明方式2触发的
                // obj.curr 最新的页码值
                console.log(obj.curr);
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到q这个查询参数对象的pagesize中
                q.pagesize = obj.limit;
                // 根据最新的q.pagenum来发起请求，重新渲染页面
                // initTable();
                // 解决死循环的问题
                if (!first) {
                    initTable();
                }
            },
        });
    }
    // 通过代理的形式为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function() {
        //获取删除按钮的个数
        var len = $(".btn-delete").length;

        // 获取的文章的id
        var id = $(this).attr("data-id");
        // 弹出的提示框
        layer.confirm("确认删除?", { icon: 3, title: "提示" }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                // :id-动态获取的id 通过自定义属性获得
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败");
                    }
                    layer.msg("删除文章成功");
                    // 当数据删除完成后，需要判断当前这一页中是否还有剩余的数据
                    // 如果没有剩余数据了，则让页码值-1后再重新调用initTable()方法
                    if (len === 1) {
                        //如果len为1，就证明删除完后页面就没有数据了
                        // 页码值不能小于1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                },
            });
            layer.close(index);
        });
    });
});