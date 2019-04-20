/**
 * This is the Data Access Object for storing and accesing only Image-related
 * information from the database. It is separated from the other DAO applications
 * and so does not affect calls to the database for other resources/documents.
 * 
 */

let dao = require('./dao.js');
const multer = require('multer');
const path = require('path');
let fs = require('fs');

module.exports = {
    saveImage: saveImage,
    getImageData: getImageData,
    getImagesNames: getImagesNames
};

let imageID;
let images = [];
let temp;

//Saving the image in the couchdb 
function saveImage(idAndRevData, attachmentData) {
    dao.data.db.saveAttachment(idAndRevData, attachmentData, function (err, reply) {
       //if there is an error end the process
        if (err) {
            return;
        }
    })
    images = [];
}

//This function  is to retrive one image file data
function getImageData(imageRequest, callback) {

    //This variable will holr the retrived image string
    let imageString;
    
    //Getting the requested image based on the ID and name 
    dao.data.db.getAttachment(imageRequest.imageID, imageRequest.imageName, function (err, reply) {
        if (err) {
            console.dir(err);
            return;
        }

        //Create buffer object from base64 encoded string, it is important to tell 
        //the constructor that the string is base64 encoded
        bitmap = Buffer(reply.body.toString(), 'base64');

        // write buffer to file teprorry for uplading
        fs.writeFileSync("public/uploads/file-1524446066100.png", bitmap);
        
        //converting the buffer data set into string 
        imageString = new Buffer(bitmap).toString('base64');

        callback(imageString);

    })
}

//This function  is to retrive all image details only 
function getImagesNames(callback) {

    dao.data.db.view('images/all', function (err, doc) {

        if (err) console.log('Error getting all images');
        else if (doc) {
       
            for (d of doc) {

                let imageID = d.id;
                let imageNum = d.id.replace(/image_/, "");
                let imageRevesion = d.value._rev;
                let imageName = Object.keys(d.value._attachments)[0];

                var imageData = {
                    Image: {
                        imageID: imageID,
                        rev: imageRevesion,
                        imageName: imageName
                    }
                }

                images.push(imageData);
            }
        }

        callback(images);

        // Empty the array for other calls
        images = [];

    });
}