'use client'
import { useEffect, useRef } from 'react'

// public/globe.js is loaded once; each visit to the landing page starts it on its own canvas and stops it on leave,
// because Nextra navigates between pages without reloading.
export function Globe() {
  const ref = useRef(null)
  useEffect(() => {
    let stop = () => {}
    let cancelled = false
    const run = () => { if (!cancelled && window.ATBPGlobe) stop = window.ATBPGlobe(ref.current) }
    if (window.ATBPGlobe) run()
    else {
      let s = document.querySelector('script[data-atbp-globe]')
      if (!s) {
        s = document.createElement('script')
        s.src = '/globe.js'
        s.async = true
        s.setAttribute('data-atbp-globe', '')
        document.head.appendChild(s)
      }
      s.addEventListener('load', run, { once: true })
    }
    return () => { cancelled = true; stop() }
  }, [])
  return <canvas ref={ref} className="atbp-globe" aria-hidden="true" />
}
