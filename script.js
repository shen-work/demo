var DB = firebase;
DB.initializeApp({databaseURL: "https://shen-member-default-rtdb.firebaseio.com/"});

var System = {
    "now_page":"",
    "ServerTime":firebase.database.ServerValue.TIMESTAMP,
    "tmp":{},
    "member":{},
    "time":null,
    "_timer_list":{},
    "client_id":"506821759724-fq3jm7jq7llvnp7tqui2493kupkknvvp.apps.googleusercontent.com",
    //"GAKey":"AIzaSyCEe6fZN3JCszefiJ8qLTpCn-HlCNTGjNo",
    "GAKey":"AIzaSyCUXIWD966J5JDtytCel0O5JXwMIz7GVr0"
};




window.onload = function()
{
    gapi.load("auth2",function(){

        if(location.href.indexOf("file")!=0)
            gapi.auth2.init({"client_id":System.client_id});
        
        DB = DB.database();

        setTimeout(function(){
            Main();
        },1);

    });


    document.body.addEventListener("touchmove",function(e){

        if(e.target.parentElement.getAttribute("draggable")=="true")
        {
            var touchLocation = e.targetTouches[0];
        
            e.target.parentElement.style.left = touchLocation.pageX - e.target.parentElement.clientWidth/2;
            e.target.parentElement.style.top = touchLocation.pageY - e.target.parentElement.clientHeight/3;
        }

        if(e.target.getAttribute("draggable")=="true")
        {
            var touchLocation = e.targetTouches[0];
        
            e.target.style.left = touchLocation.pageX - this.clientWidth/2;
            e.target.style.top = touchLocation.pageY - this.clientHeight/3;
        }
    });


    document.body.addEventListener("dragend",function(e){
        
        if(e.target.getAttribute("draggable")=="true")
        {
            e.target.style.left = e.clientX;
            e.target.style.top = e.clientY;
        }
    });


    document.body.addEventListener("click",function(e){
        var obj = e.target;
    });
    

}

function Main()
{
    System.local = JSON.parse(localStorage.shen||'{}');
    System.session = JSON.parse(sessionStorage.shen||'{}');

    ServerTime(MenuLi);
}

function MenuLi()
{
    var div = document.createElement("div");
    div.id = "Menu";
    var ul = document.createElement("ul");
    var list = {
        "Test":{"name":"測試系統"},
        "Member":{"name":"帳號管理"},
        "YT":{"name":"YouTube內嵌播放"},
    }
    for(var key in list)
    {
        System.session.menu = System.session.menu||{};
        System.session.menu[key] = System.session.menu[key]||{};

        System.session.search = System.session.search||{};
        System.session.search[key] = System.session.search[key]||{};
    }


    for(var i in list)
    {
        var li = document.createElement("li");
        li.id = i;
        li.className = list[i].class||"";
        li.innerHTML = list[i].name;
        li.addEventListener("click",function(){MenuClick(this.id,"close");});

        ul.appendChild(li);

        var li_div = document.createElement("div");
        li_div.id = i;    
        ul.appendChild(li_div);
    }
    div.appendChild(ul);
    document.body.appendChild(div);


    var _open_id = "Test";
    for(var _id in System.session.menu)
    {
        if( System.session.menu[_id].open=="open" )
        {
            _open_id = _id;
        }
    }
    MenuClick(_open_id,"open");
}


