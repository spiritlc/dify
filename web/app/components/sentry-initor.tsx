'use client'

import { useEffect, useState } from 'react'
import * as Sentry from '@sentry/react'
import { checkLogin, setLoginConfig } from '@/utils/login'

const isDevelopment = process.env.NODE_ENV === 'development'

const SentryInit = ({
  children,
}: { children: React.ReactElement }) => {
  const [token, setToken] = useState()
  useEffect(() => {
    console.log('!!')

    setLoginConfig()

    // 校验token
    console.log('校验token')
    checkLogin((res: any) => setToken(res))

    const SENTRY_DSN = document?.body?.getAttribute('data-public-sentry-dsn')
    if (!isDevelopment && SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [
          new Sentry.BrowserTracing({
          }),
          new Sentry.Replay(),
        ],
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      })
    }
  }, [])
  return token ? children : null
}

export default SentryInit
