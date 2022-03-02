import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'

import {
  register,
  login,
  logout,
  extend,
  getUserInfo
} from '../controllers/users.js'
// import { RuleTester } from 'eslint'

const router = express.Router()

// router.post(路徑, function名稱)
// router.post('/', register)

// 先用 middleware 的 function 去產生另一個 function ，再去跑 register
router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), login)
router.delete('/logout', auth, logout)
// 舊換新不能用get
router.post('/extend', auth, extend)
router.get('/me', auth, getUserInfo)

export default router
