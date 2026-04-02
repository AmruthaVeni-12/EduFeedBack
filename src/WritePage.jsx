import { useState } from 'react'

export default function WritePage({ setRoute }){
  const [text, setText] = useState('')

  return (
    <div style={{width:'100%', maxWidth:1100, padding:20}}>
      <h2 style={{color:'#fff', marginTop:0}}>Write Feedback</h2>
      <p style={{color:'rgba(255,255,255,0.85)'}}>Use the box below to write your feedback or notes. Your text will remain client-side in this demo.</p>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write your feedback here..." style={{width:'100%', minHeight:300, marginTop:12, padding:12, borderRadius:10, border:0, resize:'vertical', fontSize:16}} />
      <div style={{display:'flex', gap:12, marginTop:12}}>
        <button onClick={() => { alert('Saved (demo)'); }} style={{padding:'10px 14px', borderRadius:8, border:0, background:'#fff', cursor:'pointer'}}>Save</button>
        <button onClick={() => setRoute('dashboard')} style={{padding:'10px 14px', borderRadius:8, border:0, background:'rgba(255,255,255,0.12)', color:'#fff', cursor:'pointer'}}>Back</button>
      </div>
    </div>
  )
}
