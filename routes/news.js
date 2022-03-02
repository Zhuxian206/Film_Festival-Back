import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import {
  createNews,
  getNews,
  getAllNews,
  getNewById,
  updateNewById
} from '../controllers/news.js'

const router = express.Router()

router.post('/', auth, admin, content('multipart/form-data'), upload, createNews)
router.get('/', getNews)
router.get('/all', auth, admin, getAllNews)
router.get('/:id', getNewById)
router.patch('/:id', auth, admin, content('multipart/form-data'), upload, updateNewById)

export default router
