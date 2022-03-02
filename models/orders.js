import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  // 誰下訂的
  user: {
    type: mongoose.ObjectId,
    ref: 'users'
  },
  movies: {
    type: [
      {
        booking: {
          type: mongoose.ObjectId,
          ref: 'bookings',
          required: [true, '缺少影片 ID']
        },
        // seat: {
        //   type: String,
        //   required: [true, '缺少座位編號']
        // },
        quantity: {
          type: Number,
          required: [true, '缺少預定張數']
        }
      }
    ]
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

export default mongoose.model('orders', orderSchema)
