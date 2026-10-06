import { useState } from 'react'
export default function Auth({ open, close, visitor, setVisitor }) {
  const [name, setName] = useState(''), [email, setEmail] = useState('')
  if (!open) return null
  const submit = (e) => { e.preventDefault(); const v = { name: name.trim(), email: email.trim() }; localStorage.setItem('visitor', JSON.stringify(v)); setVisitor(v); close() }
  const out = () => { localStorage.removeItem('visitor'); setVisitor(null); close() }
  return (
    <div className="modal-bg" onClick={close}><form className="modal" role="dialog" aria-label="Sign in" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
      {visitor ? (<><h3>Signed in as {visitor.name}</h3><button type="button" className="btn" onClick={out}>Sign out</button></>) : (<>
        <h3>Sign in</h3><p className="muted small">Visitor sign-in for a personal touch. Saved only in your browser; no account is created.</p>
        <label className="field">Name<input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label className="field">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <button className="btn solid">Continue</button></>)}
      <button type="button" className="skip" style={{ color: 'var(--mut)' }} onClick={close}>Close</button>
    </form></div>
  )
}
