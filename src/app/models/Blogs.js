const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// =========================
// ĐỊNH NGHĨA SCHEMA CHO BLOG
// =========================
const Blog = new Schema({

    name: {
        type: String,
        maxLength: 255
    },

    description: {
        type: String,
        maxLength: 600
    },

    image: {
        type: String,
        maxLength: 255
    },

    slug: {
        type: String,
        maxLength: 255
    },

    // Ngày tạo bài viết
    createdAt: {
        type: Date,
        default: Date.now
    },

    // Ngày cập nhật bài viết
    updatedAt: {
        type: Date,
        default: Date.now
    }

});


// =========================
// XUẤT MODEL
// =========================
module.exports = mongoose.model('Blog', Blog);
