'use client';
import { useEffect, useState } from 'react';
import { createClient } from './lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(()=>{
    setMounted(true);
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user) router.push('/home');
    });
  },[]);

  const petals = Array.from({length:20},(_,i)=>({
    id:i, left:`${4+(i*4.7)%92}%`,
    delay:`${(i*0.6)%8}s`, duration:`${7+(i*0.4)%5}s`,
    size:`${10+(i*2)%12}px`,
  }));

  const features = [
    {emoji:'📋',title:'12 Settlement Tasks',desc:'Step-by-step guide for everything — ward office, insurance, banking and more.'},
    {emoji:'🤖',title:'AI Assistant',desc:'Ask anything about life in Japan. Get instant answers in English or Japanese.'},
    {emoji:'☁️',title:'Cloud Sync',desc:'Your progress saved securely and accessible from any device, anywhere.'},
    {emoji:'🌐',title:'Bilingual',desc:'Full English and Japanese support — perfect for navigating Japanese bureaucracy.'},
    {emoji:'📊',title:'Track Progress',desc:'Visual progress tracking so you always know what to do next.'},
    {emoji:'✅',title:'Admin Approval',desc:'Submit your completed tasks for verification and get officially confirmed.'},
  ];

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#0a0015 0%,#0d0820 40%,#0a0515 100%)',color:'white',fontFamily:"'DM Sans',system-ui,sans-serif",overflowX:'hidden'}}>
      <style>{`
        @keyframes sakuraFall{0%{transform:translateY(-20px) rotate(0deg);opacity:0}10%{opacity:0.7}90%{opacity:0.4}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes floatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 20px rgba(255,157,226,0.3)}50%{box-shadow:0 0 40px rgba(255,157,226,0.7)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
        a{text-decoration:none}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,157,226,0.3);border-radius:4px}
        @media(max-width:640px){.features-grid{grid-template-columns:1fr!important}.hero-title{font-size:36px!important}}
      `}</style>

      {/* Sakura petals */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
        {petals.map(p=>(
          <div key={p.id} style={{position:'absolute',left:p.left,top:'-20px',fontSize:p.size,animation:`sakuraFall ${p.duration} ${p.delay} infinite linear`,opacity:0.6}}>🌸</div>
        ))}
      </div>

      {/* Glow orbs */}
      <div style={{position:'fixed',top:'-10%',left:'10%',width:'600px',height:'500px',background:'radial-gradient(ellipse,rgba(255,157,226,0.06) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'fixed',bottom:'0',right:'5%',width:'500px',height:'400px',background:'radial-gradient(ellipse,rgba(179,102,255,0.07) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'fixed',top:'40%',left:'-5%',width:'300px',height:'300px',background:'radial-gradient(ellipse,rgba(255,157,226,0.04) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

      {/* Navbar */}
      <nav style={{position:'sticky',top:0,zIndex:30,background:'rgba(10,0,21,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,157,226,0.08)'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto',padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{fontSize:'24px',animation:'floatBob 4s infinite'}}>🌸</div>
            <div>
              <div style={{color:'#ff9de2',fontWeight:'900',fontSize:'18px',lineHeight:1}}>Seikatsu</div>
              <div style={{color:'rgba(255,157,226,0.3)',fontSize:'8px',letterSpacing:'2px'}}>生活 · JAPAN GUIDE</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <Link href="/login" style={{padding:'8px 18px',background:'transparent',border:'1px solid rgba(255,157,226,0.3)',color:'rgba(255,157,226,0.7)',fontSize:'13px',fontWeight:'600',borderRadius:'20px',transition:'all 0.2s'}}>
              Sign In
            </Link>
            <Link href="/signup" style={{padding:'8px 18px',background:'rgba(255,157,226,0.2)',border:'1px solid rgba(255,157,226,0.4)',color:'#ff9de2',fontSize:'13px',fontWeight:'700',borderRadius:'20px',animation:'pulseGlow 3s infinite'}}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth:'900px',margin:'0 auto',padding:'80px 20px 60px',textAlign:'center',position:'relative',zIndex:2}}>
        <div style={{fontSize:'72px',marginBottom:'16px',lineHeight:1,animation:'floatBob 5s infinite'}}>🗻</div>
        
        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 16px',background:'rgba(255,157,226,0.08)',border:'1px solid rgba(255,157,226,0.2)',borderRadius:'20px',marginBottom:'24px',fontSize:'12px',color:'rgba(255,157,226,0.7)',letterSpacing:'1px'}}>
          <span style={{animation:'shimmer 2s infinite'}}>✦</span>
          JAPAN SETTLEMENT GUIDE
          <span style={{animation:'shimmer 2s infinite 0.5s'}}>✦</span>
        </div>

        <h1 className="hero-title" style={{fontSize:'52px',fontWeight:'900',lineHeight:1.1,margin:'0 0 20px'}}>
          <span style={{color:'#ff9de2'}}>Settle into </span>
          <span style={{color:'#ffe066'}}>Japan</span>
          <br/>
          <span style={{color:'rgba(255,255,255,0.7)',fontSize:'0.65em',fontWeight:'700'}}>without the stress 🌸</span>
        </h1>

        <p style={{fontSize:'16px',color:'rgba(255,255,255,0.45)',maxWidth:'560px',margin:'0 auto 40px',lineHeight:'1.7'}}>
          Your complete guide to settling in Japan — from ward office registration to health insurance, bank accounts, SIM cards and more. With AI assistance in English and Japanese.
        </p>

        <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/signup" style={{
            padding:'14px 32px',
            background:'linear-gradient(135deg,rgba(255,157,226,0.25),rgba(179,102,255,0.25))',
            border:'1px solid rgba(255,157,226,0.4)',
            color:'#ff9de2',fontSize:'15px',fontWeight:'800',
            borderRadius:'14px',letterSpacing:'0.5px',
            boxShadow:'0 0 30px rgba(255,157,226,0.15)',
            transition:'all 0.3s',
          }}>
            Get Started Free 🌸
          </Link>
          <Link href="/login" style={{
            padding:'14px 32px',
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.1)',
            color:'rgba(255,255,255,0.5)',fontSize:'15px',fontWeight:'600',
            borderRadius:'14px',
          }}>
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div style={{display:'flex',gap:'32px',justifyContent:'center',marginTop:'48px',flexWrap:'wrap'}}>
          {[
            {num:'12',label:'Settlement Tasks'},
            {num:'AI',label:'Powered Assistant'},
            {num:'EN/JP',label:'Bilingual Support'},
            {num:'Free',label:'Forever'},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:'center'}}>
              <div style={{fontSize:'22px',fontWeight:'900',color:'#ff9de2'}}>{s.num}</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.25)',marginTop:'2px',letterSpacing:'0.5px'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{maxWidth:'900px',margin:'0 auto 60px',padding:'0 20px',position:'relative',zIndex:2}}>
        <div style={{height:'1px',background:'linear-gradient(90deg,transparent,rgba(255,157,226,0.2),transparent)'}}/>
      </div>

      {/* Features */}
      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 20px 80px',position:'relative',zIndex:2}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{fontSize:'12px',color:'rgba(255,157,226,0.5)',letterSpacing:'3px',marginBottom:'12px'}}>EVERYTHING YOU NEED</div>
          <h2 style={{fontSize:'28px',fontWeight:'800',margin:0,color:'rgba(255,255,255,0.85)'}}>Built for foreigners moving to Japan</h2>
        </div>

        <div className="features-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
          {features.map((f,i)=>(
            <div key={i} style={{
              background:'rgba(255,255,255,0.02)',
              border:'1px solid rgba(255,157,226,0.08)',
              borderRadius:'16px',padding:'24px',
              transition:'all 0.3s',cursor:'default',
            }}
            onMouseEnter={e=>{
              (e.currentTarget as HTMLDivElement).style.background='rgba(255,157,226,0.05)';
              (e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,157,226,0.2)';
              (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)';
            }}
            onMouseLeave={e=>{
              (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.02)';
              (e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,157,226,0.08)';
              (e.currentTarget as HTMLDivElement).style.transform='translateY(0)';
            }}>
              <div style={{fontSize:'32px',marginBottom:'12px'}}>{f.emoji}</div>
              <div style={{fontSize:'15px',fontWeight:'700',color:'#ff9de2',marginBottom:'8px'}}>{f.title}</div>
              <div style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',lineHeight:'1.6'}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{maxWidth:'900px',margin:'0 auto',padding:'0 20px 80px',position:'relative',zIndex:2}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{fontSize:'12px',color:'rgba(255,157,226,0.5)',letterSpacing:'3px',marginBottom:'12px'}}>HOW IT WORKS</div>
          <h2 style={{fontSize:'28px',fontWeight:'800',margin:0,color:'rgba(255,255,255,0.85)'}}>Start settling in 3 simple steps</h2>
        </div>

        <div style={{display:'flex',gap:'20px',flexWrap:'wrap',justifyContent:'center'}}>
          {[
            {step:'01',emoji:'📝',title:'Create Account',desc:'Sign up for free in seconds with email or Google.'},
            {step:'02',emoji:'✅',title:'Complete Tasks',desc:'Work through each settlement task at your own pace.'},
            {step:'03',emoji:'🎌',title:'Settle In',desc:'Track your progress and get approved — you\'re ready for Japan!'},
          ].map((s,i)=>(
            <div key={i} style={{flex:'1',minWidth:'220px',textAlign:'center',padding:'28px 20px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,157,226,0.08)',borderRadius:'20px'}}>
              <div style={{fontSize:'11px',fontWeight:'800',color:'rgba(255,157,226,0.4)',letterSpacing:'2px',marginBottom:'12px'}}>{s.step}</div>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>{s.emoji}</div>
              <div style={{fontSize:'16px',fontWeight:'700',color:'rgba(255,255,255,0.8)',marginBottom:'8px'}}>{s.title}</div>
              <div style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',lineHeight:'1.6'}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{maxWidth:'700px',margin:'0 auto',padding:'0 20px 100px',position:'relative',zIndex:2,textAlign:'center'}}>
        <div style={{background:'rgba(255,157,226,0.04)',border:'1px solid rgba(255,157,226,0.12)',borderRadius:'24px',padding:'48px 32px'}}>
          <div style={{fontSize:'48px',marginBottom:'16px'}}>🌸</div>
          <h2 style={{fontSize:'28px',fontWeight:'900',margin:'0 0 12px',color:'#ff9de2'}}>Ready to start your Japan journey?</h2>
          <p style={{fontSize:'14px',color:'rgba(255,255,255,0.35)',margin:'0 0 28px',lineHeight:'1.7'}}>
            Join others who are using Seikatsu to navigate life in Japan with confidence.
          </p>
          <Link href="/signup" style={{
            display:'inline-block',
            padding:'14px 40px',
            background:'linear-gradient(135deg,rgba(255,157,226,0.25),rgba(179,102,255,0.25))',
            border:'1px solid rgba(255,157,226,0.4)',
            color:'#ff9de2',fontSize:'15px',fontWeight:'800',
            borderRadius:'14px',letterSpacing:'0.5px',
            boxShadow:'0 0 30px rgba(255,157,226,0.15)',
          }}>
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,0.05)',padding:'24px 20px',position:'relative',zIndex:2}}>
        <div style={{maxWidth:'900px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span style={{fontSize:'16px'}}>🌸</span>
            <span style={{color:'rgba(255,255,255,0.2)',fontSize:'12px'}}>生活 Seikatsu · Japan Settlement Guide</span>
          </div>
          <div style={{display:'flex',gap:'16px'}}>
            <Link href="/login" style={{color:'rgba(255,255,255,0.2)',fontSize:'12px'}}>Sign In</Link>
            <Link href="/signup" style={{color:'rgba(255,157,226,0.4)',fontSize:'12px'}}>Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}