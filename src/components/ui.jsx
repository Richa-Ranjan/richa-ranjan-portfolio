import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  return (
    <M className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </M>
  )
}

export function Magnetic({ children }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18 }), sy = useSpring(y, { stiffness: 220, damping: 18 })
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const move = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25); y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  return (
    <motion.span ref={ref} style={{ x: sx, y: sy, display: 'inline-block' }} onMouseMove={move}
      onMouseLeave={() => { x.set(0); y.set(0) }}>{children}</motion.span>
  )
}

export function Cursor() {
  const ref = useRef(null)
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 })
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const mv = (e) => {
      x.set(e.clientX); y.set(e.clientY)
      const hot = e.target.closest && e.target.closest('a,button,input,[role=button]')
      ref.current && ref.current.classList.toggle('hot', !!hot)
    }
    window.addEventListener('mousemove', mv)
    return () => { window.removeEventListener('mousemove', mv); document.documentElement.classList.remove('has-cursor') }
  }, [x, y])
  return <motion.div ref={ref} className="cursor" aria-hidden="true" style={{ x: sx, y: sy }} />
}

export function Ext({ href, children, className = '' }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

export function Portrait() {
  const [bad, setBad] = useState(false)
  return <div className="portrait">{bad ? 'RR' : <img src="/photos/richa.jpg" alt="Richa Ranjan" onError={() => setBad(true)} />}</div>
}