function MenuClick(id,act)
{
    System.now_page = id;

    System.session.menu = System.session.menu||{};
    System.session.menu[id] = System.session.menu[id]||{};


    if(act=="close")
    {
        if(System.session.menu[id].open=="open")
        {
            document.querySelectorAll("#Menu>ul>div").forEach(function(div){
                div.innerHTML = "";
                div.style.height = "0px";
            });
            System.session.menu[id].open = "close";
            sessionStorage.shen = JSON.stringify(System.session);
        }
        else
        {
            document.querySelectorAll("#Menu>ul>div").forEach(function(div){
                div.innerHTML = "";
                div.style.height = "0px";
            });

            setTimeout(function(){
                MenuClick(id,"open");
            },0);
        }
        return;
    }
    else
    {
        document.querySelectorAll("#Menu>ul>div").forEach(function(div){
            if(div.id!=id)
            {
                div.innerHTML = "";
                div.style.height = "0px";
            }
        });
    }

    for(var _id in System.session.menu)
    {
        if(_id==id)
        {
            System.session.menu[_id].open = "open";
            System.session.menu[_id].list_id = System.session.menu[_id].list_id||"list";
        }
        else
        {
            System.session.menu[_id].open = "close";
        }
    }


    
    sessionStorage.shen = JSON.stringify(System.session);


    if(System.MainDiv) System.MainDiv.remove();

    System.MainDiv = document.createElement("div");
    System.MainDiv.id = "Main";



    eval( id +"()");
}

function Test()
{
    var menu = {};


    var div = document.createElement("div");
    
    div.innerHTML = "測試用網站";

    menu = {
        "0":{
            "html":div
        }
    }

    System.MainDiv.appendChild( RowMake(menu) );
    MainDivSetTimeout();
}

function Member()
{
    var menu = {};
    var login_word = "GOOGLE登入/註冊";


    var btn = document.createElement("input");
    btn.type = "button";

    if(gapi.auth2.getAuthInstance().isSignedIn.get()==true)
    {
        var g = gapi.auth2.getAuthInstance().currentUser.get().gt;
        menu = {
            "email":{
                "span":"GOOGLE帳號",
                "disabled":"disabled",
                "value":g.getEmail()
            },
            "name":{
                "span":"GOOGLE暱稱",
                "disabled":"disabled",
                "value":g.getName()
            }
        };
        login_word = "登出網站";
        btn.addEventListener("click",LogOut);
    }
    else
    {
        btn.addEventListener("click",Login);
    }

    btn.value = login_word;

    menu.btn = {
        "html":btn
    };

    System.MainDiv.appendChild( RowMake(menu) );
    MainDivSetTimeout();



    function Login()
    {
        gapi.auth2.getAuthInstance().signIn().then(function(r){

            DB.ref("member/"+r.Aa).once("value",function(member){

                if(member.val()==null)
                {
                    var _data = JSON.parse(JSON.stringify(r.gt));

                    for(var k in _data)
                    if(_data[k]===undefined) delete _data[k];


                    DB.ref("member/"+r.Aa).set(_data);
                }

            });
            
            var msg = document.createElement("div");
            msg.innerHTML = "登入/註冊成功";
            System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"close_ev":function(){MenuClick(System.now_page,"open");}}) );
            
            
            return;

        },function(err){
            
            var msg = document.createElement("div");
            msg.innerHTML = "登入/註冊失敗";
            System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"close_ev":function(){MenuClick(System.now_page,"open");}}) );
            return;
        });
    }

    function LogOut()
    {
        gapi.auth2.getAuthInstance().signOut();
        
        var msg = document.createElement("div");
        msg.innerHTML = "已登出網站";
        System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"close_ev":function(){MenuClick(System.now_page,"open");}}) );
        return;
    }
}

