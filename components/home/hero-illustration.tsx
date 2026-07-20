/**
 * Flat, friendly SVG illustration for the hero: two people working at desks
 * around a central dashboard window, with soft plants and floating UI bits.
 * Colors read from CSS variables so it adapts to light/dark themes.
 */
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 960 380"
      role="img"
      aria-hidden
      className="h-auto w-full max-w-4xl"
    >
      {/* soft ground */}
      <ellipse cx="480" cy="352" rx="400" ry="22" fill="var(--accent)" />

      {/* ── central dashboard window ── */}
      <g>
        <rect x="330" y="60" width="300" height="210" rx="14" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
        <rect x="330" y="60" width="300" height="36" rx="14" fill="var(--muted)" />
        <rect x="330" y="82" width="300" height="14" fill="var(--muted)" />
        <circle cx="352" cy="78" r="5" fill="#f87171" />
        <circle cx="370" cy="78" r="5" fill="#fbbf24" />
        <circle cx="388" cy="78" r="5" fill="#34d399" />

        {/* sidebar */}
        <rect x="346" y="110" width="70" height="10" rx="5" fill="var(--primary)" opacity="0.85" />
        <rect x="346" y="130" width="56" height="8" rx="4" fill="var(--border)" />
        <rect x="346" y="146" width="62" height="8" rx="4" fill="var(--border)" />
        <rect x="346" y="162" width="50" height="8" rx="4" fill="var(--border)" />

        {/* stat cards */}
        <rect x="432" y="108" width="86" height="40" rx="8" fill="var(--accent)" />
        <rect x="440" y="118" width="34" height="7" rx="3.5" fill="var(--primary)" opacity="0.7" />
        <rect x="440" y="131" width="52" height="9" rx="4" fill="var(--primary)" />
        <rect x="528" y="108" width="86" height="40" rx="8" fill="var(--accent)" />
        <rect x="536" y="118" width="34" height="7" rx="3.5" fill="#34d399" opacity="0.8" />
        <rect x="536" y="131" width="46" height="9" rx="4" fill="#10b981" />

        {/* bar chart */}
        <g>
          <rect x="436" y="212" width="16" height="38" rx="4" fill="var(--primary)" opacity="0.35" />
          <rect x="460" y="196" width="16" height="54" rx="4" fill="var(--primary)" opacity="0.55" />
          <rect x="484" y="206" width="16" height="44" rx="4" fill="var(--primary)" opacity="0.45" />
          <rect x="508" y="180" width="16" height="70" rx="4" fill="var(--primary)" />
          <rect x="532" y="192" width="16" height="58" rx="4" fill="var(--primary)" opacity="0.7" />
          <rect x="556" y="170" width="16" height="80" rx="4" fill="#10b981" opacity="0.9" />
          <rect x="580" y="188" width="16" height="62" rx="4" fill="var(--primary)" opacity="0.5" />
        </g>
      </g>

      {/* ── floating chips ── */}
      <g>
        {/* gear */}
        <circle cx="300" cy="86" r="26" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
        <path
          d="M300 74a3 3 0 0 1 3 3v2.1a7.5 7.5 0 0 1 2.6 1.5l1.9-1.1a3 3 0 0 1 4.1 1.1 3 3 0 0 1-1.1 4.1l-1.8 1a7.6 7.6 0 0 1 0 3l1.8 1a3 3 0 0 1 1.1 4.1 3 3 0 0 1-4.1 1.1l-1.9-1.1a7.5 7.5 0 0 1-2.6 1.5V98a3 3 0 0 1-6 0v-2.1a7.5 7.5 0 0 1-2.6-1.5l-1.9 1.1a3 3 0 0 1-4.1-1.1 3 3 0 0 1 1.1-4.1l1.8-1a7.6 7.6 0 0 1 0-3l-1.8-1a3 3 0 0 1-1.1-4.1 3 3 0 0 1 4.1-1.1l1.9 1.1a7.5 7.5 0 0 1 2.6-1.5V77a3 3 0 0 1 3-3z"
          fill="var(--primary)" opacity="0.8"
        />
        <circle cx="300" cy="88" r="4.5" fill="var(--card)" />

        {/* chat bubble */}
        <rect x="640" y="72" width="66" height="44" rx="12" fill="var(--primary)" />
        <path d="M652 116l4 12 12-12z" fill="var(--primary)" />
        <circle cx="662" cy="94" r="4" fill="var(--primary-foreground)" opacity="0.9" />
        <circle cx="676" cy="94" r="4" fill="var(--primary-foreground)" opacity="0.7" />
        <circle cx="690" cy="94" r="4" fill="var(--primary-foreground)" opacity="0.5" />

        {/* check badge */}
        <circle cx="672" cy="180" r="18" fill="#10b981" />
        <path d="M664 180l6 6 11-11" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* ── left person at desk ── */}
      <g>
        <rect x="96" y="252" width="150" height="10" rx="5" fill="var(--foreground)" opacity="0.75" />
        <rect x="108" y="262" width="10" height="70" rx="4" fill="var(--foreground)" opacity="0.6" />
        <rect x="224" y="262" width="10" height="70" rx="4" fill="var(--foreground)" opacity="0.6" />
        {/* laptop */}
        <rect x="150" y="222" width="58" height="34" rx="4" fill="var(--primary)" opacity="0.9" />
        <rect x="144" y="252" width="70" height="6" rx="3" fill="var(--muted-foreground)" />
        {/* person */}
        <circle cx="120" cy="196" r="15" fill="#f4b183" />
        <path d="M104 190a17 17 0 0 1 32-3c-6 4-24 5-32 3z" fill="var(--foreground)" opacity="0.85" />
        <path d="M100 252c0-22 12-36 27-36 12 0 20 8 24 20l-8 16z" fill="var(--primary)" />
        <rect x="118" y="238" width="34" height="9" rx="4.5" fill="#f4b183" />
        {/* stool */}
        <rect x="100" y="284" width="44" height="8" rx="4" fill="var(--foreground)" opacity="0.5" />
        <rect x="118" y="292" width="8" height="42" rx="3" fill="var(--foreground)" opacity="0.5" />
      </g>

      {/* ── right person at desk (mirrored feel) ── */}
      <g>
        <rect x="714" y="252" width="150" height="10" rx="5" fill="var(--foreground)" opacity="0.75" />
        <rect x="726" y="262" width="10" height="70" rx="4" fill="var(--foreground)" opacity="0.6" />
        <rect x="842" y="262" width="10" height="70" rx="4" fill="var(--foreground)" opacity="0.6" />
        <rect x="748" y="222" width="58" height="34" rx="4" fill="#10b981" opacity="0.85" />
        <rect x="742" y="252" width="70" height="6" rx="3" fill="var(--muted-foreground)" />
        <circle cx="838" cy="196" r="15" fill="#e8a87c" />
        <path d="M822 192a17 17 0 0 1 33 0c-8 3-25 3-33 0z" fill="#5b3a1e" />
        <path d="M858 252c0-22-12-36-27-36-12 0-20 8-24 20l8 16z" fill="#0e9f6e" />
        <rect x="806" y="238" width="34" height="9" rx="4.5" fill="#e8a87c" />
        <rect x="814" y="284" width="44" height="8" rx="4" fill="var(--foreground)" opacity="0.5" />
        <rect x="832" y="292" width="8" height="42" rx="3" fill="var(--foreground)" opacity="0.5" />
      </g>

      {/* ── plants ── */}
      <g>
        <path d="M40 340c0-30 10-52 24-64-2 26-6 44-10 64z" fill="#34d399" />
        <path d="M64 340c0-24 12-40 26-48-6 20-12 32-16 48z" fill="#10b981" />
        <rect x="38" y="336" width="52" height="14" rx="4" fill="var(--muted-foreground)" opacity="0.7" />
      </g>
      <g>
        <path d="M898 340c0-30-10-52-24-64 2 26 6 44 10 64z" fill="#34d399" />
        <path d="M874 340c0-24-12-40-26-48 6 20 12 32 16 48z" fill="#10b981" />
        <rect x="850" y="336" width="52" height="14" rx="4" fill="var(--muted-foreground)" opacity="0.7" />
      </g>
    </svg>
  );
}
