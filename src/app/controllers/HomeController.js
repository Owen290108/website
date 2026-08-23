const Blog = require('../models/Blogs');

class HomeController {

    // =========================
    // TRANG CHỦ
    // MỖI TRANG 3 BÀI VIẾT
    // =========================
    home(req, res, next) {

        // Lấy số trang từ URL
        // Ví dụ: /?page=2
        const page = parseInt(req.query.page) || 1;

        // Mỗi trang hiển thị 3 bài
        const limit = 3;

        // Tính số bài cần bỏ qua
        const skip = (page - 1) * limit;

        Promise.all([

            // Lấy 3 bài của trang hiện tại
            Blog.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            // Đếm tổng số bài viết
            Blog.countDocuments({})

        ])
            .then(([blogs, totalBlogs]) => {

                // Chuyển ngày tháng sang định dạng Việt Nam
                blogs.forEach(blog => {

                    if (blog.createdAt) {

                        blog.createdAt = new Date(blog.createdAt)
                            .toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            });

                    }

                });


                // =========================
                // TÍNH TỔNG SỐ TRANG
                // =========================

                const totalPages = Math.ceil(
                    totalBlogs / limit
                );


                // =========================
                // TRANG TRƯỚC
                // =========================

                const previousPage = page > 1
                    ? page - 1
                    : null;


                // =========================
                // TRANG SAU
                // =========================

                const nextPage = page < totalPages
                    ? page + 1
                    : null;


                // =========================
                // HIỂN THỊ TRANG CHỦ
                // =========================

                res.render('home', {

                    blogs,

                    // Trang hiện tại
                    currentPage: page,

                    // Tổng số trang
                    totalPages,

                    // Trang trước
                    previousPage,

                    // Trang sau
                    nextPage

                });

            })
            .catch(next);
    }


    // =========================
    // TRANG CHI TIẾT BÀI VIẾT
    // =========================
    show(req, res, next) {

        Blog.findOne({
            slug: req.params.slug
        })
            .lean()
            .then(blog => {

                if (!blog) {
                    return res.status(404).send(
                        'Không tìm thấy bài viết'
                    );
                }

                // Chuyển ngày tạo sang định dạng Việt Nam
                if (blog.createdAt) {

                    blog.createdAtVN = new Date(blog.createdAt)
                        .toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });

                }

                res.render('detail', {
                    blog
                });

            })
            .catch(next);
    }


    // =========================
    // TRANG GIỚI THIỆU
    // =========================
    about(req, res) {
        res.render('about');
    }


    // =========================
    // TRANG LIÊN HỆ
    // =========================
    contact(req, res) {
        res.render('contact');
    }


    // =========================
    // TÌM KIẾM
    // =========================
    search(req, res) {
        res.send('Trang tìm kiếm');
    }


    // =========================
    // TRANG ĐĂNG BÀI
    // =========================
    create(req, res) {
        res.render('create');
    }


    // =========================
    // LƯU BÀI VIẾT
    // =========================
    store(req, res, next) {

        const blog = new Blog({

            name: req.body.name,

            description: req.body.description,

            // Nội dung chi tiết
            content: req.body.content,

            // Link ảnh
            image: req.body.image,

            // Tạo slug tự động từ tiêu đề
            slug: req.body.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
        });


        blog.save()
            .then(() => {
                res.redirect('/');
            })
            .catch(next);
    }


    // =========================
    // TRANG SỬA BÀI VIẾT
    // =========================
    edit(req, res, next) {

        Blog.findOne({
            _id: req.params.id
        })
            .lean()
            .then(blog => {

                if (!blog) {
                    return res.status(404).send(
                        'Không tìm thấy bài viết'
                    );
                }

                res.render('edit', {
                    blog
                });

            })
            .catch(next);
    }


    // =========================
    // CẬP NHẬT BÀI VIẾT
    // =========================
    update(req, res, next) {

        const newSlug = req.body.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');


        Blog.findByIdAndUpdate(

            req.params.id,

            {
                name: req.body.name,

                description: req.body.description,

                // QUAN TRỌNG: cập nhật nội dung
                content: req.body.content,

                image: req.body.image,

                slug: newSlug,
            },

            {
                new: true,
                runValidators: true
            }
        )
            .then(blog => {

                if (!blog) {
                    return res.status(404).send(
                        'Không tìm thấy bài viết'
                    );
                }

                res.redirect('/');

            })
            .catch(next);
    }


    // =========================
    // XÓA BÀI VIẾT
    // =========================
    delete(req, res, next) {

        Blog.findByIdAndDelete(req.params.id)

            .then(blog => {

                if (!blog) {
                    return res.status(404).send(
                        'Không tìm thấy bài viết'
                    );
                }

                res.redirect('/');

            })

            .catch(next);
    }


    // =========================
    // ĐĂNG NHẬP
    // =========================
    login(req, res) {
        res.send('Trang đăng nhập');
    }


    // =========================
    // XỬ LÝ ĐĂNG NHẬP
    // =========================
    checkLogin(req, res) {
        res.send('Xử lý đăng nhập');
    }

}


module.exports = new HomeController();