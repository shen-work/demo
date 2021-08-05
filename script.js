/*
購物車
庫存管理
定單管理
*/

var DB = firebase;
DB.initializeApp({databaseURL: "https://shen-member-default-rtdb.firebaseio.com/"});

var VueApp;

var System = {
    "menu":{
        "Test":{"name":"測試系統"},
        "Member":{"name":"帳號管理"},
        "YT":{"name":"YouTube內嵌播放"},
        "Chat":{"name":"聊天室功能"},
        "Shop":{"name":"購買商品功能"},
        "Car":{"name":"購物車功能"},
        "Stock":{"name":"庫存管理"},
        "VueStock":{"name":"庫存管理(vue.js)"},
        "Order":{"name":"定單管理"},
        "VueMenu":{"name":"vue.js"}
    },
    "now_page":"",
    "ServerTime":firebase.database.ServerValue.TIMESTAMP,
    "tmp":{},
    "member":{},
    "time":null,
    "_timer_list":{},
    "product":{
        "name":"商品名稱",
        "count":"數量",
        "price":"價錢",
        "on":"上/下架"
    },
    "order":{
        "sn":"定單編號",
        "detail":"定單內容",
        "time":"下單時間",
        "time_end":"處理時間",
        "order_status":"定單狀態"
    },
    "on":{
        "on":"上架",
        "off":"下架"
    },
    "order_status":{
        "ok":"交易成立",
        "count":"數量不足,交易未成立",
        "0":"尚未處理",
        "1":"買家已付款",
        "2":"賣家已出貨",
        "3":"已出貨",
        "4":"已到貨"
    },
    "client_id":"506821759724-fq3jm7jq7llvnp7tqui2493kupkknvvp.apps.googleusercontent.com",
    //"GAKey":"AIzaSyCEe6fZN3JCszefiJ8qLTpCn-HlCNTGjNo",
    "GAKey":"AIzaSyCUXIWD966J5JDtytCel0O5JXwMIz7GVr0"
};




window.onload = function()
{

    
    System.gapi = {};
    /*
    var _then = new Promise( (r)=>r("localhost false") );
    System.gapi._loginstatus = false;
    System.gapi._login = _then;
    System.gapi._logout = function(){alert("localhost false");}
    System.gapi._user = {};



    System.gapi = gapi.auth2.getAuthInstance();
    System.gapi._loginstatus = System.gapi.isSignedIn.get();
    System.gapi._login = System.gapi.signIn;
    System.gapi._logout = System.gapi.signOut;
    System.gapi._user = System.gapi.currentUser.get().gt;
    */
    System.gapi.isSignedIn = {"get":function(){return true;}};
    System.gapi.currentUser = {"get":function(){
        return {
            "Aa":"117851722309842781944",
            "Ts":JSON.parse("{\"GS\":\"117851722309842781944\",\"Te\":\"黃仕軒\",\"Et\":\"仕軒\",\"mS\":\"黃\",\"zJ\":\"https://lh3.googleusercontent.com/a/AATXAJyhVEEcd8ALJo3jugjlpz_GMQS5a0clatX0F6yn=s96-c\",\"RT\":\"shen103227@gmail.com\"}"),
            "getId":function(){ return "117851722309842781944"; }
        };
    }};



    DB = DB.database();

    if(location.href.indexOf("file")!=0)
    {
        gapi.load("auth2",function(){

            gapi.auth2.init({"client_id":System.client_id});
            
            System.gapi = gapi.auth2.getAuthInstance();
        });
    }
    Main();
    

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
    var list = System.menu;
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

    if(System.gapi.isSignedIn.get()==true)
    {
        var Ts = System.gapi.currentUser.get().Ts;
        menu = {
            "email":{
                "span":"GOOGLE帳號",
                "disabled":"disabled",
                "value":Ts.RT
            },
            "name":{
                "span":"GOOGLE暱稱",
                "disabled":"disabled",
                "value":Ts.Et
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
        System.gapi.signIn().then(function(r){
            
            if(r==="localhost false")
            {
                alert("localhost false");
                return;
            }

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
        System.gapi.signOut();
        
        var msg = document.createElement("div");
        msg.innerHTML = "已登出網站";
        System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"close_ev":function(){MenuClick(System.now_page,"open");}}) );
        return;
    }
}


function YT()
{
    var menu = {};
    var player = {};    


    var btn = document.createElement("input");
    btn.type = "button";

    var YTdiv = document.createElement("div");
    YTdiv.id = "YT";

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
            "html":YTdiv
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
        config.width = (YTdiv.parentElement.clientWidth>640)?640:YTdiv.parentElement.clientWidth;

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
                
                document.querySelector("#CurrentTimeSeek").value = 
                Math.floor( player.getCurrentTime() / player.getDuration() * 100 );

                document.querySelector("#Volume").value = player.getVolume();
                document.querySelector("#VolumeSpan").innerHTML = "音量："+player.getVolume();


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
            player._CurrentTime();
    
        },
        "mousedown":function(){
            clearInterval(player._CurrentTimer);
        }}) );
        tmp.appendChild( document.createElement("br") );

        tmp.appendChild( SpanCr("音量：0",{"id":"VolumeSpan"}) );
        tmp.appendChild( document.createElement("br") );
        tmp.appendChild( TextCr("range",{"id":"Volume","max":100,"min":0},{"change":function(){ 
            player.setVolume(this.value);
            document.querySelector("#VolumeSpan").innerHTML = "音量：" + this.value;
            player._CurrentTime();
        },
        "mousedown":function(){
            clearInterval(player._CurrentTimer);
        }}) );

        tmp.appendChild( document.createElement("br") );



        tmp.appendChild( TextCr("button",{"value":"播放"},{"click":function(){
            player.playVideo();
        }}) );
    
        tmp.appendChild( TextCr("button",{"value":"暫停"},{"click":function(){
            player.pauseVideo();
        }}) );

        tmp.appendChild( TextCr("button",{"value":"顯示前10則留言"},{"click":function(e){
            GetYtCommentThreads( player.getVideoData().video_id ,function(r){
                
                if(r.error!==undefined)
                {
                    var msg = document.createElement("div");
                    msg.innerHTML = "無留言訊息或直播尚未結束";
                    System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true}) );

                    return;
                }


                
                var table = document.createElement("table");
                table.className = "ListTable SongRowTable";
                
                for(var k in r.items)
                {
                    var _data = r.items[k].snippet.topLevelComment.snippet;
        
                    var tr = document.createElement("tr");
                    var td = document.createElement("td");
                    td.innerHTML =  "<span style='color:#f00;'>"+_data.authorDisplayName + "：</span><BR>" +  _data.textDisplay + "<hr>" + DateFormat(new Date(_data.publishedAt),false);;
        
                    tr.appendChild(td);
        
                    table.appendChild(tr);
                }

                System.MainDiv.appendChild( OpenWindow(table,{"id":"YtCommentThreads","close":true,"xy":{
                    "x":e.clientX,
                    "y":e.clientY
                }}) );
            });


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


function Chat()
{
    var menu = {};

    var chat_textarea = document.createElement("div");
    //TextCr("textarea",{"class":"ChatText"});
    chat_textarea.className = "ChatText";

    menu = {
        "ChatText":{
            "html":chat_textarea
        },
        "SendText":{
            "html":TextCr("textarea",{"value":""})
        },
        "SendBtn":{
            "html":TextCr("button",{"value":"發言"},{"click":function(){

                if( System.gapi._loginstatus!==true )
                {
                    var msg = document.createElement("div");
                    msg.innerHTML = `請先登入帳號才可進行發言`;
                    
                    System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true}) );
                    return;
                }


                var word = document.querySelector("#SendText").value;

                var _data = {};

                _data.word = word;
                _data.time = System.ServerTime;
                _data.member_id = System.gapi._user.GS;
                _data.name = System.gapi._user.getName();

                DB.ref("chat").push( _data );

            }})
        }
    }
    System.MainDiv.appendChild( RowMake(menu) );

    var join_chat_time = 0;

    DB.ref("chat").orderByChild("time").startAt(join_chat_time).on("value",r=>{
        join_chat_time = System.time-5000;

        var r = r.val();
        var list = [];

        for(var k in r)
        {
            var list_idx = list.length;
            var _data = r[k];
            _data.time_f = DateFormat(new Date(_data.time),false );
            _data.id = k;

            list[ list_idx ] = _data;
        }
        
        for(var k in list)
        {
            var _data = list[k];

            if( chat_textarea.querySelector("#"+_data.id)===null )
                chat_textarea.innerHTML += ContentFormat(_data);
        }

        chat_textarea.scrollTo(0,chat_textarea.scrollHeight);
    });

    function ContentFormat(_data)
    {
        var _r = "";

        _r += 
        `<div id="`+_data.id+`">
        發言姓名：<span style=color:#f00>`+_data.name+`</span><br>
        發言時間：<span style=color:#f00>`+_data.time_f+`</span><br>
        發言內容：<br>`+_data.word.replaceAll("\n","<br>")+`
        <hr></div>`;

        return _r;
    }


    MainDivSetTimeout();
}


