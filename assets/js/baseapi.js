// 每次调用$.get/$.post/$.ajax的时候会先调用ajaxPrefilter，
// 在这个函数中我们可以拿到给ajax的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax之前统一拼接请求的根路径
    options.url = "http://api-breakingnews-web.itheima.net" + options.url;
});