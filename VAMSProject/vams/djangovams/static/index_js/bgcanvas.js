
var map;
// 摄像机个数
var camera_count = 0;
// 摄像机名称列表
var cam_name = [[]];
// 摄像机流url列表
var cam_stream = [[]];
// 摄像机位置列表
var cam_img = [[]];
// 三维照相机位置，一维表示工地标号
var cam_loc = [[]];

// 初始化area
var area = -1;

// 定义摄像机组编号
var cam_group;

// 定义摄像机组url
var cam_group_url; 

// 定义摄像机组名字
var cam_group_name = [];

function requestVideo(){
  $.ajax({
  method: "GET",
  url: "http://172.16.138.39/camera/",
  // 当成功的时候 获取数据
  success: function (data) {
    // 获取照相机个数
    camera_count = data.count;
    // 遍历每一个摄像机
    for (var i = 0; i < camera_count; i++) {
      
    // 检测是否是有效的组名，如果无效则不做任何判断
    if (data.results[i].camera_group){

      cam_group_url = (data.results)[i].camera_group;
      // 获取摄像机分组编号
      cam_group =  parseInt(cam_group_url.split('/')[4])-1;

      // 如果组名已经有了,那就不再发送GET请求
      if(!cam_group_name[cam_group]){

        $.ajax({
          method : "GET",
          url:cam_group_url,
          // 同步
          async:false,
          success: function (c_group){
            // 获取摄像机分组编号
            cam_group_name[cam_group] = c_group.remark;
          },
          error: function (error_data) {
            console.log("error")
            console.log(error_data)
          }
        })

      }
      
        // 如果无定义则一直加列表
        while (!cam_name[cam_group]){
          cam_name.push([]);
        }
  
        while (!cam_stream[cam_group]){
          cam_stream.push([]);
        }
  
        while (!cam_img[cam_group]){
          cam_img.push([]);
        }
  
        while (!cam_loc[cam_group]){
          cam_loc.push([]);
        }
        
        // 添加照相机名称
        cam_name[cam_group].push((data.results)[i].title);
        // 添加照相机流url
        cam_stream[cam_group].push((data.results)[i].http);
  
        // 添加照相机imgurl
        cam_img[cam_group].push((data.results)[i].imgurl);
  
        // 添加照相机位置
        var str_loc = (data.results)[i].location;
        //去除字符串头尾的中括号
        str_loc = str_loc.replace('[','').replace(']','')
        
        // 分割逗号左边与右边内容
        var loc_x = parseFloat(str_loc.split(',')[0])
        var loc_y = parseFloat(str_loc.split(',')[1])
        
        var temploc = [];
        temploc[0] = loc_x;
        temploc[1] = loc_y;

        // 将地址添加到列表中
        cam_loc[cam_group].push(temploc);

      }

    }

    console.log(cam_img);

  },
  // 当失败的时候 输出错误
  error: function (error_data) {
    console.log("error")
    console.log(error_data)
  }
})

}

// 提前获取视频信息
requestVideo();

