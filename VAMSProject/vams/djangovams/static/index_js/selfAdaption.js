// 获取 窗口 长宽
var window_width = window.screen.width;
var window_height = window.screen.height;

const ratio = window_width * window_height /(1920*1080);

// 获取 fontsize 比率为 当前分辨率/(1920*1080)
document.body.style.fontSize = ratio * 100 + '%';