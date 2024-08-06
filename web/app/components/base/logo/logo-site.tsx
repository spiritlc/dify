import type { FC } from 'react'
import classNames from 'classnames'
import { basicUrl } from '@/config'

type LogoSiteProps = {
  className?: string
}

const LogoSite: FC<LogoSiteProps> = ({
  className,
}) => {
  return (
    <img
      src={`${location.origin}${basicUrl}/logo/logo-site.png`}
      className={classNames('block w-auto h-10', className)}
      alt='logo'
    />
  )
}

export default LogoSite
