'use client'

import { SWRConfig } from 'swr'
// import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
// import { checkLogin, setLoginConfig } from '@/utils/login'

type SwrInitorProps = {
  children: ReactNode
}
const SwrInitor = ({
  children,
}: SwrInitorProps) => {
  // const AccessToken = localStorage?.getItem('UserToken')
  // const [token, setToken] = useState()

  // useEffect(() => {
  //   setLoginConfig()

  //   // 校验token
  //   console.log('校验token')
  //   checkLogin((res: any) => setToken(res))
  // }, [])

  return <SWRConfig value={{
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  }}>
    {children}
  </SWRConfig>
}

export default SwrInitor
