import type { Viewport } from 'next'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import I18nServer from './components/i18n-server'
import BrowerInitor from './components/browser-initor'
import SentryInitor from './components/sentry-initor'
import Topbar from './components/base/topbar'
import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

export const metadata = {
  title: 'HomeGPTagent',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
}

const localeMap: any = {
  'en-US': enUS,
  'zh-Hans': zhCN,
}

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()

  return (
    <html lang={locale ?? 'en'} className="h-full">
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className="h-full select-auto"
        data-api-prefix={process.env.NEXT_PUBLIC_API_PREFIX}
        data-pubic-api-prefix={process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX}
        data-public-edition={process.env.NEXT_PUBLIC_EDITION}
        data-public-sentry-dsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
        data-public-maintenance-notice={process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE}
        data-public-site-about={process.env.NEXT_PUBLIC_SITE_ABOUT}
      >
        <script src="https://r.haier.net/assets/prod/dts-fe/fe-stub-usercenter/3.0.58/core.js"></script>
        <ConfigProvider locale={localeMap[locale]}>
          <Topbar/>
          <BrowerInitor>
            <SentryInitor>
              {/* @ts-expect-error Async Server Component */}
              <I18nServer locale={locale}>{children}</I18nServer>
            </SentryInitor>
          </BrowerInitor>
        </ConfigProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
