'use client';
import { useState, useEffect } from 'react';
import { createClient } from './lib/supabase';
import Link from 'next/link';

const tasks = [
  {id:1,cat:'residence',urgent:true,title:'Register at ward office',titleJP:'住民登録',desc:'Required within 14 days of arrival.',emoji:'🏯'},
  {id:2,cat:'residence',urgent:false,title:'Apply for My Number Card',titleJP:'マイナンバーカード申請',desc:"Japan's national ID — needed for tax, health, and banking.",emoji:'🪪'},
  {id:3,cat:'health',urgent:true,title:'Enroll in Health Insurance',titleJP:'国民健康保険加入',desc:'Covers 70% of all medical costs.',emoji:'🏥'},
  {id:4,cat:'finance',urgent:false,title:'Open a bank account',titleJP:'銀行口座の開設',desc:'Needed for salary, rent, and utilities.',emoji:'🏦'},
  {id:5,cat:'daily',urgent:false,title:'Get a SIM card',titleJP:'SIMカードの契約',desc:'IIJmio or Rakuten Mobile offer English support.',emoji:'📱'},
  {id:6,cat:'work',urgent:false,title:'Confirm your visa status',titleJP:'在留資格の確認',desc:'Verify your residence card matches your job type.',emoji:'📋'},
  {id:7,cat:'health',urgent:false,title:'Enroll in Employee Pension',titleJP:'厚生年金への加入',desc:'Auto-enrolled by employer. Confirm with HR.',emoji:'💼'},
  {id:8,cat:'finance',urgent:false,title:'Set up utility payments',titleJP:'光熱費の設定',desc:'Electricity, gas, and water for your apartment.',emoji:'⚡'},
  {id:9,cat:'daily',urgent:false,title:'Get a Suica or Pasmo card',titleJP:'Suica・PASMOの取得',desc:'IC card for trains, buses, and convenience stores.',emoji:'🚃'},
  {id:10,cat:'work',urgent:false,title:'Get a personal seal (Hanko)',titleJP:'印鑑・ハンコの取得',desc:'Required for some contracts and bank accounts.',emoji:'🔏'},
  {id:11,cat:'daily',urgent:false,title:'Set up LINE and essential apps',titleJP:'LINEと必須アプリの設定',desc:'LINE is used by 97% of Japan for all communication.',emoji:'💬'},
  {id:12,cat:'residence',urgent:false,title:'Update Residence Card address',titleJP:'在留カードの住所変更',desc:'Update within 14 days any time you move.',emoji:'🏠'},
];

const CATS = [
  {key:'all',en:'All',jp:'全て',icon:'🌸'},
  {key:'residence',en:'Residence',jp:'居住',icon:'🏯'},
  {key:'finance',en:'Finance',jp:'金融',icon:'💴'},
  {key:'health',en:'Health',jp:'健康',icon:'🍵'},
  {key:'work',en:'Work',jp:'仕事',icon:'⛩️'},
  {key:'daily',en:'Daily',jp:'日常',icon:'🍜'},
];

function SakuraPetals() {
  const petals = Array.from({length:16},(_,i)=>({id:i,left:`${4+(i*6.1)%90}%`,delay:`${(i*0.8)%9}s`,duration:`${8+(i*0.5)%6}s`,size:`${12+(i*2)%10}px`}));
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
      {petals.map(p=>(
        <div key={p.id} style={{position:'absolute',left:p.left,top:'-20px',fontSize:p.size,animation:`sakuraFall ${p.duration} ${p.delay} infinite linear`,opacity:0.6}}>🌸</div>
      ))}
    </div>
  );
}