function Shop()
{
    var tmp = document.createDocumentFragment();

    tmp.appendChild( TextCr("button",{"value":"購物車內容"},{"click":function(e){

        MenuClick("Car","open");

    }}));
    
    var table,tr,td;
    table = document.createElement("table");
    table.className = "ListTable";

    tr = document.createElement("tr");

    var top_row = JSON.parse(JSON.stringify(System.product));
    delete top_row.on;

    for(var k in top_row)
    {
        td = document.createElement("td");
        td.innerHTML = top_row[k];
        tr.appendChild(td);
    }

    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    table.appendChild(tr);

    DB.ref("product").orderByChild("on").equalTo("on").once("value",r=>{

        r = r.val();

        for(var id in r)
        {
            var _data = r[id];

            tr = document.createElement("tr");
            tr.id = id;

            for(var k in top_row)
            {
                td = document.createElement("td");
                td.innerHTML = _data[k];
                if(k=="count")
                {
                    td.innerHTML = "";
                    td.appendChild(
                        TextCr("number",{"id":id,"value":"1","style":"width:50px;"})
                    );
                }
                
                tr.appendChild(td);
            }

            td = document.createElement("td");
            td.appendChild(
                TextCr("button",{"id":id,"value":"放入購物車"},{"click":function(e){
                    
                    _ShopFunc( {"id":this.id,"mode":"buy","count":document.querySelector("[id='"+this.id+"'][type=number").value} );

                }})
            );


            tr.appendChild(td);
            table.appendChild(tr);
        }
        MainDivSetTimeout();
    });

    tmp.appendChild(table);


    System.MainDiv.appendChild( tmp );
    MainDivSetTimeout();
}

