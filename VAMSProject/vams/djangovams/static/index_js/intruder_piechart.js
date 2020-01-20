// mychart初始化
var intruderchart = echarts.init(document.getElementById('intruder'));
// 设置endpoint
var endpoint_1 = '/api/intruder-chart/'
var intruder_data = [];
var labels  = ["工地1区", "工地2区"];


// 从数据库得到的数据，需要通过django 进行配置

function setajax_intruder(){
  $.ajax({
    method:"GET",
    url:endpoint_1,
    // 当成功的时候 获取数据
    success:function(data){
      intruder_data = data
      // setchart
      setpieChart()
    },
    // 当失败的时候 输出错误
    error: function(error_data){
      console.log("error")
      console.log(error_data)
    }
  })
}


setajax_intruder();
// 每隔一段时间获取信息
setInterval(function(){
  setajax_intruder()
},5000)


// 设置饼图
function setpieChart(){
  var option = {

    // legend: {
    //   orient: 'vertical',
  
    //   x: 'right',
    //   y: 'top',
    //   // legend 的位置
  
    //   itemWidth: 24,   // 设置图例图形的宽
    //   itemHeight: 18,  // 设置图例图形的高
    //   textStyle: {
    //     color: '#666'  // 图例文字颜色
    //   },
    //   // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
    //   backgroundColor: '#eee',  // 设置整个图例区域背景颜色
    //   data: labels,
  
    // },
    series: [
      {
        x: 'center',
        y: 'center',
        type: 'pie',
        radius: ['60%', '100%'],  // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
        data: intruder_data, //默认数据
        // itemStyle 设置饼状图扇形区域样式
        itemStyle: {
          // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
          // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowColor: 'rgba(30, 144, 255，0.5)'
          }
        },
        // 设置值域的那指向线
        labelLine: {
          normal: {
            show: false   // show设置线是否显示，默认为true，可选值：true ¦ false
          }
        },
        // 设置值域的标签
        label: {
          normal: {
            position: 'inner',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
            // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
            // {a}指series.name  {b}指series.data的name
            // {c}指series.data的value  {d}%指这一部分占总数的百分比
            formatter: '{b}:{c}'
          }
        },
      }
    ],
  
    grid: {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10,
    }
  };
  
  intruderchart.setOption(option);//*****自己要定义，定时器只是为了动态改变数据
}


