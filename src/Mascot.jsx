import { useEffect, useRef, useState } from 'react'
import lottie from 'lottie-web'
import mascotAnimation from './assets/dino/mascot.json'

const PHRASES = ["Hey there! 👋", "Need help? Try the Orientation tab!", "I like this campus.", "Ask me anything!"]

export default function Mascot({ size = 220 }) {
  const containerRef = useRef(null)
  const animRef = useRef(null)
  const [bubble, setBubble] = useState(null)

  useEffect(() => {
    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: mascotAnimation,
    })
    return () => animRef.current?.destroy()
  }, [])

  function handleClick() {
    setBubble(PHRASES[Math.floor(Math.random() * PHRASES.length)])
    setTimeout(() => setBubble(null), 2000)

    if (animRef.current) {
      animRef.current.setSpeed(2)
      setTimeout(() => animRef.current?.setSpeed(1), 600)
    }
  }

  return (
    <div style={{ position: 'relative', width: size, margin: '0 auto' }}>
      {bubble && (
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translate(-50%, -100%)',
            background: 'var(--surface-hover)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '6px 10px',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            zIndex: 2,
          }}
        >
          {bubble}
        </div>
      )}
      <div
        ref={containerRef}
        onClick={handleClick}
        style={{ width: size, height: size, cursor: 'pointer' }}
      />
    </div>
  )
}