function Car()
{
    DB.ref("member/"+System.gapi.currentUser.get().getId()+"/shop/").once("value",shop=>{

        shop = shop.val()||{};
        

        var tmp = document.createDocumentFragment();

        var table,tr,td;
        table = document.createElement("table");
        table.className = "ListTable";
    
        tr = document.createElement("tr");

        var total_price = 0;
        var top_row = JSON.parse(JSON.stringify(System.product));
        top_row.price_total = "單品項總價";
        delete top_row.on;
    
        for(var k in top_row)
        {
            td = document.createElement("td");
            td.innerHTML = top_row[k];
            tr.appendChild(td);
        }
    
        td = document.createElement("td");
        td.innerHTML = "";
        tr.appendChild(td);
        table.appendChild(tr);
    
        
        for(var id in shop)
        {
            var _data = shop[id];

            tr = document.createElement("tr");
            tr.id = id;

            
            for(var k in top_row)
            {    
                td = document.createElement("td");

                
                td.innerHTML = _data.product[k];

                if(k=="count")
                {
                    td.innerHTML = "";
                    td.appendChild(
                        TextCr("number",{"id":id,"value":_data.count,"style":"width:50px;"},{"change":function(){
                            _ShopFunc({"id":this.id,"mode":"count","count":this.value});
                        }})
                    );
                }

                if(k=="price")
                    td.innerHTML = _data.product.price;

                if(k=="price_total")
                    td.innerHTML = _data.count * _data.product.price;

                tr.appendChild(td);
            }

            total_price+=_data.count * _data.product.price;

            td = document.createElement("td");
            td.appendChild(
                TextCr("button",{"id":id,"value":"移出購物車"},{"click":function(e){
                    
                    
                    _ShopFunc( {"id":this.id,"mode":"remove"} );

                }})
            );


            tr.appendChild(td);
            table.appendChild(tr);
        }
        tr = document.createElement("tr");

        tr.innerHTML = `
        <td></td>
        <td></td>
        <td>總價</td>
        <td>`+total_price+`</td>
        <td></td>
        `;
        tr.querySelectorAll("td")[4].appendChild(

            TextCr("button",{"value":"結帳"},{"click":function(){
                
                _ShopFunc({"mode":"order","id":""})

            }})
        );
        table.appendChild(tr);

    
        tmp.appendChild(table);

        
        System.MainDiv.appendChild( tmp );
        MainDivSetTimeout();
    });
}


function Stock()
{
    function _Submit(table,config,e)
    {
        if(System.gapi.isSignedIn.get()!=true)
        {
            var msg = document.createElement("div");
            msg.innerHTML = "請先登入帳號";
            System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"xy":{"x":e.clientX,"y":e.clientY}}) );
            return;
        }


        var input = table.querySelectorAll("input:not([type=button])");

        var _data = {};

        for(var i=0;i<input.length;i++)
        {
            if(input[i].value=="")
            {
                var msg = document.createElement("div");
                msg.innerHTML = "欄位不可空白";
                System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"xy":{"x":e.clientX,"y":e.clientY}}) );
                return;
            }

            if(input[i].id=="on")
            {
                if( input[i].checked==true )
                _data[ input[i].id ] = input[i].value;
            }
            else
            {
                _data[ input[i].id ] = input[i].value;
            }
        }

        _data.time = System.ServerTime;
        _data.user = System.gapi.currentUser.get().getId();
        
        var word;
        if(config.mode=="push")
        {
            DB.ref("product").push(_data);
            word = "新增完成";
        }

        if(config.mode=="update")
        {
            DB.ref("product/"+config.id).update(_data);
            word = "編輯完成";
        }

        if(config.mode=="remove")
        {
            DB.ref("product/"+config.id).remove();
            word = "刪除完成";
        }


        var msg = document.createElement("div");
        msg.innerHTML = word;
        System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"close_ev":function(){MenuClick(System.now_page,"open");},"xy":{"x":e.clientX,"y":e.clientY}}) );
        return;
    }

    function _Detail(data = {})
    {
        var table = document.createElement("table");
        table.className = "ListTable";

        for(var k in System.product)
        {        
            var tr = document.createElement("tr");

            var td = document.createElement("td");
            td.innerHTML = System.product[k];
            tr.appendChild(td);

            td = document.createElement("td");
            var obj = TextCr("text",{"id":k,"value":data[k]||""});
            if(k!="name")
            {
                obj = TextCr("number",{"id":k,"value":data[k]||"0"});
            }

            if(k=="on") 
            {
                obj = document.createDocumentFragment();
                obj.appendChild( TextCr("radio",{"name":k,"id":k,"value":"on"}) );
                obj.appendChild( SpanCr("上架") );
                obj.appendChild( TextCr("radio",{"name":k,"id":k,"value":"off"}) );
                obj.appendChild( SpanCr("下架") );
            }
            td.appendChild( obj );
            
            tr.appendChild(td);

            table.appendChild(tr);
        }
        
        table.querySelector("[name='on'][value='"+(data.on||"off")+"']").checked = true

        return table;
    }


    var menu = {
        "new_product_btn":{
            "html":TextCr("button",{"value":"新增商品"},{"click":function(e){

                
                var tmp = document.createDocumentFragment();

                var table = _Detail()
                tmp.appendChild( table );


                tmp.appendChild( 
                    TextCr("button",{"value":"送出"},{"click":function(e){

                        _Submit(table,{"mode":"push"},e);

                    }}) 
                );

                

                System.MainDiv.appendChild( OpenWindow(tmp,{"id":"new_product","close":true,"xy":{
                    "x":e.clientX,
                    "y":e.clientY
                }}) );

            }})
        },
        "product_list":{
            "html":(function(){

                var tmp = document.createDocumentFragment();
                var table,tr,td;

                table = document.createElement("table");
                table.className = "ListTable";


                tr = document.createElement("tr");

                for(var k in System.product)
                {
                    td = document.createElement("td");
                    td.innerHTML = System.product[k];
                    tr.appendChild(td);
                }

                td = document.createElement("td");
                td.innerHTML = "管理";
                tr.appendChild(td);
                table.appendChild(tr);

                DB.ref("product").orderByChild("user/GS").equalTo(System.gapi.currentUser.get().getId()).once("value",r=>{

                    r = r.val();

                    for(var id in r)
                    {
                        var _data = r[id];

                        tr = document.createElement("tr");
                        tr.id = id;

                        for(var k in System.product)
                        {
                            td = document.createElement("td");
                            td.innerHTML = _data[k];
                            if(k=="on")
                                td.innerHTML = System.on[_data[k]];
                            tr.appendChild(td);
                        }

                        td = document.createElement("td");
                        td.appendChild(
                            TextCr("button",{"id":id,"value":"管理"},{"click":function(e){
                                
                                var tmp = document.createDocumentFragment();

                                var table = _Detail( r[this.id] );
                                tmp.appendChild( table );

                                tmp.appendChild(
                                    TextCr("button",{"id":this.id,"value":"修改"},{"click":function(e){
                                        _Submit(table,{"mode":"update","id":this.id},e);

                                    }}) 
                                );

                                System.MainDiv.appendChild( OpenWindow(tmp,{"id":"new_product","close":true,"xy":{
                                    "x":e.clientX,
                                    "y":e.clientY
                                }}) );
                                

                            }})
                        );
                        td.appendChild(
                            TextCr("button",{"value":"刪除","id":id},{"click":function(e){
                                
                                var msg = document.createElement("div");
                                msg.innerHTML = "確定要刪除該商品嗎";

                                msg.appendChild( 
                                    document.createElement("br")
                                );
                                msg.appendChild(
                                    TextCr("button",{"id":this.id,"value":"確定","xy":{"x":e.clientX,"y":e.clientY}},{"click":function(e){

                                        _Submit(table,{"mode":"remove","id":this.id},e);

                                    }}) 
                                );

                                msg.appendChild(
                                    TextCr("button",{"id":this.id,"value":"取消","xy":{"x":e.clientX,"y":e.clientY}},{"click":function(){
                                        msg.parentElement.remove();
                                    }}) 
                                );

                                System.MainDiv.appendChild( OpenWindow(msg,{"id":"Confirm","xy":{"x":e.clientX,"y":e.clientY}}) );
                                return;

                            }})
                        );


                        tr.appendChild(td);
                        table.appendChild(tr);
                    }
                    MainDivSetTimeout();
                });

                tmp.appendChild(table);
                
                return tmp;
                
            })()
        }
    };


    System.MainDiv.appendChild( RowMake(menu) );
    MainDivSetTimeout();
}