function AuthModal({onClose}:{onClose:()=>void}) {
  const [mode,setMode]=useState<'login'|'signup'>('login');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState('');
  const supabase=createClient();

  const handleGoogle=async()=>{
    await supabase.auth.signInWithOAuth({
      provider:'google',
      options:{redirectTo:`${window.location.origin}/auth/callback`}
    });
  };

  const handle=async()=>{
    setLoading(true);setMessage('');
    const{error}=mode==='login'
      ?await supabase.auth.signInWithPassword({email,password})
      :await supabase.auth.signUp({email,password});
    setLoading(false);
    if(error){setMessage(error.message);return;}
    if(mode==='signup'){setMessage('Check your email! 🌸');return;}
    onClose();
  };

  return (
    <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',background:'rgba(0,0,0,0.8)',backdropFilter:'blur(12px)'}}>
      <div style={{width:'100%',maxWidth:'360px',background:'linear-gradient(160deg,#1a0a2e,#0d0820)',border:'1px solid rgba(255,157,226,0.25)',borderRadius:'24px',padding:'24px',position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:'20px'}}>
          <div style={{fontSize:'36px',marginBottom:'8px'}}>⛩️</div>
          <div style={{color:'#ff9de2',fontWeight:'700',fontSize:'17px',marginBottom:'4px'}}>{mode==='login'?'おかえり！':'はじめまして！'}</div>
          <div style={{color:'rgba(255,157,226,0.4)',fontSize:'12px'}}>{mode==='login'?'Welcome back':'Create your account'}</div>
        </div>

        {/* Google button */}
        <button onClick={handleGoogle} style={{width:'100%',background:'white',border:'none',color:'#333',padding:'11px',fontSize:'13px',fontWeight:'700',cursor:'pointer',borderRadius:'12px',marginBottom:'12px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
          <img src="https://www.google.com/favicon.ico" width="16" height="16" alt="G"/>
          Continue with Google
        </button>
        <div style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.2)',marginBottom:'12px',letterSpacing:'0.5px'}}>— or —</div>

        <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'14px'}}>
          <div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',marginBottom:'5px',letterSpacing:'1px'}}>EMAIL</div>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"
              style={{width:'100%',background:'rgba(255,157,226,0.06)',border:'1px solid rgba(255,157,226,0.2)',color:'white',padding:'10px 14px',fontSize:'14px',outline:'none',borderRadius:'12px',boxSizing:'border-box'}}/>
          </div>
          <div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',marginBottom:'5px',letterSpacing:'1px'}}>PASSWORD</div>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
              style={{width:'100%',background:'rgba(255,157,226,0.06)',border:'1px solid rgba(255,157,226,0.2)',color:'white',padding:'10px 14px',fontSize:'14px',outline:'none',borderRadius:'12px',boxSizing:'border-box'}}/>
          </div>
        </div>
        {message&&<div style={{fontSize:'12px',color:'#ff9de2',background:'rgba(255,157,226,0.08)',border:'1px solid rgba(255,157,226,0.2)',padding:'8px 12px',borderRadius:'8px',marginBottom:'12px',textAlign:'center'}}>{message}</div>}
        <button onClick={handle} disabled={loading||!email||!password}
          style={{width:'100%',background:'rgba(255,157,226,0.2)',border:'1px solid rgba(255,157,226,0.4)',color:'#ff9de2',padding:'12px',fontSize:'14px',fontWeight:'700',cursor:'pointer',borderRadius:'12px',opacity:loading||!email||!password?0.4:1}}>
          {loading?'...' : mode==='login'?'SIGN IN 🌸':'CREATE ACCOUNT 🌸'}
        </button>
        <p style={{textAlign:'center',fontSize:'12px',color:'rgba(255,255,255,0.2)',marginTop:'14px',marginBottom:0}}>
          {mode==='login'?'No account? ':'Have one? '}
          <button onClick={()=>setMode(mode==='login'?'signup':'login')} style={{background:'none',border:'none',color:'#ff9de2',cursor:'pointer',fontSize:'12px'}}>
            {mode==='login'?'Sign up':'Sign in'}
          </button>
        </p>
        <button onClick={onClose} style={{position:'absolute',top:'12px',right:'16px',background:'transparent',border:'none',color:'rgba(255,255,255,0.2)',cursor:'pointer',fontSize:'18px'}}>✕</button>
      </div>
    </div>
  );
}

