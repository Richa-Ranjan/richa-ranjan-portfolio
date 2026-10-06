import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const T = (...a) => a
/* ---------------- Demo 1: seats ---------------- */
const SEATS = Array.from({ length: 24 }, (_, i) => 'A' + (i + 1))
const BOOKED0 = ['A3', 'A4', 'A9', 'A15', 'A16', 'A20']
function SeatDemo() {
  const [st, setSt] = useState(() => Object.fromEntries(BOOKED0.map((s) => [s, { s: 'booked' }])))
  const [log, setLog] = useState([]), [hold, setHold] = useState(null), [busy, setBusy] = useState(false)
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    if (!hold) return
    if (hold.left <= 0) { setSt((x) => { const n = { ...x }; delete n[hold.id]; return n }); setLog((l) => [...l, `System → ${hold.id} payment timeout → RELEASED`]); setHold(null); return }
    const t = setTimeout(() => setHold({ ...hold, left: hold.left - 1 }), 1000); return () => clearTimeout(t)
  }, [hold])
  const add = (m) => setLog((l) => [...l, m]), put = (id, v) => setSt((x) => { const n = { ...x }; v ? (n[id] = v) : delete n[id]; return n })
  const reset = () => { timers.current.forEach(clearTimeout); setSt(Object.fromEntries(BOOKED0.map((s) => [s, { s: 'booked' }]))); setLog([]); setHold(null); setBusy(false) }
  const sim = () => {
    reset(); setBusy(true)
    const seq = [[200, () => { put('A12', { s: 'locked', by: 'A' }); add('User A → Seat A12 → LOCKED') }], [1300, () => add('User B → Seat A12 → REQUESTED')],
      [2400, () => add('System → Seat already locked (atomic check failed for B)')], [3500, () => { put('A13', { s: 'locked', by: 'B' }); add('User B → automatically receives Seat A13 → LOCKED') }],
      [4800, () => { put('A12', { s: 'booked' }); add('User A pays → A12 BOOKED') }], [6000, () => { put('A13', null); add('User B payment timeout → A13 RELEASED'); setBusy(false) }]]
    timers.current = seq.map(([d, f]) => setTimeout(f, d))
  }
  const click = (id) => { if (st[id] || hold || busy) return; put(id, { s: 'locked', by: 'You' }); setHold({ id, left: 10 }); add(`You → Seat ${id} → LOCKED (10s hold)`) }
  const pay = () => { put(hold.id, { s: 'booked' }); add(`You pay → ${hold.id} BOOKED`); setHold(null) }
  return (
    <div className="demo2">
      <div className="seatmap" role="group" aria-label="Seat map">{SEATS.map((id) => <button key={id} onClick={() => click(id)} className={'seat ' + (st[id]?.s || 'free')} aria-label={`Seat ${id} ${st[id]?.s || 'free'}`}>{id.slice(1)}{st[id]?.by && <i>{st[id].by}</i>}</button>)}</div>
      <div>
        <div className="row"><button className="btn solid" onClick={sim} disabled={busy}>Two users, same seat</button>
          {hold && <button className="btn" onClick={pay}>Pay now ({hold.left}s)</button>}<button className="btn" onClick={reset}>Reset</button></div>
        <ol className="log" aria-live="polite">{log.length ? log.map((l, i) => <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{l}</motion.li>) : <li className="muted">Run the simulation, or click a free seat to hold it for 10 seconds.</li>}</ol>
        <p className="legend"><i className="seat free" />Free <i className="seat locked" />Locked <i className="seat booked" />Booked</p>
      </div></div>
  )
}

