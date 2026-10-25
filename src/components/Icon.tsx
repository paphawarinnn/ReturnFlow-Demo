type IconName = 'box' | 'return' | 'store' | 'logout' | 'arrow' | 'search' | 'check' | 'clock'

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    box: <><path d="m21 8-9 5-9-5"/><path d="M3 8l9-5 9 5v10l-9 5-9-5Z"/><path d="M12 13v10"/></>,
    return: <><path d="m9 14-4-4 4-4"/><path d="M5 10h8a6 6 0 0 1 0 12h-2"/></>,
    store: <><path d="M4 10v11h16V10"/><path d="M3 10l2-7h14l2 7"/><path d="M8 21v-7h8v7"/><path d="M3 10c0 2 4 2 4 0 0 2 5 2 5 0 0 2 5 2 5 0 0 2 4 2 4 0"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h6v18h-6"/></>,
    arrow: <><path d="m9 18 6-6-6-6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