var player = {};
function YT()
{
    var menu = {};
    


    var btn = document.createElement("input");
    btn.type = "button";

    var div = document.createElement("div");
    div.id = "YT";

    var btn = document.createElement("input");
    btn.type = "button";
    btn.value = "內嵌播放開始";
    btn.addEventListener("click",function(){
        
        GetYtInfo(YTGetV( document.querySelector("#url").value ),function(info){

            if( info.items.length>0 )
            {
                if(info.items[0].status.embeddable==false)
                {

                    var msg = document.createElement("div");
                    msg.innerHTML = `
                    影片擁有者不允許在其他網站上播放這部影片。點擊下方連結另開新分頁前往該影片網址<BR>
                    <a href="`+document.querySelector("#url").value+`" target="_blank">`+document.querySelector("#url").value+`</a>`;
                    
                    System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true}) );

                    return;
                }

                YTApi(info);
            }
            else
            {

                var msg = document.createElement("div");
                msg.innerHTML = "無此youtube影片，請確認網址是否正確";
                System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"close_ev":function(){MenuClick(System.now_page,"open");}}) );
            }

        });    
    });

    menu = {
        "url":{
            "span":"網址",
            "value":"請輸入Youtube網址",
            "type":"text",
            "event":{"focus":function(){
                if(this.value=="請輸入Youtube網址")
                this.value = "";
            }}
        },
        "video":{
            "html":div
        },
        "btn":{
            "html":btn
        }
    };

    System.MainDiv.appendChild( RowMake(menu) );
    MainDivSetTimeout();


    function YTApi(info)
    {
        if( Object.keys(player).length!=0 )
        {

            GetYtInfo(YTGetV( document.querySelector("#url").value ),function(info){

                if( info.items.length>0 )
                {
                    if(info.items[0].status.embeddable==false)
                    {
    
                        var msg = document.createElement("div");
                        msg.innerHTML = `
                        影片擁有者不允許在其他網站上播放這部影片。點擊下方連結另開新分頁前往該影片網址<BR>
                        <a href="`+document.querySelector("#url").value+`" target="_blank">`+document.querySelector("#url").value+`</a>`;
                        
                        System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true}) );
    
                        return;
                    }
    
                    player.loadVideoById( YTGetV( document.querySelector("#url").value ) );

                    document.querySelector("#channelTitle").innerHTML = "頻道名稱："+info.items["0"].snippet.channelTitle;
                    
                    document.querySelector("#title").innerHTML = "影片標題："+info.items["0"].snippet.title;

                    document.querySelector("#publishedAt").innerHTML = "直播開始(上傳)時間："+DateFormat(new Date(info.items["0"].snippet.publishedAt),false);

                }
                else
                {
    
                    var msg = document.createElement("div");
                    msg.innerHTML = "無此youtube影片，請確認網址是否正確";
                    System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true}) );
                }
    
            }); 
            return;
        }

        var config = System.session.YTconfig||{};

        config.videoId = YTGetV( document.querySelector("#url").value );

        config.playerVars = {
            //"controls":1
        };
    
        config.events = {
            "onStateChange":function(e){

                
    
                player._CurrentTime();
    
                document.querySelector("#Volume").value = player.getVolume();
                document.querySelector("#VolumeSpan").innerHTML = "音量："+player.getVolume();
                
    
                document.querySelector("#CurrentTimeSeek").value = 
                Math.floor( player.getCurrentTime() / player.getDuration() * 100 );
                
            }
        };



        player = new YT.Player("video",config);

        player._CurrentTime = function(){

            clearInterval(player._CurrentTimer);
            player._CurrentTimer = setInterval(function(){
                
                if(document.querySelector("#CurrentTime")==null)
                {
                    clearInterval(player._CurrentTimer);
                    return
                }
                document.querySelector("#CurrentTime").innerHTML = 
                "播放時間："+TimeFormat(player.getCurrentTime());
                
            },100);
        
        }
        var tmp = document.createDocumentFragment();

        tmp.appendChild( SpanCr("頻道名稱："+info.items["0"].snippet.channelTitle,{"id":"channelTitle"}) );
        tmp.appendChild( document.createElement("br") );
        tmp.appendChild( SpanCr("影片標題："+info.items["0"].snippet.title,{"id":"title"}) );
        tmp.appendChild( document.createElement("br") );
        tmp.appendChild( SpanCr("直播開始(上傳)時間："+DateFormat(new Date(info.items["0"].snippet.publishedAt),false),{"id":"publishedAt"}) );
        tmp.appendChild( document.createElement("br") );


        tmp.appendChild( SpanCr("播放時間：0:0:0",{"id":"CurrentTime"}) );
        tmp.appendChild( document.createElement("br") );
        tmp.appendChild( TextCr("range",{"id":"CurrentTimeSeek","max":100,"min":0},{"change":function(){  
            
            player.seekTo( 
                Math.floor( (this.value / 100) * player.getDuration() )
            );
    
        }}) );
        tmp.appendChild( document.createElement("br") );

        tmp.appendChild( SpanCr("音量：0",{"id":"VolumeSpan"}) );
        tmp.appendChild( document.createElement("br") );
        tmp.appendChild( TextCr("range",{"id":"Volume","max":100,"min":0},{"change":function(){ 
            player.setVolume(this.value);
            document.querySelector("#VolumeSpan").innerHTML = "音量：" + this.value;
    
        }}) );
        tmp.appendChild( document.createElement("br") );



        tmp.appendChild( TextCr("button",{"value":"播放"},{"click":function(){
            player.playVideo();
        }}) );
    
        tmp.appendChild( TextCr("button",{"value":"暫停"},{"click":function(){
            player.pauseVideo();
        }}) );



        System.MainDiv.appendChild( OpenWindow(tmp,{"id":"YTControl","close_draggable":true}) );
        MainDivSetTimeout();
    }

    function YTGetV(url)
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



    

}



