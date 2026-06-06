'use client';
import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase';
import Link from 'next/link';

const AVATARS = ['🌸','⛩️','🗻','🍣','🎎','🏯','🌊','🦊','🐉','🎋','🍵','🎐','🌙','⭐','🎑','🏮'];

function SakuraPetals() {
  const petals = Array.from({length:10},(_,i)=>({
    id:i,
    left:`${5+(i*9)%88}%`,
    delay:`${(i*0.7)%4}s`,
    duration:`${5+(i*0.4)%4}s`,
    size:`${10+(i*3)%14}px`
  }));
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
      {petals.map(p=>(
        <div key={p.id} style={{
          position:'absolute',top:'-20px',left:p.left,
          fontSize:p.size,
          animation:`fall ${p.duration} ${p.delay} infinite linear`,
        }}>🌸</div>
      ))}
      <style>{`@keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:0.8}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}`}</style>
    </div>
  );
}

export default function ProfilePage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({username:'',bio:'',avatar_url:'🌸'});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [taskStats, setTaskStats] = useState({total:0,completed:0,pending:0});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Don't redirect — just show login prompt
        setLoading(false);
        return;
      }
      setUser(session.user);
      loadProfile(session.user.id);
      loadStats(session.user.id);
    });
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile({ username: data.username || '', bio: data.bio || '', avatar_url: data.avatar_url || '🌸' });
    setLoading(false);
  }

  async function loadStats(userId: string) {
    const { data } = await supabase.from('task_responses').select('status').eq('user_id', userId);
    if (data) {
      setTaskStats({
        total: data.length,
        completed: data.filter((r:any) => r.status === 'approved' || r.completed).length,
        pending: data.filter((r:any) => r.status === 'pending').length,
      });
    }
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').upsert({
      id: user.id,
      username: profile.username,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      updated_at: new Date().toISOString()
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a0a2e,#2d1b4e,#1a1a3e)',display:'flex',alignItems:'center',justifyContent:'center',color:'#ff9de2',fontSize:'20px'}}>
      Loading... 🌸
    </div>
  );

  if (!user) return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a0a2e,#2d1b4e,#1a1a3e)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#fff',gap:'16px'}}>
      <SakuraPetals />
      <div style={{fontSize:'40px'}}>🌸</div>
      <div style={{fontSize:'18px',color:'#ff9de2'}}>Please sign in first</div>
      <Link href="/" style={{padding:'10px 24px',background:'rgba(255,157,226,0.2)',border:'1px solid rgba(255,157,226,0.4)',color:'#ff9de2',borderRadius:'20px',textDecoration:'none',fontWeight:'700'}}>
        ← Back to Home
      </Link>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a0a2e,#2d1b4e,#1a1a3e)',color:'#fff',fontFamily:'system-ui,sans-serif',position:'relative'}}>
      <SakuraPetals />

      {/* Header */}
      <header style={{position:'relative',zIndex:10,padding:'16px 24px',borderBottom:'1px solid rgba(255,157,226,0.15)',display:'flex',alignItems:'center',gap:'12px'}}>
        <Link href="/" style={{color:'rgba(255,157,226,0.6)',textDecoration:'none',fontSize:'13px'}}>← Home</Link>
        <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
        <span style={{color:'#ff9de2',fontSize:'16px',fontWeight:'700'}}>🌸 My Profile</span>
        <div style={{marginLeft:'auto'}}>
          <Link href="/requests" style={{fontSize:'12px',color:'rgba(255,157,226,0.6)',textDecoration:'none',padding:'6px 14px',border:'1px solid rgba(255,157,226,0.2)',borderRadius:'20px'}}>
            My Requests →
          </Link>
        </div>
      </header>

      <main style={{maxWidth:'600px',margin:'0 auto',padding:'40px 20px',position:'relative',zIndex:5}}>

        {/* Avatar section */}
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'72px',marginBottom:'12px',filter:'drop-shadow(0 0 20px rgba(255,157,226,0.5))'}}>
            {profile.avatar_url}
          </div>
          <div style={{fontSize:'13px',color:'rgba(255,157,226,0.6)',marginBottom:'12px'}}>Choose your avatar</div>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'8px',maxWidth:'320px',margin:'0 auto'}}>
            {AVATARS.map(a=>(
              <button key={a} onClick={()=>setProfile(p=>({...p,avatar_url:a}))}
                style={{
                  fontSize:'24px',width:'44px',height:'44px',borderRadius:'50%',cursor:'pointer',
                  background: profile.avatar_url===a ? 'rgba(255,157,226,0.25)' : 'rgba(255,255,255,0.05)',
                  border: profile.avatar_url===a ? '2px solid #ff9de2' : '2px solid transparent',
                  transition:'all 0.2s'
                }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,157,226,0.15)',borderRadius:'16px',padding:'28px',marginBottom:'20px'}}>
          <div style={{marginBottom:'20px'}}>
            <label style={{fontSize:'12px',color:'rgba(255,157,226,0.7)',fontWeight:'600',display:'block',marginBottom:'8px',letterSpacing:'1px'}}>USERNAME</label>
            <input
              value={profile.username}
              onChange={e=>setProfile(p=>({...p,username:e.target.value}))}
              placeholder="your_japan_name"
              style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,157,226,0.2)',borderRadius:'10px',padding:'12px 14px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={{fontSize:'12px',color:'rgba(255,157,226,0.7)',fontWeight:'600',display:'block',marginBottom:'8px',letterSpacing:'1px'}}>EMAIL</label>
            <div style={{padding:'12px 14px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',color:'rgba(255,255,255,0.4)',fontSize:'14px'}}>
              {user.email}
            </div>
          </div>
          <div>
            <label style={{fontSize:'12px',color:'rgba(255,157,226,0.7)',fontWeight:'600',display:'block',marginBottom:'8px',letterSpacing:'1px'}}>BIO</label>
            <textarea
              value={profile.bio}
              onChange={e=>setProfile(p=>({...p,bio:e.target.value}))}
              placeholder="Living in Tokyo, figuring it all out one ward office at a time 🌸"
              rows={3}
              style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,157,226,0.2)',borderRadius:'10px',padding:'12px 14px',color:'#fff',fontSize:'14px',outline:'none',resize:'vertical',fontFamily:'inherit',boxSizing:'border-box'}}
            />
          </div>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'24px'}}>
          {[
            {n:taskStats.total,l:'Tasks Started',e:'📋'},
            {n:taskStats.completed,l:'Completed',e:'✅'},
            {n:taskStats.pending,l:'Pending',e:'⏳'},
          ].map((s,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,157,226,0.1)',borderRadius:'12px',padding:'16px',textAlign:'center'}}>
              <div style={{fontSize:'20px',marginBottom:'4px'}}>{s.e}</div>
              <div style={{fontSize:'24px',fontWeight:'700',color:'#ff9de2'}}>{s.n}</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <button onClick={saveProfile} disabled={saving}
          style={{width:'100%',padding:'14px',background: saved ? 'rgba(100,200,100,0.2)' : 'rgba(255,157,226,0.2)',border:`1px solid ${saved?'rgba(100,200,100,0.5)':'rgba(255,157,226,0.4)'}`,color: saved ? '#90EE90' : '#ff9de2',fontSize:'15px',fontWeight:'700',borderRadius:'12px',cursor:'pointer',transition:'all 0.3s'}}>
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile 🌸'}
        </button>
      </main>
    </div>
  );
}