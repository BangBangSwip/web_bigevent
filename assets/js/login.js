$(function() {
    // 点击 注册账号 的链接
    $("#link_reg").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    $("#links").on("click", function() {
        $(".reg-box").hide();
        $(".login-box").show();
    });
    // 自定义表单验证规则
    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify来自定义规则
    form.verify({
        // 自定义了一个叫pwd的规则
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 校验密码是否一致
        repwd: function(value) {
            // 拿到的是确认密码框的内容 需要进行一次比较
            var pwd = $(".reg-box [name=password]").val();
            if (pwd != value) {
                return "两次密码不一致";
            }
        },
    });

    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val(),
        };
        $.post("/api/reguser", data, function(res) {
            if (res.status != 0) return layer.msg("只想弱弱提示没成功");
            layer.msg("注册成功，请登录");
            // 模拟点击行为
            $("#links").click();
        });
    });
    // 监听登录表单的提交事件
    $("#form_login").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "post",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg("登录失败！");
                }
                layer.msg("登录成功!");
                // 将登录成功的token字符串，保存到localStorage中
                localStorage.setItem("token", res.token);
                location.href = "/index.html";
            },
        });
    });
});