function Order()
{
    System.session[System.now_page] = 
    System.session[System.now_page]||"buy";

    var tmp = document.createDocumentFragment();

    tmp.appendChild( TextCr("button",{"value":"買家定單"},{"click":function(e){
        System.session[System.now_page] = "buy";
        sessionStorage.shen = JSON.stringify(System.session);
        MenuClick(System.now_page,"open");
    }}));

    tmp.appendChild( TextCr("button",{"value":"賣家定單"},{"click":function(e){
        System.session[System.now_page] = "sold";
        sessionStorage.shen = JSON.stringify(System.session);
        MenuClick(System.now_page,"open");
    }}));

    var table,tr,td;
    table = document.createElement("table");
    table.className = "ListTable";

    tr = document.createElement("tr");

    var top_row = JSON.parse(JSON.stringify(System.order));
    delete top_row.on;

    for(var k in top_row)
    {
        td = document.createElement("td");
        td.innerHTML = top_row[k];
        tr.appendChild(td);
    }

    
    td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
    table.appendChild(tr);
    

    DB.ref("order/"+System.gapi.currentUser.get().getId()+"/"+System.session[System.now_page]).orderByKey().once("value",r=>{

        r = r.val();

        for(var id in r){r[id].sn = id;}

        r = Sort(r,["time desc"]);

        for(var id in r)
        {
            var _data = r[id];

            tr = document.createElement("tr");
            tr.id = _data.sn;

            for(var k in top_row)
            {
                td = document.createElement("td");
                td.innerHTML = _data[k]||"";

                if(k=="detail")
                {
                    td.innerHTML = "";
                    
                    var html = document.createElement("table");
                    html.className = "ListTable";
                    html.innerHTML = `
                    <tr>
                    <td>商品</td>
                    <td>數量</td>
                    <td>單價</td>
                    <td>小計</td>
                    <td>狀態</td>
                    </tr>`;

                    

                    for(var p_id in _data.product)
                    {
                        var product_info = _data.product[p_id];
                        if(product_info.name==undefined)
                        {
                            product_info = product_info.product;
                            product_info.count = _data.product[p_id].count;
                        }

                        html.innerHTML += `
                        <tr class="`+product_info.product_status+`">
                        <td>`+product_info.name+`</td>
                        <td>`+product_info.count+`</td>
                        <td>`+product_info.price+`</td>
                        <td>`+product_info.count*product_info.price+`</td>
                        <td>`+System.order_status[product_info.product_status]+`</td>
                        </tr>`;
                    }

                    html.innerHTML += `
                    <tr>
                    <td></td>
                    <td></td>
                    <td>總計</td>
                    <td>`+_data.total_price+`</td>
                    <td></td>
                    </tr>`;

                    if(System.session[System.now_page]=="sold")
                    {
                        html.innerHTML += `
                        <tr>
                        <td>買家資訊<BR>`+_data.buy.Rt+`<BR>`+_data.buy.Te+`</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>`;
                    }


                    td.appendChild(html);
                }


                if(k=="time" || k=="time_end")
                    td.innerHTML = DateFormat( new Date(_data[k]),"<BR>" );

                if(k=="order_status")
                    td.innerHTML = System.order_status[_data[k]];
                
                tr.appendChild(td);
            }
            if(System.session[System.now_page]=="buy")
            {
                td = document.createElement("td");
                td.appendChild(
                    TextCr("button",{"id":_data.sn,"value":"金流結帳" },{"click":function(e){

                        var _data;
                        for(var k in r)
                        {
                            if(r[k].sn==this.id)
                            {
                                _data = r[k];
                                var sn = new Date().getTime().toString().substr(2);
                                _data.sn = sn;
                                _data.id = sn;
                                DB.ref("order/"+System.gapi.currentUser.get().getId()+"/"+System.session[System.now_page]+"/"+this.id).remove();

                                DB.ref("order/"+System.gapi.currentUser.get().getId()+"/"+System.session[System.now_page]+"/"+sn).set(_data);
                            }
                        }

                        _data.product_word = "";
                        for(var p_id in _data.product)
                        {
                            if(_data.product[p_id].product_status=="ok")
                            _data.product_word += "#"+_data.product[p_id].name + " 數量： " + _data.product[p_id].count;
                        }


                        ECPapi(_data);
                        
                        MenuClick(System.now_page,"open");
                    }})
                );
                tr.appendChild(td);
            }
            else if(System.session[System.now_page]=="sold")
            {
                td = document.createElement("td");
                td.appendChild(
                    TextCr("button",{"id":_data.sn,"value":"管理" },{"click":function(e){

                        var OrderStatus = document.createDocumentFragment();
                        var select = document.createElement("select");

                        for(var k in System.order_status)
                        {
                            if( isNaN(parseInt(k)) ) continue;

                            select.innerHTML += '<option value="'+k+'">'+System.order_status[k]+'</option>';
                        }

                        OrderStatus.appendChild(select);
                        OrderStatus.appendChild( document.createElement("br") );
                        OrderStatus.appendChild( 
                            TextCr("button",{"id":this.id,"value":"修改狀態"},{"click":function(){
                                var _order = {};
                                for(var k in r) if(r[k].id==this.id) _order = r[k];
                                
                                for(var p in _order.product)
                                {
                                    _order.product[p].product_status = select.value;
                                }

                                var upd = _order;
                                upd.order_status = select.value;
                                upd.time_end = System.ServerTime;
                                DB.ref("order/"+System.gapi.currentUser.get().getId()+"/sold/"+_order.sn).update(upd);

                                DB.ref("order/"+_order.buy.GS+"/buy/"+_order.buy_sn).once("value",_buy=>{
                                    _buy = _buy.val();
                                    for(var k in _order.product)
                                    for(var k2 in _buy.product)
                                    {
                                        if(k==k2 && _buy.product[k2].product_status!="count")
                                        {
                                            DB.ref("order/"+_order.buy.GS+"/buy/"+_order.buy_sn+"/product/"+k2+"/product_status").set(select.value);

                                            DB.ref("order/"+_order.buy.GS+"/buy/"+_order.buy_sn+"/time_end").set(System.ServerTime);

                                            DB.ref("order/"+_order.buy.GS+"/buy/"+_order.buy_sn+"/order_status").set(select.value);
                                        }
                                    }
                                });


                                MenuClick(System.now_page,"open");
                            }})
                        );
                        OrderStatus.appendChild( document.createElement("br") );
                        
                        System.MainDiv.appendChild( OpenWindow(OrderStatus,{"id":"OrderStatus","close":true,"xy":{
                            "x":e.clientX,
                            "y":e.clientY
                        }}) );


                    }})
                );
                tr.appendChild(td);
            }
            
            table.appendChild(tr);
        }
        MainDivSetTimeout();
    });

    tmp.appendChild(table);



    System.MainDiv.appendChild( tmp );
    MainDivSetTimeout();
}





