import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'
import { useAuth } from './AuthContext'
import MascotAvatar from './MascotAvatar'

export default function OrientationGuide() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [tone, setTone] = useState('respectful')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const messagesEndRef = useRef(null)

  const storageKey = user ? `orientation-chat-${user.id}` : null

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!error) {
        setProfile(data)

        const saved = storageKey ? localStorage.getItem(storageKey) : null
        if (saved) {
          setMessages(JSON.parse(saved))
        } else {
          setMessages([
            {
              role: 'assistant',
              content:
                data.student_type === 'returning'
                  ? "Welcome back! Ask me anything you need a refresher on."
                  : "Hey! I'm here to help you get settled in. Ask me about packing, dorm life, food, rules, anything — what do you want to know first?",
            },
          ])
        }
      }
      setLoadingProfile(false)
    }

    if (user) fetchProfile()
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (storageKey && messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || sending) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setSending(true)

    const { data, error } = await supabase.functions.invoke('orientation-ai', {
      body: {
        messages: newMessages,
        tone,
        studentType: profile.student_type,
        homeRegion: profile.home_region,
      },
    })

    if (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, something went wrong. Try again?" }])
    } else {
      setMessages([...newMessages, { role: 'assistant', content: data.text }])
    }

    setSending(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loadingProfile) return <p>Loading...</p>

  const stars = Array.from({ length: 60 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() < 0.2 ? 4 : 2,
  }))

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <div key={i} className="star" style={{ top: s.top, left: s.left, animationDelay: s.delay, width: s.size, height: s.size }} />
        ))}
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
        <h2 style={{ fontSize: '20px' }}>Orientation Assistant</h2>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setTone('respectful')}
            style={{
              background: tone === 'respectful' ? 'var(--teal)' : 'transparent',
              color: tone === 'respectful' ? 'var(--border-dark)' : 'var(--text-muted)',
              border: '2px solid var(--border)',
              boxShadow: tone === 'respectful' ? '4px 4px 0 var(--border-dark)' : 'none',
            }}
          >
            Respectful
          </button>
          <button
            onClick={() => setTone('genz')}
            style={{
              background: tone === 'genz' ? 'var(--teal)' : 'transparent',
              color: tone === 'genz' ? 'var(--border-dark)' : 'var(--text-muted)',
              border: '2px solid var(--border)',
              boxShadow: tone === 'genz' ? '4px 4px 0 var(--border-dark)' : 'none',
            }}
          >
            Gen Z
          </button>
        </div>

        <div className="dialogue-box" style={{ marginBottom: '16px' }}>
          <div className="dialogue-header" style={{ background: 'var(--surface-hover)', color: 'var(--teal)', borderBottom: '3px solid var(--border)' }}>
            ORIENTATION CHAT
          </div>
          <div className="corner" style={{ top: -3, left: -3 }} />
          <div className="corner" style={{ top: -3, right: -3 }} />
          <div className="corner" style={{ bottom: -3, left: -3 }} />
          <div className="corner" style={{ bottom: -3, right: -3 }} />

          <div style={{ height: '360px', overflowY: 'auto', padding: '16px' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '8px',
                  margin: '10px 0',
                }}
              >
                {m.role === 'assistant' && (
                  <div style={{ width: 44, height: 44, flexShrink: 0 }}>
                    <MascotAvatar size={44} />
                  </div>
                )}
                <span
                  style={{
                    display: 'inline-block',
                    background: m.role === 'user' ? 'var(--surface-hover)' : 'var(--surface)',
                    color: 'var(--text)',
                    border: `2px solid ${m.role === 'user' ? 'var(--text-muted)' : 'var(--border)'}`,
                    padding: '8px 12px',
                    maxWidth: '75%',
                    whiteSpace: 'pre-line',
                    textAlign: 'left',
                    fontFamily: 'VT323, monospace',
                    fontSize: '17px',
                  }}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {sending && <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontFamily: 'VT323, monospace' }}>Typing...</p>}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about packing, dorms, food, rules..."
            style={{ flex: 1 }}
            disabled={sending}
          />
          <button onClick={sendMessage} disabled={sending} style={{ padding: '10px 18px', background: 'var(--surface-hover)', color: 'var(--teal)', border: '2px solid var(--border)' }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}