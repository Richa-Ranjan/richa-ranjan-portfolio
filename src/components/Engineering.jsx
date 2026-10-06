import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { LINKS } from '../config'

const MAP = [
  ['Frontend', [['React.js', 'Component UI for the Food Delivery storefront.', 'Food Delivery'], ['JavaScript', 'Formula engine and rendering in vanilla JS; internship dashboard.', 'Spreadsheet System'], ['HTML / CSS', 'Responsive dashboard that worked across 15+ screen sizes.', 'CODESOFT internship']]],
  ['Backend', [['Node.js', 'Server runtime for the MERN application.', 'Food Delivery'], ['Express.js', 'Routing and middleware, MVC structure.', 'Food Delivery'], ['REST APIs', 'Endpoints for catalog, cart and orders; tested with Postman.', 'Food Delivery']]],
  ['Data', [['MongoDB', 'Schemas for users, catalog, carts and orders.', 'Food Delivery'], ['MySQL', 'Relational design, queries and CRUD.', 'Core skill']]],
  ['Core', [['Java', 'Primary language for OOP and data structures.', 'Core skill'], ['DSA', '450+ problems on GeeksforGeeks.', 'Problem solving'], ['OOP · DBMS · OS', 'Computer science fundamentals from the B.Tech.', 'Coursework']]],
  ['Tools', [['Git · GitHub', 'Version control in team and solo work.', 'All projects'], ['Postman', 'Testing REST endpoints.', 'Food Delivery'], ['CI/CD · Agile', 'Delivery practices used during the internship.', 'CODESOFT internship']]],
  ['Applied ML', [['Python', 'Secondary language for ML and AI tooling.', 'Crop · Video Analyzer'], ['Scikit-learn', 'Decision Tree and Random Forest models.', 'Crop Recommendation'], ['Whisper · BLIP · LLMs', 'Speech, vision and summaries.', 'Video Analyzer']]]
]

const D='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/'
const LOGO={'React.js':'react/react-original','JavaScript':'javascript/javascript-original','HTML / CSS':'html5/html5-original','Node.js':'nodejs/nodejs-original','Express.js':'express/express-original','MongoDB':'mongodb/mongodb-original','MySQL':'mysql/mysql-original','Java':'java/java-original','Git · GitHub':'git/git-original','Postman':'postman/postman-original','Python':'python/python-original'}
export function StackMap() {
  const [sel, setSel] = useState(MAP[0][1][0])
  return (
    <div className="map">
      <div className="groups">{MAP.map(([g, items]) => (
        <div key={g} className="group"><h3>{g}</h3>
          {items.map((it) => <button key={it[0]} className={sel === it ? 'on' : ''} aria-pressed={sel === it} onMouseEnter={() => setSel(it)} onFocus={() => setSel(it)} onClick={() => setSel(it)}>{LOGO[it[0]] && <img className={'logo' + (it[0] === 'Express.js' ? ' inv' : '')} src={D + LOGO[it[0]] + '.svg'} alt="" loading="lazy" onError={(ev) => { ev.currentTarget.style.display = 'none' }} />}{it[0]}</button>)}</div>))}</div>
      <motion.div key={sel[0]} className="detail" aria-live="polite" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="mono">Used in · {sel[2]}</p><h4>{sel[0]}</h4><p>{sel[1]}</p>
      </motion.div>
    </div>
  )
}

const MAZE = ['S...#...', '.##.#.#.', '..#...#.', '.#.##.#.', '....#.#.', '.##.#.#.', '.#....#.', '.#.##..E']
const N = 8
function bfs() {
  const prev = {}, order = [], q = [[0, 0]], seen = new Set(['0,0'])
  while (q.length) {
    const [r, c] = q.shift(); order.push(r * N + c)
    if (r === N - 1 && c === N - 1) break
    for (const [dr, dc] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const nr = r + dr, nc = c + dc, k = nr + ',' + nc
      if (nr < 0 || nc < 0 || nr >= N || nc >= N || MAZE[nr][nc] === '#' || seen.has(k)) continue
      seen.add(k); prev[k] = r + ',' + c; q.push([nr, nc])
    }
  }
  const path = []; let k = (N - 1) + ',' + (N - 1)
  while (k) { const [r, c] = k.split(',').map(Number); path.unshift(r * N + c); k = prev[k] }
  return { order, path }
}
const SOLVED = bfs()
export function Dsa() {
  const [v, setV] = useState(0), [p, setP] = useState(0), [busy, setBusy] = useState(false)
  const t = useRef()
  useEffect(() => () => clearInterval(t.current), [])
  const done = p >= SOLVED.path.length
  const run = () => {
    if (busy) return; setBusy(true); setV(0); setP(0); let a = 0, b = 0
    t.current = setInterval(() => {
      if (a < SOLVED.order.length) { a++; setV(a) } else if (b < SOLVED.path.length) { b++; setP(b) } else { clearInterval(t.current); setBusy(false) }
    }, 70)
  }
  const vis = new Set(SOLVED.order.slice(0, v)), pth = new Set(SOLVED.path.slice(0, p))
  return (
    <div className="dsa">
      <div className="maze" role="img" aria-label="Breadth-first search finding a path through a maze">
        {MAZE.join('').split('').map((ch, i) => <i key={i} className={ch === '#' ? 'wall' : pth.has(i) ? 'path' : vis.has(i) ? 'vis' : ch === 'S' || ch === 'E' ? 'end' : ''} />)}</div>
      <div className="dsa-text">
        <p className="big" aria-live="polite">{done ? '450+' : '···'}</p>
        <p>{done ? 'problems solved on GeeksforGeeks' : 'Run breadth-first search to find the shortest path and reveal the number.'}</p>
        <p className="muted small">Arrays, trees, graphs, dynamic programming, sorting and searching.</p>
        <div className="row"><button className="btn solid" onClick={run} disabled={busy}>{done ? 'Run again' : 'Run BFS'}</button>
          <a className="btn" href={LINKS.gfg} target="_blank" rel="noopener noreferrer">GeeksforGeeks profile</a></div>
      </div>
    </div>
  )
}
