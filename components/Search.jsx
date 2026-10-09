'use client'

// Based on Nextra 4.2.17's Search component (MIT). Changes: only the best
// MAX_PAGES pages are loaded and shown, each with at most MAX_SUB sections,
// and result links are not prefetched. The stock component loaded and
// rendered every match (180 pages and 450+ links for "server"), and each
// link prefetched its page, which froze the tab while typing.

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import cn from 'clsx'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useDeferredValue, useEffect, useRef, useState } from 'react'

const MAX_PAGES = 8
const MAX_SUB = 3
const INPUTS = new Set(['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'])

async function importPagefind() {
  window.pagefind = await import(/* webpackIgnore: true */ '/_pagefind/pagefind.js')
  await window.pagefind.options({ baseUrl: '/' })
}

const cleanUrl = (url) => url.replace(/\.html$/, '').replace(/\.html#/, '#')

export function Search({ className, placeholder = 'Search documentation…' }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [focused, setFocused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const inputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    setIsMac(navigator.userAgent.includes('Mac'))
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async (value) => {
      if (!value) {
        setResults([])
        setError('')
        return
      }
      setIsLoading(true)
      if (!window.pagefind) {
        try {
          await importPagefind()
        } catch (e) {
          if (!cancelled) {
            setError(e instanceof Error ? `${e.constructor.name}: ${e.message}` : String(e))
            setIsLoading(false)
          }
          return
        }
      }
      const response = await window.pagefind.debouncedSearch(value)
      if (!response || cancelled) return
      const data = await Promise.all(response.results.slice(0, MAX_PAGES).map((r) => r.data()))
      if (cancelled) return
      setIsLoading(false)
      setError('')
      setResults(
        data.map((d) => ({
          ...d,
          sub_results: d.sub_results.slice(0, MAX_SUB).map((s) => ({ ...s, url: cleanUrl(s.url) }))
        }))
      )
    }
    run(deferredSearch)
    return () => {
      cancelled = true
    }
  }, [deferredSearch])

  useEffect(() => {
    const onKeyDown = (event) => {
      const el = document.activeElement
      if (!el || INPUTS.has(el.tagName) || el.isContentEditable) return
      if (
        event.key === '/' ||
        (event.key === 'k' && !event.shiftKey && (navigator.userAgent.includes('Mac') ? event.metaKey : event.ctrlKey))
      ) {
        event.preventDefault()
        inputRef.current?.focus({ preventScroll: true })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleFocus = (event) => setFocused(event.type === 'focus')

  const handleSelect = (result) => {
    if (!result) return
    inputRef.current.blur()
    const [path, hash] = result.url.split('#')
    if (location.pathname === path) {
      location.href = `#${hash}`
    } else {
      router.push(result.url)
    }
    setSearch('')
  }

  return (
    <Combobox onChange={handleSelect}>
      <div
        className={cn(
          'nextra-search',
          'x:relative x:flex x:items-center',
          'x:text-gray-900 x:dark:text-gray-300',
          'x:contrast-more:text-gray-800 x:contrast-more:dark:text-gray-300',
          className
        )}
      >
        <ComboboxInput
          ref={inputRef}
          spellCheck={false}
          className={({ focus }) =>
            cn(
              'x:rounded-lg x:px-3 x:py-2 x:transition-colors',
              'x:w-full x:md:w-64',
              'x:text-base x:leading-tight x:md:text-sm',
              focus ? 'x:bg-transparent x:nextra-focus' : 'x:bg-black/[.05] x:dark:bg-gray-50/10',
              'x:placeholder:text-gray-500 x:dark:placeholder:text-gray-400',
              'x:contrast-more:border x:contrast-more:border-current',
              'x:[&::-webkit-search-cancel-button]:appearance-none'
            )
          }
          autoComplete="off"
          type="search"
          onChange={(e) => setSearch(e.currentTarget.value)}
          onFocus={handleFocus}
          onBlur={handleFocus}
          value={search}
          placeholder={placeholder}
        />
        {mounted && !focused && (
          <kbd
            className={cn(
              'x:absolute x:my-1.5 x:select-none x:end-1.5',
              'x:h-5 x:rounded x:bg-nextra-bg x:px-1.5 x:font-mono x:text-[11px] x:font-medium x:text-gray-500',
              'x:border nextra-border',
              'x:contrast-more:text-current',
              'x:items-center x:gap-1 x:flex',
              'x:max-sm:hidden not-prose'
            )}
          >
            {isMac ? '⌘K' : 'CTRL K'}
          </kbd>
        )}
      </div>
      <ComboboxOptions
        transition
        anchor={{ to: 'top end', gap: 10, padding: 16 }}
        className={({ open }) =>
          cn(
            'nextra-search-results',
            'nextra-scrollbar x:max-md:h-full',
            'x:border x:border-gray-200 x:text-gray-100 x:dark:border-neutral-800',
            'x:z-30 x:rounded-xl x:py-2.5 x:shadow-xl',
            'x:contrast-more:border x:contrast-more:border-gray-900 x:contrast-more:dark:border-gray-50',
            'x:backdrop-blur-md x:bg-nextra-bg/70',
            'x:motion-reduce:transition-none x:transition-opacity',
            open ? 'x:opacity-100' : 'x:opacity-0',
            error || isLoading || !results.length
              ? [
                  'x:md:min-h-28 x:grow x:flex x:justify-center x:text-sm x:gap-2 x:px-8',
                  error ? 'x:text-red-500 x:items-start' : 'x:text-gray-400 x:items-center'
                ]
              : 'x:md:max-h-[min(calc(100vh-5rem),400px)]!',
            'x:w-full x:md:w-[576px]',
            'x:empty:invisible'
          )
        }
      >
        {error ? (
          <div className="x:grid">
            <b className="x:mb-2">Failed to load search index.</b>
            {error}
          </div>
        ) : isLoading ? (
          'Loading…'
        ) : results.length ? (
          results.map((page) => (
            <Fragment key={page.url}>
              <div
                className={cn(
                  'x:mx-2.5 x:mb-2 x:not-first:mt-6 x:select-none x:border-b x:border-black/10 x:px-2.5 x:pb-1.5 x:text-xs x:font-semibold x:uppercase x:text-gray-500 x:dark:border-white/20 x:dark:text-gray-300',
                  'x:contrast-more:border-gray-600 x:contrast-more:text-gray-900 x:contrast-more:dark:border-gray-50 x:contrast-more:dark:text-gray-50'
                )}
              >
                {page.meta.title}
              </div>
              {page.sub_results.map((sub) => (
                <ComboboxOption
                  key={sub.url}
                  as={NextLink}
                  prefetch={false}
                  value={sub}
                  href={sub.url}
                  className={({ focus }) =>
                    cn(
                      'x:mx-2.5 x:break-words x:rounded-md',
                      'x:contrast-more:border',
                      focus
                        ? 'x:text-primary-600 x:contrast-more:border-current x:bg-primary-500/10'
                        : 'x:text-gray-800 x:dark:text-gray-300 x:contrast-more:border-transparent',
                      'x:block x:scroll-m-12 x:px-2.5 x:py-2'
                    )
                  }
                >
                  <div className="x:text-base x:font-semibold x:leading-5">{sub.title}</div>
                  <div
                    className={cn(
                      'x:mt-1 x:text-sm x:leading-[1.35rem] x:text-gray-600 x:dark:text-gray-400 x:contrast-more:dark:text-gray-50',
                      'x:[&_mark]:bg-primary-600/80 x:[&_mark]:text-white'
                    )}
                    dangerouslySetInnerHTML={{ __html: sub.excerpt }}
                  />
                </ComboboxOption>
              ))}
            </Fragment>
          ))
        ) : (
          deferredSearch && 'No results found.'
        )}
      </ComboboxOptions>
    </Combobox>
  )
}