/* ---------------- Demo 2: parking ---------------- */
const perm = Array.from({ length: 140 }, (_, i) => (i * 37) % 140)
const initLot = () => { const a = Array(140).fill('available'); perm.slice(0, 86).forEach((i) => (a[i] = 'occupied')); perm.slice(86, 98).forEach((i) => (a[i] = 'reserved')); return a }
const STEPS_P = ['Search', 'Select slot', 'Reserve', 'QR generated', 'Vehicle enters', 'Vehicle exits']
function Qr({ seed }) { return <svg width="64" height="64" viewBox="0 0 7 7" aria-label="Sample QR code" role="img">{Array.from({ length: 49 }, (_, i) => ((i * 7 + seed * 13 + (i % 5)) % 3 === 0 || [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(i)) && <rect key={i} x={i % 7} y={Math.floor(i / 7)} width="1" height="1" fill="currentColor" />)}</svg> }
function ParkingDemo() {
  const [lot, setLot] = useState(initLot), [sel, setSel] = useState(null), [step, setStep] = useState(-1), [busy, setBusy] = useState(false)
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const count = (k) => lot.filter((x) => x === k).length
  const set = (i, v) => setLot((l) => l.map((x, n) => (n === i ? v : x)))
  const run = () => {
    if (sel == null || busy) return; setBusy(true); setStep(1)
    const q = [[900, () => { set(sel, 'reserved'); setStep(2) }], [1900, () => setStep(3)], [3100, () => { set(sel, 'occupied'); setStep(4) }], [4800, () => { set(sel, 'available'); setStep(5) }], [6000, () => { setBusy(false); setSel(null); setStep(-1) }]]
    timers.current = q.map(([d, f]) => setTimeout(f, d))
  }
  const expire = () => { const i = lot.findIndex((x, n) => x === 'reserved' && n !== sel); if (i < 0) return; set(i, 'expired'); setTimeout(() => set(i, 'available'), 1600) }
  const pick = (i) => { if (!busy && lot[i] === 'available') { setSel(i); setStep(0) } }
  return (
    <div className="demo2">
      <div>
        <p className="counters" aria-live="polite"><span>AVAILABLE <b>{count('available')}</b></span><span>OCCUPIED <b>{count('occupied')}</b></span><span>RESERVED <b>{count('reserved')}</b></span>{count('expired') > 0 && <span>EXPIRED <b>{count('expired')}</b></span>}</p>
        <div className="lot" role="group" aria-label="Parking lot">{lot.map((s, i) => <button key={i} className={'slot ' + s + (sel === i ? ' sel' : '')} onClick={() => pick(i)} aria-label={`Slot ${i + 1} ${s}`} />)}</div>
        <p className="legend"><i className="slot available" />Available <i className="slot reserved" />Reserved <i className="slot occupied" />Occupied <i className="slot expired" />Expired</p>
      </div>
      <div>
        <ol className="chips2">{STEPS_P.map((s, i) => <li key={s} className={i === step ? 'cur' : i < step ? 'done' : ''}>{s}</li>)}</ol>
        {step >= 3 && step < 5 && <div className="qr"><Qr seed={sel} /><span className="mono">Sample QR · slot {sel + 1}</span></div>}
        <div className="row"><button className="btn solid" onClick={run} disabled={sel == null || busy}>{sel == null ? 'Select an available slot' : `Reserve slot ${sel + 1}`}</button><button className="btn" onClick={expire}>Expire a reservation</button></div>
      </div></div>
  )
}

/* ---------------- Demo 4: SOS ---------------- */
const SOS = ['SOS ACTIVATED', 'LOCATION ACQUIRED', 'TRUSTED CONTACT NOTIFIED', 'LIVE LOCATION SHARING ENABLED', 'NEARBY EMERGENCY RESOURCES DISPLAYED', 'INCIDENT TRACKING ACTIVE']
function SosDemo() {
  const [i, setI] = useState(-1), [fail, setFail] = useState(false), [tl, setTl] = useState([]), [age, setAge] = useState(0)
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => { if (i < 3) return; const t = setInterval(() => setAge((a) => a + 1), 1000); return () => clearInterval(t) }, [i])
  const reset = () => { timers.current.forEach(clearTimeout); setI(-1); setTl([]); setAge(0) }
  const go = () => {
    reset(); let at = 0; const ev = (m) => setTl((t) => [...t, m])
    SOS.forEach((s, k) => {
      if (k === 2 && fail) { at += 800; timers.current.push(setTimeout(() => ev('Push notification failed → retry queued'), at)); at += 900; timers.current.push(setTimeout(() => ev('Retry failed → falling back to SMS'), at)) }
      at += 900; timers.current.push(setTimeout(() => { setI(k); setAge(0); ev(s + (k === 2 && fail ? ' (via SMS fallback)' : '')) }, at))
    })
  }
  const on = i >= 0
  return (
    <div className="demo2 sos">
      <div className="sos-l">
        <button className={'sosbtn' + (on ? ' on' : '')} onClick={go} aria-label="Press SOS (simulation)">SOS</button>
        <label className="check"><input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} /> Simulate a failed notification</label>
        {on && <button className="btn" onClick={reset}>Reset</button>}
        <ol className="chips2 v">{SOS.map((s, k) => <li key={s} className={k === i ? 'cur' : k < i ? 'done' : ''}>{s}</li>)}</ol>
      </div>
      <div className="dash" aria-live="polite">
        <div><p className="mono">Emergency status</p><b>{!on ? 'Idle' : i < 5 ? 'Active' : 'Tracking'}</b></div>
        <div><p className="mono">Current location</p><b>{i >= 1 ? 'Sample location (demo)' : '—'}</b></div>
        <div><p className="mono">Trusted contacts notified</p><b>{i >= 2 ? '2 of 2 (sample)' : '0'}</b></div>
        <div><p className="mono">Last location update</p><b>{i >= 3 ? `${age}s ago` : '—'}</b></div>
        <div className="wide"><p className="mono">Nearby emergency resources</p><b>{i >= 4 ? 'Police station · Hospital (sample data)' : '—'}</b></div>
        <div className="wide"><p className="mono">Incident timeline</p><ol className="tl">{tl.length ? tl.map((t, k) => <motion.li key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{t}</motion.li>) : <li className="muted">No incident.</li>}</ol></div>
      </div></div>
  )
}

