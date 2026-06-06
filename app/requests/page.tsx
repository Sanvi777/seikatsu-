'use client';
import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TASK_NAMES: Record<number,{title:string,emoji:string}> = {
  1:{title:'Register at ward office',emoji:'🏯'},
  2:{title:'Apply for My Number Card',emoji:'🪪'},
  3:{title:'Enroll in Health Insurance',emoji:'🏥'},
  4:{title:'Open a bank account',emoji:'🏦'},
  5:{title:'Get a SIM card',emoji:'📱'},
  6:{title:'Confirm your visa status',emoji:'📋'},
  7:{title:'Enroll in Employee Pension',emoji:'💼'},
  8:{title:'Set up utility payments',emoji:'⚡'},
  9:{title:'Get a Suica or Pasmo card',emoji:'🚃'},
  10:{title:'Get a personal seal (Hanko)',emoji:'🔏'},
  11:{title:'Set up LINE and essential apps',emoji:'💬'},
  12:{title:'Update Residence Card address',emoji:'🏠'},
};

function SakuraPetals() {
  const petals = Array.from({length:10},(_,i)=>({id:i,left:`${4+(i*9)%90}%`,delay:`${(i*0.9)%8}s`,duration:`${8+(i*0.5)%5}s`,size:`${10+(i*2)%8}px`}));
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
      {petals.map(p=>(
        <div key={p.id} style={{position:'absolute',left:p.left,top:'-20px',fontSize:p.size,animation:`sakuraFall ${p.duration} ${p.delay} infinite linear`,opacity:0.5}}>🌸</div>
      ))}
    </div>
  );
}

