'use client';
import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const taskData: Record<number, {
  title: string; titleJP: string; emoji: string; cat: string; urgent: boolean;
  desc: string; about: string;
  fields: { id: string; label: string; type: 'text'|'select'|'date'|'textarea'|'radio'; options?: string[]; placeholder?: string; required?: boolean }[];
  tips: string[];
  links?: { label: string; url: string }[];
}> = {
  1: {
    title:'Register at ward office', titleJP:'住民登録', emoji:'🏯', cat:'residence', urgent:true,
    desc:'Required within 14 days of arrival.',
    about:'Registering your address at the local ward office (市区町村役場) is the most important first step. You will receive your Residence Registration (住民票) which is needed for almost everything else.',
    fields:[
      {id:'city',label:'Which city/ward are you registering in?',type:'text',placeholder:'e.g. Shinjuku, Tokyo',required:true},
      {id:'date',label:'Date of registration',type:'date',required:true},
      {id:'ward_office',label:'Name of your ward office',type:'text',placeholder:'e.g. Shinjuku City Office'},
      {id:'notes',label:'Any notes or observations',type:'textarea',placeholder:'e.g. staff were helpful, took 30 mins...'},
    ],
    tips:['Bring your passport + residence card + 1 passport photo','Go on weekday mornings to avoid queues','Some ward offices have English-speaking staff','You can ask for an English form'],
    links:[{label:'Find your ward office',url:'https://www.city.tokyo.lg.jp/en/'}],
  },
  2: {
    title:'Apply for My Number Card', titleJP:'マイナンバーカード申請', emoji:'🪪', cat:'residence', urgent:false,
    desc:"Japan's national ID card.",
    about:'The My Number Card (マイナンバーカード) is Japan\'s national ID. You need it for tax filings, health insurance, and some banking. It takes about 1 month to receive after applying.',
    fields:[
      {id:'applied_date',label:'Date you applied',type:'date',required:true},
      {id:'method',label:'How did you apply?',type:'radio',options:['At ward office','Online via QR code','Via post'],required:true},
      {id:'pickup_date',label:'Expected pickup date',type:'date'},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Any observations...'},
    ],
    tips:['Your notification letter has a QR code for online application','Pin numbers are set when you pick up the card','Keep your card safe — it has your address on it','You can use it as ID at convenience store ATMs'],
  },
  3: {
    title:'Enroll in Health Insurance', titleJP:'国民健康保険加入', emoji:'🏥', cat:'health', urgent:true,
    desc:'Covers 70% of all medical costs.',
    about:'National Health Insurance (国民健康保険) covers 70% of all medical expenses. Premiums are based on your income from the previous year — so your first year is usually very affordable.',
    fields:[
      {id:'enrolled_date',label:'Date of enrollment',type:'date',required:true},
      {id:'monthly_premium',label:'Monthly premium amount (¥)',type:'text',placeholder:'e.g. 3000',required:true},
      {id:'insurance_number',label:'Insurance card number',type:'text',placeholder:'Your card number'},
      {id:'type',label:'Type of insurance',type:'radio',options:['National Health Insurance (国民健康保険)','Employee Insurance (健康保険)','Other'],required:true},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Any observations...'},
    ],
    tips:['Apply at ward office right after address registration','Bring your residence card, passport, and My Number','Premiums can be reduced if your income is low','Keep your health insurance card with you at all times'],
  },
  4: {
    title:'Open a bank account', titleJP:'銀行口座の開設', emoji:'🏦', cat:'finance', urgent:false,
    desc:'Needed for salary, rent, and utilities.',
    about:'A Japanese bank account is essential for receiving salary and paying bills. Japan Post Bank is the easiest for newcomers as it has no minimum residency requirement.',
    fields:[
      {id:'bank',label:'Which bank did you choose?',type:'select',options:['Japan Post Bank (ゆうちょ銀行)','Rakuten Bank','Sony Bank','MUFG','Mizuho','SMBC','Seven Bank','Other'],required:true},
      {id:'opened_date',label:'Date account was opened',type:'date',required:true},
      {id:'branch',label:'Branch name/location',type:'text',placeholder:'e.g. Shinjuku branch'},
      {id:'online_banking',label:'Set up online banking?',type:'radio',options:['Yes','No','In progress']},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Any tips for others...'},
    ],
    tips:['Japan Post Bank is the easiest for newcomers','Bring residence card, passport, and My Number','Some banks require 6 months of residency','Get a hanko (seal) for ¥500 at a 100-yen store'],
    links:[{label:'Japan Post Bank English',url:'https://www.jp-bank.japanpost.jp/en/'}],
  },
  5: {
    title:'Get a SIM card', titleJP:'SIMカードの契約', emoji:'📱', cat:'daily', urgent:false,
    desc:'Stay connected in Japan.',
    about:'Getting a Japanese phone plan is essential for navigation, communication, and work. Several carriers offer English support and affordable plans.',
    fields:[
      {id:'carrier',label:'Which carrier did you choose?',type:'select',options:['IIJmio','Rakuten Mobile','DOCOMO','SoftBank','au','Aeon Mobile','Mineo','Other'],required:true},
      {id:'plan',label:'Monthly plan cost (¥)',type:'text',placeholder:'e.g. 2000',required:true},
      {id:'data',label:'Data allowance',type:'text',placeholder:'e.g. 20GB'},
      {id:'sim_type',label:'SIM type',type:'radio',options:['Physical SIM','eSIM','Data only SIM']},
      {id:'phone_number',label:'Your Japanese phone number',type:'text',placeholder:'080-XXXX-XXXX'},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Would you recommend this carrier?'},
    ],
    tips:['Install LINE immediately after getting your SIM','IIJmio has great English support','Rakuten Mobile has free domestic calls','Prepaid SIMs are available at airports on day 1'],
  },
  6: {
    title:'Confirm your visa status', titleJP:'在留資格の確認', emoji:'📋', cat:'work', urgent:false,
    desc:'Verify your residence card matches your job.',
    about:'Your residence card shows your status of residence (在留資格). It\'s crucial this matches your actual work. If changing jobs, you must notify immigration within 14 days.',
    fields:[
      {id:'visa_type',label:'Your visa/status type',type:'select',options:['Engineer/Specialist in Humanities/International Services','Highly Skilled Professional','Intra-company Transferee','Student','Working Holiday','Spouse of Japanese National','Permanent Resident','Other'],required:true},
      {id:'expiry',label:'Visa expiry date',type:'date',required:true},
      {id:'employer',label:'Employer name (if applicable)',type:'text',placeholder:'Company name'},
      {id:'confirmed',label:'Confirmed with HR?',type:'radio',options:['Yes','No','Not applicable']},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Any visa-related observations...'},
    ],
    tips:['Never work outside your visa status','Notify immigration within 14 days of changing jobs','You can check your status at immigration bureau','Visa renewal should start 3 months before expiry'],
  },
  7: {
    title:'Enroll in Employee Pension', titleJP:'厚生年金への加入', emoji:'💼', cat:'health', urgent:false,
    desc:'Auto-enrolled by employer.',
    about:'Employee pension (厚生年金) is automatically handled by your employer. If self-employed, you need to enroll in National Pension (国民年金) at the ward office.',
    fields:[
      {id:'type',label:'Which pension type?',type:'radio',options:['Employee Pension via employer (厚生年金)','National Pension self-enrolled (国民年金)','Not yet enrolled'],required:true},
      {id:'monthly_amount',label:'Monthly contribution (¥)',type:'text',placeholder:'e.g. 15000'},
      {id:'confirmed_hr',label:'Confirmed with HR?',type:'radio',options:['Yes','No','Self-employed']},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Any notes...'},
    ],
    tips:['Keep all pension records — you can claim a refund when leaving Japan','The refund is called 脱退一時金 (lump-sum withdrawal)','You can claim within 2 years of leaving Japan','Contributions are ~9.15% of salary'],
  },
  8: {
    title:'Set up utility payments', titleJP:'光熱費の設定', emoji:'⚡', cat:'finance', urgent:false,
    desc:'Electricity, gas, and water.',
    about:'Setting up utilities is essential for your apartment. Most can be done online or by phone. Your real estate agent may help on move-in day.',
    fields:[
      {id:'electricity',label:'Electricity provider',type:'select',options:['TEPCO (Tokyo Electric)','Kansai Electric','Chubu Electric','Other','Not set up yet'],required:true},
      {id:'gas',label:'Gas provider',type:'select',options:['Tokyo Gas','Osaka Gas','Toho Gas','Other','Not applicable (no gas)','Not set up yet'],required:true},
      {id:'water',label:'Water',type:'radio',options:['Handled by landlord','Set up myself','Not yet done']},
      {id:'autopay',label:'Set up auto-pay?',type:'radio',options:['Yes','No']},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Tips for setting up utilities...'},
    ],
    tips:['TEPCO and Tokyo Gas have English websites','Set up auto-pay from your bank account','Water is often included in rent','Internet setup can take 1-2 weeks — plan ahead'],
  },
  9: {
    title:'Get a Suica or Pasmo card', titleJP:'Suica・PASMOの取得', emoji:'🚃', cat:'daily', urgent:false,
    desc:'IC card for trains and daily payments.',
    about:'IC cards like Suica and Pasmo work on all trains, buses, and at most convenience stores. They are rechargeable and make daily life much easier.',
    fields:[
      {id:'card_type',label:'Which card did you get?',type:'radio',options:['Suica','Pasmo','ICOCA','Other IC card'],required:true},
      {id:'got_date',label:'Date obtained',type:'date'},
      {id:'initial_charge',label:'Initial charge amount (¥)',type:'text',placeholder:'e.g. 2000'},
      {id:'mobile',label:'Using mobile version (Apple/Google Pay)?',type:'radio',options:['Yes','No, physical card']},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Tips for using IC cards...'},
    ],
    tips:['You can use Suica/Pasmo at 7-Eleven, FamilyMart, and Lawson','Mobile Suica works with iPhone and Android','Keep at least ¥1,000 charged for daily use','Suica and Pasmo are interchangeable nationwide'],
  },
  10: {
    title:'Get a personal seal (Hanko)', titleJP:'印鑑・ハンコの取得', emoji:'🔏', cat:'work', urgent:false,
    desc:'Required for some contracts.',
    about:'A hanko (印鑑) is a personal seal used instead of signatures in Japan. Foreigners can get a katakana name seal for most purposes. Required for some real estate and banking.',
    fields:[
      {id:'got_hanko',label:'Did you get a hanko?',type:'radio',options:['Yes','Not yet','Not needed'],required:true},
      {id:'where',label:'Where did you get it?',type:'select',options:['100-yen store','Stationery store','Online','Hanko specialty shop','Not yet']},
      {id:'type',label:'Type of seal',type:'radio',options:['Katakana name seal','Romaji name seal','Japanese name seal','Registered seal (実印)']},
      {id:'registered',label:'Registered at ward office (実印登録)?',type:'radio',options:['Yes','No','Not needed yet']},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Any tips about getting a hanko...'},
    ],
    tips:['A basic hanko costs ¥300-500 at 100-yen stores','Katakana seals are perfectly accepted for foreigners','Only register as 実印 if needed for real estate','Many modern banks and services no longer require hanko'],
  },
  11: {
    title:'Set up LINE and essential apps', titleJP:'LINEと必須アプリの設定', emoji:'💬', cat:'daily', urgent:false,
    desc:'Essential apps for life in Japan.',
    about:'LINE is Japan\'s primary messaging app used by 97% of the population. You also need apps for navigation, payments, and news. Setting these up early makes daily life much easier.',
    fields:[
      {id:'line',label:'Installed LINE?',type:'radio',options:['Yes','No'],required:true},
      {id:'paypay',label:'Set up PayPay or other cashless payment?',type:'radio',options:['Yes - PayPay','Yes - d-Payment','Yes - Other','No']},
      {id:'maps',label:'Navigation app of choice',type:'select',options:['Google Maps','Yahoo! Maps Japan','Apple Maps','Navitime','Other']},
      {id:'other_apps',label:'Other useful apps you installed',type:'textarea',placeholder:'e.g. NHK World, Hyperdia, Tabelog...'},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'App recommendations for others...'},
    ],
    tips:['LINE is used for work, school, and social life in Japan','PayPay is accepted almost everywhere now','Google Maps works great for trains in Japan','NHK World app provides English news about Japan'],
  },
  12: {
    title:'Update Residence Card address', titleJP:'在留カードの住所変更', emoji:'🏠', cat:'residence', urgent:false,
    desc:'Update within 14 days of moving.',
    about:'Every time you move in Japan, you must update your address at the ward office within 14 days. Your residence card will be updated on the spot.',
    fields:[
      {id:'new_address',label:'New address (city/ward)',type:'text',placeholder:'e.g. Shibuya, Tokyo',required:true},
      {id:'updated_date',label:'Date address was updated',type:'date',required:true},
      {id:'bank_updated',label:'Updated bank with new address?',type:'radio',options:['Yes','No','Not yet']},
      {id:'employer_updated',label:'Notified employer of new address?',type:'radio',options:['Yes','No','Not applicable']},
      {id:'notes',label:'Notes',type:'textarea',placeholder:'Any observations...'},
    ],
    tips:['Submit 転出届 at old ward office first if moving between wards','Then submit 転入届 at new ward office','Card is updated on the spot at ward office','Also update your bank, employer, and subscriptions'],
  },
};

