/*
購物車
庫存管理
定單管理
*/

var DB = firebase;
DB.initializeApp({databaseURL: "https://shen-member-default-rtdb.firebaseio.com/"});

var System = {
    "menu":{
        "Test":{"name":"測試系統"},
        "Member":{"name":"帳號管理"},
        "YT":{"name":"YouTube內嵌播放"},
        "Chat":{"name":"聊天室功能"},
        "Shop":{"name":"購物車功能"},
        "Stock":{"name":"庫存管理"},
        "Order":{"name":"定單管理"},
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
        "time":"下單時間"
    },
    "on":{
        "on":"上架",
        "off":"下架"
    },
    "order_status":{
        "ok":"交易成立",
        "count":"數量不足,交易未成立"
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
            "gt":JSON.parse("{\"GS\":\"117851722309842781944\",\"Te\":\"黃仕軒\",\"rU\":\"仕軒\",\"mS\":\"黃\",\"zJ\":\"https://lh3.googleusercontent.com/a/AATXAJyhVEEcd8ALJo3jugjlpz_GMQS5a0clatX0F6yn=s96-c\",\"Rt\":\"shen103227@gmail.com\"}")
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
        var gt = System.gapi.currentUser.get().gt;
        menu = {
            "email":{
                "span":"GOOGLE帳號",
                "disabled":"disabled",
                "value":gt.getEmail()
            },
            "name":{
                "span":"GOOGLE暱稱",
                "disabled":"disabled",
                "value":gt.getName()
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
    function _Shop(config,r = {})
    {
        DB.ref("member/"+System.gapi.currentUser.get().Aa+"/shop/").once("value",shop=>{

            shop = shop.val()||{};
            
            if(config.mode=="order")
            {
                var _order = {};
                var sold = {};

                _order.time = System.ServerTime;
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

                

                DBGetId(DB,"order/"+System.gapi.currentUser.get().Aa+"/buy/",function(sn){

                    DB.ref("order/"+System.gapi.currentUser.get().Aa+"/buy/"+sn).set(
                        _order
                    );

                });
                

                for(var sold_id in sold)
                {
                    var sold_order = sold[sold_id];
                    sold_order.buy = System.gapi.currentUser.get().gt;
                    sold_order.total_price = 0;
                    sold_order.order_status = 0;
                    for(var p_id in sold_order.product)
                    {
                        sold_order.total_price+=
                        sold_order.product[p_id].price*sold_order.product[p_id].count;
                    }

                    DBGetId(DB,"order/"+sold_id+"/sold/",function(sn){

                        DB.ref("order/"+sold_id+"/sold/"+sn).set(
                            sold[sold_id]
                        );
    
                    });
                }

                DB.ref("member/"+System.gapi.currentUser.get().Aa+"/shop/").remove();

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
                DB.ref("member/"+System.gapi.currentUser.get().Aa+"/shop/"+config.id).update(_data);

                shop[config.id] = _data;
            }
            if(config.mode=="count")
            {
                _data.count=config.count;
                DB.ref("member/"+System.gapi.currentUser.get().Aa+"/shop/"+config.id).update(_data);

                shop[config.id] = _data;
            }


            

            if(config.mode=="remove")
            {
                delete shop[config.id];
                DB.ref("member/"+System.gapi.currentUser.get().Aa+"/shop/"+config.id).remove();
            }
        

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
                                _Submit({"id":this.id,"mode":"count","count":this.value});
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
                        
                        
                        _Submit( {"id":this.id,"mode":"remove"} );
    
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
                    
                    _Submit({"mode":"order","id":""})

                }})
            );
            table.appendChild(tr);

        
            tmp.appendChild(table);

            if(document.querySelector("#shop_car")!=null)
                document.querySelector("#shop_car").remove();

            
            System.MainDiv.appendChild( OpenWindow(tmp,{"id":"shop_car","close":true}) );
            
            return;


        });
    }


    function _Submit(config)
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

            _Shop(config,r);

        });
    }

    var tmp = document.createDocumentFragment();

    tmp.appendChild( TextCr("button",{"value":"購物車內容"},{"click":function(e){

        _Shop({},{});

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
                    
                    
                    _Submit( {"id":this.id,"mode":"buy","count":document.querySelector("[id='"+this.id+"'][type=number").value} );

                }})
            );


            tr.appendChild(td);
            table.appendChild(tr);
        }
        MainDivSetTimeout();
    });

    tmp.appendChild(table);


    DB.ref("member/"+System.gapi.currentUser.get().Aa+"/shop/").once("value",shop=>{
        if(shop.val()!=null)
        {
            _Shop({},{});
        }
    });



    System.MainDiv.appendChild( tmp );
    MainDivSetTimeout();
}

function Stock()
{
    function _Submit(table,config)
    {
        if(System.gapi.isSignedIn.get()!=true)
        {
            var msg = document.createElement("div");
            msg.innerHTML = "請先登入帳號";
            System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true}) );
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
                System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true}) );
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
        _data.user = System.gapi.currentUser.get().gt;
        
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
        System.MainDiv.appendChild( OpenWindow(msg,{"id":"Alert","close":true,"close_ev":function(){MenuClick(System.now_page,"open");}}) );
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
                    TextCr("button",{"value":"送出"},{"click":function(){

                        _Submit(table,{"mode":"push"});

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

                DB.ref("product").orderByChild("user/GS").equalTo(System.gapi.currentUser.get().Aa).once("value",r=>{

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
                                    TextCr("button",{"id":this.id,"value":"修改"},{"click":function(){

                                        _Submit(table,{"mode":"update","id":this.id});

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
                                    TextCr("button",{"id":this.id,"value":"確定","xy":{"x":e.clientX,"y":e.clientY}},{"click":function(){

                                        _Submit(table,{"mode":"remove","id":this.id});

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


    DB.ref("order/"+System.gapi.currentUser.get().Aa+"/"+System.session[System.now_page]).once("value",r=>{

        r = r.val();

        for(var id in r)
        {
            var _data = r[id];
            _data.sn = id;

            tr = document.createElement("tr");
            tr.id = id;

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
                        <td>買家資訊</td>
                        <td>`+_data.buy.Rt+`</td>
                        <td>`+_data.buy.Te+`</td>
                        <td></td>
                        <td></td>
                        </tr>`;
                    }


                    td.appendChild(html);
                }


                if(k=="time")
                    td.innerHTML = DateFormat( new Date(_data[k]),false );
                
                tr.appendChild(td);
            }

            td = document.createElement("td");
            td.appendChild(
                TextCr("button",{"id":id,"value":"管理"},{"click":function(e){
                    
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




/*

取得IP
https://ipinfo.io/
https://ipinfo.io/?callback=callback
GOOGLE get ip address api

*/



