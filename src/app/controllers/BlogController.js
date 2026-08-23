const Blog = require('../models/Blogs');

class BlogController {

    // GET /blogs/:slug
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


                // =========================
                // PHÂN TRANG
                // =========================

                const page = parseInt(req.query.page) || 1;

                // Chia nội dung bằng ---PAGE---
                const pages = (blog.content || '').split('---PAGE---');

                const totalPages = pages.length;

                // Không cho page vượt quá giới hạn
                const currentPage = Math.max(
                    1,
                    Math.min(page, totalPages)
                );


                // Nội dung trang hiện tại
                blog.currentContent = pages[currentPage - 1];


                // Thông tin trang
                blog.currentPage = currentPage;
                blog.totalPages = totalPages;


                // Trang trước
                if (currentPage > 1) {
                    blog.previousPage = currentPage - 1;
                }


                // Trang sau
                if (currentPage < totalPages) {
                    blog.nextPage = currentPage + 1;
                }


                res.render('detail', {
                    blog
                });

            })
            .catch(next);
    }
}

module.exports = new BlogController();