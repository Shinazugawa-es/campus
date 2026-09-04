import { useEffect, useRef, useState } from 'react'
import catWalk from './assets/dino/cat-walk.png'

const FRAME_SIZE = 256
const FRAME_COUNT = 12
const FRAME_DURATION = 80

const PHRASES = ["Meow! 🐱", "Need help? Try the Orientation tab!", "I like this campus.", "Zzz... 😴", "Ooh, what's over there?", "Beep boop, I'm your guide!"]

export default function Dino({ size = 0.6 }) {
  const containerRef = useRef(null)
  const [maxX, setMaxX] = useState(200)
  const [frame, setFrame] = useState(0)
  const [x, setX] = useState(0)
  const [direction, setDirection] = useState(1)
  const [bubble, setBubble] = useState(null)
  const [mode, setMode] = useState('walk') // 'walk' | 'idle' | 'bounce'
  const [jumping, setJumping] = useState(false)

  const spriteWidth = FRAME_SIZE * size

  useEffect(() => {
    function updateBounds() {
      if (containerRef.current) {
        setMaxX(Math.max(0, containerRef.current.offsetWidth - spriteWidth))
      }
    }
    updateBounds()
    window.addEventListener('resize', updateBounds)
    return () => window.removeEventListener('resize', updateBounds)
  }, [spriteWidth])

  // Animate walk-cycle frames only while actually walking
  useEffect(() => {
    if (mode !== 'walk') return
    const frameTimer = setInterval(() => {
      setFrame((f) => (f + 1) % FRAME_COUNT)
    }, FRAME_DURATION)
    return () => clearInterval(frameTimer)
  }, [mode])

  // Move across the screen only while walking
  useEffect(() => {
    if (mode !== 'walk') return
    const moveTimer = setInterval(() => {
      setX((prevX) => {
        const next = prevX + direction * 2
        if (next > maxX || next < 0) {
          setDirection((d) => -d)
          return prevX
        }
        return next
      })
    }, 40)
    return () => clearInterval(moveTimer)
  }, [mode, direction, maxX])

  // Randomly switch between walking and taking a playful break
  useEffect(() => {
    let cancelled = false

    function scheduleNext() {
      const delay = mode === 'walk' ? 2500 + Math.random() * 2500 : 1500 + Math.random() * 1500
      const timer = setTimeout(() => {
        if (cancelled) return
        if (mode === 'walk') {
          const nextMode = Math.random() < 0.5 ? 'bounce' : 'idle'
          setMode(nextMode)
          setFrame(0)
          if (nextMode === 'bounce') {
            setJumping(true)
            setTimeout(() => setJumping(false), 350)
          }
          if (Math.random() < 0.6) {
            setBubble(PHRASES[Math.floor(Math.random() * PHRASES.length)])
            setTimeout(() => setBubble(null), 2000)
          }
        } else {
          setMode('walk')
        }
      }, delay)
      return timer
    }

    const t = scheduleNext()
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [mode])

  function handleClick() {
    setJumping(true)
    setBubble(PHRASES[Math.floor(Math.random() * PHRASES.length)])
    setTimeout(() => setJumping(false), 350)
    setTimeout(() => setBubble(null), 2000)
  }

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative', height: spriteWidth + 40 }}>
      {bubble && (
        <div
          style={{
            position: 'absolute',
            left: x,
            bottom: spriteWidth + 8,
            background: 'var(--surface-hover)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '6px 10px',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            transform: 'translateX(-10%)',
            zIndex: 2,
          }}
        >
          {bubble}
        </div>
      )}
      <div
        onClick={handleClick}
        style={{
          width: spriteWidth,
          height: spriteWidth,
          position: 'absolute',
          left: x,
          bottom: jumping ? 24 : 0,
          transition: 'bottom 0.2s ease, transform 0.3s ease',
          cursor: 'pointer',
          transform: `${direction < 0 ? 'scaleX(-1)' : 'none'} ${mode === 'idle' ? 'scale(0.96)' : 'scale(1)'}`,
          backgroundImage: `url(${catWalk})`,
          backgroundPosition: `-${frame * spriteWidth}px 0`,
          backgroundSize: `${spriteWidth * FRAME_COUNT}px ${spriteWidth}px`,
          imageRendering: 'auto',
        }}
      />
    </div>
  )
}