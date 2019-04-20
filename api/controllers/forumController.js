/**
 * This is the internal API for controlling requests regarding town forums.
 * It is isolated from the rest of the code and only handles forum-related
 * HTTP requests. Forum posts are retrieved from the database.
 *
 * It requires daoForum.js and dao.js files for the access to the database,
 * and the Post model.
 *
 * @module api/controllers/forum
 */

let model = require('../../static/models/Post.js');
let bodyParser = require('body-parser');
let dao = require('../dao/daoForum.js');
let daoData = require('../dao/dao.js');
const moment = require('moment');


let postID;

module.exports = {
    getPosts: getPosts,
    addPost: addPost,
    deletePost: deletePost
};

/**
   * Connets the recived post data to the database 
   * 
   * @param post
   * @returns {string}
   */

function addPost(req, res, next) {

    // Put the received object into the store 
    let jsonobj = req.body;
    jsonobj.id = daoData.data.maxID[0]++;
    jsonobj.type = "post";
    jsonobj.username = req.user.username;
    //Converting the post to object for sending to the database
    let post = (new model.Post()).fromJSON(jsonobj);

    // We will ask the DAO to store the post, and then finish
    // the handler  in the callback
    dao.addPost(post, function (retpost) {

        // Check if the post has been added
        if (!retpost) {
            res.status(409).send({ success: false, message: 'Sorry there is a posting conflic' });
        } else {
            res.status(201).end(JSON.stringify(retpost));
        }
    });
};


/**
   * Deleting the reqired post by certain user
   * 
   * @param id
   * @returns {string}
   */
function deletePost(req, res, next) {

    let id = req.params.id;

    // This part will ask the DAO to delete the post, and then finish
    // the handler  in the callback
    dao.removePost(id, function (databaseResponse) {
        console.log(databaseResponse.ok)

        // Check if the post has been added
        if (!databaseResponse.ok) {
            res.status(409).send({ success: false, message: 'Sorry there is a deleting problem' });
        } else {
            res.status(201).end(JSON.stringify({ success: true }));
        }
    });
}

/**
   * Getting all the posts data
   * 
   * @param id
   * @returns {string}
   */
function getPosts(req, res, next) {

    // This will ask the DAO to get allthe the posts, and then finish
    // the handler in the callback
    dao.getPosts(function (posts) {

        let result = { 'allposts': [] };
        for (post of posts) {
            result.allposts.push(JSON.parse(post.toJSON()));
        }

        // iterate over the array of all posts, update the date
        // for human friendly display
        for (let post of result.allposts) {
            post.date = moment(post.date).fromNow();
        }

        // Check if the post has been added
        if (!posts) {
            res.status(409).send({ success: false, message: 'Sorry there is a posting conflic' });
        } else {
            res.status(200).end(JSON.stringify(result));
        }

    });
}