const CS = [
  { id: 'rail', title: 'Railway ticket booking & seat allocation', tag: 'A concurrency and transaction management problem inspired by real railway reservation systems.', Demo: SeatDemo,
    problem: 'During high-demand periods, thousands of users try to book seats on the same train at nearly the same time. No two people may get the same seat, held seats must be released if payment times out, and availability must stay accurate.',
    matters: 'A double booking becomes a real person at a station with a ticket that does not work. Fairness under load is a trust problem, not only a performance problem.',
    challenges: ['Concurrent booking requests', 'Double-booking prevention', 'Temporary seat locking', 'Payment timeout and seat release', 'Cancellation and refund states', 'Waiting list management', 'Real-time availability', 'Idempotent booking requests'],
    approach: 'Treat each seat as a shared resource with states: free → locked → booked. Moving from free to locked is one atomic operation, so only one request can win. A lock carries an expiry time; payment confirms it, a timeout releases it. Every booking request carries an idempotency key so a retry never books twice. If the requested seat is taken, the system offers the next free one.',
    arch: ['React seat map', 'REST API', 'Booking service', 'Seat lock store', 'Database', 'Expiry worker'],
    features: ['Atomic seat locking', 'Timed holds with automatic release', 'Next-free-seat assignment on conflict', 'Cancellation and waiting-list promotion', 'Idempotent requests', 'Live availability updates'],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'REST APIs', 'WebSockets'],
    trade: ['Short holds free seats faster but frustrate slow payers; long holds block seats.', 'Strict transactions are safe but slower than optimistic checks.', 'Pushed updates are fresher than polling but cost more.'],
    learned: 'Correctness comes before speed. Designing the states and transitions first made the edge cases (timeouts, retries, cancellations) visible early.',
    result: 'A working simulation of locking, conflict handling, timeout and release.' },
  { id: 'park', title: 'Smart parking system', tag: 'A real-time resource allocation problem.', Demo: ParkingDemo,
    problem: 'Drivers waste time looking for parking. A facility may have hundreds of slots, but nobody knows which are actually free. Reservations, entries, exits and no-shows keep changing availability.',
    matters: 'Searching for a slot adds congestion and frustration, and wrong availability data is worse than no data.',
    challenges: ['Real-time availability', 'Slot allocation', 'Reservation expiry', 'Entry and exit tracking', 'QR-based check-in', 'Overstay detection', 'Many users competing for limited slots'],
    approach: 'Model each slot as a state machine: available → reserved → occupied → available, with expired as a branch of reserved. Reserving claims the slot atomically. A scheduled check releases reservations that pass their deadline. Entry scans a QR code carrying a reservation id, exit frees the slot and records the stay for overstay checks.',
    arch: ['React lot view', 'REST API', 'Allocation service', 'Slot state store', 'Expiry scheduler', 'Gate check-in'],
    features: ['Live counters', 'Atomic reservation', 'Automatic expiry release', 'QR check-in and exit', 'Overstay flagging', 'Dynamic availability'],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'WebSockets'],
    trade: ['Short reservation windows free slots sooner but can penalise late drivers.', 'Sensors are accurate but costly; QR check-in is cheap but trusts the flow.'],
    learned: 'Most bugs in resource systems live in the transitions, not the states. Writing allowed transitions down first kept the logic small.',
    result: 'A live lot simulation covering reservation, entry, exit and expiry.' },
  { id: 'sos', title: "Women's emergency response network", tag: 'An emergency coordination prototype.', Demo: SosDemo,
    problem: 'In an emergency, a lone SOS button is not enough. A person may have no time to call several people, explain where they are or keep sending updates.',
    matters: 'Fast, clear information shared with the right people can save minutes when minutes matter. This prototype guarantees no response.',
    challenges: ['Real-time alerts', 'Live location sharing', 'Trusted contacts', 'Emergency state management', 'Notification delivery and failure handling', 'Incident timeline', 'Permission-based sharing'],
    approach: 'Model an emergency as a state machine: idle → active → location acquired → contacts notified → live sharing → tracking. Every step writes to an incident timeline. Notifications go through a retry queue with a fallback channel, so one failed push does not end the flow. Contacts see only what the user has permitted.',
    arch: ['SOS trigger', 'Incident service', 'Location updates', 'Notification queue', 'Trusted contacts', 'Incident timeline'],
    features: ['One-press SOS', 'Retry and SMS fallback', 'Live location updates', 'Nearby resources', 'Timeline of every event'],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'WebSockets'],
    trade: ['Frequent updates track better but drain battery.', 'Aggressive retries notify sooner but can spam.', 'Sharing more helps responders but exposes more.'],
    learned: 'Failure is the normal case here. Designing retries, fallbacks and clear status mattered more than the happy path.',
    result: 'A prototype showing emergency coordination, including a failure path.' }
]
const SEC = [['Real-world problem', 'problem'], ['Why this matters', 'matters'], ['Engineering challenge', 'challenges'], ['My approach', 'approach'], ['System architecture', 'arch'], ['Key features', 'features'], ['Interactive demonstration', 'demo'], ['Technologies used', 'tech'], ['Engineering trade-offs', 'trade'], ['What I learned', 'learned']]

