import mongoose from 'mongoose'
import md5 from 'md5'
import validator from 'validator'

const userSchema = new mongoose.Schema({
  account: {
    type: String,
    minlength: [4, '帳號必須 4 個字以上'],
    maxlength: [20, '帳號必須 20 個字以下'],
    unique: true,
    required: [true, '帳號不能為空']
  },
  password: {
    type: String,
    required: [true, '密碼不能為空']
  },
  email: {
    type: String,
    required: [true, '信箱不能為空'],
    unique: true,
    validate: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式不正確'
    }
  },
  role: {
    // 0 = 一般會員
    // 1 = 管理員
    type: Number,
    default: 0
  },
  tokens: {
    type: [String]
  },
  cart: {
    type: [
      {
        booking: {
          type: mongoose.ObjectId,
          ref: 'bookings',
          required: [true, '缺少選定場次 ID']
        },
        // seat: {
        //   type: [String],
        //   required: [true, '缺少座位編號']
        // },
        quantity: {
          type: Number,
          required: [true, '缺少預定張數']
        }
      }
    ]
  },
  realName: {
    type: String
  },
  cellPhone: {
    type: String,
    default: '手機號碼'
    // validate: {
    //   validator (phone) {
    //     return validator.isMobilePhone(phone)
    //   },
    //   message: '手機號碼格式不正確'
    // }
  }
}, { versionKey: false })

// isMobilePhone 檢測是否為手機號碼

userSchema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = md5(user.password)
    } else {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

userSchema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = md5(user.password)
    } else {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default mongoose.model('users', userSchema)
