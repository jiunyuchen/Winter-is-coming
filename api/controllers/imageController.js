/**
 * This is the internal API for controlling image uploads and retrieval.
 * It is isolated from the rest of the code and only handles image-related
 * HTTP requests. Information for the requests is retrieved from the database.
 *
 * It requires daoImage.js and dao.js files for the access to the database, as
 * well as the Image model code.
 *
 * @module api/controllers/image
 */

let model = require('../../static/models/Image.js');
let dao = require('../dao/dao.js');
let daoImage = require('../dao/daoImage.js');
let multer = require('multer');
let path = require('path');
let fs = require('fs');

module.exports = {
    addImage: addImage,
    getImageData: getImageData,
    getImagesNames: getImagesNames
};
let townName


/**
 * Adding an Image endpoint. Take the image file and data and then assign the 
 * params cvalue in the town name value to be stored in the image new file name in
 * the database  
 * 
 * Adds a new Image Doc and Attachment inside of it.
 *
 * @param req Params, file, data 
 * @param res
 */

function addImage(req, res, next) {

    //Assign the town name to be used in the image new file naming 
    townName = req.params.town;

    upload(req, res, (err) => {

        if (err) {
            res.status(520).end(JSON.stringify(err));
        } else {
            if (req.file === undefined) {
                res.status(520).end(JSON.stringify({
                    msg: 'Error: No File Selected!'
                }));
            } else {
                //Assigning the appended file data to the doc variable
                var doc = req.file
                // getting the last image ID
                imageID = dao.data.maxIDImage[0];
                let id = imageID + 1;

                //Update server ID
                dao.data.maxIDImage[0] = id
                id = "image_" + id

                //Getting the appended data for later validations
                //And requiring the image from the Database
                jsonobj = JSON.parse(req.body.data);
                jsonobj.id = id;
                jsonobj.type = "image";

                //Creatying a object model
                let image = new model.Image();
                image.fromJSON(jsonobj);


                //Read binary data
                var bitmap = fs.readFileSync(req.file.path);

                //This part is an object for detailes of the needed image
                var idAndRevData = {
                    id: id,
                    town: image.town,
                    type: image.type
                }
                //This part is an object for detailes of the needed attatchment
                var attachmentData = {
                    name: req.file.filename,
                    'Content-Type': req.file.mimetype,
                    "Image-town": image.town,
                    "Content-Length": req.file.size,
                    body: new Buffer(bitmap).toString('base64')
                }

                // We will ask the DAO to store the post, and then finish
                // the handler  in the callback
                daoImage.saveImage(idAndRevData, attachmentData)

                //If the image is saved response with success message
                res.status(201).end(JSON.stringify({
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                }));
            }
            //Unlink the file from the server if the the proccess is correct
            fs.unlink(req.file.path)
        }
    });
}


/**
 * Adding an Image endpoint. Take the image file and data and then assign the 
 * params value in the town name value to be stored in the image new file name in
 * the database  
 * 
 * Retrive the image data file
 *
 * @param req Image, file, data 
 * @returns {string}
 */

function getImageData(req, res, next) {

    imageRequest = JSON.parse(req.params.image).params;

    daoImage.getImageData(imageRequest, function (imageString) {

        // Check if the response has image data
        if (!imageString) {
            res.status(409).send({ success: false, message: 'Sorry has been an error' });
        } else {
            // end the response with code 200 and the correct object
            res.status(200).end(JSON.stringify(imageString));
        }

    });
}


/**
 * Retriving the images endpoint. Take the image file and data and then assign the 
 * params cvalue in the town name value to be stored in the image new file name in
 * the database  
 * 
 * Retrive all images details 
 *
 * @returns {string}
 */

function getImagesNames(req, res, next) {

    // We will ask the DAO to bring all the images details
    // the handler  in the callback
    daoImage.getImagesNames(function (images) {

        // Check if the response has image data
        if (!images) {
            res.status(409).send({ success: false, message: 'Sorry has been an error' });
        } else {
            // end the response with code 200 and the correct array of images
            res.status(200).end(JSON.stringify(images));
        }
    })
}


//Using Multer to store the image file temproary on the server befor uploading it
//The file name has the town name for later filttering
let storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, townName + '_' + Date.now() + path.extname(file.originalname));
    }
});


// Initiation the uploading using multer and cheking if the file could be uploaded
let upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('file');

// Check the file extention and sixe 
function checkFileType(file, callback) {
    // Allowed extention
    let filetypes = /jpeg|jpg|png|gif/;
    // Check the extention
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check the multipurpose internet mail extensions
    let mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback('Error: Images Only!');
    }
}



