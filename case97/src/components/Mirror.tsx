// The haunted mirror: breathing fog and sketchy ghost eyes that appear,
// look around, blink, bleed and fade. Pure SVG + CSS, no JavaScript.
export function Mirror({ alert = false, label }: { alert?: boolean; label: string }) {
  return (
    <div className="mirror-col" aria-hidden="true">
      <div className={`mirror${alert ? ' alert' : ''}`}>
        <span className="fog-blob" />
        <svg className="eyes" viewBox="0 0 240 130">
          <defs>
            <filter id="c97-sketch" x="-10%" y="-20%" width="120%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={1}>
                <animate attributeName="seed" values="1;4;7;2" dur="0.45s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale={4} />
            </filter>
            <filter id="c97-soft"><feGaussianBlur stdDeviation="6" /></filter>
            <filter id="c97-glow">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <ellipse cx="70" cy="62" rx="56" ry="38" fill="#030405" filter="url(#c97-soft)" />
          <ellipse cx="170" cy="62" rx="56" ry="38" fill="#030405" filter="url(#c97-soft)" />
          <g filter="url(#c97-sketch)" fill="none" strokeLinecap="round">
            {[70, 170].map((cx) => {
              const d = cx - 70
              const flip = cx === 170
              return (
                <g key={cx} className="lid" style={{ transformOrigin: `${cx}px 60px` }}>
                  <path d={`M${28 + d} 61 Q${cx} 24 ${112 + d} 60 Q${cx} 92 ${28 + d} 61 Z`} fill="#0A0C0E" stroke="#C7D2DC" strokeWidth="1.6" />
                  <path d={`M${31 + d} 59 Q${cx + 1} 29 ${109 + d} 62`} stroke="#9AA6B1" strokeWidth="0.9" />
                  <path d={`M${30 + d} 63 Q${cx - 1} 88 ${111 + d} 58`} stroke="#9AA6B1" strokeWidth="0.9" />
                  <path d={flip ? `M${206} 60 l-12 -2 l-5 4 l-8 -1` : `M34 60 l12 -2 l5 4 l8 -1`} stroke="#8E2F2F" strokeWidth="0.8" />
                  <path d={flip ? `M134 61 l11 2 l4 -4` : `M106 61 l-11 2 l-4 -4`} stroke="#8E2F2F" strokeWidth="0.8" />
                  <g className="iris">
                    <circle cx={cx} cy="60" r="15" stroke="#C7D2DC" strokeWidth="1.3" />
                    <circle cx={cx} cy="60" r="10" stroke="#6F7B86" strokeWidth="0.8" />
                    <circle cx={cx} cy="60" r="3.4" fill="#F4F8FB" stroke="none" filter="url(#c97-glow)" />
                  </g>
                </g>
              )
            })}
            <path d="M22 30 l18 -9 M30 22 l20 -6 M44 18 l22 -3 M92 17 l22 4 M104 22 l16 8" stroke="#7D8892" strokeWidth="1.1" />
            <path d="M120 30 l16 -8 M126 21 l22 -5 M174 15 l22 3 M190 19 l20 6 M200 25 l16 8" stroke="#7D8892" strokeWidth="1.1" />
            <path className="drip" d="M58 84 q3 16 -1 34" stroke="#3A1010" strokeWidth="2.4" />
            <path className="drip" d="M182 83 q-2 12 2 26" stroke="#3A1010" strokeWidth="2" style={{ animationDelay: '.6s' }} />
          </g>
        </svg>
        <span className="shine" />
      </div>
      <div className="signature">
        <div><span>{label}</span><span>···</span></div>
        <div className="bar"><i /></div>
      </div>
    </div>
  )
}

export function AuthShell({ children, alert = false, label = 'SOUL SIGNATURE' }: { children: React.ReactNode; alert?: boolean; label?: string }) {
  return (
    <section className="auth">
      <div className="auth-grid">
        <Mirror alert={alert} label={label} />
        <div className="auth-panel">{children}</div>
      </div>
    </section>
  )
}
