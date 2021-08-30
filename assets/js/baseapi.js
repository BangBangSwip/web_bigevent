// 每次调用$.get/$.post/$.ajax的时候会先调用ajaxPrefilter，
// 在这个函数中我们可以拿到给ajax的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax之前统一拼接请求的根路径
    options.url = "http://api-breakingnews-web.itheima.net" + options.url;

    if (options.url.indexOf("/my/") != -1) {
        // 统一为有权限的接口设置headers
        options.headers = {
            Authorization: localStorage.getItem("token") || "",
        };
    }

    // 全局统一挂载complete回调函数
    options.complete = function(res) {
        if (
            res.responseJSON.status === 1 &&
            res.responseJSON.message === "身份认证失败！"
        ) {
            // 强制清空token
            localStorage.removeItem("token");
            // 强制跳转登录页
            location.href = "/login.html";
        }
    };
});