export default function Problems({ open, close }) {
  const [id, setId] = useState('rail'), ref = useRef()
  const c = CS.find((x) => x.id === id)
  useEffect(() => { if (!open) return; const k = (e) => e.key === 'Escape' && close(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [open, close])
  useEffect(() => { ref.current && (ref.current.scrollTop = 0) }, [id])
  const body = (k) => {
    const v = c[k]
    if (k === 'demo') return <><p className="mono sim">Interactive simulation with mock data. Not a production system.</p><c.Demo /><p className="small"><b>Result:</b> {c.result}</p></>
    if (k === 'arch') return <ol className="arch">{v.map((a) => <li key={a}>{a}</li>)}</ol>
    if (k === 'tech') return <p className="tech">{v.map((a) => <span key={a}>{a}</span>)}</p>
    if (Array.isArray(v)) return <ul>{v.map((a) => <li key={a}>{a}</li>)}</ul>
    return <p>{v}</p>
  }
  return (
    <AnimatePresence>{open && (
      <motion.div className="overlay" ref={ref} role="dialog" aria-modal="true" aria-label="Real-world problems I am exploring" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.35 }}>
        <div className="ov-in">
          <div className="ov-head"><div><p className="mono">Case studies</p><h2>Real-world problems I'm exploring</h2></div><button className="btn" onClick={close}>Close</button></div>
          <p className="lead">These are problems I find worth thinking about, not live products. For each one I reason through the constraints, design the system, work out the logic and build a simulation you can play with.</p>
          <div className="cases" role="tablist">{CS.map((x) => <button key={x.id} role="tab" aria-selected={x.id === id} className={x.id === id ? 'on' : ''} onClick={() => setId(x.id)}>{x.title}</button>)}</div>
          <motion.article key={c.id} className="case" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h3>{c.title}</h3><p className="tagline">{c.tag}</p>
            <ol className="story">{['Problem', 'Constraints', 'System design', 'Algorithm', 'Implementation', 'Result'].map((s) => <li key={s}>{s}</li>)}</ol>
            {SEC.map(([label, k], n) => <section key={k} className={'cs' + (k === 'demo' ? ' wide' : '')}><h4><span className="mono">{String(n + 1).padStart(2, '0')}</span>{label}</h4>{body(k)}</section>)}
          </motion.article>
        </div>
      </motion.div>)}</AnimatePresence>
  )
}
