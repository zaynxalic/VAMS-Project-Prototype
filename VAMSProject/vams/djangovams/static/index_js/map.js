
var map;
// 摄像机个数
var camera_count = 0;
// 照相机名称列表
var c_name = [];
// 照相机流url列表
var c_stream = [];
// 照相机位置列表
var c_loc = [];
// 照相机图片
var c_img = [];

$.ajax({
  method:"GET",
  url:"http://172.16.138.39/camera/",
  // 当成功的时候 获取数据
  success:function(data){
      // 获取照相机个数
      console.log(data);
      camera_count = data.count;
      // 遍历每一个摄像机
      for (var i=0;i<camera_count;i++){
          // 添加照相机名称
          c_name.push((data.results)[i].title)
          // 添加照相机流url
          c_stream.push((data.results)[i].http)
          // 添加照相机位置
          c_loc.push((data.results)[i].location)
          // 添加照相机imgurl
          c_img.push((data.results)[i].img_url)
      }
      

  },
  // 当失败的时候 输出错误
  error: function(error_data){
    console.log("error")
    console.log(error_data)
  }
})

// 异步加载
function mapInit() {

  var buildingLayer = new AMap.Buildings({
    zIndex:10, //到时候改一下这里的数据，看看这是什么数据
    merge:false,
    sort:false,
    zooms:[14.55, 19.99],
    zIndex: 10,
    heightFactor: 15//2倍于默认高度，3D下有效
  });
  
  map = new AMap.Map('map', {
    // 调整最大放大级别
    resizeEnable: true,
    rotateEnable: true,
    pitchEnable: true,
    zoom: 17,
    // 限定地图放大范围
    // 似乎不能等于20 否则会问题
    zooms: [14.55, 19.99],
    pitch: 60,
    rotation: -15,
    viewMode: '3D',//开启3D视图,默认为关闭
    buildingAnimation: true,//楼块出现是否带动画
    mapStyle: 'amap://styles/darkblue', //设置地图样式
    expandZoomRange: true,
    center: [113.304515,23.392121],
    layers: [
      // 高德默认标准图层
      new AMap.TileLayer({}),
      // 楼块图层
      buildingLayer
    ],
  });


  // 显示路，点，建筑,背景
  map.setFeatures(['road', 'building', 'bg']);

  // 设置地图边界
  var southWest = new AMap.LngLat(113.287040, 23.372261);
  var northEast = new AMap.LngLat(113.326424, 23.419538);
  var bounds = new AMap.Bounds(southWest, northEast);
  map.setLimitBounds(bounds);

  // 监听 drag 事件
  AMap.event.addListener(map, 'dragend', function () {
    if (!map.getLimitBounds().contains(map.getCenter())) {
      alert("你已经超出范围");
      // 复原原位
      map.setZoomAndCenter(17, [113.304515,23.392121]);
      console.log('drag 事件');
    }
  });


  // 监听 move 事件
  AMap.event.addListener(map, 'moveend', function () {
    if (!map.getLimitBounds().contains(map.getCenter())) {
      alert("你已经超出范围");
      // 复原原位
      map.setZoomAndCenter(17, [113.304515,23.392121]);
      console.log('move 事件');
    }
  });

//   // 定义点坐标
//   var marker_cam = null;
//   // 将地址值保存在列表中
//   var marker_camspos = [
//     [113.299825,23.387633],
//     [113.299749,23.387639],
//     [113.300108,23.390916],
//     [113.299911,23.390997],
//     [113.302119,23.401424],
//     [113.302005,23.401476],
//     [113.301393,23.397028],
//     [113.301214,23.397073],
//   ];
//   var marker_cams = [];

//   // 设置摄像头图标
//   for (var i = 0; i < 8; i++) {
//     marker_cam = new AMap.Marker({
//       position: marker_camspos[i],
//       icon: "/static/img/index_img/camera_1.png",
//       // visible:false,
//     });
//     marker_cam.setMap(map);
//     marker_cams.push(marker_cam);
//   }

//   // 聚合地图中的数据
//   map.plugin(["AMap.MarkerClusterer"], function () {
//     var cluster = new AMap.MarkerClusterer(map, marker_cams);
//   });

//   var str;
//   // 点击地图获得该点的坐标,并清除其他坐标信息
//   AMap.event.addListener(map, 'click', function (e) {
//     // map.clearMap();
//     // 清空一部分数据
//     var x = e.lnglat.getLng();
//     var y = e.lnglat.getLat();
//     str = '[' + x + "," + y + '],' + str;
//     console.log(str);
//     var marker = new AMap.Marker({
//       icon:"http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png",
//       position: [x, y]
//     });
//     marker.setMap(map);
//   });

//   var contextmenu = new AMap.ContextMenu();
//   var pos = [];
//   // 添加右键菜单内容项
//   contextmenu.addItem("放大", function () {
//     map.zoomIn();
//   }, 0);

//   contextmenu.addItem("缩小", function () {
//     map.zoomOut();
//   }, 1);

//   contextmenu.addItem("添加点标记", function () {
//     var newmarker = new AMap.Marker({
//       map: map,
//       position: pos,
//       icon:  "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png"
//     })
//   }, 2);

//   // 监听右键事件
//   map.on('rightclick', function (e) {
//     contextmenu.open(map, e.lnglat);
//     pos = e.lnglat;
//   });

//   // 信息窗体

//   // content 内容
//   function info(num) {
//     var info = [];
//     info.push('<span style="font-size:16px;color:#F00;">监控摄像头' + num + '号</span>');
//     // 将每一个摄像头的名字命名为 camera_ + num的名字
//     info.push('<iframe frameborder="0"  height= "300px" width= "500px" src="http://172.16.138.39:8080" allowfullscreen></iframe>')
//     return info.join('<br/>');
//   }

//   // window 上面显示的文字
//   function text(num) {
//     var infoWindow = new AMap.InfoWindow({
//       isCustom: false,
//       content: info(num),
//       showShadow: true,
//       closeWhenClickMap: true,
//       autoMove: true,
//       offset: new AMap.Pixel(0, -36)
//     });
//     return infoWindow;
//   }

// // 使用闭包进行js 循环
// // 点击摄像头可以打开视频
//   for (var i=0;i<8;i++){

//     AMap.event.addListener(marker_cams[i], 'click', function (param) {
//       var temp = param;

//       return function(){
//         var infoWindow = text(temp);
//         infoWindow.open(map, marker_camspos[temp]);
//       }

//     }(i));
//   }


//   // 假定施工位置为
//   var construction = [[
//     [113.301469,23.397131],[113.301274,23.397166],[113.302124,23.400955],[113.302002,23.401058]
//   ],
//     [[113.299829,23.387474],[113.299738,23.387491],[113.300187,23.391029],[113.299969,23.391119]
//   ]]

//     // // 计算一个多边形的中心位置,返回值为AMap.LngLat
//     function center_polygon(l) {
//       var sum_x = 0;
//       var sum_y = 0;
//       for (var i = 0; i < l.length; i++) {
//         // 取出平均坐标x与y
//         sum_x = sum_x + l[i][0];
//         sum_y = sum_y + l[i][1];
//       }
//       return new AMap.LngLat((sum_x / l.length), (sum_y / l.length));
//     }

// // 加载窗口的所有函数
//   window.onload = function(){
//      // 点击图片显示摄像头
//       for (var i=0;i<8;i++){
//         // 提取出名称为img_xxx的id 的监视器
//         document.getElementById('img_' + i).onclick = function(para){
//           var cpara = para;
//               return function(){
//                   var infoWindow = text(cpara);
//                   infoWindow.open(map, marker_camspos[cpara]);
//               }
      
//         }(i)

//     }

//     // 施工地点
//     for (var i=0;i<2;i++){
//       document.getElementById('construct_' + i).onclick = function(param){
//         // 更改地图的位置
//           var temp = param;

//           return function(){
//           // 设置地图位置
//             map.setZoomAndCenter(18.1, center_polygon(construction[temp]));
//         }

//       }(i)
      
//     }


//   }




  var options =  {
    hideWithoutStyle:false,//是否隐藏设定区域外的楼块
    areas:[{ 
          rejectTexture:true,//是否屏蔽自定义地图的纹理
          color1: 'afffff00',//楼顶颜色
          color2: 'afffcc00',//楼面颜色
          path: [
            [113.301398,23.39255],[113.30237,23.391692],[113.303462,23.391099],[113.304638,23.39083],[113.305556,23.390474],[113.306166,23.390232],[113.306829,23.390592],[113.307988,23.390124],[113.308488,23.390099],[113.308903,23.389845],[113.309985,23.389367],[113.309965,23.388795],[113.309381,23.388273],[113.308718,23.388326],[113.307965,23.388566],[113.30732,23.388928],[113.307043,23.388285],[113.306836,23.387123],[113.307302,23.386951],[113.308008,23.386582],[113.308683,23.386272],[113.309013,23.385543],[113.30851,23.3846],[113.307582,23.384781],[113.306812,23.384994],[113.306178,23.385495],[113.305789,23.385157],[113.305353,23.384089],[113.305786,23.383573],[113.306486,23.382673],[113.306965,23.382061],[113.307541,23.38138],[113.307665,23.380904],[113.306616,23.38035],[113.305995,23.380815],[113.304888,23.38185],[113.304229,23.382434],[113.303632,23.382726],[113.303374,23.383813],[113.303961,23.385069],[113.303092,23.385222],[113.302019,23.385525],[113.301688,23.384815],[113.301511,23.383745],[113.29978,23.383442],[113.299001,23.383161],[113.298252,23.382784],[113.297344,23.382428],[113.296913,23.382489],[113.296193,23.383327],[113.296794,23.38406],[113.297388,23.384566],[113.298382,23.384683],[113.299387,23.385071],[113.299926,23.385461],[113.299967,23.386225],[113.299744,23.386917],[113.299105,23.387003],[113.297622,23.386784],[113.297138,23.387285],[113.297154,23.387893],[113.297607,23.388283],[113.298255,23.388383],[113.299154,23.388491],[113.299844,23.388447],[113.300011,23.389064],[113.300133,23.389564],[113.300122,23.390362],[113.299307,23.390467],[113.298246,23.39045],[113.298015,23.391201],[113.297954,23.392275],[113.299133,23.392452],[113.300288,23.392391]
          ]
  },{
      color1: 'af09ff00',//楼顶颜色
      color2: 'af09ff00',//楼面颜色
      // 注意添加很多点，不然有可能无法形成立体图像
      path: [
        [113.303814,23.401088],[113.303919,23.400285],[113.304271,23.399835],[113.304958,23.399621],[113.305559,23.399392],[113.306194,23.399255],[113.306705,23.399144],[113.307587,23.398943],[113.308431,23.398728],[113.30908,23.399159],[113.309819,23.399516],[113.310292,23.400194],[113.311702,23.399714],[113.312417,23.399186],[113.312449,23.398563],[113.311762,23.398173],[113.310436,23.397767],[113.310057,23.397222],[113.309865,23.396802],[113.309616,23.396251],[113.30934,23.395784],[113.309584,23.395753],[113.310494,23.395601],[113.311033,23.395407],[113.311226,23.395133],[113.311296,23.39471],[113.311185,23.394007],[113.310526,23.393918],[113.309516,23.393995],[113.309169,23.39395],[113.308415,23.394134],[113.307857,23.394562],[113.307833,23.394974],[113.307147,23.395419],[113.305816,23.395651],[113.304974,23.395965],[113.304282,23.396071],[113.303674,23.396268],[113.303038,23.39612],[113.302674,23.395594],[113.302545,23.395629],[113.301893,23.395792],[113.301731,23.395983],[113.301948,23.396027],[113.30107,23.396245],[113.300691,23.396298],[113.299995,23.396587],[113.299752,23.396857],[113.300115,23.397085],[113.300101,23.397227],[113.299904,23.397512],[113.300341,23.397472],[113.300835,23.397402],[113.30119,23.397308],[113.301587,23.397201],[113.301897,23.39717],[113.302183,23.397225],[113.302219,23.397426],[113.302422,23.398185],[113.302571,23.398824],[113.302805,23.399431],[113.302621,23.399784],[113.302343,23.400399],[113.30164,23.400593],[113.301266,23.400764],[113.301079,23.400854],[113.300933,23.401072],[113.301094,23.401409],[113.301064,23.401736],[113.301421,23.401901],[113.302265,23.401796],[113.302908,23.401602],[113.303524,23.401465],
      ]
  }]
};

//此配色优先级高于自定义mapStyle
buildingLayer.setStyle(options); 

  // var area_camera = new AMap.Polygon({
  //   map: map,
  //   path: camera_1,
  // });

  // // 实例化信息窗体类
  // var infowindow_polygon = new AMap.InfoWindow({
  //   content: "<h3>白云机场</h3><p>1号监视器</p>",
  //   closeWhenClickMap: true
  // });

  // // 监听鼠标移入、移除事件
  // area_camera.on("mouseover", function (e) {
  //   console.log(camera_1);
  //   infowindow_polygon.open(map, center_polygon(camera_1));
  // }).on("mouseout", function () {
  //   infowindow_polygon.close();
  // });
}

mapInit();