function MainDivSetTimeout()
{
    document.querySelectorAll("#Menu>ul>div").forEach(function(d){
        d.innerHTML = "";
    });
    document.querySelector("#Menu>ul>div#"+System.now_page).appendChild(System.MainDiv);

    setTimeout(function(){
        if(document.querySelector("div#"+System.now_page) && 
        document.querySelector("div#"+System.now_page+" div#Main") )
        {
            document.querySelector("div#"+System.now_page).style.height = 
            document.querySelector("div#"+System.now_page+" div#Main").clientHeight + "px";
        }
        
    },0);
}



function ListDiv(list,_class)
{
    var _div = document.createElement("div");
    _div.className = "ListDiv";

    if( _class!=undefined )
        _div.classList.add(_class);

    for(var idx in list)
    {
        var _value = list[idx];

        var div_list = document.createElement("div");
        div_list.innerHTML = _value.div_word;
        div_list.id = _value.id;

        if(_value.add_class!=undefined)
            div_list.classList.add(_value.add_class);


        _div.appendChild(div_list);
    }

    var detail = document.createElement("div");
    detail.className = "detail";
    detail.setAttribute("draggable","true");

    var btn_close = document.createElement("input");
    btn_close.type = "button";
    btn_close.value = "關閉";
    var detail_content = document.createElement("div");

    

    detail.appendChild(detail_content);
    detail.appendChild(btn_close);
    _div.appendChild(detail);

    btn_close.addEventListener("click",function(){

        this.parentElement.style.display = "none";
    });

    _div.addEventListener("click",function(e){
        
        if(e.target.parentElement==detail) return;

        for(var key in e.path)
        {
            if(e.path[key].parentElement==this)
            {
                var _id = e.path[key].id;
                detail_content.innerHTML = list[ _id ].detail_content;
                detail.style.display = "block";
                detail.style.left = e.clientX;
                detail.style.top = e.clientY;

                var _btn = detail.querySelectorAll("[data-func]");
                
                for(var i=0;i<_btn.length;i++)
                {
                    _btn[i].addEventListener(
                        list[_id][_btn[i].dataset.func+"_func"].type,
                        list[_id][_btn[i].dataset.func+"_func"].func);
                }
            }
        }
    });

    return _div;
    
}



