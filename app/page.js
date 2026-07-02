"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, userText: text }),
      });
      const data = await res.json();
      const reply = data.reply || `⚠️ خطأ: ${data.error}`;
      setMessages([...newHistory, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newHistory, { role: "assistant", content: `⚠️ خطأ: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#0d1117", fontFamily:"Arial,sans-serif", direction:"rtl" }}>
      {/* Header */}
      <div style={{ background:"#161b22", borderBottom:"1px solid #30363d", padding:"14px 18px", display:"flex", alignItems:"center", gap:"12px" }}>
        <div style={{ width:40, height:40, background:"linear-gradient(135deg,#1a7f5a,#0ea271)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:13 }}>OJ</div>
        <div>
          <div style={{ color:"#e6edf3", fontSize:15, fontWeight:600 }}>مساعد OJ الذكي</div>
          <div style={{ color:"#7d8590", fontSize:12 }}>دوسيات الأستاذ عمر جيتاوي · كيمياء التوجيهي</div>
        </div>
        <div style={{ width:8, height:8, background:"#3fb950", borderRadius:"50%", marginRight:"auto", boxShadow:"0 0 6px #3fb950" }} />
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:16 }}>
        {messages.length === 0 && (
          <div style={{ background:"#161b22", border:"1px solid #21262d", borderRadius:12, padding:20, color:"#e6edf3", lineHeight:1.8, fontSize:14 }}>
            <div style={{ color:"#0ea271", fontSize:16, fontWeight:600, marginBottom:10 }}>🧪 أهلاً بك في مساعد OJ الذكي</div>
            <p>أعمل حصراً من <strong>دوسيات الأستاذ عمر جيتاوي</strong> والكتاب المدرسي الفلسطيني.</p>
            <p style={{ marginTop:10 }}><strong>ما سؤالك الكيميائي اليوم؟ 🎯</strong></p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, flexDirection: m.role==="user" ? "row-reverse" : "row" }}>
            <div style={{ width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0, background: m.role==="assistant" ? "#1f6feb22" : "#0ea27122", border: m.role==="assistant" ? "1px solid #1f6feb44" : "1px solid #0ea27144", color: m.role==="assistant" ? "#58a6ff" : "#3fb950" }}>
              {m.role === "assistant" ? "OJ" : "أنت"}
            </div>
            <div style={{ maxWidth:"83%", padding:"11px 15px", borderRadius:12, fontSize:14, lineHeight:1.75, whiteSpace:"pre-wrap", wordBreak:"break-word", background: m.role==="assistant" ? "#161b22" : "#0ea271", border: m.role==="assistant" ? "1px solid #21262d" : "none", color: m.role==="assistant" ? "#e6edf3" : "#fff", borderTopRightRadius: m.role==="user" ? 4 : 12, borderTopLeftRadius: m.role==="assistant" ? 4 : 12 }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, background:"#1f6feb22", border:"1px solid #1f6feb44", color:"#58a6ff" }}>OJ</div>
            <div style={{ background:"#161b22", border:"1px solid #21262d", borderRadius:"4px 12px 12px 12px", padding:"14px 16px", display:"flex", gap:5 }}>
              {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, background:"#0ea271", borderRadius:"50%", animation:`pulse 1.2s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:14, borderTop:"1px solid #21262d", background:"#0d1117" }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, background:"#161b22", border:"1px solid #30363d", borderRadius:12, padding:"9px 12px" }}>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"; }}
            onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
            placeholder="اكتب سؤالك الكيميائي هنا..."
            rows={1}
            disabled={loading}
            style={{ flex:1, background:"transparent", border:"none", outline:"none", resize:"none", fontFamily:"inherit", fontSize:14, color:"#e6edf3", lineHeight:1.6, direction:"rtl", minHeight:24, maxHeight:120 }}
          />
          <button onClick={send} disabled={!input.trim()||loading} style={{ width:34, height:34, background: input.trim()&&!loading ? "#0ea271" : "#21262d", border:"none", borderRadius:8, cursor: input.trim()&&!loading ? "pointer" : "not-allowed", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
          </button>
        </div>
        <p style={{ textAlign:"center", fontSize:11, color:"#484f58", marginTop:7 }}>Enter للإرسال · Shift+Enter لسطر جديد</p>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