function PaymentFlow()
{
    
    System.MainDiv.appendChild( ECPapi() );
    MainDivSetTimeout();
}


function VueStock()
{
    DB.ref("product").orderByChild("user/GS").equalTo(System.gapi.currentUser.get().getId()).once("value",r=>{

        r = r.val();
        var list = {};

        for(var id in r)
        {
            list[id] = r[id];
        }


        var title = JSON.parse(JSON.stringify(System.product));
        title[ "menu" ] = "管理";

        VueApp = Vue.createApp( 
            {
                data(){
                    return {
                        "title":title,
                        "list":list
                    }
                }
            }
        );

        var methods_list = {
            New(e){
                var tmp = document.createDocumentFragment();

                var table = this.Detail();
                tmp.appendChild( table );

                var Submit_func = this.Submit;

                tmp.appendChild(
                    TextCr("button",{"id":e.target.id,"value":"送出"},{"click":function(e){
                        Submit_func(table,{"mode":"push"},e);
                    }}) 
                );

                System.MainDiv.appendChild( OpenWindow(tmp,{"id":"new_product","close":true,"xy":{
                    "x":e.clientX,
                    "y":e.clientY
                }}) );
            },
            Menu(e){

                var tmp = document.createDocumentFragment();

                var table = this.Detail( list[e.target.id] );
                tmp.appendChild( table );

                var Submit_func = this.Submit;

                tmp.appendChild(
                    TextCr("button",{"id":e.target.id,"value":"修改"},{"click":function(e){
                        Submit_func(table,{"mode":"update","id":this.id},e);
                    }}) 
                );

                System.MainDiv.appendChild( OpenWindow(tmp,{"id":"new_product","close":true,"xy":{
                    "x":e.clientX,
                    "y":e.clientY
                }}) );
            },
            Del(e){

                var msg = document.createElement("div");
                msg.innerHTML = "確定要刪除該商品嗎";

                msg.appendChild( 
                    document.createElement("br")
                );

                var Submit_func = this.Submit;

                msg.appendChild(
                    TextCr("button",{"id":e.target.id,"value":"確定","xy":{"x":e.clientX,"y":e.clientY}},{"click":function(e){

                        Submit_func( msg ,{"mode":"remove","id":this.id},e);

                    }}) 
                );

                msg.appendChild(
                    TextCr("button",{"id":this.id,"value":"取消","xy":{"x":e.clientX,"y":e.clientY}},{"click":function(){
                        msg.parentElement.remove();
                    }}) 
                );

                System.MainDiv.appendChild( OpenWindow(msg,{"id":"Confirm","xy":{"x":e.clientX,"y":e.clientY}}) );

            },
            Submit(table,config,e){

                if(System.gapi.isSignedIn.get()!=true)
                {
                    var msg = document.createElement("div");
                    msg.innerHTML = "請先登入帳號";
                    System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"xy":{"x":e.clientX,"y":e.clientY}}) );
                    return;
                }

                var input = table.querySelectorAll("input:not([type=button])");

                var _data = {};

                for(var i=0;i<input.length;i++)
                {
                    if(input[i].value=="")
                    {
                        var msg = document.createElement("div");
                        msg.innerHTML = "欄位不可空白";
                        System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"xy":{"x":e.clientX,"y":e.clientY}}) );
                        return;
                    }

                    if(input[i].id=="on")
                    {
                        if( input[i].checked==true )
                        _data[ input[i].id ] = input[i].value;
                    }
                    else
                    {
                        _data[ input[i].id ] = input[i].value;
                    }
                }

                _data.time = System.ServerTime;
                _data.user = System.gapi.currentUser.get().getId();//System.gapi.currentUser.get().gt;
                
                if(config.id!==undefined)
                VueApp.$data.list[config.id] = _data;


                if(config.mode=="push")
                {


                    DB.ref("product").push(_data).then(function(r){

                        VueApp.$data.list[r.key] = _data;
                        MainDivSetTimeout();
                    });
                }

                if(config.mode=="update")
                {
                    DB.ref("product/"+config.id).update(_data);
                }

                if(config.mode=="remove")
                {
                    DB.ref("product/"+config.id).remove();

                    delete VueApp.$data.list[config.id];
                }

                
                
                table.parentElement.remove();


                MainDivSetTimeout();
                return;



            },
            Detail(data = {})
            {
                var table = document.createElement("table");
                table.className = "ListTable";

                for(var k in System.product)
                {        
                    var tr = document.createElement("tr");

                    var td = document.createElement("td");
                    td.innerHTML = System.product[k];
                    tr.appendChild(td);

                    td = document.createElement("td");
                    var obj = TextCr("text",{"id":k,"value":data[k]||""});
                    if(k!="name")
                    {
                        obj = TextCr("number",{"id":k,"value":data[k]||"0"});
                    }

                    if(k=="on") 
                    {
                        obj = document.createDocumentFragment();
                        obj.appendChild( TextCr("radio",{"name":k,"id":k,"value":"on"}) );
                        obj.appendChild( SpanCr("上架") );
                        obj.appendChild( TextCr("radio",{"name":k,"id":k,"value":"off"}) );
                        obj.appendChild( SpanCr("下架") );
                    }
                    td.appendChild( obj );
                    
                    tr.appendChild(td);

                    table.appendChild(tr);
                }
                
                table.querySelector("[name='on'][value='"+(data.on||"off")+"']").checked = true

                return table;
            }
        }

        
        VueApp.component("table_component",{
            data(){
                return {
                    "title":title,
                    "list":list
                }
            },
            methods:methods_list,
            template:`<table class="ListTable">
            <tr>
            <td v-for="(data,idx) in title">{{data}}</td>
            </tr>

            <tr v-for="(data,idx) in list">
            <td>{{data.name}}</td>
            <td>{{data.count}}</td>
            <td>{{data.price}}</td>
            <td>{{data.on=='on'?"上架":"下架"}}</td>
            <td>
            <input type="button" value="管理" :id="idx" v-on:click="Menu($event)">
            <input type="button" value="刪除" :id="idx" v-on:click="Del($event)">
            </td>
            </tr>
            </table>`
        });



        VueApp.component("btn_component",{
            data(){
                return {
                    "title":title,
                    "list":list
                }
            },
            methods:methods_list,
            template:`<input type="button" value="新增商品" @click="New($event)">`
        });


        VueApp = VueApp.mount("#Main");

        MainDivSetTimeout();
    });


    System.MainDiv.appendChild( document.createElement("btn_component") );    
    System.MainDiv.appendChild( document.createElement("table_component") );

    MainDivSetTimeout();
}




