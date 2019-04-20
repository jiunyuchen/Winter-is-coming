(function () {

    let api = new HW('');

    window.API.Forum = {
        addPost(post) {
            return api.post('addForumPost', JSON.parse(post.toJSON()));
        },

        deletePost(id) {
            return api.del('deletePost/' + id);
        }
    };

})();