import md5 from 'md5'
import jwt from 'jsonwebtoken'
import users from '../models/users.js'

export const register = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '成功註冊' })
  } catch (error) {
    // 跳 ValidationError 為 model 裡設定的驗證錯誤
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      console.log(error)
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    // 去資料庫找一個帳號是 req.body.account
    // 然後密碼是 md5 加密之後的 req.body.password
    const user = await users.findOne(
      { account: req.body.account, password: md5(req.body.password) },
      '-password'
    )
    // 如果找到的話，簽一個 token 給他
    if (user) {
      // _id 是 user 的 id，從 mongoose.ObjectId 轉成文字
      // 加上加密的密鑰
      // 最後一個是選項，多久後過期的jwt
      const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
      user.tokens.push(token)
      await user.save()
      const result = user.toObject()
      delete result.tokens
      result.token = token
      res.status(200).send({ success: true, message: '成功登入', result })
      // 如果沒有找到的話
    } else {
      res.status(404).send({ success: false, message: '帳號或密碼錯誤' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    // 把不是這個請求的token留下來，其餘踢掉
    // 儲存後user的token應為空
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '登出成功' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
    // 找到指定tokens後，舊換新
    req.user.tokens[idx] = token
    // 標記有做更新，不然他不會修改
    req.user.markModified('tokens')
    await req.user.save()
    // 新的要記得傳出
    res.status(200).send({ success: true, message: '', result: { token } })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
// 使用者拿jwt來換他的資料
// 我們的jwt會放在local storage裡面
// 登入之後使用者將瀏覽器關掉後，再打開網頁的時候要去跟後台要使用者資訊
export const getUserInfo = (req, res) => {
  try {
    const result = req.user.toObject()
    delete result.tokens
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
