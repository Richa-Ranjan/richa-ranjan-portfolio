import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ---------- Food delivery ---------- */
const MENU = [
  { id: 1, name: 'Paneer tikka wrap', price: 180 }, { id: 2, name: 'Veg biryani', price: 220 },
  { id: 3, name: 'Margherita pizza', price: 260 }, { id: 4, name: 'Cold coffee', price: 120 }
]
const STEPS = ['Placed', 'Preparing', 'Out for delivery', 'Delivered']
export function FoodDemo() {
  const [role, setRole] = useState('customer')
  const [cart, setCart] = useState({})
  const [order, setOrder] = useState(null)
  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const total = MENU.reduce((s, m) => s + (cart[m.id] || 0) * m.price, 0)
  const add = (id, d) => setCart((c) => { const n = Math.max(0, (c[id] || 0) + d); const x = { ...c }; n ? (x[id] = n) : delete x[id]; return x })
  const place = () => { setOrder({ total, items: count, step: 0 }); setCart({}) }
  useEffect(() => { if (!order || order.step >= 3 || role !== 'customer') return; const t = setTimeout(() => setOrder((o) => o && { ...o, step: o.step + 1 }), 1700); return () => clearTimeout(t) }, [order, role])
  const advance = () => setOrder((o) => o && o.step < 3 ? { ...o, step: o.step + 1 } : o)
  return (
    <div className="demo food">
      <div className="seg" role="tablist" aria-label="Role">
        {['customer', 'admin'].map((r) => <button key={r} role="tab" aria-selected={role === r} className={role === r ? 'on' : ''} onClick={() => setRole(r)}>{r}</button>)}
      </div>
      {role === 'customer' ? (
        <div className="food-grid">
          <ul className="menu">{MENU.map((m) => (
            <li key={m.id}><span>{m.name}<small>₹{m.price}</small></span>
              <span className="qty">
                <button onClick={() => add(m.id, -1)} aria-label={`Remove ${m.name}`} disabled={!cart[m.id]}>−</button>
                <motion.b key={cart[m.id] || 0} initial={{ scale: 1.6 }} animate={{ scale: 1 }}>{cart[m.id] || 0}</motion.b>
                <button onClick={() => add(m.id, 1)} aria-label={`Add ${m.name}`}>+</button>
              </span></li>))}</ul>
          <div className="cart" aria-live="polite">
            <p className="mono">Cart <motion.b key={count} initial={{ scale: 1.6 }} animate={{ scale: 1 }}>{count}</motion.b></p>
            <AnimatePresence>{MENU.filter((m) => cart[m.id]).map((m) => (
              <motion.p key={m.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                {cart[m.id]} × {m.name}</motion.p>))}</AnimatePresence>
            {!count && <p className="muted">Add something from the menu.</p>}
            <p className="total">₹{total}</p>
            <button className="btn solid" disabled={!count} onClick={place}>Place order</button>
          </div>
        </div>
      ) : (
        <div className="admin">
          <p className="muted">Admin role: can see and move every order. Customers cannot reach this view (role-based access control).</p>
          {order ? <p>Order · {order.items} items · ₹{order.total} · <b>{STEPS[order.step]}</b></p> : <p className="muted">No orders yet. Place one as a customer.</p>}
          <button className="btn" disabled={!order || order.step === 3} onClick={advance}>Advance status</button>
        </div>
      )}
      {order && <div><div className="trackbar"><motion.i animate={{ width: `${((order.step + 1) / 4) * 100}%` }} transition={{ duration: 0.8 }} /></div><ol className="track" aria-label="Order status">{STEPS.map((s, i) => <li key={s} className={i <= order.step ? 'done' : ''}>{s}</li>)}</ol><p className="mono muted">Simulated order tracking</p></div>}
    </div>
  )
}

/* ---------- Generic pipeline (StudyBuddy / Video) ---------- */
export function Pipeline({ stages, note }) {
  const [i, setI] = useState(-1)
  const t = useRef()
  const run = () => {
    clearInterval(t.current); setI(0); let k = 0
    t.current = setInterval(() => { k++; setI(k); if (k >= stages.length - 1) clearInterval(t.current) }, 1200)
  }
  useEffect(() => () => clearInterval(t.current), [])
  return (
    <div className="demo">
      <div className="pbar"><motion.i animate={{ width: i < 0 ? '0%' : `${((i + 1) / stages.length) * 100}%` }} transition={{ duration: 0.6 }} /></div>
      <ol className="pipe">{stages.map((s, n) => (
        <li key={s.name} className={n === i ? 'cur' : n < i ? 'done' : ''}>
          <button onClick={() => { clearInterval(t.current); setI(n) }}><span className="mono">{String(n + 1).padStart(2, '0')}</span>{s.name}</button>
        </li>))}</ol>
      <div className="pipe-out" aria-live="polite">
        {i < 0 ? <p className="muted">Press run to step through the pipeline.</p> :
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mono">{stages[i].tech}</p><p>{stages[i].out}</p></motion.div>}
      </div>
      <div className="row"><button className="btn solid" onClick={run}>Run demonstration</button><span className="mono muted">{note}</span></div>
    </div>
  )
}
export const STUDY = [
  { name: 'Document', tech: 'PDF upload', out: 'A sample file, “Operating Systems – Notes.pdf”, is loaded.' },
  { name: 'Chunk', tech: 'LangChain text splitter', out: 'The text is split into overlapping passages so each one fits a model prompt.' },
  { name: 'Index', tech: 'Embeddings + FAISS', out: 'Each passage becomes a vector and is stored in a similarity index.' },
  { name: 'Retrieve', tech: 'FAISS search', out: 'Question: “What is deadlock?” The closest passages are pulled from the index.' },
  { name: 'Answer', tech: 'Ollama (local LLM)', out: 'The model drafts an answer grounded only in the retrieved passages.' }
]
export const VIDEO = [
  { name: 'Video', tech: 'Input', out: 'A local video file is selected. Nothing leaves the machine.' },
  { name: 'Audio', tech: 'Audio extraction', out: 'The audio track is separated from the video.' },
  { name: 'Speech', tech: 'Whisper', out: 'Whisper turns the audio into a timestamped transcript.' },
  { name: 'Vision', tech: 'BLIP', out: 'Frames are sampled and BLIP describes what is visible in each.' },
  { name: 'Summary', tech: 'LLM', out: 'Transcript and frame captions are combined into one summary.' }
]

/* ---------- Crop recommendation (heuristic demo) ---------- */
const CROPS = {
  Rice: { t: 25, h: 82, r: 230, ph: 6.2, n: 80 }, Wheat: { t: 18, h: 60, r: 80, ph: 6.8, n: 100 },
  Maize: { t: 24, h: 65, r: 90, ph: 6.3, n: 80 }, Cotton: { t: 27, h: 60, r: 75, ph: 7, n: 120 },
  Chickpea: { t: 19, h: 25, r: 70, ph: 7, n: 40 }
}
const SPAN = { t: 40, h: 100, r: 300, ph: 4, n: 140 }
const SL = [['n', 'Nitrogen', 0, 140, 1], ['ph', 'Soil pH', 4, 9, 0.1], ['t', 'Temperature °C', 5, 45, 1], ['h', 'Humidity %', 10, 100, 1], ['r', 'Rainfall mm', 20, 300, 5]]
export function CropDemo() {
  const [v, setV] = useState({ n: 80, ph: 6.5, t: 24, h: 65, r: 100 })
  const ranked = Object.entries(CROPS).map(([name, c]) => ({ name, fit: Math.max(0, 1 - Object.keys(SPAN).reduce((s, k) => s + Math.abs(v[k] - c[k]) / SPAN[k], 0) / 2.2) }))
    .sort((a, b) => b.fit - a.fit)
  return (
    <div className="demo crop">
      <div className="sliders">{SL.map(([k, label, min, max, step]) => (
        <label key={k}><span>{label}<b>{v[k]}</b></span>
          <input type="range" min={min} max={max} step={step} value={v[k]} onChange={(e) => setV({ ...v, [k]: +e.target.value })} /></label>))}</div>
      <div className="result" aria-live="polite">
        <p className="mono">Suggested crop</p>
        <motion.h4 key={ranked[0].name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{ranked[0].name}</motion.h4>
        {ranked.map((c) => <motion.div layout className="bar" key={c.name}><span>{c.name}</span><i><motion.u animate={{ width: `${Math.round(c.fit * 100)}%` }} /></i></motion.div>)}
      </div>
      <p className="mono muted note">Portfolio demonstration: a simple distance heuristic, not the trained model. The real project used Decision Tree and Random Forest models.</p>
    </div>
  )
}

/* ---------- Spreadsheet ---------- */
const COLS = 'ABCDE'
const ids = []; for (let r = 1; r <= 5; r++) for (const c of COLS) ids.push(c + r)
const num = (x) => (typeof x === 'number' ? x : 0)
const rng = (a, b) => {
  const [c1, c2] = [a[0], b[0]].sort(), [r1, r2] = [+a[1], +b[1]].sort()
  const out = []; for (let r = r1; r <= r2; r++) for (let c = COLS.indexOf(c1); c <= COLS.indexOf(c2); c++) out.push(COLS[c] + r); return out
}
function ev(id, cells, seen = new Set()) {
  const raw = cells[id] ?? ''
  if (!raw.startsWith('=')) { const n = parseFloat(raw); return raw === '' ? '' : isNaN(n) ? raw : n }
  if (seen.has(id)) return '#CYCLE'
  const s = new Set(seen).add(id)
  try {
    let f = raw.slice(1).toUpperCase()
    f = f.replace(/(SUM|AVG)\(([A-E][1-5]):([A-E][1-5])\)/g, (_, fn, a, b) => {
      const v = rng(a, b).map((i) => num(ev(i, cells, s))); const t = v.reduce((x, y) => x + y, 0)
      return String(fn === 'SUM' ? t : t / v.length)
    })
    f = f.replace(/[A-E][1-5]/g, (m) => String(num(ev(m, cells, s))))
    if (!/^[\d+\-*/().\s]+$/.test(f)) return '#ERR'
    const r = Function('"use strict";return (' + f + ')')()
    return Number.isFinite(r) ? +r.toFixed(4) : '#ERR'
  } catch { return '#ERR' }
}
export function SheetDemo() {
  const [cells, setCells] = useState({ A1: 'Q1', B1: '120', C1: '=B1*2', A2: 'Q2', B2: '95', C2: '=B2*2', A3: 'Total', B3: '=SUM(B1:B2)', C3: '=SUM(C1:C2)' })
  const [focus, setFocus] = useState(null)
  const [theme, setTheme] = useState('paper'), [flash, setFlash] = useState({})
  const edit = (id, v) => { const next = { ...cells, [id]: v }, ch = {}; ids.forEach((i) => { if (String(ev(i, cells)) !== String(ev(i, next))) ch[i] = 1 }); setCells(next); setFlash(ch); setTimeout(() => setFlash({}), 700) }
  return (
    <div className="demo">
      <div className="row"><div className="seg">{['paper', 'ink', 'gold'].map((t) => <button key={t} className={theme === t ? 'on' : ''} onClick={() => setTheme(t)}>{t}</button>)}</div>
        <span className="mono muted">Try =B1+B2 or =SUM(B1:B2) in any cell</span></div>
      <div className={'sheet ' + theme} role="grid" aria-label="Mini spreadsheet">
        <span className="hd" />{[...COLS].map((c) => <span key={c} className="hd">{c}</span>)}
        {[1, 2, 3, 4, 5].map((r) => [<span key={'r' + r} className="hd">{r}</span>, ...[...COLS].map((c) => {
          const id = c + r, val = ev(id, cells)
          return <input key={id} aria-label={`Cell ${id}`} value={focus === id ? cells[id] ?? '' : String(val)}
            className={(typeof val === 'number' ? 'n ' : '') + (flash[id] ? 'flash' : '')} onFocus={() => setFocus(id)} onBlur={() => setFocus(null)}
            onChange={(e) => edit(id, e.target.value)} />
        })])}
      </div>
    </div>
  )
}
