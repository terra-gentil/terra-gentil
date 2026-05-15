// Padroes SVG botanicos. Usados como fallback do tile quando nao ha thumbnail
// real do Graph API (ou a imagem falha ao carregar) e nas capas dos Destaques.
// Portados do prototipo de design. Puros e deterministicos: sem hooks, podem
// rodar em server component.

interface PatternProps {
  fg: string;
  bg: string;
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Leaves({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g fill="none" stroke={fg} strokeWidth="1.4" strokeLinecap="round" opacity="0.65">
        {Array.from({ length: 7 }).map((_, i) => {
          const x = 20 + i * 26;
          const y = 220 - (i % 3) * 18;
          return (
            <g key={i} transform={`translate(${x},${y}) rotate(${-12 + i * 4})`}>
              <path
                d="M0 0 C 6 -40 18 -70 0 -100 C -18 -70 -6 -40 0 0 Z"
                fill={fg}
                fillOpacity="0.18"
              />
              <line x1="0" y1="0" x2="0" y2="-100" />
              {Array.from({ length: 5 }).map((__, j) => (
                <path
                  key={j}
                  d={`M0 ${-20 - j * 14} C ${j % 2 ? 6 : -6} ${-28 - j * 14}, ${
                    j % 2 ? 14 : -14
                  } ${-22 - j * 14}, ${j % 2 ? 16 : -16} ${-18 - j * 14}`}
                />
              ))}
            </g>
          );
        })}
      </g>
    </Frame>
  );
}

function Circles({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g opacity="0.7">
        <circle cx="40" cy="60" r="44" fill="none" stroke={fg} strokeWidth="1.5" />
        <circle cx="40" cy="60" r="28" fill="none" stroke={fg} strokeWidth="1.5" />
        <circle cx="40" cy="60" r="12" fill={fg} />
        <circle cx="150" cy="140" r="56" fill="none" stroke={fg} strokeWidth="1.5" opacity="0.6" />
        <circle cx="150" cy="140" r="34" fill="none" stroke={fg} strokeWidth="1.5" opacity="0.6" />
        <circle cx="118" cy="36" r="6" fill={fg} />
        <circle cx="180" cy="42" r="3" fill={fg} />
      </g>
    </Frame>
  );
}

function Drops({ fg, bg }: PatternProps) {
  const pts: Array<[number, number, number]> = [
    [40, 50, 14],
    [110, 40, 18],
    [160, 70, 10],
    [70, 110, 22],
    [140, 130, 14],
    [40, 160, 10],
    [180, 160, 16],
  ];
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g fill={fg} opacity="0.75">
        {pts.map(([cx, cy, r], i) => (
          <path
            key={i}
            d={`M${cx} ${cy - r * 1.4} C ${cx + r} ${cy - r * 0.4}, ${cx + r * 0.9} ${
              cy + r * 0.8
            }, ${cx} ${cy + r} C ${cx - r * 0.9} ${cy + r * 0.8}, ${cx - r} ${
              cy - r * 0.4
            }, ${cx} ${cy - r * 1.4} Z`}
          />
        ))}
      </g>
    </Frame>
  );
}

function Sun({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g stroke={fg} strokeWidth="1.6" fill="none" opacity="0.8">
        <circle cx="100" cy="100" r="38" fill={fg} fillOpacity="0.2" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const x1 = 100 + Math.cos(a) * 52;
          const y1 = 100 + Math.sin(a) * 52;
          const x2 = 100 + Math.cos(a) * (i % 2 ? 72 : 84);
          const y2 = 100 + Math.sin(a) * (i % 2 ? 72 : 84);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
    </Frame>
  );
}

function Fronds({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g stroke={fg} strokeWidth="1.4" fill="none" opacity="0.75" strokeLinecap="round">
        {[40, 100, 160].map((x, i) => (
          <g key={i} transform={`translate(${x}, 230) rotate(${-6 + i * 3})`}>
            <line x1="0" y1="0" x2="0" y2="-180" />
            {Array.from({ length: 12 }).map((__, j) => {
              const y = -20 - j * 13;
              const len = 30 - j * 1.5;
              return (
                <g key={j}>
                  <path d={`M0 ${y} q -${len * 0.4} -10, -${len} -2`} />
                  <path d={`M0 ${y} q ${len * 0.4} -10, ${len} -2`} />
                </g>
              );
            })}
          </g>
        ))}
      </g>
    </Frame>
  );
}

function Hills({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g opacity="0.85">
        <path d="M0 140 Q 50 90, 100 130 T 200 120 L 200 200 L 0 200 Z" fill={fg} fillOpacity="0.3" />
        <path d="M0 160 Q 60 120, 120 155 T 200 150 L 200 200 L 0 200 Z" fill={fg} fillOpacity="0.5" />
        <path d="M0 180 Q 50 165, 100 178 T 200 175 L 200 200 L 0 200 Z" fill={fg} fillOpacity="0.7" />
        <circle cx="155" cy="60" r="22" fill={fg} fillOpacity="0.4" />
      </g>
    </Frame>
  );
}

