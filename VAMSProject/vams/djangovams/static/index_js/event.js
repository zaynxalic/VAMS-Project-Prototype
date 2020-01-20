// 摄像机 编号
var c_name = [];

var c_fromurl = [];
// 事件编号
var event_num = [];
// 事件名称地址
var event_nameurl = [];
// 事件名称
var event_name = [];
// 事件被创建时间戳
var event_create_time = [];
// 事件视频
var video_url = [];
// 最大设置事件个数
var maxShowEvent = 16;
// 当前播放的事件
var curr = 0;
// 获取播放地址iframe url
var iframeurl = [];
// 全局计时器
var pageTimer = {};


for (var i=0;i<maxShowEvent;i++){
    c_name.push('');
    c_fromurl.push('');
    event_num.push(-1);
    event_nameurl.push('');
    event_name.push('');
    event_create_time.push('');
    video_url.push('');
}

var eventCount = 0;

    //转换日期
    var formatTime = function(number,format) {

        var formateArr  = ['Y','M','D','h','m','s'];
        var returnArr   = [];
        var date = new Date(number * 1000);

        returnArr.push(date.getFullYear());
        returnArr.push(formatNumber(date.getMonth() + 1));
        returnArr.push(formatNumber(date.getDate()));
        returnArr.push(formatNumber(date.getHours()));
        returnArr.push(formatNumber(date.getMinutes()));
        returnArr.push(formatNumber(date.getSeconds()));

        for (var i in returnArr){
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    }

    //数据转化
    var formatNumber = function(n){
        n = n.toString();
        return n[1] ? n : '0' + n
    }

    function transferTimestampToTime(timestamp){
        return formatTime(timestamp,'Y/M/D h:m:s');
    }



// 事件js
function requestEvent(){
    $.ajax({
      method:"GET",
      async: true,
      url:"http://172.16.138.39/event/",
      // 当成功的时候 获取数据
      success:function(data){
        
        eventCount = parseInt(data.count); 

        if(eventCount >0){

            // 只取最多16个事件,取当前时间数与最大事件数的最小值
            for (var i=0;i<Math.min(maxShowEvent,eventCount);i++){

            // 获取摄像机编号
            c_fromurl[i] = ((data.results)[i].camera_from);

            // 获取事件编号
            event_num[i] = parseInt((data.results)[i].url.split('/')[4]);

            // 获取事件名称
            event_name[i] = ((data.results)[i].eventtype);

            $.ajax({
                method:"GET",
                url:c_fromurl[i],
                // 需要取消异步
                async: false,
                success:function(from){
                    c_name[i] = from.title;
                },

                error: function(error_event){
                    console.log("error");
                    console.log(error_event);
                }

            })
            // 获取事件时间戳
            event_create_time[i] = transferTimestampToTime((data.results)[i].timestamp.slice(0,-3));
            // 获取事件url
            video_url[i] = (data.results)[i].videopath;

            }

            // 如果无事件，获取iframe url
        }else{
            $.ajax({

                method:"GET",
                async:false,
                url:"http://172.16.138.39/camera/",

                // 当成功的时候 获取数据
                success: function (data) {
                    // 数据总数
                    var iframeDataNum = parseInt(data.count);
                    for (var i=0;i<iframeDataNum;i++){
                        // if(data.results[i].camera_group !== null){
                            iframeurl[i] = data.results[i].http;
                        // }
                    }
                },
                error: function (error_data) {
                    console.log("error")
                    console.log(error_data)
                }

            })


        }
        
        // 如果有事件就报警,如果无事件就显示
        if (eventCount>0){
            setAlert();
        }else{
            recursiveFrameVideo();
        }
        
    },
    
      // 当失败的时候 输出错误
      error: function(error_data){
        console.log("error")
        console.log(error_data)
      }

    })
}

requestEvent();
    // 每隔一分钟获取信息
setInterval(function(){

    requestEvent();
    // setAlert();
},15000)

function recursiveFrameVideo(){

    // window.onload = function(){

        // 显示暂时无事件，并居中
        var alertinfo = '<div class = "flex-container"> 暂无事件</div>'

        document.getElementById('marq').innerHTML = alertinfo;  

        document.getElementsByClassName('flex-container')[0].style.textAlign = 'center';


        // 去除定时
    for(var each in pageTimer){
        clearInterval(pageTimer[each]);
    }

        setTimeout(function(){
            intervalPlay();
            // 一开始播放的加载
        },150);
            

        pageTimer["timer1"] = setInterval(function(){

            intervalPlay();

            // 调整切换播放时间间隔
        },15000);
        
    // }

}


function intervalPlay(){
    document.getElementById('alert_video').innerHTML = '<iframe src = "' + iframeurl[curr] + '" frameborder = "0" marginwidth="0" marginheight="0" id = "alertIframe" scrolling="no">'
        // 播放一次，curr + 1
        curr++;

        // 若超过数字则重新滚动播放
        if (curr >= iframeurl.length){
            curr = 0;
        }

}

function setAlert(){
    var alertInfos = '';

    // 去除定时
    for(var each in pageTimer){
        clearInterval(pageTimer[each]);
    }


    for (i=0;i<Math.min(maxShowEvent,eventCount);i++){
        var alertInfo_ = '<div class="area">' + c_name[i] +'</div><div class="date">' + event_create_time[i] + '</div><div class="event">' + event_name[i] + '</div></div>'
        var alertInfo =  '<div class="flex-container_' + i + '" onclick = "document.getElementById(\'alert_video\').innerHTML = \'<video id = &quot;alertVideo&quot; autoplay=&quot;autoplay&quot; src=&quot;' + video_url[i]  + '&quot;></video>\' ">' + alertInfo_
        alertInfos += alertInfo;
    }
    document.getElementById('marq').innerHTML = alertInfos;

    for (i=0;i<Math.min(maxShowEvent,eventCount);i++){
        document.getElementsByClassName('flex-container_'+ i)[0].style.display = 'flex';
        document.getElementsByClassName('flex-container_'+ i)[0].onmouseover = function(valueofI1){
            return function(){

                this.style.cursor = 'pointer';
                this.style.textDecoration = 'underline';

            }
            
        }(i);

        document.getElementsByClassName('flex-container_'+ i)[0].onmouseout = function(valueofI2){
            return function(){

                this.style.cursor = 'default';

                this.style.textDecoration = 'none';

            }
            
        }(i);
    }

    recursiveVideo();
}

// 当跑完html 之后运行 视频

function recursiveVideo(){
    // 没有事件的时候就循环播放
    
        // 获取视频列表长度
        vLen = video_url.length;

        document.getElementById('alert_video').innerHTML = '<video id = "alertVideo" autoplay="true" muted="muted" src = "' + video_url[0] + '" ></video>';

        var video = document.getElementById('alertVideo');
        video.addEventListener('ended',play);

        play();
        
        function play() {
            var video = document.getElementById('alertVideo');
            video.src = video_url[curr];

            var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;

            // video.load(); //如果短的话，可以加载完成之后再播放，监听 canplaythrough 事件即可

            // 设置timeout 以防止play（）被打断
            setTimeout( function() {
                if(!isPlaying){
                    video.play();
                }
            }, 500);
            
            curr++;
            if (curr >= vLen){
                curr = 0; // 播放完了，重新播放
            }
                
        }
}

    










