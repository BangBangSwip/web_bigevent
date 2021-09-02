$(function() {
    // 调用 getUserinfo获取用户的基本信息
    getUserinfo();
    var layer = layui.layer;
    $("#btnLogout").on("click", function() {
        layer.confirm(
            "确定退出登录？", { icon: 3, title: "提示" },
            function(index) {
                // 1.清空本地存储中的token
                localStorage.removeItem("token");
                // 2.跳转到登录页
                location.href = "./login.html";
                // 关闭询问框
                layer.close(index);
            }
        );
    });
});
// 获取用户的基本信息
function getUserinfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // 请求头配置对象
        //  headers: {
        //      Authorization: localStorage.getItem("token") || "",
        //  },
        success: function(res) {
            if (res.status != 0) {
                return layui.layer.msg("获取用户信息失败");
            }

            // 调用渲染用户头像的函数
            renderAvatar(res.data);
        },
        // 无论成功还是失败最后都会调用complete这个函数
        // complete: function(res) {
        //     // console.log("complete回调");
        //     // console.log(res);
        //     // 在complete回调函数中可以使用res.responseJSON拿到服务器响应
        //     // 回来的数据
        //     if (
        //         res.responseJSON.status === 1 &&
        //         res.responseJSON.message === "身份认证失败！"
        //     ) {
        //         // 强制清空token
        //         localStorage.removeItem("token");
        //         // 强制跳转登录页
        //         location.href = "/login.html";
        //     }
        // },
    });
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username;
    // 2.设置欢迎文本
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    // 3.按需渲染用户头像
    if (user.user_pic != null) {
        // 3.1 渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        // 3.2 渲染文本头像
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show();
    }
}