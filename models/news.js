import mongoose from 'mongoose'

const newSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '標題為必填欄位']
  },
  description: {
    type: String,
    required: [true, '內文為必填欄位']
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: {
      values: ['新聞', '公告', '推廣', '其他'],
      message: '商品分類不存在'
    }
  },
  upState: {
    type: Boolean,
    default: false
  }
  // comments: {
  //   uId: {
  //     type: mongoose.ObjectId,
  //     ref: 'users'
  //   },
  //   word: {
  //     type: String,
  //     maxlength: [300, '內文最多字數為300字'],
  //     required: [true, '內容不能為空']
  //   },
  //   date: {
  //     type: Date,
  //     required: Date.now
  //   },
  //   isban: {
  //     type: Number,
  //     // 0 = 顯示
  //     // 1 = 被檢舉
  //     // 2 = 不顯示
  //     default: 0,
  //     required: [true, '缺少留言狀態']
  //   }

  // }
})

export default mongoose.model('news', newSchema)
