const cryptoSHA256 = require('crypto-js/sha256')
const encHex = require('crypto-js/enc-hex')
export const getSign = (timestamp: string, body = '', url: string, appId: string, appKey: string) => {
  body = body.replace(/ /g, '')
  body = body.replace(/\t/g, '')
  body = body.replace(/\r/g, '')
  body = body.replace(/\n/g, '')
  // body = body.replace(/\\n/g, '')
  if (url.charAt(0) !== '/')
    url = url.substring(url.indexOf('/', 8))

  if (url.includes('?'))
    url = url.substring(0, url.indexOf('?'))

  const sign = encHex.stringify(
    cryptoSHA256(url + body + appId + appKey + timestamp),
  )
  return sign
}
