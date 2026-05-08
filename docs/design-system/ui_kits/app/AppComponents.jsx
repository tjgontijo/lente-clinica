// AppComponents.jsx — Shared UI primitives for Lente Clínica

const LC = {
  teal50: "oklch(97% 0.025 192)",
  teal100: "oklch(93% 0.050 192)",
  teal200: "oklch(86% 0.080 192)",
  teal300: "oklch(76% 0.105 192)",
  teal400: "oklch(66% 0.118 192)",
  teal600: "oklch(50% 0.120 192)",
  teal700: "oklch(42% 0.110 192)",
  teal800: "oklch(34% 0.095 192)",
  teal900: "oklch(26% 0.080 192)",
  amber50: "oklch(97.5% 0.030 70)",
  amber100: "oklch(94%   0.060 70)",
  amber200: "oklch(88%   0.100 70)",
  amber300: "oklch(80%   0.140 70)",
  amber600: "oklch(57%   0.158 64)",
  amber700: "oklch(49%   0.145 62)",
  amber800: "oklch(40%   0.125 60)",
  red50: "oklch(97.5% 0.018 22)",
  red100: "oklch(94%   0.040 22)",
  red300: "oklch(79%   0.130 22)",
  red600: "oklch(50%   0.220 24)",
  red700: "oklch(42%   0.200 23)",
  red800: "oklch(34%   0.175 22)",
  n0: "#ffffff",
  n50: "oklch(98.5% 0.003 200)",
  n100: "oklch(96.5% 0.005 200)",
  n150: "oklch(93.5% 0.005 200)",
  n200: "oklch(91%   0.004 200)",
  n300: "oklch(84%   0.003 200)",
  n400: "oklch(74%   0.002 200)",
  n500: "oklch(62%   0.002 200)",
  n600: "oklch(50%   0.002 200)",
  n700: "oklch(40%   0.002 200)",
  n800: "oklch(28%   0.002 200)",
  n900: "oklch(20%   0.002 200)",
  n950: "oklch(13%   0.002 200)",
};

const FONT = "'Geist', 'Geist Sans', ui-sans-serif, system-ui, sans-serif";
const MONO = "'Geist Mono', ui-monospace, monospace";