function Shovel({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g stroke={fg} strokeWidth="2" fill="none" opacity="0.85" strokeLinecap="round">
        <line x1="60" y1="40" x2="140" y2="160" />
        <path d="M 130 150 Q 160 170, 165 195 Q 140 195, 120 170 Z" fill={fg} fillOpacity="0.5" />
        <rect x="52" y="32" width="20" height="16" rx="4" fill={fg} fillOpacity="0.5" />
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={30 + i * 22} cy={185 + (i % 2) * 5} r="2.5" fill={fg} />
        ))}
      </g>
    </Frame>
  );
}

function Plus({ fg, bg }: PatternProps) {
  const pts: Array<[number, number]> = [
    [60, 60],
    [140, 60],
    [60, 140],
    [140, 140],
    [100, 100],
    [30, 100],
    [170, 100],
    [100, 30],
    [100, 170],
  ];
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g stroke={fg} strokeWidth="2.2" opacity="0.85" strokeLinecap="round">
        {pts.map(([x, y], i) => {
          const s = i === 4 ? 22 : 14;
          return (
            <g key={i}>
              <line x1={x - s} y1={y} x2={x + s} y2={y} />
              <line x1={x} y1={y - s} x2={x} y2={y + s} />
            </g>
          );
        })}
        <circle cx="100" cy="100" r="40" fill="none" />
      </g>
    </Frame>
  );
}

function Monstera({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g opacity="0.85">
        <path
          d="M100 30 C 60 60, 50 110, 70 170 C 90 130, 130 130, 150 170 C 170 110, 160 60, 100 30 Z"
          fill={fg}
          fillOpacity="0.35"
          stroke={fg}
          strokeWidth="1.4"
        />
        <ellipse cx="80" cy="100" rx="6" ry="14" fill={bg} />
        <ellipse cx="120" cy="100" rx="6" ry="14" fill={bg} />
        <ellipse cx="70" cy="140" rx="5" ry="10" fill={bg} />
        <ellipse cx="130" cy="140" rx="5" ry="10" fill={bg} />
        <line x1="100" y1="30" x2="100" y2="170" stroke={fg} strokeWidth="1.2" />
      </g>
    </Frame>
  );
}

function Lines({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g stroke={fg} strokeWidth="1.5" opacity="0.6">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="-20" y1={i * 20} x2="220" y2={i * 20 - 40} />
        ))}
      </g>
      <g fill={fg} opacity="0.85">
        <circle cx="60" cy="80" r="6" />
        <circle cx="140" cy="120" r="10" />
        <circle cx="100" cy="160" r="4" />
      </g>
    </Frame>
  );
}

function Arch({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g opacity="0.85">
        <path
          d="M 30 180 L 30 100 A 70 70 0 0 1 170 100 L 170 180 Z"
          fill={fg}
          fillOpacity="0.25"
          stroke={fg}
          strokeWidth="1.6"
        />
        <path d="M 60 180 L 60 110 A 40 40 0 0 1 140 110 L 140 180 Z" fill={fg} fillOpacity="0.4" />
        <line x1="0" y1="180" x2="200" y2="180" stroke={fg} strokeWidth="2" />
      </g>
    </Frame>
  );
}

function Bloom({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g opacity="0.9">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const cx = 100 + Math.cos(a) * 32;
          const cy = 100 + Math.sin(a) * 32;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx="22"
              ry="14"
              fill={fg}
              fillOpacity="0.35"
              transform={`rotate(${(i / 8) * 360} ${cx} ${cy})`}
            />
          );
        })}
        <circle cx="100" cy="100" r="14" fill={fg} />
      </g>
    </Frame>
  );
}

function Grid({ fg, bg }: PatternProps) {
  return (
    <Frame>
      <rect width="200" height="200" fill={bg} />
      <g fill={fg} opacity="0.7">
        {Array.from({ length: 5 }).map((_, i) =>
          Array.from({ length: 5 }).map((__, j) => (
            <rect
              key={`${i}-${j}`}
              x={20 + i * 36}
              y={20 + j * 36}
              width="20"
              height="20"
              rx="3"
              fillOpacity={0.3 + ((i + j) % 3) * 0.2}
            />
          )),
        )}
      </g>
    </Frame>
  );
}

const PATTERNS: Record<string, (p: PatternProps) => React.ReactElement> = {
  leaves: Leaves,
  circles: Circles,
  drops: Drops,
  sun: Sun,
  fronds: Fronds,
  hills: Hills,
  shovel: Shovel,
  plus: Plus,
  monstera: Monstera,
  lines: Lines,
  arch: Arch,
  bloom: Bloom,
  grid: Grid,
};

export const PATTERN_NAMES = Object.keys(PATTERNS);

export function Pattern({
  name,
  fg,
  bg,
}: {
  name: string;
  fg: string;
  bg: string;
}) {
  const Comp = PATTERNS[name] ?? Leaves;
  return <Comp fg={fg} bg={bg} />;
}
