import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, Search, Users, Sun, Moon, LogOut, Wifi, WifiOff, Hash, UserRound, Menu, X, CheckCheck } from 'lucide-react';

const WS_URL = import.meta.env.VITE_WS_URL || `ws://${location.hostname || 'localhost'}:3001`;
const ROOM = 'general';
const initials = (name='?') => name.trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()).join('');
const palette = ['#6c5ce7','#0984e3','#00a884','#e17055','#d63031','#8e44ad'];
const colorFor = (name='') => palette[[...name].reduce((a,c)=>a+c.charCodeAt(0),0)%palette.length];

export default function App(){
  const [user,setUser] = useState(()=>sessionStorage.getItem('chat_user')||'');
  const [draftName,setDraftName] = useState('');
  const [dark,setDark] = useState(()=>localStorage.getItem('chat_theme')==='dark');
  const [connected,setConnected] = useState(false);
  const [users,setUsers] = useState([]);
  const [messages,setMessages] = useState([]);
  const [text,setText] = useState('');
  const [search,setSearch] = useState('');
  const [active,setActive] = useState('general');
  const [mobilePanel,setMobilePanel] = useState(false);
  const [error,setError] = useState('');
  const ws = useRef(null), bottom = useRef(null), input = useRef(null);

  const historyKey = user ? `chat_history_${user}` : '';
  useEffect(()=>{
    if(!user) return;
    try { setMessages(JSON.parse(localStorage.getItem(historyKey)||'[]')); } catch { setMessages([]); }
  },[user]);
  useEffect(()=>{
    if(user) localStorage.setItem(historyKey,JSON.stringify(messages.slice(-300)));
  },[messages,user]);
  useEffect(()=>{
    if(!user) return;
    let socket;
    try { socket = new WebSocket(WS_URL); ws.current=socket; }
    catch { setError('Không thể khởi tạo kết nối.'); return; }
    socket.onopen=()=>{ setConnected(true); setError(''); socket.send(JSON.stringify({type:'join',name:user})); };
    socket.onmessage=(event)=>{
      let data; try { data=JSON.parse(event.data); } catch { return; }
      if(data.type==='users') setUsers(data.users||[]);
      if(data.type==='message') setMessages(prev=>[...prev,data.message].slice(-300));
      if(data.type==='system') setMessages(prev=>[...prev,data.message].slice(-300));
      if(data.type==='error') setError(data.message||'Có lỗi xảy ra.');
    };
    socket.onclose=()=>{setConnected(false);setUsers([]);};
    socket.onerror=()=>setError('Không kết nối được máy chủ. Hãy chạy npm run dev.');
    return ()=>{ socket.close(); ws.current=null; };
  },[user]);
  useEffect(()=>{ bottom.current?.scrollIntoView({behavior:'smooth'}); },[messages,active]);
  useEffect(()=>{ localStorage.setItem('chat_theme',dark?'dark':'light'); },[dark]);

  const visibleMessages=useMemo(()=>messages.filter(m=>{
    const matchesRoom=active==='general' ? (m.room==='general'||m.type==='system') :
      (m.to===user&&m.from===active)||(m.from===user&&m.to===active);
    return matchesRoom && (!search || `${m.text} ${m.from}`.toLowerCase().includes(search.toLowerCase()));
  }),[messages,active,search,user]);
  const send=(e)=>{
    e?.preventDefault(); const value=text.trim();
    if(!value || !ws.current || ws.current.readyState!==WebSocket.OPEN) return;
    ws.current.send(JSON.stringify(active==='general'
      ? {type:'message',room:'general',text:value}
      : {type:'direct',to:active,text:value}));
    setText(''); input.current?.focus();
  };
  const login=(e)=>{e.preventDefault(); const name=draftName.trim().replace(/\s+/g,' ').slice(0,24);
    if(name.length<2){setError('Tên hiển thị cần ít nhất 2 ký tự.');return;}
    sessionStorage.setItem('chat_user',name);setUser(name);setError('');
  };
  const logout=()=>{ws.current?.close();sessionStorage.removeItem('chat_user');setUser('');setUsers([]);setMessages([]);setActive('general');};
  const selectChat=(id)=>{setActive(id);setMobilePanel(false);};
  const chatTitle=active==='general'?'Phòng trò chuyện chung':active;
  const chatSubtitle=active==='general'?'Mọi người trong phòng đều có thể tham gia':users.find(u=>u.name===active)?.online?'Đang hoạt động':'Chat cá nhân';

  if(!user) return <main className={`login-screen ${dark?'dark':''}`}>
    <section className="login-card">
      <div className="brand-mark"><MessageCircle size={30}/></div>
      <div className="eyebrow">KẾT NỐI MỌI LÚC</div><h1>Chat<span>Online</span></h1>
      <p className="muted">Một không gian trò chuyện đơn giản, nhanh chóng và thân thiện.</p>
      <form onSubmit={login} className="login-form">
        <label htmlFor="nickname">Tên hiển thị của bạn</label>
        <input id="nickname" autoFocus value={draftName} onChange={e=>setDraftName(e.target.value)} placeholder="Ví dụ: Minh Anh" maxLength={24}/>
        <button className="primary-btn" type="submit">Bắt đầu trò chuyện <Send size={17}/></button>
      </form>
      {error&&<p className="error">{error}</p>}
      <div className="login-note"><Wifi size={15}/> Kết nối máy chủ để chat thời gian thực</div>
    </section>
  </main>;

  return <main className={`app-shell ${dark?'dark':''}`}>
    <aside className={`sidebar ${mobilePanel?'show-mobile':''}`}>
      <div className="side-top"><div className="brand"><div className="brand-small"><MessageCircle size={21}/></div><div><b>Chat<span>Online</span></b><small>Không gian của bạn</small></div></div>
        <button className="icon-btn mobile-close" onClick={()=>setMobilePanel(false)} aria-label="Đóng"><X/></button>
      </div>
      <div className="profile-card"><div className="avatar me" style={{background:colorFor(user)}}>{initials(user)}</div><div className="profile-meta"><b>{user}</b><small><i className={connected?'dot online':'dot'}></i>{connected?'Đang trực tuyến':'Đang kết nối...'}</small></div><button className="icon-btn" title="Đăng xuất" onClick={logout}><LogOut size={17}/></button></div>
      <div className="section-label"><span>TIN NHẮN</span><span className="count">{users.length}</span></div>
      <button className={`chat-item ${active==='general'?'selected':''}`} onClick={()=>selectChat('general')}>
        <div className="chat-icon group"><Hash size={21}/></div><div className="chat-info"><b>Phòng chung</b><small>Trò chuyện cùng mọi người</small></div>
      </button>
      <div className="section-label people-label"><span>THÀNH VIÊN</span><span className="count">{users.filter(u=>u.name!==user).length}</span></div>
      <div className="people-list">{users.filter(u=>u.name!==user).map(person=><button key={person.name} className={`chat-item ${active===person.name?'selected':''}`} onClick={()=>selectChat(person.name)}>
        <div className="avatar" style={{background:colorFor(person.name)}}>{initials(person.name)}<i className={person.online?'presence':''}/></div><div className="chat-info"><b>{person.name}</b><small>{person.online?'Đang hoạt động':'Ngoại tuyến'}</small></div>
      </button>)}
      {!users.some(u=>u.name!==user)&&<div className="empty-people"><Users size={23}/><span>Chưa có thành viên khác</span><small>Mở ứng dụng ở trình duyệt khác để thử chat.</small></div>}</div>
      <div className="sidebar-bottom"><div className="connection"><span className={connected?'dot online':'dot'}></span>{connected?'Đã kết nối máy chủ':'Mất kết nối máy chủ'}</div><button className="theme-btn" onClick={()=>setDark(v=>!v)}>{dark?<Sun size={17}/>:<Moon size={17}/>} {dark?'Giao diện sáng':'Giao diện tối'}</button></div>
    </aside>
    {mobilePanel&&<div className="scrim" onClick={()=>setMobilePanel(false)}/>}
    <section className="chat-area">
      <header className="chat-header"><button className="icon-btn menu-btn" onClick={()=>setMobilePanel(true)} aria-label="Mở danh sách"><Menu/></button>
        <div className={`chat-icon ${active==='general'?'group':'person'}`}>{active==='general'?<Hash size={20}/>:<UserRound size={20}/>}</div>
        <div className="header-title"><b>{chatTitle}</b><small>{chatSubtitle}</small></div>
        <div className="header-status">{connected?<><span className="dot online"/> Trực tuyến</>:<><span className="dot"/> Ngoại tuyến</>}</div>
      </header>
      <div className="search-bar"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm trong cuộc trò chuyện..."/>{search&&<button className="clear-search" onClick={()=>setSearch('')}>Xóa</button>}</div>
      <div className="messages" aria-live="polite">
        <div className="welcome"><div className="welcome-icon"><MessageCircle size={22}/></div><b>{active==='general'?'Chào mừng đến phòng trò chuyện!':`Cuộc trò chuyện với ${active}`}</b><p>{active==='general'?'Hãy gửi lời chào và bắt đầu kết nối với mọi người.':'Tin nhắn cá nhân chỉ hiển thị với hai người tham gia khi cùng trực tuyến.'}</p></div>
        {visibleMessages.map((m,i)=>m.type==='system'?<div className="system-message" key={m.id||i}><span>{m.text}</span></div>:<div className={`message-row ${m.from===user?'mine':''}`} key={m.id||i}>
          {m.from!==user&&<div className="avatar tiny" style={{background:colorFor(m.from)}}>{initials(m.from)}</div>}
          <div className="message-content">{m.from!==user&&<b className="sender">{m.from}</b>}<div className="bubble">{m.text}</div><div className="message-meta">{new Date(m.time).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})} {m.from===user&&<CheckCheck size={13}/>}</div></div>
        </div>)}
        {visibleMessages.length===0&&<div className="no-messages">{search?'Không tìm thấy tin nhắn phù hợp.':'Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!'}</div>}
        <div ref={bottom}/>
      </div>
      <form className="composer" onSubmit={send}><div className="composer-inner"><input ref={input} value={text} onChange={e=>setText(e.target.value)} placeholder={connected?'Nhập tin nhắn của bạn...':'Đang chờ kết nối máy chủ...'} disabled={!connected} maxLength={2000}/><span className="char-count">{text.length}/2000</span><button className="send-btn" type="submit" disabled={!connected||!text.trim()} aria-label="Gửi tin nhắn"><Send size={19}/></button></div><div className="composer-hint">Nhấn Enter để gửi tin nhắn <span>•</span> Tin nhắn được lưu trên trình duyệt này</div></form>
      {error&&<div className="toast" role="status">{error}<button onClick={()=>setError('')}>×</button></div>}
    </section>
  </main>;
}
