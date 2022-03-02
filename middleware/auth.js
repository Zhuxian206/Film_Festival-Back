import jwt from 'jsonwebtoken'
import users from '../models/users.js'

export default async (req, res, next) => {
  try {
    // authorization 授權 是跟header、body同層的種類
    // 把 Bearer 改成空的，或是空文字
    // 因為 jwt 認證預設最前面會有一段多出的 Bearer
    // 檢測有沒有 authorization，有的話做下一個動作
    // 完整寫法
    // const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') || ''
    // 短路求值 加 可選串連
    const token = req.headers.authorization?.replace('Bearer ', '') || ''
    // 如果有token
    if (token.length > 0) {
      // 先 decode 解密
      // jwt這個套件解譯錯誤會直接跳catch，所以不需要再寫錯誤判斷
      const decoded = jwt.decode(token)
      // 找一個使用者，他的 id 是解譯出來的 id，然後他的 token 有這個 jwt
      req.user = await users.findOne({ _id: decoded._id, tokens: token })
      req.token = token
      // 如果有user的話
      if (req.user) {
        // 再 verify 驗證
        jwt.verify(token, process.env.SECRET)
        next()
      } else {
        throw new Error()
      }
    } else {
      throw new Error()
    }
  } catch (error) {
    console.log(error)
    if (error.name === 'TokenExpiredError' && req.baseUrl === '/users' && req.path === '/extend') {
      next()
    } else {
      res.status(401).send({ success: false, message: '驗證錯誤' })
    }
  }
}
