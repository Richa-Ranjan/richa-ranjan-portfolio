import { useState } from 'react'
import { LINKS } from '../config'
import { Reveal, Ext } from './ui'
export default function Contact({ visitor }) {
  const [f, setF] = useState({ name: visitor?.name || '', email: visitor?.email || '', subject: '', message: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const send = (e) => {
    e.preventDefault()
    const body = `${f.message}\n\n${f.name}\n${f.email}`
    window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(body)}`
  }
  const rows = [['Email', LINKS.email, 'mailto:' + LINKS.email], ['LinkedIn', 'rranjan-tech', LINKS.linkedin], ['GitHub', 'Richa-Ranjan', LINKS.github], ['GeeksforGeeks', 'ranjanricha12', LINKS.gfg]]
  return (
    <div className="contact">
      <Reveal as="h2" className="h2">Contact</Reveal>
      <p className="lead">Have a role, project, or idea worth building? Open to software engineering opportunities.</p>
      <div className="contact-grid">
        <ul className="links">{rows.map(([n, v, h]) => <li key={n}><Ext href={h}><span className="mono">{n}</span><span>{v}</span></Ext></li>)}<li><span className="mono">Location</span><span>Dhanbad, Jharkhand, India</span></li></ul>
        <form className="cform" onSubmit={send}>
          <label className="field">Name<input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
          <label className="field">Email<input type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></label>
          <label className="field">Subject<input required value={f.subject} onChange={set('subject')} /></label>
          <label className="field">Message<textarea required rows={5} value={f.message} onChange={set('message')} /></label>
          <button className="btn solid" style={{ justifySelf: 'start' }}>Send message</button>
          <p className="muted small">Opens in your email app, addressed to Richa.</p>
        </form>
      </div>
    </div>
  )
}
