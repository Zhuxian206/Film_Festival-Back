import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import {
  create,
  getMovies,
  getAllMovies,
  getMovieById,
  updateMovieById
} from '../controllers/movies.js'

const router = express.Router()

router.post('/', auth, admin, content('multipart/form-data'), upload, create)
router.get('/', getMovies)
router.get('/all', getAllMovies)
router.get('/:id', getMovieById)
router.patch('/:id', auth, admin, content('multipart/form-data'), upload, updateMovieById)

export default router