function VueMenu()
{
    var vue_div = document.createElement("div");
    vue_div.id = "v_div";
    
    var btn = document.createElement("input");
    btn.type = "button";
    
    btn.setAttribute("v-on:click.once","click('click',$event)");
    btn.setAttribute("v-bind:value","btn.value");
    btn.setAttribute("v-bind:class","{VueStyle:true,Style2:control.style2}");


    var text = document.createElement("input");
    text.type = "text";


    text.setAttribute("v-bind:value","check");
    text.setAttribute("v-if","control.display");
    text.setAttribute("v-on:focus","focus");




    var if_btn = document.createElement("input");
    if_btn.type = "button";
    if_btn.value = "if";
    if_btn.setAttribute("v-if","control.if");

    var else_btn = document.createElement("input");
    else_btn.type = "button";
    else_btn.value = "else";
    else_btn.setAttribute("v-else","");

    var for_div = document.createElement("div");
    for_div.setAttribute("v-for","(data,idx) in list");
    for_div.setAttribute("v-bind:id","idx");
    for_div.innerHTML = "{{idx}} => {{data.content}}";



    vue_div.innerHTML = "{{false ? $data.btn.value:`test`}}";
    vue_div.innerHTML = "{{true ? $data.btn.value:`test`}}";
    vue_div.appendChild(btn);
    vue_div.appendChild(text);

    vue_div.appendChild(if_btn);
    vue_div.appendChild(else_btn);

    vue_div.appendChild(for_div);




    System.MainDiv.appendChild( vue_div );
    MainDivSetTimeout();

    VueApp = Vue.createApp({
        data() {
          return {
              "btn":{
                  "value":"CLICK"
              },
              "text":{
                  "value":"text"
              },
              "list":{
                "a":{"content":"內容A","id":"a_0"},
                "b":{"content":"內容B","id":"b_1"},
                "c":{"content":"內容C","id":"c_2"},
              },
              "control":{
                  "display":true,
                  "style2":false,
                  "if":true
              }
          }
        },
        computed:{
            check(){
                return this.$data.text.value
            }
        },
        watch:{

        },
        methods:{
            click(act,e){
                console.log(act);
                console.log(e);
                console.log(this.$data);
            },
            focus(e){
                console.log(e);
                console.log(this);
            }
        }
      });

      VueApp = VueApp.mount('#v_div');

      



}





