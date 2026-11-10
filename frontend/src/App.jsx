import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { ShieldCheck, Play, Save, Trash2, Zap, Cpu, RefreshCw, Code2, Activity } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const starter = `(module
  (func (export "run") (result i32)
    ;; Return a sample result to the host.
    i32.const 42
  )
)`
const loopSample = `(module
  (func (export "run") (result i32)
    ;; This infinite loop should be stopped by the fuel limit.
    (loop $again
      br $again
    )
    i32.const 0
  )
)`

export default function App() {
  const [source, setSource] = useState(starter)
  const [name, setName] = useState('My first plugin')
  const [plugins, setPlugins] = useState([])
  const [busy, setBusy] = useState(false)
  const [output, setOutput] = useState(null)
  const [error, setError] = useState('')
  const [health, setHealth] = useState('checking')

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Request failed')
    return data
  }

  async function refresh() {
    try {
      const [items] = await Promise.all([request('/api/plugins')])
      setPlugins(items)
      setHealth('online')
    } catch (e) {
      setHealth('offline')
      setError(e.message)
    }
  }

  useEffect(() => { refresh() }, [])

  async function run() {
    setBusy(true); setError(''); setOutput(null)
    try { setOutput(await request('/api/execute', { method: 'POST', body: JSON.stringify({ source }) })) }
    catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  async function save() {
    setError('')
    try {
      await request('/api/plugins', { method: 'POST', body: JSON.stringify({ name, source }) })
      await refresh()
      setOutput({ success: true, message: 'Plugin saved successfully.' })
    } catch (e) { setError(e.message) }
  }

  async function load(id) {
    try {
      const plugin = await request(`/api/plugins/${id}`)
      setName(plugin.name); setSource(plugin.source); setOutput(null); setError('')
    } catch (e) { setError(e.message) }
  }

  async function remove(id) {
    try { await request(`/api/plugins/${id}`, { method: 'DELETE' }); await refresh() }
    catch (e) { setError(e.message) }
  }

  async function webhook(id) {
    setBusy(true); setError(''); setOutput(null)
    try { setOutput(await request(`/api/plugins/${id}/webhook`, { method: 'POST' })) }
    catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-icon"><ShieldCheck size={21}/></span><span>Wasm<span className="accent">Box</span><small>SECURE PLUGIN RUNTIME</small></span></a>
      <div className="top-status"><span className={`status-dot ${health}`}></span> API {health}</div>
    </header>

    <main className="main">
      <section className="hero">
        <div><div className="eyebrow"><span></span> DEVELOPER SANDBOX</div><h1>Run code. <span>Not risks.</span></h1>
          <p>Build and execute WebAssembly plugins in a capability-restricted runtime.</p></div>
        <div className="hero-shield"><ShieldCheck size={54}/><span>ISOLATED EXECUTION</span></div>
      </section>

      <section className="metrics">
        <div className="metric"><span className="metric-icon"><ShieldCheck/></span><div><small>RUNTIME MODE</small><strong>WASM Sandbox</strong></div></div>
        <div className="metric"><span className="metric-icon"><Cpu/></span><div><small>MEMORY CAP</small><strong>10 MB</strong></div></div>
        <div className="metric"><span className="metric-icon"><Zap/></span><div><small>INSTRUCTION FUEL</small><strong>1,000,000</strong></div></div>
        <div className="metric"><span className="metric-icon"><Activity/></span><div><small>HOST ACCESS</small><strong>Disabled by default</strong></div></div>
      </section>

      <div className="workspace">
        <section className="editor-panel panel">
          <div className="panel-head"><div><Code2 size={17}/><strong>Plugin workspace</strong><span className="file-pill">module.wat</span></div><span className="language">WEBASSEMBLY TEXT</span></div>
          <div className="plugin-name"><label htmlFor="plugin-name">PLUGIN NAME</label><input id="plugin-name" value={name} onChange={e => setName(e.target.value)} maxLength={80}/></div>
          <div className="editor-wrap"><Editor height="390px" language="lisp" theme="vs-dark" value={source} onChange={v => setSource(v || '')} options={{fontSize:14,minimap:{enabled:false},padding:{top:18},scrollBeyondLastLine:false,automaticLayout:true,wordWrap:'on'}} /></div>
          <div className="editor-actions"><div className="left-actions"><button className="btn secondary" onClick={() => {setSource(starter);setOutput(null)}}>Reset sample</button><button className="btn secondary" onClick={() => {setSource(loopSample);setOutput(null)}}>Load loop test</button></div><div className="right-actions"><button className="btn secondary" onClick={save}><Save size={15}/> Save plugin</button><button className="btn primary" onClick={run} disabled={busy || !source.trim()}><Play size={15} fill="currentColor"/>{busy ? 'Running…' : 'Run plugin'}</button></div></div>
          <p className="editor-hint">Expected contract: export <code>run() → i32</code>. No WASI, filesystem, or network imports are provided.</p>
        </section>

        <aside className="side-column">
          <section className="panel output-panel">
            <div className="panel-head"><div><Activity size={17}/><strong>Execution output</strong></div><span className="live-tag">LIVE</span></div>
            {!output && !error && <div className="empty-output"><div className="terminal-icon">&gt;_</div><strong>Awaiting execution</strong><p>Run your plugin to inspect its result and execution time.</p></div>}
            {output && <div className="result"><span className="result-label">{output.success ? 'EXECUTION SUCCESS' : 'EXECUTION RESULT'}</span><strong>{output.result ?? 'Saved'}</strong><p>{output.message}</p>{output.execution_ms !== undefined && <small>Execution time · {output.execution_ms} ms</small>}</div>}
            {error && <div className="error-box"><strong>Request failed</strong><p>{error}</p></div>}
          </section>
          <section className="panel plugins-panel">
            <div className="panel-head"><div><Cpu size={17}/><strong>Saved plugins</strong></div><button className="icon-btn" onClick={refresh} title="Refresh"><RefreshCw size={15}/></button></div>
            {plugins.length === 0 ? <div className="empty-list">No saved plugins yet.<br/>Save your first module to see it here.</div> : <div className="plugin-list">{plugins.map(p => <div className="plugin-row" key={p.id}><button className="plugin-load" onClick={() => load(p.id)}><span className="plugin-symbol"><Code2 size={16}/></span><span><strong>{p.name}</strong><small>{new Date(p.created_at).toLocaleString()}</small></span></button><div className="plugin-tools"><button title="Simulate webhook" onClick={() => webhook(p.id)}><Zap size={14}/></button><button title="Delete plugin" onClick={() => remove(p.id)}><Trash2 size={14}/></button></div></div>)}</div>}
          </section>
        </aside>
      </div>

      <section className="security-note"><ShieldCheck size={20}/><div><strong>Sandbox security boundary</strong><p>Each run gets a fresh Wasmtime Store with bounded memory and instruction fuel. No WASI linker is installed, so guest modules cannot access host files or sockets through this runtime.</p></div></section>
      <footer>WASMBOX <span>·</span> SECURE MULTI-TENANT PLUGIN SANDBOX <span className="footer-right">Built with FastAPI + Wasmtime + React</span></footer>
    </main>
  </div>
}
