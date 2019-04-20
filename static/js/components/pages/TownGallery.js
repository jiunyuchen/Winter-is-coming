(function () {
    window.Components.Pages.TownGallery = {

        template: `
<div>
    <div class="galleryContainer">

        <div class="main-img">
            <img v-if="images.length>0" :src="images[0]" id="current">
        </div>
        <br>
        <div class="imgs">
            <img v-for="imageSrcData in images" :src="imageSrcData" />
        </div>

    </div>

    <br>
    <br>

    <h4>Upload Photos of your amazing town</h4>
    <hr/>
    <div v-if="$root.user">

        <div class="container text-center border rounded" id="imageSection">
            <div class="form-group">
                <div id="app">
                    <div v-if="!image">
                        <label for="selectImage">Select an image</label>
                        <input name="myImage" class="form-control-file border rounded" type="file" @change="assignImage">
                    </div>
                    <div v-else>
                        <label for="ItemPreview">Image Preview</label>
                        <img class="forumImg border rounded" :src="image" />
                        <button @click="removeImage" class="btn btn-danger">Remove image</button>
                    </div>
                </div>
            </div>
            <div class="container text-center ">
                <button @click="onUpload" class="btn btn-primary ">Submit</button>
            </div>
        </div>
    </div>

    <div v-else>
        Please
        <a @click="$root.auth().openLoginModal()">log in</a> to leave a Upload
    </div>
    <hr/>
</div>
        `,

        data() {
            return {
                myImage: "null",
                image: '',
                images: [],
                imageSrc: ''
            };
        },

        methods: {

            setUpEvents() {
                let current = document.querySelector("#current");
                let imgs = document.querySelectorAll(".imgs img");
                let opacity = 0.6;

                if (imgs.length === 0) return;

                // Set first img opacity
                imgs[0].style.opacity = opacity;

                imgs.forEach(img => img.addEventListener("click", imgClick));

                function imgClick(e) {
                    // Reset the opacity
                    imgs.forEach(img => (img.style.opacity = 1));

                    // Change current image to src of clicked image
                    current.src = e.target.src;

                    // Add fade in class
                    current.classList.add("fade-in");

                    // Remove fade-in class after .5 seconds
                    setTimeout(() => current.classList.remove("fade-in"), 500);

                    // Change the opacity to opacity var
                    e.target.style.opacity = opacity;
                }
            },

            getImage(image) {
                //Preparing the data object about the image details
                let imageRequest = {
                    params: {
                        imageID: image.Image.imageID,
                        rev: image.Image.rev,
                        imageName: image.Image.imageName
                    }
                };
                //Stringifing the params vlaues to be sent to the server
                imageRequest = JSON.stringify(imageRequest);

                fetch('/getImage/' + imageRequest)
                    .then(response => response.json())
                    .then(data => {
                        this.imageSrc = "data:image/png;base64," + data;
                        this.images.push(this.imageSrc);
                    })
                    .catch(err => console.log(err));
            },
            //Method to get all the images names  
            showImages() {
                this.images = [];
                fetch('/getImages')
                    .then(response => response.json())
                    .then(data => {
                        //Receving the names of the images from the Database 
                        for (imageData of data) {
                            //Filltering the images based on the requested town 
                            if (imageData.Image.imageName.split("_", 1)[0] === this.$root.town.id) {
                                //We can call the server to bring the data of the
                                //images of this specific town
                                this.getImage(imageData);
                            }
                        }
                    })
                    .catch(err => console.log(err));
            },

            //Method to stage the image file data for uploading 
            assignImage(event) {
                let files = event.target.files;
                if (!files.length)
                    return;
                this.createImage(files[0]);
                this.myImage = files[0];

            },

            //Method to assigning the value of the uploded file to avariable and
            //To be reviewed by the user 
            createImage(file) {
                let image = new Image();
                let reader = new FileReader();
                //After loading th image get the Src and assign it to the image valriable
                reader.onload = (event) => {
                    this.image = event.target.result;
                };

                reader.readAsDataURL(file);
            },
            //Method to remove the image from the preview mode
            removeImage(image) {
                this.image = '';
                this.myImage = '';
            },
            //This methjod is triggered after previwing th image
            onUpload() {
                // Assessing the image file and src
                if (this.myImage == '' || this.image == '') {
                    alert("Please enter a photo");
                    return;
                }
                let townName = this.$route.params.name;
                let userName = this.$root.user.username
                let type = "image";

                //Using the FormData object to store the file data into our request
                let formData = new FormData();
                
                //Calling the module 
                let image = new window.exports.Image(-1, townName, type, userName);
                let json = JSON.parse(image.toJSON());

                formData.append('file', this.myImage);

                //Appending image data object to the other useful data 
                formData.append('data', JSON.stringify(json));

                fetch('/addImage/' + townName, {
                    method: 'POST',
                    headers: new Headers({
                        'Accept': 'application/json, */*'
                    }),
                    body: formData
                })
                    .then(res => {
                        //Redisplay the data accordingly
                        this.showImages();
                        this.setUpEvents();
                        formData = '';
                        this.image = '';
                        this.myImage = '';
                        return res.json();
                    })
                    .catch(err => console.log("Error: " + err));
            }
        },

        updated() {
            this.setUpEvents();
        },

        mounted() {
            this.showImages();
        }

    };
})();