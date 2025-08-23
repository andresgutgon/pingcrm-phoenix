import { Text } from '@/components/ui/atoms/Text'
import { useIsMac } from '@/hooks/useIsMac'
import { cn } from '@/lib/utils'
import { Fragment, useMemo } from 'react'

function parseShortcut({
  shortcut,
  isMac,
}: {
  shortcut: string
  isMac: boolean
}) {
  return shortcut
    .replace(/cmd\+|command\+/gi, isMac ? '⌘' : 'Ctrl+')
    .replace(/ctrl\+/gi, isMac ? '⌘' : 'Ctrl+')
    .replace(/alt\+/gi, isMac ? '⌥' : 'Alt+')
    .replace(/shift\+/gi, isMac ? '⇧' : 'Shift+')
    .replace(/meta\+/gi, isMac ? '⌘' : 'Win+')
}

export function KeyboardShortcut({
  shortcut,
  inline = false,
}: {
  shortcut: string
  inline?: boolean
}) {
  const isMac = useIsMac()

  const keys = useMemo(() => {
    return parseShortcut({ shortcut, isMac })
      .split('+')
      .map((key) => key.trim())
      .filter((key) => key.length > 0)
  }, [shortcut, isMac])
  return (
    <div className={cn('flex items-center gap-1', { 'ml-auto': !inline })}>
      {keys.map((key, index) => (
        <Fragment key={index}>
          <kbd className='inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs font-medium text-muted-foreground bg-muted border border-border rounded shadow-sm'>
            <Text.H6
              color='foregroundMuted'
              tracking='widest'
              data-slot='dropdown-menu-shortcut'
            >
              {key}
            </Text.H6>
          </kbd>
          {index < keys.length - 1 && (
            <Text.H6
              color='foregroundMuted'
              tracking='widest'
              data-slot='dropdown-menu-shortcut'
            >
              +
            </Text.H6>
          )}
        </Fragment>
      ))}
    </div>
  )
}
