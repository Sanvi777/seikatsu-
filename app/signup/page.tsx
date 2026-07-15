'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user) router.push('/');
    });
  },[]);

  const handleGoogle = async()=>{
    await supabase.auth.signInWithOAuth({
      provider:'google',
      options:{redirectTo:`${window.location.origin}/auth/callback`}
    });
  };

  const handle = async()=>{
    if(!email||!password) return;
    if(password!==confirm){ setMessage('Passwords do not match!'); return; }
    if(password.length<6){ setMessage('Password must be at least 6 characters!'); return; }
    setLoading(true); setMessage('');
    const{error} = await supabase.auth.signUp({email,password});
    setLoading(false);
    if(error){ setMessage(error.message); return; }
    setMessage('Account created! Now sign in 🎌');
  };

  return (
    <div style={{minHeight:'100vh',background:'#050508',display:'flex',fontFamily:"'DM Sans',system-ui,sans-serif",overflow:'hidden',position:'relative'}}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-15px) rotate(2deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rain{0%{transform:translateY(-20px) translateX(0);opacity:0}10%{opacity:0.6}90%{opacity:0.3}100%{transform:translateY(110vh) translateX(-30px);opacity:0}}
        @keyframes lantern{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
        *{box-sizing:border-box}
        input{color:white!important}
        input::placeholder{color:rgba(255,255,255,0.2)!important}
        a{text-decoration:none}
      `}</style>

      {/* Rain */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
        {Array.from({length:40},(_,i)=>(
          <div key={i} style={{position:'absolute',left:`${(i*7.3)%100}%`,top:'-20px',width:'1px',height:`${15+(i*3)%20}px`,background:`rgba(100,150,255,${0.1+(i*0.01)%0.2})`,animation:`rain ${1.5+(i*0.1)%2}s ${(i*0.15)%3}s infinite linear`}}/>
        ))}
      </div>

      {/* Floating kanji */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
        {[
          {char:'日',x:'5%',y:'10%',size:'80px',delay:'0s',dur:'7s'},
          {char:'本',x:'88%',y:'5%',size:'60px',delay:'1s',dur:'9s'},
          {char:'生',x:'92%',y:'40%',size:'70px',delay:'2s',dur:'8s'},
          {char:'活',x:'3%',y:'55%',size:'65px',delay:'0.5s',dur:'10s'},
          {char:'東',x:'90%',y:'75%',size:'55px',delay:'3s',dur:'7s'},
          {char:'京',x:'5%',y:'80%',size:'60px',delay:'1.5s',dur:'9s'},
          {char:'夢',x:'45%',y:'2%',size:'50px',delay:'2.5s',dur:'8s'},
          {char:'道',x:'50%',y:'92%',size:'55px',delay:'4s',dur:'11s'},
        ].map((k,i)=>(
          <div key={i} style={{position:'absolute',left:k.x,top:k.y,fontSize:k.size,color:'rgba(255,100,50,0.06)',fontWeight:'900',lineHeight:1,animation:`float ${k.dur} ${k.delay} infinite ease-in-out`,fontFamily:'serif'}}>{k.char}</div>
        ))}
      </div>

      {/* Torii gate */}
      <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',pointerEvents:'none',zIndex:1}}>
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none">
          <rect x="20" y="40" width="12" height="160" fill="rgba(255,60,0,0.08)"/>
          <rect x="268" y="40" width="12" height="160" fill="rgba(255,60,0,0.08)"/>
          <rect x="0" y="35" width="300" height="14" rx="4" fill="rgba(255,60,0,0.1)"/>
          <rect x="10" y="55" width="280" height="10" rx="3" fill="rgba(255,60,0,0.08)"/>
        </svg>
      </div>

      {/* Lanterns */}
      <div style={{position:'fixed',top:'5%',left:'8%',animation:'lantern 3s infinite ease-in-out',transformOrigin:'top center',pointerEvents:'none',zIndex:2}}>
        <div style={{width:'2px',height:'30px',background:'rgba(255,150,0,0.2)',margin:'0 auto'}}/>
        <div style={{width:'24px',height:'36px',background:'rgba(255,80,0,0.12)',borderRadius:'4px 4px 8px 8px',border:'1px solid rgba(255,100,0,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:'12px',color:'rgba(255,120,0,0.4)'}}>灯</span>
        </div>
      </div>
      <div style={{position:'fixed',top:'3%',right:'10%',animation:'lantern 4s 1s infinite ease-in-out',transformOrigin:'top center',pointerEvents:'none',zIndex:2}}>
        <div style={{width:'2px',height:'25px',background:'rgba(255,150,0,0.2)',margin:'0 auto'}}/>
        <div style={{width:'20px',height:'30px',background:'rgba(255,80,0,0.12)',borderRadius:'4px 4px 8px 8px',border:'1px solid rgba(255,100,0,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:'10px',color:'rgba(255,120,0,0.4)'}}>光</span>
        </div>
      </div>

      {/* Neon ground glow */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,height:'200px',background:'linear-gradient(to top,rgba(255,40,0,0.04),transparent)',pointerEvents:'none',zIndex:1}}/>

      {/* Main content */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',position:'relative',zIndex:10}}>
        <div style={{width:'100%',maxWidth:'400px',animation:'fadeUp 0.6s ease'}}>

          {/* Logo */}
          <div style={{textAlign:'center',marginBottom:'28px'}}>
            <div style={{fontSize:'44px',lineHeight:1,marginBottom:'8px',filter:'drop-shadow(0 0 20px rgba(255,60,0,0.4))'}}>⛩️</div>
            <div style={{color:'#ff6633',fontWeight:'900',fontSize:'26px',letterSpacing:'2px',textShadow:'0 0 20px rgba(255,60,0,0.5)'}}>生活</div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:'11px',letterSpacing:'4px',marginTop:'4px'}}>SEIKATSU</div>
          </div>

          {/* Card */}
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,100,50,0.15)',borderRadius:'20px',padding:'28px',backdropFilter:'blur(20px)',boxShadow:'0 0 60px rgba(255,40,0,0.06)'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}>
              <div style={{color:'rgba(255,255,255,0.8)',fontWeight:'800',fontSize:'18px',marginBottom:'4px'}}>Create your account</div>
              <div style={{color:'rgba(255,255,255,0.3)',fontSize:'12px'}}>Start your Japan settlement journey 🌸</div>
            </div>

            {/* Google */}
            <button onClick={handleGoogle} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.8)',padding:'11px',fontSize:'13px',fontWeight:'600',cursor:'pointer',borderRadius:'12px',marginBottom:'16px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'all 0.2s'}}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.06)'}>
              <img src="https://www.google.com/favicon.ico" width="16" height="16" alt="G"/>
              Sign up with Google
            </button>

            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.07)'}}/>
              <span style={{fontSize:'11px',color:'rgba(255,255,255,0.2)',letterSpacing:'1px'}}>OR</span>
              <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.07)'}}/>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'16px'}}>
              <div>
                <div style={{fontSize:'11px',color:'rgba(255,150,100,0.6)',marginBottom:'6px',letterSpacing:'1px',fontWeight:'600'}}>EMAIL</div>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                  style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,100,50,0.2)',padding:'11px 14px',fontSize:'14px',outline:'none',borderRadius:'10px',boxSizing:'border-box'}}
                  onFocus={e=>(e.target as HTMLInputElement).style.borderColor='rgba(255,100,50,0.5)'}
                  onBlur={e=>(e.target as HTMLInputElement).style.borderColor='rgba(255,100,50,0.2)'}
                />
              </div>
              <div>
                <div style={{fontSize:'11px',color:'rgba(255,150,100,0.6)',marginBottom:'6px',letterSpacing:'1px',fontWeight:'600'}}>PASSWORD</div>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 characters"
                  style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,100,50,0.2)',padding:'11px 14px',fontSize:'14px',outline:'none',borderRadius:'10px',boxSizing:'border-box'}}
                  onFocus={e=>(e.target as HTMLInputElement).style.borderColor='rgba(255,100,50,0.5)'}
                  onBlur={e=>(e.target as HTMLInputElement).style.borderColor='rgba(255,100,50,0.2)'}
                />
              </div>
              <div>
                <div style={{fontSize:'11px',color:'rgba(255,150,100,0.6)',marginBottom:'6px',letterSpacing:'1px',fontWeight:'600'}}>CONFIRM PASSWORD</div>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handle()}
                  placeholder="••••••••"
                  style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,100,50,0.2)',padding:'11px 14px',fontSize:'14px',outline:'none',borderRadius:'10px',boxSizing:'border-box'}}
                  onFocus={e=>(e.target as HTMLInputElement).style.borderColor='rgba(255,100,50,0.5)'}
                  onBlur={e=>(e.target as HTMLInputElement).style.borderColor='rgba(255,100,50,0.2)'}
                />
              </div>
            </div>

            {message&&(
              <div style={{fontSize:'12px',padding:'10px 14px',borderRadius:'10px',marginBottom:'14px',textAlign:'center',
                background:message.includes('created')||message.includes('Check')?'rgba(0,200,100,0.08)':'rgba(255,60,0,0.08)',
                border:message.includes('created')||message.includes('Check')?'1px solid rgba(0,200,100,0.2)':'1px solid rgba(255,60,0,0.2)',
                color:message.includes('created')||message.includes('Check')?'#00cc66':'#ff6644',
              }}>{message}</div>
            )}

            <button onClick={handle} disabled={loading||!email||!password||!confirm} style={{
              width:'100%',
              background:loading||!email||!password||!confirm?'rgba(255,80,30,0.1)':'rgba(255,80,30,0.25)',
              border:'1px solid rgba(255,80,30,0.4)',
              color:loading||!email||!password||!confirm?'rgba(255,100,50,0.4)':'#ff6633',
              padding:'12px',fontSize:'14px',fontWeight:'700',
              cursor:loading||!email||!password||!confirm?'not-allowed':'pointer',
              borderRadius:'12px',letterSpacing:'1px',transition:'all 0.2s',
              boxShadow:loading||!email||!password||!confirm?'none':'0 0 20px rgba(255,60,0,0.15)',
            }}>
              {loading?'Creating account...':'CREATE ACCOUNT'}
            </button>

            <p style={{textAlign:'center',fontSize:'13px',color:'rgba(255,255,255,0.3)',marginTop:'16px',marginBottom:0}}>
              Already have an account?{' '}
              <Link href="/login" style={{color:'#ff6633',fontWeight:'700',textDecoration:'none'}}>Sign in</Link>
            </p>
          </div>

          <div style={{textAlign:'center',marginTop:'24px'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.08)',letterSpacing:'3px',fontFamily:'serif'}}>七転び八起き</div>
            <div style={{fontSize:'10px',color:'rgba(255,255,255,0.05)',marginTop:'4px',letterSpacing:'1px'}}>Fall seven times, rise eight</div>
          </div>
        </div>
      </div>
    </div>
  );
}