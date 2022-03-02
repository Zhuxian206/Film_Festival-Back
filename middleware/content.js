// 使用 middleware 避免寫大量的格式驗證
export default (contentType) => {
  // function 再 return 一個 function
  return (req, res, next) => {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(contentType)) {
      res.status(400).send({ success: false, message: '資料格式不正確' })
    } else {
      next()
    }
  }
}