function SakuraPetals() {
  const petals = Array.from({length:12},(_,i)=>({id:i,left:`${4+(i*7.5)%90}%`,delay:`${(i*0.9)%8}s`,duration:`${8+(i*0.5)%5}s`,size:`${10+(i*2)%8}px`}));
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
      {petals.map(p=>(
        <div key={p.id} style={{position:'absolute',left:p.left,top:'-20px',fontSize:p.size,animation:`sakuraFall ${p.duration} ${p.delay} infinite linear`,opacity:0.5}}>🌸</div>
      ))}
    </div>
  );
}

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = Number(params.id);
  const task = taskData[taskId];

  const [formData, setFormData] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user??null);
      if(session?.user) loadExisting(session.user.id);
    });
  },[]);

  const loadExisting = async(uid:string)=>{
    setLoading(true);
    const{data}=await supabase.from('task_responses').select('*').eq('user_id',uid).eq('task_id',taskId).single();
    if(data){ setFormData(data.responses||{}); setCompleted(data.completed||false); }
    setLoading(false);
  };

  const save = async(markComplete:boolean)=>{
    if(!user){ alert('Please sign in to save your progress!'); return; }
    setSaving(true);
    await supabase.from('task_responses').upsert({
      user_id:user.id, task_id:taskId,
      responses:formData, completed:markComplete,
      updated_at:new Date().toISOString()
    });
    setSaving(false);
    setSaved(true);
    if(markComplete) setCompleted(true);
    setTimeout(()=>setSaved(false),2000);
  };

  if(!task) return <div style={{color:'white',padding:'40px',textAlign:'center'}}>Task not found</div>;

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0a2e 0%,#0d0820 50%,#0a0515 100%)',fontFamily:"'DM Sans',system-ui,sans-serif",color:'white'}}>
      <style>{`
        @keyframes sakuraFall{0%{transform:translateY(-20px) rotate(0deg);opacity:0}10%{opacity:0.6}90%{opacity:0.4}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes floatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes successPop{0%{transform:scale(0.8);opacity:0}50%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        *{box-sizing:border-box}
        input,textarea,select{color:white!important}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25)!important}
      `}</style>
      <SakuraPetals/>

      <div style={{position:'fixed',top:'-5%',left:'15%',width:'500px',height:'400px',background:'radial-gradient(ellipse,rgba(255,157,226,0.07) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

      {/* Header */}
      <header style={{position:'sticky',top:0,zIndex:30,background:'rgba(26,10,46,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,157,226,0.1)'}}>
        <div style={{maxWidth:'700px',margin:'0 auto',padding:'14px 20px',display:'flex',alignItems:'center',gap:'12px'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'8px',color:'rgba(255,157,226,0.6)',fontSize:'13px',fontWeight:'600',textDecoration:'none'}}>
            ← Back
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginLeft:'8px'}}>
            <span style={{fontSize:'20px'}}>{task.emoji}</span>
            <span style={{color:'#ff9de2',fontWeight:'700',fontSize:'14px'}}>{task.title}</span>
          </div>
          {completed && (
            <span style={{marginLeft:'auto',fontSize:'11px',padding:'3px 12px',background:'rgba(0,255,100,0.1)',border:'1px solid rgba(0,255,100,0.3)',color:'#00ff9f',borderRadius:'20px',fontWeight:'700'}}>
              ✓ Completed
            </span>
          )}
        </div>
      </header>

      <main style={{maxWidth:'700px',margin:'0 auto',padding:'32px 20px',position:'relative',zIndex:2,animation:'fadeIn 0.4s ease'}}>
        {/* Task hero */}
        <div style={{background:'rgba(255,157,226,0.05)',border:'1px solid rgba(255,157,226,0.15)',borderRadius:'20px',padding:'24px',marginBottom:'28px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',right:'-10px',bottom:'-10px',fontSize:'80px',opacity:0.06,lineHeight:1}}>🌸</div>
          <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'16px'}}>
            <div style={{fontSize:'48px',lineHeight:1,animation:'floatBob 4s infinite'}}>{task.emoji}</div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                <span style={{fontSize:'11px',padding:'2px 10px',background:`rgba(255,157,226,0.1)`,border:'1px solid rgba(255,157,226,0.2)',color:'rgba(255,157,226,0.7)',borderRadius:'20px',textTransform:'uppercase',letterSpacing:'1px'}}>{task.cat}</span>
                {task.urgent&&!completed&&<span style={{fontSize:'11px',padding:'2px 10px',background:'rgba(255,100,100,0.1)',border:'1px solid rgba(255,100,100,0.3)',color:'#ff8080',borderRadius:'20px',fontWeight:'700'}}>⚡ URGENT</span>}
                {completed&&<span style={{fontSize:'11px',padding:'2px 10px',background:'rgba(0,255,100,0.1)',border:'1px solid rgba(0,255,100,0.3)',color:'#00ff9f',borderRadius:'20px',fontWeight:'700'}}>✓ COMPLETED</span>}
              </div>
              <h1 style={{margin:0,fontSize:'22px',fontWeight:'800',color:'#ff9de2',lineHeight:1.2}}>{task.title}</h1>
              <div style={{fontSize:'13px',color:'rgba(255,157,226,0.5)',marginTop:'2px'}}>{task.titleJP}</div>
            </div>
          </div>
          <p style={{margin:0,fontSize:'14px',color:'rgba(255,255,255,0.55)',lineHeight:'1.7'}}>{task.about}</p>
        </div>

        {/* Tips */}
        <div style={{background:'rgba(255,224,102,0.04)',border:'1px solid rgba(255,224,102,0.15)',borderRadius:'16px',padding:'18px',marginBottom:'28px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
            <span style={{fontSize:'16px'}}>💡</span>
            <span style={{color:'#ffe066',fontWeight:'700',fontSize:'13px',letterSpacing:'0.5px'}}>Tips & Reminders</span>
          </div>
          <ul style={{margin:0,padding:'0 0 0 16px',display:'flex',flexDirection:'column',gap:'6px'}}>
            {task.tips.map((tip,i)=>(
              <li key={i} style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',lineHeight:'1.5'}}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Links */}
        {task.links&&task.links.length>0&&(
          <div style={{display:'flex',gap:'10px',marginBottom:'28px',flexWrap:'wrap'}}>
            {task.links.map((link,i)=>(
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'8px 16px',background:'rgba(179,102,255,0.1)',border:'1px solid rgba(179,102,255,0.25)',color:'#b366ff',borderRadius:'20px',fontSize:'12px',fontWeight:'600',textDecoration:'none'}}>
                🔗 {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Form */}
        {loading?(
          <div style={{textAlign:'center',padding:'40px',color:'rgba(255,157,226,0.5)'}}>
            <div style={{fontSize:'32px',marginBottom:'8px',animation:'floatBob 2s infinite'}}>🌸</div>
            <div>Loading your saved data...</div>
          </div>
        ):(
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,157,226,0.1)',borderRadius:'20px',padding:'24px',marginBottom:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
              <span style={{fontSize:'16px'}}>📝</span>
              <span style={{color:'#ff9de2',fontWeight:'700',fontSize:'14px'}}>Fill in your details</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              {task.fields.map(field=>(
                <div key={field.id}>
                  <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'rgba(255,255,255,0.6)',marginBottom:'8px',letterSpacing:'0.3px'}}>
                    {field.label}
                    {field.required&&<span style={{color:'#ff9de2',marginLeft:'4px'}}>*</span>}
                  </label>

                  {field.type==='text'&&(
                    <input value={formData[field.id]||''} onChange={e=>setFormData(p=>({...p,[field.id]:e.target.value}))}
                      placeholder={field.placeholder}
                      style={{width:'100%',background:'rgba(255,157,226,0.06)',border:'1px solid rgba(255,157,226,0.2)',padding:'10px 14px',fontSize:'13px',outline:'none',borderRadius:'12px',transition:'border-color 0.2s'}}
                      onFocus={e=>(e.target as HTMLInputElement).style.borderColor='rgba(255,157,226,0.5)'}
                      onBlur={e=>(e.target as HTMLInputElement).style.borderColor='rgba(255,157,226,0.2)'}
                    />
                  )}

                  {field.type==='date'&&(
                    <input type="date" value={formData[field.id]||''} onChange={e=>setFormData(p=>({...p,[field.id]:e.target.value}))}
                      style={{width:'100%',background:'rgba(255,157,226,0.06)',border:'1px solid rgba(255,157,226,0.2)',padding:'10px 14px',fontSize:'13px',outline:'none',borderRadius:'12px',colorScheme:'dark'}}
                    />
                  )}

                  {field.type==='textarea'&&(
                    <textarea value={formData[field.id]||''} onChange={e=>setFormData(p=>({...p,[field.id]:e.target.value}))}
                      placeholder={field.placeholder} rows={3}
                      style={{width:'100%',background:'rgba(255,157,226,0.06)',border:'1px solid rgba(255,157,226,0.2)',padding:'10px 14px',fontSize:'13px',outline:'none',borderRadius:'12px',resize:'vertical',fontFamily:'inherit'}}
                    />
                  )}

                  {field.type==='select'&&(
                    <select value={formData[field.id]||''} onChange={e=>setFormData(p=>({...p,[field.id]:e.target.value}))}
                      style={{width:'100%',background:'#1a0a2e',border:'1px solid rgba(255,157,226,0.2)',padding:'10px 14px',fontSize:'13px',outline:'none',borderRadius:'12px',cursor:'pointer'}}>
                      <option value="">Select an option...</option>
                      {field.options?.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}

                  {field.type==='radio'&&(
                    <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                      {field.options?.map(opt=>(
                        <label key={opt} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 14px',background:formData[field.id]===opt?'rgba(255,157,226,0.15)':'rgba(255,255,255,0.03)',border:`1px solid ${formData[field.id]===opt?'rgba(255,157,226,0.4)':'rgba(255,255,255,0.1)'}`,borderRadius:'20px',cursor:'pointer',fontSize:'12px',color:formData[field.id]===opt?'#ff9de2':'rgba(255,255,255,0.5)',transition:'all 0.2s',fontWeight:formData[field.id]===opt?'700':'400'}}>
                          <input type="radio" name={field.id} value={opt} checked={formData[field.id]===opt} onChange={()=>setFormData(p=>({...p,[field.id]:opt}))} style={{display:'none'}}/>
                          {formData[field.id]===opt?'🌸':''} {opt}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!user&&(
          <div style={{background:'rgba(255,157,226,0.06)',border:'1px solid rgba(255,157,226,0.15)',borderRadius:'16px',padding:'16px',marginBottom:'16px',textAlign:'center',fontSize:'13px',color:'rgba(255,157,226,0.6)'}}>
            💡 <Link href="/" style={{color:'#ff9de2',fontWeight:'700',textDecoration:'none'}}>Sign in</Link> to save your responses to the cloud
          </div>
        )}

        <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
          <button onClick={()=>save(false)} disabled={saving||!user}
            style={{flex:1,minWidth:'140px',padding:'14px',background:'rgba(255,157,226,0.08)',border:'1px solid rgba(255,157,226,0.25)',color:'#ff9de2',fontSize:'14px',fontWeight:'700',cursor:saving||!user?'not-allowed':'pointer',borderRadius:'14px',opacity:saving||!user?0.5:1,transition:'all 0.2s'}}>
            {saving?'Saving... 🌸':'💾 Save Progress'}
          </button>
          <button onClick={()=>save(true)} disabled={saving||completed||!user}
            style={{flex:1,minWidth:'140px',padding:'14px',background:completed?'rgba(0,255,100,0.1)':'rgba(255,157,226,0.2)',border:`1px solid ${completed?'rgba(0,255,100,0.4)':'rgba(255,157,226,0.5)'}`,color:completed?'#00ff9f':'#ff9de2',fontSize:'14px',fontWeight:'700',cursor:saving||completed||!user?'not-allowed':'pointer',borderRadius:'14px',opacity:saving||!user?0.5:1,transition:'all 0.2s'}}>
            {completed?'✓ Completed!':'✅ Mark as Complete'}
          </button>
        </div>

        {saved&&(
          <div style={{marginTop:'16px',textAlign:'center',fontSize:'14px',color:'#00ff9f',animation:'successPop 0.4s ease',fontWeight:'700'}}>
            🌸 Saved successfully!
          </div>
        )}

        {/* Back button */}
        <div style={{marginTop:'32px',textAlign:'center'}}>
          <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'10px 20px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)',borderRadius:'20px',fontSize:'13px',textDecoration:'none',fontWeight:'600'}}>
            ← Back to all tasks
          </Link>
        </div>

        <div style={{marginTop:'40px',textAlign:'center',borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'20px'}}>
          <div style={{fontSize:'20px',marginBottom:'6px'}}>🌸 ⛩️ 🗻</div>
          <div style={{fontSize:'11px',color:'rgba(255,255,255,0.08)',letterSpacing:'2px'}}>生活 SEIKATSU · JAPAN SETTLEMENT GUIDE</div>
        </div>
      </main>
    </div>
  );
}