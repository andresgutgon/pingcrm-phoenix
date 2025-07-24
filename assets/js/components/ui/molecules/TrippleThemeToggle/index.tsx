'use client'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { Button } from '../../atoms/Button'
import { cn } from '@/lib/utils'
import { AppLocalStorage, useLocalStorage } from '@/hooks/useLocalStorage'
import { ClientOnly } from '@/components/ui/atoms/ClientOnly'

export const THEMES = ['light', 'dark', 'system'] as const
export type ThemeValue = (typeof THEMES)[number]

export function TripleThemeToggle() {
  const { theme: initialTheme, setTheme } = useTheme()
  const { value: theme, setValue: setLocalTheme } = useLocalStorage<ThemeValue>(
    {
      key: AppLocalStorage.colorTheme,
      defaultValue: initialTheme as ThemeValue,
    },
  )
  const onClick = useCallback(
    (t: ThemeValue) => () => {
      setLocalTheme(t)
      setTimeout(() => {
        setTheme(() => t)
      }, 200) // Css transition duration
    },
    [setTheme, setLocalTheme],
  )
  return (
    <ClientOnly>
      <div className='relative flex'>
        {THEMES.map((t) => (
          <Button
            key={t}
            variant='nope'
            size='icon'
            onClick={onClick(t)}
            aria-label={`Switch to ${t} theme`}
            className='rounded-full relative z-10'
            iconProps={{
              name: t === 'light' ? 'sun' : t === 'dark' ? 'moon' : 'monitor',
              color: 'foreground',
              opacity: theme === t ? undefined : '60',
            }}
          />
        ))}
        <div
          className={cn(
            'absolute top-0 left-0',
            'bg-background rounded-full',
            'transition-transform duration-200 ease-in-out',
            'w-6 h-full',
            {
              'translate-x-0': theme === 'light',
              'translate-x-6': theme === 'dark',
              'translate-x-12': theme === 'system',
            },
          )}
        />
      </div>
    </ClientOnly>
  )
}
