var wsServer = require('ws').Server;
var mysql  = require('mysql'); 
var net = require('net');

const HOST = '127.0.0.1';
const PORT = 10881;


var conns = new Array();
var usrid = null; //id who connect latest
var userName = null;
var userPhone = null;
var order =null;
var InfoFlag =null;
var userID = null;//id who send info
var isFstConn = null;
var uersRoomNum = null;




//----------------------function-------------------------------------------------------
var tcpClient = net.Socket();





function sendOrder(Ord,tcpClient){
  var connection = mysql.createConnection({       
  host     : '127.0.0.1',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '',        //MySQL认证用户密码
  port: '3306',                   //端口号
  database: 'Intelligent_Hotel',
}); 
  connection.connect(function(err){
    if(err){        
      console.log('[query] - :'+err);
      return;
    }
    console.log('[connection connect]  succeed!');
  });  
  var sqlqryisfstcon = 'SELECT RoomNum FROM Intelligent_Hotel.Client_tb where Name = ? and PhoneNum = ?;'
  var sqlqryisfstcon_Param = [userName,userPhone];
  connection.query(sqlqryisfstcon,sqlqryisfstcon_Param,function(err, result){
   if(err){
    console.log('[SELECT ERROR] - ',err.message);
  }else{
    console.log('point1');
    console.log(userName,userPhone)
    console.log(result);
    if(result[0]!=null){
      console.log('point2');

      uersRoomNum = result[0].RoomNum;
      console.log(uersRoomNum);
      tcpClient.write('@'+uersRoomNum+'#['+Ord+']{'+order+'}\n');
    }
  }
});
  connection.end;
}


function signIn(conn,tcpClient){
  var connection = mysql.createConnection({     
  host     : '127.0.0.1',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '',        //MySQL认证用户密码
  port: '3306',                   //端口号
  database: 'Intelligent_Hotel',
}); 
      connection.connect(function(err){//查询新插入的客户id
        if(err){        
          console.log('[query] - :'+err);
          return;
        }
        console.log('[connection connect]  succeed!');
      });  
      var sqlqryisfstcon = 'SELECT ID FROM Intelligent_Hotel.Client_tb where Name = ? and PhoneNum = ?;'
      var sqlqryisfstcon_Param = [userName,userPhone];
      connection.query(sqlqryisfstcon,sqlqryisfstcon_Param,function(err, result){
       if(err){
        console.log('[SELECT ERROR] - ',err.message);
      }else{   
       
       
       if((result[0])!=null){
        isFstConn = 'N';
      }else {
        isFstConn = 'Y';
      }
      console.log(isFstConn);
      if(isFstConn =='Y'){

        InsertNewUser();
        conn.send('first sign in ok');
      }else if(isFstConn =='N'){

        conn.send('sign already');
      }else{
        console.log('isFstConn is wrong');
      }

  //tcpClient.write(userName+'jion in\n');
  
}
});
      connection.end;
      
      
      

    }


    function getInfo(msg){
      InfoFlag = msg.substring(msg.indexOf('!')+1,msg.indexOf('@'));
      console.log(InfoFlag);
      userName = msg.substring(msg.indexOf('[')+1,msg.indexOf(']'));
      console.log(userName);
      userPhone = msg.substring(msg.indexOf('{')+1,msg.indexOf('}'));
      console.log(userPhone);
      order = msg.substring(msg.indexOf('#')+1,msg.indexOf('$'));
      console.log(order);


    }

    function qryNewuserid(){
      var connection = mysql.createConnection({     
  host     : '127.0.0.1',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '',        //MySQL认证用户密码
  port: '3306',                   //端口号
  database: 'Intelligent_Hotel',
}); 
      connection.connect(function(err){//查询新插入的客户id
        if(err){        
          console.log('[query] - :'+err);
          return;
        }
        console.log('[connection connect]  succeed!');
      });  
      var sqlqryNewuserid = 'SELECT MAX(ID) AS Id FROM Client_tb';
      connection.query(sqlqryNewuserid,function(err, result){
       if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
      }   
      
       //console.log(result[0].Id);

       usrid = result[0].Id;
       console.log(usrid);
       

       
     });
      connection.end;
    }

    function InsertNewUser(){
      var connection = mysql.createConnection({     
  host     : '127.0.0.1',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '',        //MySQL认证用户密码
  port: '3306',                   //端口号
  database: 'Intelligent_Hotel',
}); 

      connection.connect(function(err){
        if(err){        
          console.log('[query] - :'+err);
          return;
        }
        console.log('[connection connect]  succeed!');
      });  
      var sqlInsertUser = 'INSERT INTO `Intelligent_Hotel`.`Client_tb` (`Name`,PhoneNum) VALUES (?,?);';
      var sqlInsertUser_Params = [userName,userPhone];
      connection.query(sqlInsertUser,sqlInsertUser_Params,function(err,result){
       if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
       }   
       console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('INSERT ID:',result);        
       console.log('-----------------------------------------------------------------\n\n');
     });
      connection.end();

      userID= usrid;
    }
    

    

    function updateUserdata(){
      var connection = mysql.createConnection({     
  host     : '127.0.0.1',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '',        //MySQL认证用户密码
  port: '3306',                   //端口号
  database: 'Intelligent_Hotel',
}); 
      connection.connect(function(err){
        if(err){        
          console.log('[query] - :'+err);
          return;
        }
        console.log('[connection connect]  succeed!');
      });  
      var sqlupdate = 'UPDATE `Intelligent_Hotel`.`Client_tb` SET `Name`=?,PhoneNum =? WHERE `ID`=?';
      var sqlupdate_Param = [userName,userPhone,userID];
      connection.query(sqlupdate,sqlupdate_Param,function(err,result){
        if(err){
         console.log('[UPDATE ERROR] - ',err.message);
         return;
       }        
       console.log('--------------------------UPDATE----------------------------');
       console.log('UPDATE affectedRows',result.affectedRows);
       console.log('-----------------------------------------------------------------\n\n');
     });
      connection.end;
    }

//---------------------tcp client by nodejs---------------------------------------
tcpClient.connect(PORT, HOST, function(){
  console.log('connect success.');
});

tcpClient.on('data', function(data){
  var tcpData =data.toString;
  console.log('received: ', data.toString());
  if(tcpData == 'COMFIRM'){

  }
});


//--------------------ws server by nodejs------------------------------------------

wss = new wsServer({port:5566});

wss.addListener('connection',function connhandle(conn){
	console.log('some one connected:');
  



	conn.addListener('message',function(msg){
    console.log(msg);
    getInfo(msg);
    
    if(InfoFlag == 'INFORMATION'){
      
      signIn(conn,tcpClient);

      
    }else if (InfoFlag == 'ORDER') {
      console.log('turn on the light1');

      sendOrder('ORDER',tcpClient);

    }else if(InfoFlag == 'QUIT'){
      sendOrder('QUIT',tcpClient);
    }else{
      console.log('UnKnow infomation');
    }





    
    
    


  });

});


/*wss.addListener('disconnected',function disconnhandle(conn){
	console.log(conn.remoteAddress);
})*/

console.log('running.........');















