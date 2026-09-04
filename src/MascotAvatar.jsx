import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import mascotAnimation from './assets/dino/mascot.json'

export default function MascotAvatar({ size = 32 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: mascotAnimation,
    })
    anim.goToAndStop(35, true) // freeze on a nice-looking frame
    return () => anim.destroy()
  }, [])

  return <div ref={containerRef} style={{ width: size, height: size }} />
}