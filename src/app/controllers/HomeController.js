home(req, res, next) {
    Blog.find({})
        .lean()
        .then(blogs => {

            blogs = blogs.map(blog => {

                if (blog.createdAt) {
                    blog.createdAtVN = new Date(blog.createdAt)
                        .toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
                }

                if (blog.updatedAt) {
                    blog.updatedAtVN = new Date(blog.updatedAt)
                        .toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
                }

                return blog;
            });

            res.render('home', { blogs });
        })
        .catch(next);
}
