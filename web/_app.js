// // pages/_app.js
// import type { AppProps } from 'next/app'
// import { Router } from 'next/router'

// function MyApp({ Component, pageProps }: AppProps) {
//   const prefix = '/homegptagent' // 这里设置你想要的前缀
//   console.log('路由问题')
//   // 在路由切换时，添加前缀
//   Router.events.on('routeChangeStart', (url) => {
//     Router.push(prefix + url)
//   })

//   return <Component {...pageProps} />
// }

// export default MyApp
