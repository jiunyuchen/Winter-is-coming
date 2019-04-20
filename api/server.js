// Exports methods that launch and configure the server

const dao = require('./dao/dao');
const daoImage = require('./dao/daoImage');
const imageController = require('./controllers/imageController');
const forumController = require('./controllers/forumController');
const authController = require('./controllers/authController');
const weatherController = require('./controllers/weatherController');
const townController = require('./controllers/townController');
const getRequestUser = require('./middleware/getRequestUser');

(function () {

    let express = require('express');
    let bodyParser = require('body-parser');
    let port;


    // Export the public methods of the module so we can run it from JS
    module.exports = {
        runApp,
        configureApp,
    };

    function runApp() {
        port = 8080;
        dao.init();
        let app = express();
        configureApp(app);
        console.log("Listening on port " + port);
        return app.listen(port);
    }

    function configureApp(app) {

        // This parses anything submitted by assuming it is JSON.
        app.use(bodyParser.json());

        //Forum routs
        app.get("/getPosts", forumController.getPosts);
        app.post("/addForumPost", getRequestUser, forumController.addPost);
        app.delete("/deletePost/:id", getRequestUser, forumController.deletePost);

        //Images routs
        app.post("/addImage/:town", imageController.addImage);
        app.get('/getImage/:image', imageController.getImageData);
        app.get("/getImages", imageController.getImagesNames);

        //Weather app routs
        app.get('/getCurrentWeather/:name', weatherController.getCurrentWeather);
        app.get('/getForecast/:name', weatherController.getForecast);
        app.get('/getDescription', weatherController.getDescription);

        //Authentication routs
        app.post('/api/auth/login', authController.login);
        app.post('/api/auth/register', authController.register);

        // Towns routes
        app.get('/api/towns', townController.getTowns);
        app.get('/api/towns/:id', townController.getTown);


        //Static route
        app.use('/', express.static('static'));

        app.use('/public', express.static('public'));



    }

})();
