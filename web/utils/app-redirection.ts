import { basicUrl } from '@/config'

export const getRedirection = (
  isCurrentWorkspaceManager: boolean,
  app: any,
  redirectionFunc: (href: string) => void,
) => {
  if (!isCurrentWorkspaceManager) {
    redirectionFunc(`${basicUrl}/app/${app.id}/overview`)
  }
  else {
    if (app.mode === 'workflow' || app.mode === 'advanced-chat')
      redirectionFunc(`${basicUrl}/app/${app.id}/workflow`)
    else
      redirectionFunc(`${basicUrl}/app/${app.id}/configuration`)
  }
}
