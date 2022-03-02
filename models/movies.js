import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '片名為必填欄位']
  },
  description: {
    type: String,
    required: [true, '影片介紹為必填欄位']
  },
  image: {
    type: String
  },
  director: {
    type: String,
    required: [true, '導演名稱為必填欄位']
  },
  directorDesc: {
    type: String
  },
  // 是否上架
  upState: {
    type: Boolean,
    default: false
  }
  // 本片有的場次
  // booking: {
  //   type: [
  //     {
  //       bId: {
  //         type: mongoose.ObjectId,
  //         ref: 'bookings',
  //         required: [true, '缺少場次 ID']
  //       }
  //     }
  //   ]
  // }

})

export default mongoose.model('movies', movieSchema)
