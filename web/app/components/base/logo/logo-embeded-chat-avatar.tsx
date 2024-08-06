import type { FC } from 'react'
import { basicUrl } from '@/config'

type LogoEmbededChatAvatarProps = {
  className?: string
}
const LogoEmbededChatAvatar: FC<LogoEmbededChatAvatarProps> = ({
  className,
}) => {
  return (
    <img
      src={`${location.origin}${baseUrl}/logo/logo-embeded-chat-avatar.png`}
      className={`block w-10 h-10 ${className}`}
      alt='logo'
    />
  )
}

export default LogoEmbededChatAvatar
