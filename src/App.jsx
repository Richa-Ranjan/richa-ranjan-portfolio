import { useEffect, useState, lazy, Suspense, useCallback } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { LINKS, SECTIONS } from './config'
import { Magnetic, Reveal } from './components/ui'
import HeroArt from './components/HeroArt'
import Door from './components/Door'
import Palette from './components/Palette'
import { Journey, Resume, Beyond, Footer } from './components/Sections'
import { StackMap, Dsa } from './components/Engineering'
import Contact from './components/Contact'
import Chat from './components/Chat'
import Auth from './components/Auth'
import Problems from './components/Problems'
const Projects = lazy(() => import('./components/Projects'))

const HERO = 'I identify real problems and engineer systems to solve them.'

export default function App() {
  const [entered, setEntered] = useState(() => sessionStorage.getItem('entered') === '1')
  const [mode, setMode] = useState(() => { const m = localStorage.getItem('mode'); return m === 'dark' || m === 'light' ? m : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' })
  const [pal, setPal] = useState(false), [active, setActive] = useState('intro'), [toast, setToast] = useState('')
  const [authOpen, setAuth] = useState(false), [prob, setProb] = useState(false), [menu, setMenu] = useState(false)
  const [visitor, setVisitor] = useState(() => { try { return JSON.parse(localStorage.getItem('visitor')) } catch { return null } })
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const toggleTheme = useCallback(() => setMode((m) => (m === 'dark' ? 'light' : 'dark')), [])
  const enter = useCallback(() => { sessionStorage.setItem('entered', '1'); setEntered(true) }, [])

  useEffect(() => { const d = document.documentElement; d.dataset.theme = mode; d.dataset.reading = 'off'; localStorage.setItem('mode', mode) }, [mode])
  useEffect(() => { document.body.style.overflow = entered && !prob ? '' : 'hidden' }, [entered, prob])
  useEffect(() => {
    let buf = ''
    const k = (e) => {
      const typing = /INPUT|TEXTAREA/.test(e.target.tagName)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); setPal((p) => !p); return }
      if (typing || e.key.length > 1) return
      buf = (buf + e.key).slice(-4)
      if (buf === 'ship') { setToast('$ git push origin main  ✓ shipped'); setTimeout(() => setToast(''), 2600) }
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => {
    if (!entered) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [entered])

  return (
    <>
      <a className="skip-link" href="#work">Skip to work</a>
      <AnimatePresence>{!entered && <Door onDone={enter} />}</AnimatePresence>
      {entered && (<>
        <motion.div className="progress" style={{ scaleX: prog }} aria-hidden="true" />
        <header className="top">
          <a className="brand" href="#intro"><span className="full">RR</span><span className="short">RR</span></a>
          <nav aria-label="Sections" className={menu ? 'open' : ''}><ul>{SECTIONS.map(([id, label]) => (
            <li key={id}><a href={'#' + id} onClick={() => setMenu(false)} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined}>{label}</a></li>))}
            <li><button onClick={() => { setProb(true); setMenu(false) }}>Problems</button></li></ul></nav>
          <div className="tools">
            <button className="themebtn" onClick={toggleTheme} aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{mode === 'dark' ? '☀ Light' : '☾ Dark'}</button>
            <button className="signin" onClick={() => setAuth(true)}>{visitor ? visitor.name.split(' ')[0] : 'Sign in'}</button>
            <button className="burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button></div>
        </header>
        <main>
          <section id="intro" className="hero" aria-labelledby="h1">
            <div className="hero-grid">
              <div>
                <motion.p className="mono avail" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <i className="pulse" />Open to software engineering opportunities</motion.p>
                <h1 id="h1" aria-label={HERO}>{HERO.split(' ').map((w, i) => (
                  <span className="w" key={i} aria-hidden="true"><motion.span initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.045, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{w}&nbsp;</motion.span></span>))}</h1>
                <p className="intro-p">I'm Richa, a 2026 B.Tech graduate from Dhanbad who builds full-stack systems in Java and the MERN stack. I like to start with the problem: who gets stuck, why it happens, and what a well-designed system would change. Then I build it, test it, and make it feel good to use.</p>
                <p className="name">Richa Ranjan</p>
                <p className="muted">Software Engineer · Full-Stack Developer · Problem Solver · System Thinker</p>
                <div className="row" style={{ marginTop: '1.4rem' }}><Magnetic><a className="btn solid" href={LINKS.resume} target="_blank" rel="noopener noreferrer">View Resume</a></Magnetic></div>
              </div>
              <HeroArt />
            </div>
            <ul className="proof"><li><b>450+</b> DSA problems</li><li><b>8th</b> Smart India Hackathon 2024, college round</li><li><b>Intern</b> Web Developer, CODESOFT</li><li><b>2026</b> B.Tech graduate, CS &amp; Business Systems</li></ul>
          </section>

          <section id="work" className="sec" aria-labelledby="h-work">
            <Reveal as="h2" className="h2"><span id="h-work">Selected work-Projects</span></Reveal>
           
            <Suspense fallback={<p className="muted">Loading projects…</p>}><Projects /></Suspense>
          </section>

          <section id="engineering" className="sec" aria-labelledby="h-eng">
            <Reveal as="h2" className="h2"><span id="h-eng">Skills</span></Reveal>
            <p className="lead">The tools I reach for to design, build and ship software, and the projects where each one earned its place. Hover or tap any skill to see it in context.</p>
            <Reveal><StackMap /></Reveal>
            <h3 className="h3">Problem solving</h3>
            <Reveal><Dsa /></Reveal>
          </section>

          <section id="journey" className="sec" aria-labelledby="h-jr">
            <Reveal as="h2" className="h2"><span id="h-jr">Journey</span></Reveal>
            <Journey />
            <Reveal><Resume /></Reveal>
          </section>

          <section id="beyond" className="sec" aria-labelledby="h-bd">
            <Reveal as="h2" className="h2"><span id="h-bd">Outside the code</span></Reveal>
            <p className="lead">More about me.</p>
            <Reveal><Beyond /></Reveal>
          </section>

          <section id="contact" className="sec" aria-label="Contact"><Contact visitor={visitor} /></section>
        </main>
        <Footer />
      </>)}
      <Chat />
      <Problems open={prob} close={() => setProb(false)} />
      <Auth open={authOpen} close={() => setAuth(false)} visitor={visitor} setVisitor={setVisitor} />
      <Palette open={pal} setOpen={setPal} toggleTheme={toggleTheme} />
      <AnimatePresence>{toast && <motion.div className="toast mono" role="status" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
    </>
  )
}