/*===================================*/

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
    LeftZero(parseInt(new Date(timestamp).getMonth()+1),2,0) + "/" + 
    LeftZero(new Date(timestamp).getDate(),2,0);

    if(time===true) tmp = "";
    if(time===false) tmp += " ";
    if(time==="<BR>") tmp += "<BR>"
    

    tmp += hms.split(":")[0] + ":" 
        + hms.split(":")[1] + ":" 
        + hms.split(":")[2];


    return tmp;
}

function LeftZero(val,num,str)
{
    while(val.toString().length<num)
    {
        val = str.toString() + val.toString();
    }
    return val;
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

        func(id);
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


function _ShopFunc(config)
{
    if(System.gapi.isSignedIn.get()!=true)
    {
        var msg = document.createElement("div");
        msg.innerHTML = "請先登入帳號";
        System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true}) );
        return;
    }

    DB.ref("product/"+config.id).once("value",r=>{
        r = r.val();

        DB.ref("member/"+System.gapi.currentUser.get().getId()+"/shop/").once("value",shop=>{

            shop = shop.val()||{};
            
            if(config.mode=="order")
            {
                var _order = {};
                var sold = {};
                var sn;

                _order.time = System.ServerTime;
                _order.time_end = System.ServerTime;
                _order.product = {};
                _order.total_price = 0;
                _order.order_status = 0;


                for(var k in shop)
                {
                    var pro = shop[k].product;
                    _order.product[ k ] = pro;

                    if( r[k].count*1 >= shop[k].count*1 )
                    {
                        pro.product_status = "ok";

                        _order.total_price+=shop[k].count*pro.price;

                        sold[ pro.user.GS ] = sold[ pro.user.GS ]||{
                            "product":{},
                            "time":System.ServerTime
                        };

                        pro.count = shop[k].count
                        sold[ pro.user.GS ].product[ k ] = pro;

                        DB.ref("product/"+k+"/count").set(r[k].count-shop[k].count);
                    }
                    else
                    {
                        pro.product_status = "count";
                    }
                }

                
                sn = new Date().getTime().toString().substr(2);

                //DBGetId(DB,"order/"+System.gapi.currentUser.get().Aa+"/buy/",function(sn){

                    DB.ref("order/"+System.gapi.currentUser.get().getId()+"/buy/"+sn).set(
                        _order
                    );

                    for(var sold_id in sold)
                    {
                        var sold_order = sold[sold_id];
                        sold_order.buy = System.gapi.currentUser.get().getId();
                        sold_order.total_price = 0;
                        sold_order.order_status = 0;
                        sold_order.buy_sn = sn;
                        for(var p_id in sold_order.product)
                        {
                            sold_order.total_price+=
                            sold_order.product[p_id].price*sold_order.product[p_id].count;
                        }
    

                        //sn = new Date().getTime().toString().substr(2);
                        
                        DBGetId(DB,"order/"+sold_id+"/sold/",function(sn){
    
                            DB.ref("order/"+sold_id+"/sold/"+sn).set(
                                sold[sold_id]
                            );
    
                        });
                    }
                //});
                

                

                DB.ref("member/"+System.gapi.currentUser.get().getId()+"/shop/").remove();

                var msg = document.createElement("div");
                msg.innerHTML = "結帳成功，請至定單管理確認結果";
                System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"close_ev":function(){MenuClick("Order","open");}}) );

                return;
            }



            _data = {};
            _data.time = System.ServerTime;
            _data.product = r;
            _data.count = config.count;
            
            if(config.mode=="buy")
            {
                if( Object.keys(shop).indexOf(config.id)!=-1)
                {
                    _data = shop[config.id];
                    _data.count-=-1*config.count;
                }
                DB.ref("member/"+System.gapi.currentUser.get().getId()+"/shop/"+config.id).update(_data);

                shop[config.id] = _data;
            }
            if(config.mode=="count")
            {
                _data.count=config.count;
                DB.ref("member/"+System.gapi.currentUser.get().getId()+"/shop/"+config.id).update(_data);

                shop[config.id] = _data;
            }


            if(config.mode=="remove")
            {
                delete shop[config.id];
                DB.ref("member/"+System.gapi.currentUser.get().getId()+"/shop/"+config.id).remove();
            }
            MenuClick("Car","open");
            return;
        });
    });
}


