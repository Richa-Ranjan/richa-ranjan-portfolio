import { useState, useRef, useEffect } from 'react'
import { LINKS } from '../config'
const KB = [
  [['hello', 'hi', 'hey'], "Hi! I can tell you about Richa's work, skills, projects or how to reach her."],
   [[ 'how are you', 'hru'], "I'm good and i hope you are doing well."],
  [['skill', 'tech', 'stack', 'java', 'mern', 'know', 'language'], 'Richa works mainly with Java and the MERN stack (MongoDB, Express.js, React, Node.js), with REST APIs, MySQL and Git. Python and machine learning are secondary.'],
  [['project', 'built', 'work'], 'Five projects: Food Delivery (MERN), StudyBuddy (AI study assistant), Crop Recommendation (ML), Spreadsheet Enhancement System (JavaScript) and Video Analyzer. Each has a demo in the Work section.'],
  [['intern', 'experience', 'codesoft'], 'She was a Web Developer Intern at CODESOFT in June to July 2023. She built a responsive portfolio dashboard, sped up page loads and fixed 20+ UI and performance bugs.'],
  [['hackathon', 'sih', 'smart india'], 'She ranked 8th among 80+ teams in the Smart India Hackathon 2024 college round.'],
  [['dsa', 'problem solving', 'geeks', 'algorithm'], 'She has solved 450+ data structures and algorithms problems on GeeksforGeeks. Profile: ' + LINKS.gfg],
  [['educat', 'study', 'college', 'degree', 'graduat'], 'B.Tech in Computer Science & Business Systems at Asansol Engineering College, 2022 to 2026.'],
  [['where', 'location', 'live', 'from'], 'Richa is based in Dhanbad, Jharkhand, India.'],
  [['hire', 'open', 'available', 'job', 'role'], 'She is open to software engineering opportunities: SDE, Java, full-stack and backend roles.'],
  [['contact', 'email', 'reach', 'linkedin', 'github', 'resume'], `Email: ${LINKS.email}. LinkedIn: ${LINKS.linkedin}. GitHub: ${LINKS.github}. The resume is in the Journey section.`]
]
const CHIPS = ['Projects', 'Skills', 'Internship', 'Hackathon', 'Contact']
export default function Chat() {
  const [open, setOpen] = useState(false), [q, setQ] = useState('')
  const [m, setM] = useState([{ me: false, t: "Hi, I'm the portfolio assistant. Ask me about Richa." }])
  const end = useRef()
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [m, open])
  const ask = (text) => {
    if (!text.trim()) return
    const l = text.toLowerCase(), hit = KB.find(([k]) => k.some((w) => l.includes(w)))
    setM((x) => [...x, { me: true, t: text }, { me: false, t: hit ? hit[1] : `I only know what is on this site. For anything else, email ${LINKS.email}.` }]); setQ('')
  }
  return (<>
    {open && <section className="chat" aria-label="Portfolio assistant"><header>Ask anything about Richa</header>
      <div className="msgs" aria-live="polite">{m.map((x, i) => <p key={i} className={'msg' + (x.me ? ' me' : '')}>{x.t}</p>)}<span ref={end} /></div>
      <div className="sugg">{CHIPS.map((c) => <button key={c} onClick={() => ask(c)}>{c}</button>)}</div>
      <form onSubmit={(e) => { e.preventDefault(); ask(q) }}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a question…" aria-label="Your question" /><button>Send</button></form></section>}
    <button className="chat-fab" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Close' : 'Chat with bot'}</button>
  </>)
}