function TaskCard({task,completed,isJP}:{task:any,completed:number[],isJP:boolean}) {
  const done=completed.includes(task.id);
  return (
    <Link href={`/task/${task.id}`} style={{textDecoration:'none'}}>
      <div style={{
        background:done?'rgba(0,255,100,0.04)':'rgba(255,157,226,0.04)',
        border:`1px solid ${done?'rgba(0,255,100,0.2)':'rgba(255,157,226,0.15)'}`,
        borderRadius:'16px',padding:'16px',cursor:'pointer',transition:'all 0.25s',
        opacity:done?0.65:1,position:'relative',overflow:'hidden',height:'100%',
      }}>
        <div style={{position:'absolute',right:'-8px',bottom:'-8px',fontSize:'40px',opacity:0.06,lineHeight:1}}>🌸</div>
        <div style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
          <div style={{fontSize:'26px',lineHeight:1,flexShrink:0}}>{task.emoji}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px',flexWrap:'wrap'}}>
              {done&&<span style={{fontSize:'13px'}}>✅</span>}
              {task.urgent&&!done&&<span style={{fontSize:'10px',padding:'2px 7px',background:'rgba(255,100,100,0.12)',border:'1px solid rgba(255,100,100,0.3)',color:'#ff8080',borderRadius:'20px',fontWeight:'700'}}>⚡ URGENT</span>}
            </div>
            <div style={{fontSize:'13px',fontWeight:'700',color:done?'rgba(255,255,255,0.35)':'#ff9de2',marginBottom:'4px',textDecoration:done?'line-through':'none',lineHeight:1.3}}>
              {isJP?task.titleJP:task.title}
            </div>
            <div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',lineHeight:'1.5',marginBottom:'10px'}}>{task.desc}</div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'4px'}}>
              <span style={{fontSize:'10px',padding:'2px 8px',background:'rgba(255,157,226,0.08)',border:'1px solid rgba(255,157,226,0.15)',color:'rgba(255,157,226,0.6)',borderRadius:'20px'}}>{task.cat}</span>
              <span style={{fontSize:'11px',color:done?'#00ff9f':'rgba(255,157,226,0.5)',fontWeight:'700'}}>{done?'Done ✓':'View →'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [completed,setCompleted]=useState<number[]>([]);
  const [cat,setCat]=useState('all');
  const [isJP,setIsJP]=useState(false);
  const [mounted,setMounted]=useState(false);
  const [user,setUser]=useState<any>(null);
  const [showAuth,setShowAuth]=useState(false);
  const supabase=createClient();

  useEffect(()=>{
    setMounted(true);
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user??null);
      if(session?.user) loadCompleted(session.user.id);
      else {const s=localStorage.getItem('seikatsu-completed');if(s)setCompleted(JSON.parse(s));}
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>{
      setUser(session?.user??null);
      if(session?.user) loadCompleted(session.user.id);
    });
    return()=>subscription.unsubscribe();
  },[]);

  const loadCompleted=async(uid:string)=>{
    const{data}=await supabase.from('task_responses').select('task_id').eq('user_id',uid).eq('completed',true);
    if(data)setCompleted(data.map((r:any)=>r.task_id));
  };

  const signOut=async()=>{await supabase.auth.signOut();setUser(null);setCompleted([]);};

  const filtered=cat==='all'?tasks:tasks.filter(t=>t.cat===cat);
  const urgent=filtered.filter(t=>t.urgent&&!completed.includes(t.id));
  const normal=filtered.filter(t=>!t.urgent||completed.includes(t.id));
  const pct=mounted?Math.round(completed.length/tasks.length*100):0;

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0a2e 0%,#0d0820 50%,#0a0515 100%)',color:'white',overflowX:'hidden'}}>
      <style>{`
        @keyframes sakuraFall{0%{transform:translateY(-20px) rotate(0deg);opacity:0}10%{opacity:0.7}90%{opacity:0.4}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes floatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 10px rgba(255,157,226,0.3)}50%{box-shadow:0 0 25px rgba(255,157,226,0.7)}}
        @keyframes shimmer{0%,100%{opacity:0.5}50%{opacity:1}}
        *{box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif}
        a{text-decoration:none}
        .hide-scroll{scrollbar-width:none;-ms-overflow-style:none}
        .hide-scroll::-webkit-scrollbar{display:none}
        @media(max-width:640px){.task-grid{grid-template-columns:1fr!important}}
        @media(max-width:480px){.hero-title{font-size:26px!important}.hero-emoji{font-size:40px!important}.header-extra{display:none!important}}
        @media(max-width:360px){.stat-num{font-size:20px!important}.quick-grid{grid-template-columns:1fr!important}}
      `}</style>

      <SakuraPetals/>
      <div style={{position:'fixed',top:'-5%',left:'15%',width:'500px',height:'400px',background:'radial-gradient(ellipse,rgba(255,157,226,0.08) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'fixed',bottom:'0',right:'10%',width:'400px',height:'400px',background:'radial-gradient(ellipse,rgba(179,102,255,0.08) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)}/>}

      <header style={{position:'sticky',top:0,zIndex:30,background:'rgba(26,10,46,0.92)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,157,226,0.1)'}}>
        <div style={{maxWidth:'820px',margin:'0 auto',padding:'12px 16px',display:'flex',alignItems:'center',gap:'10px'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
            <div style={{fontSize:'22px',animation:'floatBob 4s infinite'}}>🌸</div>
            <div>
              <div style={{color:'#ff9de2',fontWeight:'800',fontSize:'16px',lineHeight:1}}>Seikatsu</div>
              <div style={{color:'rgba(255,157,226,0.35)',fontSize:'8px',letterSpacing:'1.5px',marginTop:'1px'}}>生活 · JAPAN GUIDE</div>
            </div>
          </Link>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'6px'}}>
            <div className="header-extra" style={{display:'flex',alignItems:'center',gap:'6px',padding:'5px 10px',background:'rgba(255,157,226,0.06)',border:'1px solid rgba(255,157,226,0.15)',borderRadius:'20px'}}>
              <span style={{fontSize:'11px'}}>🌸</span>
              <div style={{width:'60px',height:'4px',background:'rgba(255,255,255,0.08)',borderRadius:'10px',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#ff9de2,#b366ff)',transition:'width 0.6s',borderRadius:'10px'}}/>
              </div>
              <span style={{fontSize:'10px',color:'#ff9de2',fontWeight:'700'}}>{pct}%</span>
            </div>
            <button onClick={()=>setIsJP(!isJP)} style={{padding:'6px 10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontSize:'11px',cursor:'pointer',borderRadius:'20px',fontWeight:'700'}}>
              {isJP?'EN':'JP'}
            </button>
            {user?(
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <Link href="/profile" style={{textDecoration:'none'}}>
                  <div style={{width:'30px',height:'30px',border:'2px solid #ff9de2',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#ff9de2',fontSize:'12px',fontWeight:'800',background:'rgba(255,157,226,0.1)',cursor:'pointer',flexShrink:0}}>
                    {user.email?.[0].toUpperCase()}
                  </div>
                </Link>
                <Link href="/requests" style={{fontSize:'11px',color:'rgba(255,157,226,0.6)',textDecoration:'none',fontWeight:'600',padding:'5px 8px',background:'rgba(255,157,226,0.06)',border:'1px solid rgba(255,157,226,0.15)',borderRadius:'20px',whiteSpace:'nowrap'}}>
                  Requests
                </Link>
                <button onClick={signOut} style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',cursor:'pointer',fontSize:'11px',padding:'4px',whiteSpace:'nowrap'}}>out</button>
              </div>
            ):(
              <button onClick={()=>setShowAuth(true)} style={{padding:'7px 14px',background:'rgba(255,157,226,0.15)',border:'1px solid rgba(255,157,226,0.35)',color:'#ff9de2',fontSize:'12px',fontWeight:'700',cursor:'pointer',borderRadius:'20px',animation:'pulseGlow 3s infinite',whiteSpace:'nowrap'}}>
                Login 🌸
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{maxWidth:'820px',margin:'0 auto',padding:'28px 16px',position:'relative',zIndex:2}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div className="hero-emoji" style={{fontSize:'48px',marginBottom:'10px',lineHeight:1}}>🗻</div>
          <h1 className="hero-title" style={{fontSize:'32px',fontWeight:'900',margin:'0 0 8px',lineHeight:1.1}}>
            <span style={{color:'#ff9de2'}}>Settle</span>
            <span style={{color:'white'}}> into </span>
            <span style={{color:'#ffe066'}}>Japan</span>
            <span> 🌸</span>
          </h1>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',margin:'0 0 4px'}}>
            {isJP?'各タスクをクリックして詳細を入力してください。':'Click any task to fill in your details and track your progress.'}
          </p>
          {!user&&(
            <p style={{fontSize:'12px',color:'rgba(255,157,226,0.5)',margin:'8px 0 0'}}>
              💡 <button onClick={()=>setShowAuth(true)} style={{background:'none',border:'none',color:'#ff9de2',cursor:'pointer',fontSize:'12px',textDecoration:'underline'}}>Sign in</button> to save progress
            </p>
          )}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'24px'}}>
          {[
            {num:mounted?completed.length:0,label:isJP?'完了':'Completed',emoji:'✅',color:'#00ff9f'},
            {num:mounted?tasks.length-completed.length:tasks.length,label:isJP?'残り':'Remaining',emoji:'📋',color:'rgba(255,255,255,0.7)'},
            {num:mounted?tasks.filter(t=>t.urgent&&!completed.includes(t.id)).length:2,label:isJP?'緊急':'Urgent',emoji:'⚡',color:'#ff9de2'},
          ].map((s,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'12px',textAlign:'center'}}>
              <div style={{fontSize:'20px',marginBottom:'3px'}}>{s.emoji}</div>
              <div className="stat-num" style={{fontSize:'24px',fontWeight:'900',color:s.color,lineHeight:1}}>{s.num}</div>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,0.25)',marginTop:'3px',textTransform:'uppercase',letterSpacing:'0.8px'}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="hide-scroll" style={{display:'flex',gap:'6px',overflowX:'auto',paddingBottom:'4px',marginBottom:'20px'}}>
          {CATS.map(c=>{
            const active=cat===c.key;
            return(
              <button key={c.key} onClick={()=>setCat(c.key)} style={{
                display:'flex',alignItems:'center',gap:'5px',padding:'7px 12px',borderRadius:'20px',
                background:active?'rgba(255,157,226,0.15)':'rgba(255,255,255,0.03)',
                border:active?'1px solid rgba(255,157,226,0.4)':'1px solid rgba(255,255,255,0.07)',
                color:active?'#ff9de2':'rgba(255,255,255,0.3)',
                fontSize:'11px',fontWeight:active?'700':'400',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.2s',flexShrink:0,
              }}>
                <span>{c.icon}</span><span>{isJP?c.jp:c.en}</span>
              </button>
            );
          })}
        </div>

        {urgent.length>0&&(
          <div style={{marginBottom:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
              <span style={{fontSize:'14px',animation:'shimmer 2s infinite'}}>⚡</span>
              <span style={{fontSize:'11px',fontWeight:'700',color:'rgba(255,100,100,0.8)',letterSpacing:'1px',textTransform:'uppercase'}}>Urgent — 14 days</span>
              <div style={{flex:1,height:'1px',background:'linear-gradient(90deg,rgba(255,100,100,0.3),transparent)'}}/>
            </div>
            <div className="task-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'10px'}}>
              {urgent.map(t=><TaskCard key={t.id} task={t} completed={completed} isJP={isJP}/>)}
            </div>
          </div>
        )}

        {normal.length>0&&(
          <div>
            {urgent.length>0&&(
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
                <span style={{fontSize:'14px'}}>🌸</span>
                <span style={{fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,0.25)',letterSpacing:'1px',textTransform:'uppercase'}}>All Tasks</span>
                <div style={{flex:1,height:'1px',background:'linear-gradient(90deg,rgba(255,255,255,0.1),transparent)'}}/>
              </div>
            )}
            <div className="task-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'10px'}}>
              {normal.map(t=><TaskCard key={t.id} task={t} completed={completed} isJP={isJP}/>)}
            </div>
          </div>
        )}

        <div style={{marginTop:'40px',textAlign:'center',borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'20px'}}>
          <div style={{fontSize:'20px',marginBottom:'6px'}}>🌸 ⛩️ 🗻 🍵 🎋</div>
          <div style={{fontSize:'10px',color:'rgba(255,255,255,0.1)',letterSpacing:'1.5px'}}>生活 SEIKATSU · JAPAN SETTLEMENT GUIDE</div>
        </div>
      </main>
    </div>
  );
}