// 一旦页面加载完全就执行以下代码
window.onload = function(){

  // 获取元素id
  var client_width = window.screen.width;
  var client_height = window.screen.height;
  var bgcvs = document.getElementById("bgCvs");
  var lbcvs = document.getElementById("lbCvs");

  // 获取 context
  var ctx_0 = bgcvs.getContext("2d");
  var ctx_1 = lbcvs.getContext("2d");

  // 设置全屏画布
  bgcvs.width = window.screen.width;
  bgcvs.height = window.screen.height;

  lbcvs.width = window.screen.width;
  lbcvs.height = window.screen.height;
  // 新建图片对象
  var bg = new Image();

  // 设置背景图片
  bg.src = "/static/img/map/map.png";

  bg.onload = function(){
    // 设置全屏图片
    var scale = Math.min(bgcvs.width / bg.width, bgcvs.height / bg.height);
    ctx_0.drawImage(this,0,0,bg.width * scale, bg.height * scale)
  };
  

  var wdiv = "";

  for (var i=0;i<cam_loc.length;i++){
    
      // 工地分类，在左上角画出摄像头名称以及 坐标
      if (cam_loc[i].length > 0){

          var str = '<div style="cursor: pointer;"><img src = "/static/img/index_img/working.png" style = "height:70px;width:70px;" id = "construct_' + i + '"><span id = "cam">' + cam_group_name[i] + '</span></div>';
        
          wdiv += str;     
               
          document.getElementsByClassName('whole_img')[0].innerHTML = wdiv;

      }

  }

    for (var i = 0;i< cam_loc.length;i++){
      // 检查是否有坐标
      
        document.getElementById('construct_' + i).onclick = function(p1){
          var tp1 = p1;
          return function(){
              // 清除ctx_1 画布上的所有东西
            ctx_1.clearRect(0, 0, client_width, client_height);
            // 更改地区
            area = tp1;
            
            for(var j = 0; j< cam_loc[tp1].length;j++){
              cam_img = new Image();
              cam_img.src = '/static/img/index_img/camera_1.png';
    
              cam_img.onload = function (param){
                var tp2 = param;
    
                return function(){
                  ctx_1.drawImage(this, (cam_loc[tp1][tp2])[0]*client_width,  (cam_loc[tp1][tp2])[1]*client_height, 60, 60);
                } 
    
              }(j)
    
            } 
                
         }
              
        }(i);

      
    }
  

  // 得到事件地址
  function getEventPosition(ev){
    var x,y;
    if (ev.layerX || ev.layerX == 0) {
      x = ev.layerX;
      y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      x = ev.offsetX;
      y = ev.offsetY;
    }
    return {x: x, y: y};
  }

  // 添加点击事件
  lbcvs.addEventListener('click',ClickReporter);
 
    function ClickReporter(e){

      if (area >=0){
        // 获取x,y 的相对坐标
        p = getEventPosition(e);
        var x_lb = p.x;
        var y_lb = p.y;
        // 左侧/右侧
        for (var l=0;l<cam_loc[area].length;l++){
          // 水平竖直偏移
          var horizontalOffset = 54;
          var verticalOffset = 42;
          var xLeft_ = cam_loc[area][l][0]*client_width;
          var xRight_ = cam_loc[area][l][0]*client_width + horizontalOffset;
          var yTop_ = cam_loc[area][l][1]*client_height;
          var yBottom_ = cam_loc[area][l][1]*client_height + verticalOffset;

          if (x_lb > xLeft_ && x_lb < xRight_ && y_lb > yTop_ && y_lb < yBottom_){
            // 弹出窗口操作
             infoWindow(area,l);
          }

        }
    
    }
            
  }

  function infoWindow(a,n){
    document.getElementById('video').style = "block";
      var top = '<span style ="color:white">' + cam_group_name[a] + ' &nbsp' + cam_name[a][n] + '</span>'
      var img = '<img src = "/static/img/index_img/close.png" onclick = "c();" height = "20" "width" = "20" style = "float:right">'
      var br = '<br>'
      // 播放视频位置
      var resource = cam_stream[a][n];
      var iframe = "<iframe width='585' height='385' src='" + resource + "'" + "style='text-align: center;' frameBorder='0'> </iframe>";
      document.getElementById('video').innerHTML = top + img + br + iframe;
  }
  

  // 获取照相机图片
  var cam_innerHtml_strs = '';
  
  for (var a=0;a<cam_loc.length;a++){

    for (var c=0;c<cam_loc[a].length;c++){

      cam_innerHtml_str = '<div id = "img_' + a + '_' + c + '" style="cursor: pointer;"><img src = "' + cam_img[a][c] + '" style = "height:70px;width:70px;"></img></div>' 
      cam_innerHtml_strs += cam_innerHtml_str;

    }

  }
// 设置动态div
  document.getElementsByClassName('camera_flex')[0].innerHTML = cam_innerHtml_strs;


  // 点击右下角图片跳出视频
  for (var i=0;i<cam_loc.length;i++){

    (function(p1){

      for (var j=0;j<cam_loc[p1].length;j++){

      document.getElementById("img_" + p1 + "_" + j ).onclick = (function(p2){
        var t2 = p2;
        return function(){
          infoWindow(p1,t2);
        }
            
      })(j)

    }
  })(i)

}




  // // 设置鼠标移动事件
  // lbcvs.onmousemove = function(e){
  //   // 如果地区变化
  //   if (area >= 0){
  //     p = getEventPosition(e);
  //     var x_cursor = p.x;
  //     var y_cursor = p.y;
  //     for (var k=0;k<cam_loc[area].length;k++){
  //       // 水平竖直偏移
  //       var horizontalOffeset = 54;
  //       var verticalOffset = 42;
  //       var xLeft_ = cam_loc[area][k][0]*client_width;
  //       var xRight_ = cam_loc[area][k][0]*client_width + horizontalOffeset;
  //       var yTop_ = cam_loc[area][k][1]*client_height;
  //       var yBottom_ = cam_loc[area][k][1]*client_height + verticalOffset;
  
  //       if (x_cursor > xLeft_ && x_cursor < xRight_ && y_cursor > yTop_ && y_cursor < yBottom_){
  //         document.body.style.cursor = "hand";
  //       }else{
  //         document.body.style.cursor = "default";
  //       }
  
  //     }
  //     console.log(x_cursor,y_cursor)
  //   }
  // }
};