//desc 由大到小321 無desc 由小到大123
function Sort(JsonData,row,opt = {})
{
    JsonData = JSON.parse(JSON.stringify(JsonData));
    var list = [];
    for(var k in JsonData)
    {
        var idx = list.length;
        list[idx] = JsonData[k];
        list[idx].id = k;
    }

    row = row["0"];
    var desc = row.split(" ")[1];
    row = row.split(" ")[0].split("/");
    
    list.sort(function(a,b){

        var one = a;
        var two = b;
        
        if(desc==="desc")
        {
            one = b;
            two = a;
        }

        for(var i=0;i<row.length;i++) 
        {
            one = one[row[i]]||{};
            two = two[row[i]]||{};
        }

        if(opt.object_keys=="1")
        {
            one = Object.keys(one||{}).length;
            two = Object.keys(two||{}).length;
        }
        
        return one - two;
    });
    


    return list;
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
    var url = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=10&videoId="+VideoId+"&key="+System.GAKey;//&order=relevance

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


var ApiRow = {};
function ECPapi(order)
{
    var TradeNo = order.sn;//"s"+System.time
    var TradeDate = DateFormat(new Date(System.time));
    
    ApiRow = {
        "MerchantID":"2000132",
        "MerchantTradeNo":TradeNo,//定單編號 不可重覆
        "MerchantTradeDate":TradeDate,//2012/03/21 15:40:18
        "PaymentType":"aio",
        "TotalAmount":order.total_price,//金額
        "TradeDesc":"交易敘述",//交易敘述
        "ItemName":order.product_word,
        "ReturnURL":"https://shen-work.github.io/demo/ecp.html",//收到 Server 端付款結果通知後，請正確回應 1|OK。
        "ChoosePayment":"ALL",//
        "CheckMacValue":"",//sha256加密
        "EncryptType":"1"
    };

    
    var PrintRow = {
        //"ItemName":"商品名稱",
        //"TotalAmount":"商品價錢"
    }
    

    var HashKey = "5294y06JbISpM5x9";
    var HashIV = "v77hoKGq4kWxNNIS";


    ApiRow.CheckMacValue = 
    "HashKey="+HashKey+
    "&ChoosePayment="+ApiRow.ChoosePayment+
    "&EncryptType="+ApiRow.EncryptType+
    "&ItemName="+ApiRow.ItemName+
    "&MerchantID="+ApiRow.MerchantID+
    "&MerchantTradeDate="+TradeDate+
    "&MerchantTradeNo="+TradeNo+
    "&PaymentType="+ApiRow.PaymentType+
    "&ReturnURL="+ApiRow.ReturnURL+
    "&TotalAmount="+ApiRow.TotalAmount+
    "&TradeDesc="+ApiRow.TradeDesc+
    "&HashIV="+HashIV;
    
    
    ApiRow.CheckMacValue = sha256(NetUrlEncode(encodeURIComponent(ApiRow.CheckMacValue)).toLowerCase()).toUpperCase();

    

    var form = document.createElement("form");
    form.action = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
    form.enctype = "application/x-www-form-urlencoded";
    form.method = "POST";
    form.target = "_blank";

    for(var k in ApiRow)
    {
        if(PrintRow[k]!=undefined)
        {
            form.appendChild( SpanCr(PrintRow[k]) );
            form.appendChild( TextCr("text",{"name":k,"value":ApiRow[k]},{"change":function(){
                ApiRow[this.name] = this.value;
            }}) );
        }
        else
        {
            form.appendChild( TextCr("hidden",{"name":k,"value":ApiRow[k]}) );
        }
        form.appendChild( document.createElement("p") );
    }

    form.appendChild( TextCr("button",{"value":"送出定單"},{"click":function(){

        ApiRow.CheckMacValue = 
        "HashKey="+HashKey+
        "&ChoosePayment="+ApiRow.ChoosePayment+
        "&EncryptType="+ApiRow.EncryptType+
        "&ItemName="+ApiRow.ItemName+
        "&MerchantID="+ApiRow.MerchantID+
        "&MerchantTradeDate="+TradeDate+
        "&MerchantTradeNo="+TradeNo+
        "&PaymentType="+ApiRow.PaymentType+
        "&ReturnURL="+ApiRow.ReturnURL+
        "&TotalAmount="+ApiRow.TotalAmount+
        "&TradeDesc="+ApiRow.TradeDesc+
        "&HashIV="+HashIV;
        
        
        ApiRow.CheckMacValue = sha256(NetUrlEncode(encodeURIComponent(ApiRow.CheckMacValue)).toLowerCase()).toUpperCase();

        form.querySelector("[name=CheckMacValue]").value = ApiRow.CheckMacValue;


        form.submit();
    }}));

    System.MainDiv.appendChild( form );

    form.submit();
    form.remove();
    
    //return form;
}


function NetUrlEncode(url)
{
    return url.replaceAll("%20","+");
}



var sha256=function a(b){function c(a,b){return a>>>b|a<<32-b}for(var d,e,f=Math.pow,g=f(2,32),h="length",i="",j=[],k=8*b[h],l=a.h=a.h||[],m=a.k=a.k||[],n=m[h],o={},p=2;64>n;p++)if(!o[p]){for(d=0;313>d;d+=p)o[d]=p;l[n]=f(p,.5)*g|0,m[n++]=f(p,1/3)*g|0}for(b+="\x80";b[h]%64-56;)b+="\x00";for(d=0;d<b[h];d++){if(e=b.charCodeAt(d),e>>8)return;j[d>>2]|=e<<(3-d)%4*8}for(j[j[h]]=k/g|0,j[j[h]]=k,e=0;e<j[h];){var q=j.slice(e,e+=16),r=l;for(l=l.slice(0,8),d=0;64>d;d++){var s=q[d-15],t=q[d-2],u=l[0],v=l[4],w=l[7]+(c(v,6)^c(v,11)^c(v,25))+(v&l[5]^~v&l[6])+m[d]+(q[d]=16>d?q[d]:q[d-16]+(c(s,7)^c(s,18)^s>>>3)+q[d-7]+(c(t,17)^c(t,19)^t>>>10)|0),x=(c(u,2)^c(u,13)^c(u,22))+(u&l[1]^u&l[2]^l[1]&l[2]);l=[w+x|0].concat(l),l[4]=l[4]+w|0}for(d=0;8>d;d++)l[d]=l[d]+r[d]|0}for(d=0;8>d;d++)for(e=3;e+1;e--){var y=l[d]>>8*e&255;i+=(16>y?0:"")+y.toString(16)}return i};


/*

取得IP
https://ipinfo.io/
https://ipinfo.io/?callback=callback
GOOGLE get ip address api

*/



