const http = require('node:http');
const WebSocket = require('ws');
const {cleanName, createMessage, safePayload} = require('./chat-core');
const PORT = Number(process.env.PORT || 3001);
const server = http.createServer((req,res)=>{
  res.writeHead(200, {'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*'});
  res.end(JSON.stringify({app:'ChatOnline WebSocket Server',status:'running',clients:wss.clients.size}));
});
const wss = new WebSocket.Server({server, maxPayload:4096});
const peers = new Map();
function send(ws, data){if(ws.readyState===WebSocket.OPEN) ws.send(JSON.stringify(data));}
function broadcast(data, except=null){for(const client of wss.clients) if(client!==except) send(client,data);}
function publishUsers(){
  const users=[...peers.entries()].map(([ws,p])=>({name:p.name,online:ws.readyState===WebSocket.OPEN}));
  broadcast({type:'users',users});
}
function system(text){broadcast({type:'system',message:{id:`sys-${Date.now()}-${Math.random()}`,type:'system',text,time:Date.now()}});}
wss.on('connection',(ws)=>{
  peers.set(ws,{name:''});
  ws.on('message',(buffer)=>{
    let data;
    try {data=safePayload(buffer.toString());}
    catch(err){send(ws,{type:'error',message:err.message||'Gói tin không hợp lệ.'});return;}
    const peer=peers.get(ws);
    if(data.type==='join'){
      const name=cleanName(data.name);
      if(name.length<2){send(ws,{type:'error',message:'Tên hiển thị cần ít nhất 2 ký tự.'});return;}
      const duplicate=[...peers.entries()].some(([other,p])=>other!==ws&&p.name.toLowerCase()===name.toLowerCase());
      if(duplicate){send(ws,{type:'error',message:'Tên này đang được sử dụng. Hãy chọn tên khác.'});ws.close(1008,'duplicate name');return;}
      peer.name=name;
      send(ws,{type:'users',users:[...peers.values()].filter(p=>p.name).map(p=>({name:p.name,online:true}))});
      broadcast({type:'users',users:[...peers.values()].filter(p=>p.name).map(p=>({name:p.name,online:true}))});
      system(`${name} đã tham gia phòng chat.`);
      return;
    }
    if(!peer?.name){send(ws,{type:'error',message:'Vui lòng tham gia trước khi gửi tin nhắn.'});return;}
    if(data.type==='message'){
      try {const message=createMessage({from:peer.name,text:data.text,room:'general'});broadcast({type:'message',message});}
      catch(err){send(ws,{type:'error',message:err.message});}
    } else if(data.type==='direct'){
      const recipient=cleanName(data.to);
      const target=[...peers.entries()].find(([other,p])=>other!==ws&&p.name.toLowerCase()===recipient.toLowerCase());
      if(!target){send(ws,{type:'error',message:'Người nhận hiện không trực tuyến.'});return;}
      try {
        const message=createMessage({from:peer.name,text:data.text,to:target[1].name,room:'direct'});
        send(ws,{type:'message',message}); send(target[0],{type:'message',message});
      } catch(err){send(ws,{type:'error',message:err.message});}
    } else send(ws,{type:'error',message:'Loại tin nhắn không được hỗ trợ.'});
  });
  ws.on('close',()=>{
    const old=peers.get(ws);peers.delete(ws);
    if(old?.name){system(`${old.name} đã rời phòng chat.`);publishUsers();}
  });
  ws.on('error',()=>{});
});
server.listen(PORT,'0.0.0.0',()=>console.log(`ChatOnline server listening on http://localhost:${PORT} (WebSocket ws://localhost:${PORT})`));
