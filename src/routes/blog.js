const express = require('express');

const router = express.Router();

const BlogController = require('../app/controllers/BlogController');

const HomeController = require('../app/controllers/HomeController');


// ========================================
// TRANG TẠO BÀI VIẾT
// ========================================
router.get('/create', HomeController.create);


// ========================================
// LƯU BÀI VIẾT
// ========================================
router.post('/create', HomeController.store);


// ========================================
// TRANG SỬA BÀI VIẾT
// ========================================
router.get('/:id/edit', HomeController.edit);


// ========================================
// CẬP NHẬT BÀI VIẾT
// ========================================
router.put('/:id', HomeController.update);


// ========================================
// XÓA BÀI VIẾT
// ========================================
router.delete('/:id', HomeController.delete);


// ========================================
// CHI TIẾT BÀI VIẾT
// ĐỂ CUỐI CÙNG
// ========================================
router.get('/:slug', HomeController.show);


module.exports = router;