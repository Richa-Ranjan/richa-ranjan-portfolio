import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

const LINES = ['const problem = findRealProblem()', 'const system = design(problem)', 'test(system); ship(system)']
const CHIPS = [['Java', '4%', '6%'], ['React', '70%', '-4%'], ['Node.js', '88%', '46%'], ['MongoDB', '6%', '82%'], ['REST', '62%', '92%']]

export default function HeroArt() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 16 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 16 })
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5) }
  return (
    <div className="art" onMouseMove={reduce ? undefined : move} onMouseLeave={() => { mx.set(0); my.set(0) }} aria-hidden="true">
      <motion.div className="win" style={reduce ? undefined : { rotateX: rx, rotateY: ry }} initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
        <div className="win-bar"><i /><i /><i /><span className="mono">richa / workspace</span></div>
        <div className="win-body">
          {LINES.map((l, i) => <motion.p key={l} className="mono" initial={reduce ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.5 }}><span>{String(i + 1).padStart(2, '0')}</span>{l}</motion.p>)}
          <div className="flow">
            <b>Client</b><span className="wire"><motion.i animate={reduce ? undefined : { left: ['0%', '100%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} /></span>
            <b>API</b><span className="wire"><motion.i animate={reduce ? undefined : { left: ['0%', '100%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }} /></span><b>Database</b>
          </div>
          <div className="status-row"><i className="pulse" /><span className="mono">all requests handled</span></div>
        </div>
      </motion.div>
      {CHIPS.map(([t, l, tp], i) => (
        <motion.span key={t} className="chip" style={{ left: l, top: tp }} initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ opacity: { delay: 1.4 + i * 0.12 }, scale: { delay: 1.4 + i * 0.12 }, y: { duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 } }}>{t}</motion.span>))}
    </div>
  )
}
