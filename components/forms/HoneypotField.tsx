interface HoneypotFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Bot trap. Real users never see or tab to this field, so any submission that
 * fills it is discarded server-side.
 *
 * Positioned off-screen rather than `display: none` — some bots skip hidden
 * inputs entirely, which would defeat the trap.
 */
export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] h-px w-px overflow-hidden"
    >
      <label htmlFor="website">Website (leave this field empty)</label>
      <input
        id="website"
        name="website"
        type="text"
        value={value}
        onChange={onChange}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
}
