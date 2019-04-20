(function () {

    window.Components.Pages.TownForum = {
        template: `<div>
    <h3>Message Board</h3>

    <hr/>

    <div v-for="post in allPosts.allposts" v-if="post.town == $root.town.id">
        <div class="card">
            <div class="card-body">

                <button @click="deletePost(post.id)" class="btn btn-sm btn-danger float-right ml-2" title="Delete post"
                        v-if="userCanDelete(post)">
                    <i class="fa fa-times"></i>
                </button>
                <span class="float-right text-muted">{{ post.date }} by <strong v-text="post.username"></strong></span>
                <h5 class="card-title">{{ post.title }}</h5>
                <hr/>
                <p class="card-text">{{ post.desc }}</p>
            </div>
        </div>
        <br/>
    </div>

    <br/><br/>

    <h4>Leave a comment</h4>
    <hr/>

    <div v-if="$root.user">

        <div class="form-group">
            <input v-model="postTitleText" class="form-control" type="text" name="postTitle" size="35" required
                   placeholder="Title">
        </div>

        <div class="form-group">
            <textarea v-model="postBodyText" class="form-control" type="text" name="postBody" rows="5" required
                      placeholder="Your comment"></textarea>
        </div>

        <br/>
        <p class="text-danger" v-if="postError" v-text="postError"></p>

        <button value="Save" @click="addPost" class="btn btn-success btn-lg">Post</button>

    </div>
    <div v-else>
        Please <a @click="$root.auth().openLoginModal()">log in</a> to leave a comment
    </div>

    <hr/>
</div>
        `,

        data() {
            return {
                postTitleText: "",
                postBodyText: "",
                postError: null,
                allPosts: ""
            };
        },

        methods: {
            
            // Method to refresh after addin a post
            refreshList() {
                this.showPosts();
            },

            // Method to call the posts from the server and then update allposts array value
            showPosts() {
                fetch('/getPosts')
                    .then(response => response.json())
                    .then(dat => {
                        this.allPosts = dat;
                    })
                    .catch(err => console.log(err));
            },
            // Method to add Post
            addPost() {

                //Getting th values of th post
                let townName = this.$root.town.id;
                let type = "post";
                let title = this.postTitleText.trim();
                let desc = this.postBodyText.trim();
                //Making sure the fields are not empty
                if (title.length === 0) {
                    this.postError = 'Please enter a title';
                } else if (desc.length === 0) {
                    this.postError = 'Please enter your comment';
                } else {
                    this.postError = null;
                }

                if (this.postError === null) {
                    let post = new window.exports.Post(-1, title, desc, townName, type);

                    API.Forum.addPost(post).then(() => {
                        // Refresh the messages
                        this.refreshList();

                        // Reset the inputs
                        this.postTitleText = '';
                        this.postBodyText = '';
                    }).catch(err => {
                        this.postError = err;
                    });
                }
            },
            //Method to delete a certain post
            deletePost(id) {
                API.Forum.deletePost(id).then(res => this.refreshList()).catch(err => console.log(err));
            },
            //Making sure the user quilified to delete the post
            userCanDelete(post) {
                if (this.$root.user && post.username === this.$root.user.username) {
                    return true;
                } else {
                    return false;
                }
            }

        },

        mounted() {
            this.refreshList();
        }
    };
})();
