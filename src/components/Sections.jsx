import { motion } from 'framer-motion'
import { LINKS } from '../config'
import { Reveal, Magnetic, Ext } from './ui'

const TL = [
  ['2020', 'Secondary education', 'D.A.V Public School, Barora, Dhanbad'],
  ['2022', 'Senior secondary (Science)', 'D.A.V Public School, Barora, Dhanbad'],
  ['2022', 'Starts B.Tech in CS & Business Systems', 'Asansol Engineering College'],
  ['2023', 'Web Developer Intern at CODESOFT', 'Built a responsive dashboard that worked across 15+ screen sizes, sped up page loads and fixed 20+ UI and performance bugs.'],
  ['2024', 'Smart India Hackathon, College Round: rank 8', 'Among 80+ teams.'],
  ['2026', 'B.Tech graduate', 'Open to software engineering opportunities.']
]
export function Journey() {
  return (
    <ol className="timeline">{[...TL].reverse().map(([y, t, d], i) => (
      <Reveal as="li" key={t} delay={i * 0.04}><span className="yr mono">{y}</span><div><h3>{t}</h3><p>{d}</p></div></Reveal>))}</ol>
  )
}

export function Resume() {
  return (
    <div className="resume">
      <div><h3>Resume</h3><p>The story is above. The details are here.</p></div>
      <div className="row"><a className="btn solid" href={LINKS.resume} target="_blank" rel="noopener noreferrer">View resume</a>
        <a className="btn" href={LINKS.resume} download>Download resume</a></div>
    </div>
  )
}

const BEYOND = ['Cycling', 'Training', 'Volleyball', 'Badminton']
export function Beyond() {
  return <ul className="beyond-row">{BEYOND.map((b) => <li key={b}>{b}</li>)}</ul>
}

export function Footer() {
  return (
    <footer className="footer">
      <div><b>Richa Ranjan</b><p>Software Engineer / Full-Stack Developer</p><p className="muted">Built with curiosity, code, and way too many iterations.</p>
        <div className="foot-contact"><a href={'mailto:' + LINKS.email}>Email: {LINKS.email}</a><a href={'tel:' + LINKS.phoneHref}>Phone: {LINKS.phone}</a></div></div>
      <div className="foot-links"><Ext href={LINKS.github}>GitHub</Ext><Ext href={LINKS.linkedin}>LinkedIn</Ext><Ext href={LINKS.gfg}>GeeksforGeeks</Ext><a href={'mailto:' + LINKS.email}>Email</a></div>
      <p className="muted small">© 2026 Richa Ranjan</p>
    </footer>
  )
}
