import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECT_LINKS } from '../config'
import { FoodDemo, Pipeline, STUDY, VIDEO, CropDemo, SheetDemo } from './Demos'

const PROJECTS = [
  { id: 'food', title: 'Food Delivery Website', tags: ['Full Stack', 'JavaScript'], stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT'],
    blurb: 'A full-stack food ordering platform with separate customer and admin roles.',
    challenge: 'Keeping catalog, cart and order logic organised and secure as the scope grew.',
    built: ['JWT authentication and role-based access control', 'Normalised database schemas', 'REST endpoints for catalog, cart and orders (MVC)'],
    arch: ['React UI', 'REST API', 'JWT + RBAC', 'Controllers', 'MongoDB'], Demo: FoodDemo },
  { id: 'study', title: 'StudyBuddy', tags: ['AI/ML'], stack: ['Streamlit', 'Flask', 'FAISS', 'LangChain', 'Ollama'],
    blurb: 'An AI academic assistant built by a small team: PDF summarisation, code analysis, video processing and voice interaction.',
    challenge: 'Coordinating several modules across a team and testing each one before integration.',
    built: ['The frontend', 'Contributions to backend modules', 'Independent testing of each module before integration'],
    arch: ['Streamlit UI', 'Flask API', 'LangChain', 'FAISS', 'Ollama'], Demo: () => <Pipeline stages={STUDY} note="Simulated walkthrough, not a live AI product" /> },
  { id: 'crop', title: 'Crop Recommendation System', tags: ['AI/ML'], stack: ['Python', 'Scikit-learn', 'Decision Tree', 'Random Forest'],
    blurb: 'Predicts a suitable crop from soil and weather parameters.',
    challenge: 'Getting clean, useful features out of raw agricultural data.',
    built: ['Data preprocessing and feature engineering', 'Decision Tree and Random Forest models', 'Model evaluation'],
    arch: ['Dataset', 'Preprocessing', 'Features', 'Models', 'Evaluation'], Demo: CropDemo },
  { id: 'sheet', title: 'Spreadsheet Enhancement System', tags: ['JavaScript', 'Frontend'], stack: ['JavaScript', 'HTML', 'CSS'],
    blurb: 'An Excel-like interface in vanilla JavaScript with formulas, live updates and theme switching.',
    challenge: 'Re-rendering large grids quickly without lag.',
    built: ['Dynamic formula evaluation', 'Real-time cell updates', 'Theme toggling', 'Optimised DOM manipulation and rendering'],
    arch: ['Cell input', 'Formula parser', 'Dependency lookup', 'Render'], Demo: SheetDemo },
  { id: 'video', title: 'Video Analyzer', tags: ['AI/ML'], stack: ['Python', 'Whisper', 'BLIP', 'LLMs'],
    blurb: 'A local video analyser that extracts speech and visual context, then writes a summary.',
    challenge: 'Combining speech and visual signals into one coherent summary.',
    built: ['A modular processing pipeline', 'A user-friendly interface', 'Speech, visual and summary stages'],
    arch: ['Video', 'Audio', 'Whisper', 'BLIP', 'LLM summary'], Demo: () => <Pipeline stages={VIDEO} note="Simulated walkthrough, no real processing" /> }
]
const FILTERS = ['All', 'Full Stack', 'JavaScript', 'Frontend', 'AI/ML']

const Link = ({ href, label, ph }) => href
  ? <a className="btn" href={href} target="_blank" rel="noopener noreferrer">{label}</a>
  : <span className="ph" title="Set in src/config.js">{ph}</span>

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [sel, setSel] = useState('food')
  const shown = PROJECTS.filter((p) => filter === 'All' || p.tags.includes(filter))
  const p = shown.find((x) => x.id === sel) || shown[0]
  const L = PROJECT_LINKS[p.id]
  return (
    <div className="work-wrap">
      <div className="chips" role="group" aria-label="Filter projects">{FILTERS.map((f) => <button key={f} className={filter === f ? 'on' : ''} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}</div>
      <div className="work">
        <ul className="plist">{shown.map((x) => (
          <li key={x.id}><button className={x.id === p.id ? 'on' : ''} aria-current={x.id === p.id} onClick={() => setSel(x.id)}>
            <span className="mono">{String(PROJECTS.indexOf(x) + 1).padStart(2, '0')}</span>{x.title}{x.id === p.id && <motion.span layoutId="pind" className="pind" />}</button></li>))}</ul>
        <AnimatePresence mode="wait">
          <motion.article key={p.id} className="stage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            <h3>{p.title}</h3>
            <p className="lead">{p.blurb}</p>
            <p className="tech">{p.stack.map((s) => <span key={s}>{s}</span>)}</p>
            <ol className="arch" aria-label="Architecture">{p.arch.map((a) => <li key={a}>{a}</li>)}</ol>
            <p.Demo />
            <div className="cols"><div><h4>Engineering challenge</h4><p>{p.challenge}</p></div>
              <div><h4>What I built</h4><ul>{p.built.map((b) => <li key={b}>{b}</li>)}</ul></div></div>
            
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  )
}
