// import { useRouter } from 'vue-router'
// import { publicCheckData } from './utils'
// import { checkToken, exchange, postBigDataLogin } from '@/apis/common'
import { publicCheckData } from '.'
import { checkToken, exchange } from '@/service/common'
import { client_id } from '@/config'
// import useOverviewStore from '@/store'
// import useMenuStore from '@/store/menu'

// 登出
export async function logout() {
  // 清空集团信息和token
  localStorage.clear();
  (window as any).__USERCENTER__.logout()
}

// 登录
export function login(fn?: any) {
  // const store = useOverviewStore();
  (window as any).__USERCENTER__.login().then(async (res: any) => {
    // if (!res.token) {
    //   logout()
    // }
    // else {
    localStorage.setItem('base_token', res.token || '')
    const tokenRes = await exchange(res.token)

    const token = publicCheckData([tokenRes, 'data', 'Access-User-Token'])
    if (token) {
      localStorage.setItem('UserToken', token)
      fn(token)
    }
    else {
      logout()
    }
    // }
  })
}

// 配置
export function setLoginConfig() {
  (window as any).__USERCENTER__.configUserCenter({
    clientId: client_id, // 账号中心cliendtId
    ssoUrl: 'https://iama.haier.net', // 账号中心统一登录页
    tokenUrl: `/system-manager-rest/iam/${client_id}/token`, // 集成了账号中心提供的后端服务的地址
  })
}

// 校验登录
export function checkLogin(fn: any) {
  const token = localStorage.getItem('UserToken')
  if (!token) { // 不存在token，登录获取token
    login(fn)
  }
  else {
    console.log('当前token是', token)
    checkToken(token).then((res: any) => { //  校验token是否过期
      const { id, name } = publicCheckData([res]) || {}
      if (!id || !name)
        logout()
      else
        fn(token)
    })
  }
}