const ICONS = {
  home: (
    <>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  "list-checks": (
    <>
      <path d="m3 17 2 2 4-4" />
      <path d="m3 7 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  "arrow-left": (
    <>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </>
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  "triangle-alert": (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  "alert-circle": (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  pill: (
    <>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </>
  ),
  copy: (
    <>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  "check-circle": (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </>
  ),
  save: (
    <>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  "chevron-right": <polyline points="9 18 15 12 9 6" />,
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  clipboard: (
    <>
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M9 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  "log-out": (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ),
};

const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {ICONS[name] || <circle cx="12" cy="12" r="10" />}
  </svg>
);

const TopHeader = ({ title, onBack, action, tinted }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px 12px",
      background: tinted ? LC.teal600 : LC.n0,
      borderBottom: `1px solid ${tinted ? "transparent" : LC.n150}`,
      flexShrink: 0,
    }}
  >
    {onBack && (
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          padding: "6px 6px 6px 0",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Icon
          name="arrow-left"
          size={22}
          color={tinted ? "white" : LC.teal600}
        />
      </button>
    )}
    <div
      style={{
        flex: 1,
        fontFamily: FONT,
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: tinted ? "white" : LC.n950,
      }}
    >
      {title}
    </div>
    {action}
  </div>
);

const BottomNav = ({ active, onNav }) => {
  const tabs = [
    { id: "home", icon: "home", label: "Início" },
    { id: "search", icon: "search", label: "Medicações" },
    { id: "checklist", icon: "list-checks", label: "Sessão" },
    { id: "profile", icon: "user", label: "Perfil" },
  ];
  return (
    <div
      style={{
        display: "flex",
        background: LC.n0,
        borderTop: `1px solid ${LC.n150}`,
        padding: "6px 0 20px",
        flexShrink: 0,
      }}
    >
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onNav(t.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "6px 0",
              fontFamily: FONT,
            }}
          >
            <Icon
              name={t.icon}
              size={22}
              color={on ? LC.teal600 : LC.n400}
              strokeWidth={on ? 2.5 : 1.75}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: on ? 700 : 400,
                color: on ? LC.teal600 : LC.n400,
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const Badge = ({ children, variant = "teal", size = "md" }) => {
  const C = {
    teal: { bg: LC.teal100, color: LC.teal800, border: LC.teal200 },
    amber: { bg: LC.amber100, color: LC.amber800, border: LC.amber300 },
    red: { bg: LC.red100, color: LC.red800, border: LC.red300 },
    neutral: { bg: LC.n100, color: LC.n700, border: LC.n200 },
  };
  const c = C[variant] || C.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: 4,
        padding: size === "sm" ? "2px 6px" : "3px 8px",
        fontSize: size === "sm" ? 9 : 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontFamily: FONT,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
};

const CaseCard = ({ cas, onTap }) => (
  <div
    onClick={() => onTap(cas)}
    style={{
      background: LC.n0,
      border: `1px solid ${LC.n150}`,
      borderRadius: 10,
      padding: "13px 14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 11,
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: LC.teal50,
        border: `1.5px solid ${LC.teal200}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 700,
          color: LC.teal700,
        }}
      >
        {cas.initials.slice(0, 2)}
      </span>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 14,
          fontWeight: 700,
          color: LC.n950,
          marginBottom: 4,
        }}
      >
        {cas.initials}
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {cas.meds.map((m, i) => (
          <Badge key={i} variant="neutral" size="sm">
            {m}
          </Badge>
        ))}
      </div>
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 2,
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: FONT, fontSize: 11, color: LC.n500 }}>
        {cas.lastSession}
      </span>
      <span style={{ fontFamily: FONT, fontSize: 10, color: LC.n400 }}>
        {cas.sessions} sessões
      </span>
    </div>
    <Icon name="chevron-right" size={15} color={LC.n300} />
  </div>
);

const MedListItem = ({ med, onTap }) => (
  <div
    onClick={() => onTap(med)}
    style={{
      background: LC.n0,
      border: `1px solid ${LC.n150}`,
      borderRadius: 10,
      padding: "12px 14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 11,
    }}
  >
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        background: LC.teal50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon name="pill" size={17} color={LC.teal600} />
    </div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 14,
          fontWeight: 700,
          color: LC.n950,
          marginBottom: 2,
        }}
      >
        {med.name}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: LC.n500 }}>
        {med.generic}
      </div>
    </div>
    <Badge variant="teal" size="sm">
      {med.class}
    </Badge>
    <Icon name="chevron-right" size={15} color={LC.n300} />
  </div>
);

const PrimaryBtn = ({
  children,
  onClick,
  full,
  icon,
  variant = "primary",
  disabled,
}) => {
  const S = {
    primary: { bg: LC.teal600, hov: LC.teal700, color: "#fff", border: "none" },
    outline: {
      bg: "transparent",
      hov: LC.teal50,
      color: LC.teal600,
      border: `1.5px solid ${LC.teal600}`,
    },
    ghost: { bg: "transparent", hov: LC.n100, color: LC.n600, border: "none" },
    danger: { bg: LC.red600, hov: LC.red700, color: "#fff", border: "none" },
  };
  const s = S[variant] || S.primary;
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        height: 48,
        padding: "0 22px",
        width: full ? "100%" : "auto",
        background: hov && !disabled ? s.hov : s.bg,
        color: s.color,
        border: s.border || "none",
        borderRadius: 9999,
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background 150ms",
        letterSpacing: "-0.005em",
      }}
    >
      {icon && <Icon name={icon} size={18} color={s.color} />}
      {children}
    </button>
  );
};

Object.assign(window, {
  Icon,
  TopHeader,
  BottomNav,
  Badge,
  CaseCard,
  MedListItem,
  PrimaryBtn,
  LC,
  FONT,
  MONO,
});
