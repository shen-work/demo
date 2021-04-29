var WebConfig = {
    
};


window.onload = function()
{
    var div = document.createElement("div");
    div.id = "body";

    
    document.body.appendChild(div);

    WebConfig.player = new YT.Player("YT", {
        width: 1280,
        height: 720,
        videoId: "6tKlnHZJZo4",
        playerVars:{"controls":0},
        events:{
            "onStateChange":function(e){

                WebConfig.player._CurrentTime();

                document.querySelector("#Volume").value = WebConfig.player.getVolume();
                document.querySelector("#VolumeSpan").innerHTML = WebConfig.player.getVolume();

                document.querySelector("#CurrentTimeSeek").value = 
                Math.floor( WebConfig.player.getCurrentTime() / WebConfig.player.getDuration() * 100 );
                
            }
        }
    });

    WebConfig.player._CurrentTime = function(){

        clearInterval(WebConfig.CurrentTime);
        WebConfig.CurrentTime = setInterval(function(){
            
            document.querySelector("#CurrentTime").innerHTML = 
            TimeFormat(WebConfig.player.getCurrentTime());
        },500);
    
    }


    var tmp = document.createDocumentFragment();

    tmp.appendChild( SpanCr("播放時間：") );
    tmp.appendChild( SpanCr("0:0:0",{"id":"CurrentTime"}) );
    tmp.appendChild( document.createElement("br") );
    tmp.appendChild( TextCr("range",{"id":"CurrentTimeSeek","max":100,"min":0},{"change":function(){  
        
        WebConfig.player.seekTo( 
            Math.floor( (this.value / 100) * WebConfig.player.getDuration() )
        );

    }}) );
    tmp.appendChild( document.createElement("br") );

    tmp.appendChild( SpanCr("音量：") );
    tmp.appendChild( SpanCr("0",{"id":"VolumeSpan"}) );
    tmp.appendChild( document.createElement("br") );
    tmp.appendChild( TextCr("range",{"id":"Volume","max":100,"min":0},{"change":function(){ 
        WebConfig.player.setVolume(this.value);
        document.querySelector("#VolumeSpan").innerHTML = this.value;

    }}) );



    tmp.appendChild( document.createElement("br") );

    tmp.appendChild( TextCr("button",{"value":"播放"},{"click":function(){
        WebConfig.player.playVideo();
    }}) );



    tmp.appendChild( TextCr("button",{"value":"暫停"},{"click":function(){WebConfig.player.pauseVideo();}}) );

    

    tmp.appendChild( document.createElement("br") );
    tmp.appendChild( TextCr("text",{"id":"URL","value":"請輸入YouTube網址"},{"focus":function(){
        this.value = "";  
    }}));
    tmp.appendChild( TextCr("button",{"value":"切換影片"},{"click":function(){

        WebConfig.player.loadVideoById( YtGetV(document.querySelector("#URL").value) );

    }}));

    

    document.body.appendChild(tmp);
}


function TimeFormat(sec)
{
    if( isNaN(parseInt(sec)) ) sec = 0;

    sec = parseInt(sec);

    var set_time = [
        Math.floor(sec/3600),
        Math.floor(sec%3600/60),
        sec%60
    ];

    return set_time.join(":");
}

function SpanCr(str,attr)
{
    var obj = document.createElement("span");
    obj.innerHTML = str;

    for(var k in attr)
    {
        obj.setAttribute(k,attr[k]);
    }

    return obj;
}

function TextCr(type,attr,event)
{
    var obj;
    
    if(type=="textarea")
    obj = document.createElement("textarea");
    else
    obj = document.createElement("input");
    
    obj.type = type;

    for(var k in attr)
    {
        if(type=="textarea" && k=="value")
        obj.innerHTML = attr[k];
        else
        obj.setAttribute(k,attr[k]);
    }


    for(var type in event)
        obj.addEventListener(type,event[type]);


    return obj;
}

function YtGetV(url)
{
    if(url.indexOf("embed")!=-1 || url.indexOf("youtu.be")!=-1)
    {
        url = url||url.split("?")[1];
        console.log(url);
        return url.split("/")[ url.split("/").length-1 ];
    }

    url = "?"+url.split("?")[1]||url;
    url = new URLSearchParams(url);
    return url.get("v");
}

