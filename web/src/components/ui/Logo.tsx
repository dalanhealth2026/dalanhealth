import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  asLink?: boolean;
  /** Force wordmark colour — defaults to theme-aware. Useful on dark sidebars. */
  variant?: 'auto' | 'onDark' | 'onLight';
  showWordmark?: boolean;
}

const sizes = {
  sm: { box: 28, text: 'text-[11px]' },
  md: { box: 34, text: 'text-[12px]' },
  lg: { box: 42, text: 'text-[14px]' },
};

/**
 * DalanHealth mark — green/teal heart-leaf medical icon paired with
 * a spaced uppercase wordmark. Modelled on the Paras-style reference.
 */
export function Logo({ size = 'md', className, asLink = true, variant = 'auto', showWordmark = true }: Props) {
  const s = sizes[size];
  const wordmarkClass =
    variant === 'onDark'
      ? 'text-white'
      : variant === 'onLight'
      ? 'text-ink-900'
      : 'text-ink-900 dark:text-white';

  const inner = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative inline-flex items-center justify-center">
        <span
          className="absolute inset-0 -z-10 rounded-[10px] bg-token blur-md opacity-40"
          aria-hidden
        />
        <HeartLeafMark size={s.box} />
      </span>
      {showWordmark && (
        <span className={cn('font-brand font-semibold leading-none tracking-[0.22em] uppercase', s.text, wordmarkClass)}>
          Dalan <span className="font-light opacity-80">Health</span>
        </span>
      )}
    </span>
  );

  return asLink ? (
    <Link to="/" className="inline-flex items-center">
      {inner}
    </Link>
  ) : (
    inner
  );
}

/** Heart-leaf medical icon in green→teal gradient. */
export function HeartLeafMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dh-mark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="55%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      {/* Soft halo */}
      <circle cx="20" cy="20" r="18" fill="url(#dh-mark)" opacity="0.12" />
      {/* Heart-leaf body */}
      <path
        d="M20 33s-11-7.2-11-15.2A6.8 6.8 0 0 1 20 12a6.8 6.8 0 0 1 11 5.8C31 25.8 20 33 20 33Z"
        fill="url(#dh-mark)"
      />
      {/* Inner medical cross */}
      <path
        d="M20 14.5v12M14.5 20.5h11"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}