//menu=>obj,div=>div容器
function ListMake(title = {},list = {},table_id = "")
{
    var table = document.createElement("table");
    table.className = "ListTable";

    if(table_id!="")
    {
        table.id = table_id;

        if( document.querySelector("#"+table_id) )
        {
            table = document.querySelector("#"+table_id);
            table.innerHTML = "";
        }
    }

    var tr = document.createElement("tr");
    

    for(var row in title)
    {
        var td = document.createElement("td");

        td.innerHTML = title[row].title;

        for(var e_type in title[row].title_event)
        {
            td.addEventListener(e_type,title[row].title_event[e_type]);
        }
        delete title[row].title_event;

        for(var k in title[row])
        {
            if(k=="html" || k=="value") continue;

            if( typeof(title[row][k])=="object" || 
                title[row][k]==undefined || 
                title[row][k]=="") continue;

            td.setAttribute(k,title[row][k]||"");
        }

        td.className = title[row].title_class||"";

        tr.appendChild(td);
    }
    table.appendChild(tr);

    
    for(var a in list)
    {
        var tr = document.createElement("tr");

        for(var row in title)
        {
            var td = document.createElement("td");

            if(title[row].html)
            td.innerHTML = list[a][ title[row].html ];
            
            if(title[row].appendChild)
            td.appendChild(list[a][ title[row].appendChild ]);

            for(var _i in title[row])
            {
                if( list[a][ title[row][_i] ]!=undefined)
                if(_i=="html" || _i=="value") continue;

                if( typeof(list[a][ title[row][_i] ])=="object" || 
                list[a][ title[row][_i] ]==undefined || 
                list[a][ title[row][_i] ]=="") continue;

                td.setAttribute(_i,list[a][ title[row][_i] ]||"");
            }

            td.setAttribute("id",list[a][ title[row].id ]||"");
            td.className = title[row].class||"";

            for(var e_type in title[row].event)
            {
                td.addEventListener(e_type,title[row].event[e_type]);
            }

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    return table;
}

//menu=>obj,div=>div容器
function RowMake(menu = {})
{
    var div = document.createElement("div");
    for(var i in menu)
    {
        var input = document.createElement("input");
        var span = document.createElement("span");
        span.className = "row";

        if(menu[i].html!=undefined && menu[i].html!="")
        {
            input = menu[i].html;
        }

        if(menu[i].class=="content")
        {
            input = document.createElement("textarea");
            input.value = menu[i].value||"";
        }

        input.id = i;

        for(var attr in menu[i])
        {
            if( typeof(menu[i][attr])=="object" ) continue;

            input.setAttribute(attr,menu[i][attr]);
        } 
        
        span.innerHTML = menu[i].span||"";

        if(menu[i].event!==undefined)
        {
            for(var _on in menu[i].event)
                input.addEventListener(_on,menu[i].event[_on]);
        }


        var row_div = document.createElement("div");
        row_div.className = "row";

        row_div.appendChild(span);
        row_div.appendChild(input);


        div.appendChild(row_div);
        //System.MainDiv.appendChild(row_div);
    }
    return div;
}


function DelAccount(gapi_getid)
{
    DB.ref("member/"+gapi_getid).once("value",m=>{
        m = m.val();

        gapi.auth2.getAuthInstance().signOut();
        gapi.auth2.getAuthInstance().disconnect();
        DB.ref("member/"+gapi_getid).remove();
        
    
        var _tmp = {"member":{}};
        localStorage.shen = JSON.stringify(_tmp);
    
        if(m==null)
        {   
            alert("該GOOGLE帳號無綁定會員");
        }

        location.reload();

    });
}



function RegisterMember(gapi_getid)
{
    DB.ref("member/"+gapi_getid).once("value",function(m){
        m = m.val();

        if(m==null)
        {
            m = {};
            m.account = gapi_getid;
            m.name = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().sd;
            m.time = System.ServerTime;
            DB.ref("/member/"+gapi_getid).set(m);

            m.time = System.time;
            System.member = m;
            
            var _tmp = {"member":System.member};
            localStorage.shen = JSON.stringify(_tmp);
            

            location.reload();
        }
        else
        {
            System.member = m;

            var _tmp = {"member":System.member};
            localStorage.shen = JSON.stringify(_tmp);

            location.reload();
        }
    });        
}


function ServerTime(func)
{
    DB.ref("ServerTime").set(System.ServerTime).then(
            function(){
            
            DB.ref("ServerTime").once("value").then(function(data)
            {
                System.time = data.val();
                setInterval(function(){ System.time+=1000; },1000);

                
                func();
            });
        });
}


function DateFormat(timestamp,time = false)
{
    if(timestamp=="Invalid Date") return;

    var tmp = timestamp.toString().split(" ");
    var hms = tmp[4];

    tmp = tmp[3] + "/" + 
        parseInt(new Date(timestamp).getMonth()+1) + "/" + 
        new Date(timestamp).getDate();

    if(time===true) tmp = "";
    if(time===false) tmp += " ";
    if(time==="<BR>") tmp += "<BR>"
    

    tmp += hms.split(":")[0] + ":" 
        + hms.split(":")[1] + ":" 
        + hms.split(":")[2];


    return tmp;
}


function Shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function Rad(number)
{
    return 1+Math.floor(Math.random()*number);
}

function DBGetId(DB,path,func)
{
    DB.ref(path).orderByKey().limitToLast(1).once("value",function(last_data){

        var id;
        last_data = last_data.val();


        if(last_data==null)
        {
            id = new Date().getTime().toString().substr(2);
        }
        else
        {
            for(var key in last_data) 
                id = key-(-1);
        }

        func.call(this,id);
    });
}


function OpenWindow(content,config = {})
{
    var id = config.id||"OpenWindow";
    var xy = config.xy;

    var detail = document.querySelector("#"+id);
    
    

    if(detail==null)
    {
        detail = document.createElement("div");
        detail.className = "detail";
        detail.id = id;
        
        if(config.close_draggable===undefined)
        detail.setAttribute("draggable","true");
    }
    else
    {
        detail.innerHTML = "";
    }

    detail.appendChild(content);


    if(config.close===true)
    {
        var btn_close = document.createElement("input");
        btn_close.type = "button";
        btn_close.value = "關閉";
        btn_close.addEventListener("click",function(){
            this.parentElement.remove();

            if(config.close_ev!=undefined)
            {
                config.close_ev();
            }

        });
        detail.appendChild(btn_close);


    }

    if(xy!=undefined)
    {
        detail.style.left = xy.x+"px";
        detail.style.top = xy.y+"px";
    }
    detail.style.display = "block";


    detail.addEventListener("dragend",function(e){

        e.target.style.left = e.clientX - System.mousedown.offsetX;
        e.target.style.top = e.clientY - System.mousedown.offsetY;
        
    });

    detail.addEventListener("mousedown",function(e){
        System.mousedown = e;
    });


    return detail;
}

//true手機行動裝置 false非手機
function CheckMobile()
{
    return (navigator.userAgent.indexOf("Mobile")!==-1)?true:false;
}



function DivMainClientHeight(_id)
{
    if(_id!=undefined)
    {
        if( System.session.menu[_id].open=="open" )
        {
            document.querySelector("div#"+_id).style.height = document.querySelector("div#"+_id+" div#Main").clientHeight + "px";
        }
        return;
    }


    document.querySelector("div#"+System.now_page).style.height = document.querySelector("div#"+System.now_page+" div#Main").clientHeight + "px";
        
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


function GetYtInfo(VideoId,_func)
{
    var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id="+VideoId+"&key="+System.GAKey;

    var xml;
    xml = new XMLHttpRequest();
    xml.open("GET",url);
    xml.setRequestHeader("Content-type","application/x-www-form-urlencoded;");

    xml.onreadystatechange = function()
    {
        if(xml.readyState==4)
        {
            if(xml.response!="")
            {
                System.XmlData = JSON.parse(xml.response);
                
                _func(System.XmlData);
            }
        }
    }
    xml.send();
}



function GetYtCommentThreads(VideoId,_func)
{
    var url = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&order=relevance&maxResults=10&videoId="+VideoId+"&key="+System.GAKey;

    var xml;
    xml = new XMLHttpRequest();
    xml.open("GET",url);
    xml.setRequestHeader("Content-type","application/x-www-form-urlencoded;");

    xml.onreadystatechange = function()
    {
        if(xml.readyState==4)
        {
            if(xml.response!="")
            {
                System.XmlData = JSON.parse(xml.response);
                
                _func(System.XmlData);
            }
        }
    }
    xml.send();
}




/*

取得IP
https://ipinfo.io/
https://ipinfo.io/?callback=callback
GOOGLE get ip address api

*/