export default function RequestsPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all'|'pending'|'approved'|'rejected'>('all');
  const router = useRouter();
  const supabase = createClient();

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(!session?.user){ router.push('/'); return; }
      setUser(session.user);
      loadRequests(session.user.id);
    });
  },[]);

  const loadRequests = async(uid:string)=>{
    setLoading(true);
    const{data}=await supabase.from('task_responses').select('*').eq('user_id',uid).order('updated_at',{ascending:false});
    if(data) setRequests(data);
    setLoading(false);
  };

  const filtered = filter==='all' ? requests : requests.filter(r=>{
    if(filter==='pending') return !r.completed && r.status!=='approved' && r.status!=='rejected';
    if(filter==='approved') return r.status==='approved' || r.completed;
    if(filter==='rejected') return r.status==='rejected';
    return true;
  });

  const getStatus = (r:any)=>{
    if(r.status==='approved') return {label:'Approved',color:'#00ff9f',bg:'rgba(0,255,100,0.1)',border:'rgba(0,255,100,0.3)',emoji:'✅'};
    if(r.status==='rejected') return {label:'Rejected',color:'#ff4d4d',bg:'rgba(255,77,77,0.1)',border:'rgba(255,77,77,0.3)',emoji:'❌'};
    if(r.completed) return {label:'Submitted',color:'#ffe066',bg:'rgba(255,224,102,0.1)',border:'rgba(255,224,102,0.3)',emoji:'⏳'};
    return {label:'In Progress',color:'rgba(255,157,226,0.7)',bg:'rgba(255,157,226,0.06)',border:'rgba(255,157,226,0.2)',emoji:'🌸'};
  };

  const completedCount = requests.filter(r=>r.status==='approved').length;
  const pendingCount = requests.filter(r=>r.completed&&r.status!=='approved'&&r.status!=='rejected').length;
  const inProgressCount = requests.filter(r=>!r.completed).length;

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0a2e 0%,#0d0820 50%,#0a0515 100%)',fontFamily:"'DM Sans',system-ui,sans-serif",color:'white'}}>
      <style>{`
        @keyframes sakuraFall{0%{transform:translateY(-20px) rotate(0deg);opacity:0}10%{opacity:0.6}90%{opacity:0.4}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes floatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
      `}</style>
      <SakuraPetals/>
      <div style={{position:'fixed',top:'-5%',left:'15%',width:'500px',height:'400px',background:'radial-gradient(ellipse,rgba(255,157,226,0.07) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

      {/* Header */}
      <header style={{position:'sticky',top:0,zIndex:30,background:'rgba(26,10,46,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,157,226,0.1)'}}>
        <div style={{maxWidth:'700px',margin:'0 auto',padding:'14px 20px',display:'flex',alignItems:'center',gap:'12px'}}>
          <Link href="/" style={{color:'rgba(255,157,226,0.6)',fontSize:'13px',fontWeight:'600',textDecoration:'none'}}>← Home</Link>
          <Link href="/profile" style={{color:'rgba(255,157,226,0.6)',fontSize:'13px',fontWeight:'600',textDecoration:'none',marginLeft:'4px'}}>· Profile</Link>
          <div style={{color:'#ff9de2',fontWeight:'700',fontSize:'15px',marginLeft:'8px'}}>📋 My Requests</div>
        </div>
      </header>

      <main style={{maxWidth:'700px',margin:'0 auto',padding:'32px 20px',position:'relative',zIndex:2,animation:'fadeIn 0.4s ease'}}>
        {/* Hero */}
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'48px',marginBottom:'12px',animation:'floatBob 4s infinite'}}>📋</div>
          <h1 style={{fontSize:'28px',fontWeight:'900',margin:'0 0 8px',color:'#ff9de2'}}>My Requests</h1>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',margin:0}}>Track all your submitted tasks and their approval status</p>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'28px'}}>
          {[
            {num:completedCount,label:'Approved',emoji:'✅',color:'#00ff9f'},
            {num:pendingCount,label:'Under Review',emoji:'⏳',color:'#ffe066'},
            {num:inProgressCount,label:'In Progress',emoji:'🌸',color:'#ff9de2'},
          ].map((s,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px',padding:'14px',textAlign:'center'}}>
              <div style={{fontSize:'20px',marginBottom:'4px'}}>{s.emoji}</div>
              <div style={{fontSize:'24px',fontWeight:'900',color:s.color}}>{s.num}</div>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,0.2)',textTransform:'uppercase',letterSpacing:'1px',marginTop:'2px'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap'}}>
          {(['all','pending','approved','rejected'] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:'7px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'600',cursor:'pointer',transition:'all 0.2s',
              background:filter===f?'rgba(255,157,226,0.15)':'rgba(255,255,255,0.03)',
              border:filter===f?'1px solid rgba(255,157,226,0.4)':'1px solid rgba(255,255,255,0.08)',
              color:filter===f?'#ff9de2':'rgba(255,255,255,0.3)',
              textTransform:'capitalize',
            }}>
              {f==='all'?'🌸 All':f==='pending'?'⏳ Pending':f==='approved'?'✅ Approved':'❌ Rejected'}
            </button>
          ))}
        </div>

        {/* Requests list */}
        {loading?(
          <div style={{textAlign:'center',padding:'48px',color:'rgba(255,157,226,0.5)'}}>
            <div style={{fontSize:'32px',marginBottom:'8px',animation:'floatBob 2s infinite'}}>🌸</div>
            <div>Loading your requests...</div>
          </div>
        ) : filtered.length===0?(
          <div style={{textAlign:'center',padding:'48px',color:'rgba(255,255,255,0.25)'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>🌸</div>
            <div style={{fontSize:'14px',fontWeight:'600',marginBottom:'4px'}}>No requests yet</div>
            <div style={{fontSize:'12px'}}>Complete some tasks to see them here!</div>
            <Link href="/" style={{display:'inline-block',marginTop:'16px',padding:'10px 24px',background:'rgba(255,157,226,0.15)',border:'1px solid rgba(255,157,226,0.3)',color:'#ff9de2',borderRadius:'20px',textDecoration:'none',fontSize:'13px',fontWeight:'700'}}>
              Go to Tasks 🌸
            </Link>
          </div>
        ):(
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {filtered.map(req=>{
              const task = TASK_NAMES[req.task_id];
              const status = getStatus(req);
              const responses = req.responses||{};
              const responseCount = Object.keys(responses).filter(k=>responses[k]).length;
              return (
                <div key={req.id} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,157,226,0.1)',borderRadius:'16px',padding:'18px',transition:'all 0.2s'}}
                  onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,157,226,0.25)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,157,226,0.1)'}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      <span style={{fontSize:'24px'}}>{task?.emoji||'📋'}</span>
                      <div>
                        <div style={{fontSize:'14px',fontWeight:'700',color:'#ff9de2',marginBottom:'2px'}}>{task?.title||`Task ${req.task_id}`}</div>
                        <div style={{fontSize:'11px',color:'rgba(255,255,255,0.25)'}}>
                          Updated {new Date(req.updated_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                        </div>
                      </div>
                    </div>
                    <span style={{flexShrink:0,fontSize:'11px',padding:'4px 12px',background:status.bg,border:`1px solid ${status.border}`,color:status.color,borderRadius:'20px',fontWeight:'700'}}>
                      {status.emoji} {status.label}
                    </span>
                  </div>

                  {/* Response preview */}
                  {responseCount>0&&(
                    <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'10px',padding:'12px',marginBottom:'12px'}}>
                      <div style={{fontSize:'11px',color:'rgba(255,255,255,0.25)',marginBottom:'8px',letterSpacing:'0.5px'}}>YOUR RESPONSES ({responseCount} fields filled)</div>
                      <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                        {Object.entries(responses).filter(([,v])=>v).slice(0,3).map(([k,v])=>(
                          <div key={k} style={{display:'flex',gap:'8px',fontSize:'12px'}}>
                            <span style={{color:'rgba(255,157,226,0.5)',minWidth:'80px',textTransform:'capitalize'}}>{k.replace(/_/g,' ')}:</span>
                            <span style={{color:'rgba(255,255,255,0.55)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{String(v)}</span>
                          </div>
                        ))}
                        {Object.keys(responses).filter(k=>responses[k]).length>3&&(
                          <div style={{fontSize:'11px',color:'rgba(255,255,255,0.2)'}}>+{Object.keys(responses).filter(k=>responses[k]).length-3} more fields</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status message */}
                  {req.status==='approved'&&(
                    <div style={{fontSize:'12px',padding:'8px 12px',background:'rgba(0,255,100,0.06)',border:'1px solid rgba(0,255,100,0.15)',borderRadius:'10px',color:'rgba(0,255,100,0.7)'}}>
                      ✅ Your submission has been approved! Great job settling into Japan 🌸
                    </div>
                  )}
                  {req.status==='rejected'&&(
                    <div style={{fontSize:'12px',padding:'8px 12px',background:'rgba(255,77,77,0.06)',border:'1px solid rgba(255,77,77,0.15)',borderRadius:'10px',color:'rgba(255,100,100,0.7)'}}>
                      ❌ This submission needs more information. Please update and resubmit.
                    </div>
                  )}
                  {req.completed&&req.status!=='approved'&&req.status!=='rejected'&&(
                    <div style={{fontSize:'12px',padding:'8px 12px',background:'rgba(255,224,102,0.06)',border:'1px solid rgba(255,224,102,0.15)',borderRadius:'10px',color:'rgba(255,224,102,0.7)'}}>
                      ⏳ Submitted and waiting for admin review...
                    </div>
                  )}

                  <div style={{display:'flex',justifyContent:'flex-end',marginTop:'10px'}}>
                    <Link href={`/task/${req.task_id}`} style={{fontSize:'12px',color:'rgba(255,157,226,0.5)',textDecoration:'none',fontWeight:'600'}}>
                      Edit submission →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{marginTop:'40px',textAlign:'center',borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'20px'}}>
          <div style={{fontSize:'20px',marginBottom:'6px'}}>🌸 ⛩️ 🗻</div>
          <div style={{fontSize:'11px',color:'rgba(255,255,255,0.08)',letterSpacing:'2px'}}>生活 SEIKATSU · JAPAN SETTLEMENT GUIDE</div>
        </div>
      </main>
    </div>
  );
}