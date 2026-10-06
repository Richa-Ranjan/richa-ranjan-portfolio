import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function Door({ onDone }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const touch = typeof matchMedia !== 'undefined' && matchMedia('(pointer:coarse)').matches
  const enter = () => { if (open) return; if (reduce) return onDone(); setOpen(true); setTimeout(onDone, 2000) }
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onDone()
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [onDone])
  return (
    <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 0.7 }} role="dialog" aria-label="Intro"
      onClick={touch ? enter : undefined}>
      <div className={'room' + (open ? ' open' : '')}>
        <div className="floor" />
        <div className="frame">
          <div className="beyond"><span className="b-name">Richa Ranjan</span><span className="b-role">Software Engineer</span></div>
          <div className="door">
            <span className="door-panel" /><span className="door-panel p2" />
            <button className="handle" onClick={(e) => { e.stopPropagation(); enter() }} aria-label="Open the door" />
          </div>
        </div>
      </div>
      <div className="intro-copy">
        <p className="hint">{touch ? 'Tap anywhere to open the door' : 'Click the door handle to enter'}</p>
        <button className="skip" onClick={(e) => { e.stopPropagation(); onDone() }}>Skip intro</button>
      </div>
    </motion.div>
  )
}
