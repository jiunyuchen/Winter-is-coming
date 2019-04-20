/**
 * This is the Data Access Object for storing and accesing only posts-related
 * information from the database. It is separated from the other DAO applications
 * and so does not affect calls to the database for other resources/documents.
 * 
 */

let model = require('../../static/models/Post.js');
let dao = require('./dao.js');

module.exports = {
    getPosts: getPosts,
    removePost: removePost,
    addPost: addPost
};


//Geting all the posts from the couchdb
function getPosts(callback) {
    dao.data.db.view('allposts/all', function (err, doc) {
        let posts = [];
        if (err) console.log('Error getting all posts');
        else if (doc) {
            for (d of doc) {
                // console.log(d)
                post = new model.Post();
                post.fromJSON(d.value);
                posts.push(post);
            }
        }
        callback(posts);
    });
}

//Adding one post to the couchdb
function addPost(post, callback) {
    dao.data.db.save(post.id + "", JSON.parse(post.toJSON()), function (err, res) {
        callback(post.toJSON());
    });
}

//Removing one post from the couchdb
function removePost(id, callback) {
    dao.data.db.remove(id + "", function (err, res) {
        if(err) console.log(err);
        else callback(res);
    });
}
