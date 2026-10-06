import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LINKS, SECTIONS } from '../config'

export default function Palette({ open, setOpen, toggleTheme }) {
  const [q, setQ] = useState('')
  const ref = useRef(null)
  const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const ext = (u) => () => window.open(u, '_blank', 'noopener')
  const cmds = [
    ['Go to Work', go('work')], ['Go to Skills', go('engineering')], ['Go to Journey', go('journey')],
    ['Go to Beyond code', go('beyond')], ['Contact Richa', go('contact')],
    ['Open GitHub', ext(LINKS.github)], ['Open LinkedIn', ext(LINKS.linkedin)], ['Open GeeksforGeeks', ext(LINKS.gfg)],
    ['Download resume', () => { const a = document.createElement('a'); a.href = LINKS.resume; a.download = ''; a.click() }],
    ['Toggle light / dark theme', toggleTheme]
  ]
  const list = cmds.filter(([n]) => n.toLowerCase().includes(q.toLowerCase()))
  useEffect(() => { if (open) { setQ(''); setTimeout(() => ref.current?.focus(), 30) } }, [open])
  const run = (fn) => { setOpen(false); setTimeout(fn, 150) }
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="palette-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}>
          <motion.div className="palette" role="dialog" aria-label="Command palette" onClick={(e) => e.stopPropagation()}
            initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
            <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command…" aria-label="Command"
              onKeyDown={(e) => { if (e.key === 'Enter' && list[0]) run(list[0][1]); if (e.key === 'Escape') setOpen(false) }} />
            <ul>{list.map(([n, fn]) => <li key={n}><button onClick={() => run(fn)}>{n}</button></li>)}
              {!list.length && <li className="empty">No command matches “{q}”.</li>}</ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
