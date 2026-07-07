export default function Logo({ className = "", variant = "dark" }) {
  const stroke = variant === "dark" ? "#282834" : "#FEFFFC";

  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" stroke={stroke} strokeWidth="1.2" />
      <path
        d="M24 14v-6M24 40v-6M14 24h-6M40 24h-6"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M8 32c6-8 10-12 16-12s10 4 16 12"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 18c4 2 8 3 12 3s8-1 12-3"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
