(function () {
    window.Components.Auth = {
        template: `<div>

    <div class="text-right">

        <div v-if="currentUser">
        
            Hello, <strong v-text="currentUser.username"></strong>!
            <button class="btn btn-link text-danger" @click="logoutUser">
                Logout
            </button>

        </div>

        <div v-if="!currentUser">

            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#login-modal">
                Login
            </button>

            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#register-modal">
                Register
            </button>

        </div>

    </div>

    <div class="modal fade" id="login-modal" tabindex="-1" role="dialog" aria-labelledby="login-modal-label"
         aria-hidden="true" ref="login-modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="login-modal-label">Login to your account</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input v-model="login.username" class="form-control" placeholder="Username"/>
                    <br/>

                    <input type="password" v-model="login.password" class="form-control" placeholder="Password"/>
                    <br/>

                    <div class="alert alert-danger" v-if="login.error.length > 0" v-text="login.error"></div>

                    <div v-if="isLoading">
                        <br/>
                        <i class="fa fa-spin fa-spinner fa-2x"></i>
                        <br/>
                    </div>

                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary btn-block" @click="processLogin" :disabled="isLoading">Login</button>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="register-modal" tabindex="-1" role="dialog" aria-labelledby="register-modal-label"
         aria-hidden="true" ref="register-modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="login-modal-label">Register an account</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <input v-model="register.username" class="form-control" placeholder="Username"/>
                    <br/>

                    <input type="password" v-model="register.password" class="form-control" placeholder="Password"/>
                    <br/>

                    <input type="password" v-model="register.password_confirm" class="form-control"
                           placeholder="Confirm Password"/>
                    <br/>

                    <div class="alert alert-danger" v-if="register.error.length > 0" v-text="register.error"></div>

                    <div v-if="isLoading">
                        <br/>
                        <i class="fa fa-spin fa-spinner fa-2x"></i>
                        <br/>
                    </div>

                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary btn-block" @click="processRegister" :disabled="isLoading">Register
                    </button>
                </div>
            </div>
        </div>
    </div>

</div>`,

        data() {
            return {
                login: {
                    username: '',
                    password: '',
                    error: '',
                    modalOn: false
                },
                register: {
                    username: '',
                    password: '',
                    password_confirm: '',
                    error: ''
                },
                currentUser: null,
                isLoading: false,
            };
        },

        methods: {
            processLogin() {
                this.isLoading = true;


                API.Auth.login(this.login.username, this.login.password).then(response => {
                    if (response.success) {
                        // Login successful
                        // Save current user
                        let user = (new window.exports.User()).fromJSON(response.user);
                        this.loginUser(user);

                        // Hide modal
                        jQuery(this.$refs['login-modal']).modal('hide');

                        // Reset error message
                        this.login.error = '';

                        // Reset the inputs
                        this.login.username = '';
                        this.login.password = '';
                    } else {
                        // Login unsuccessful
                        this.login.error = response.message;
                    }

                    this.isLoading = false;
                });
            },

            processRegister() {
                this.isLoading = true;

                API.Auth.register(this.register.username, this.register.password, this.register.password_confirm).then(response => {
                    if (response.success) {
                        // Register successful
                        // Save current user
                        let user = (new window.exports.User()).fromJSON(JSON.parse(response.user));
                        this.loginUser(user);

                        // Hide modal
                        jQuery(this.$refs['register-modal']).modal('hide');

                        // Reset error message
                        this.register.error = '';

                        // Reset the inputs
                        this.register.username = '';
                        this.register.password = '';
                        this.register.password_confirm = '';
                    } else {
                        // Register unsuccessful
                        this.register.error = response.message;
                    }

                    this.isLoading = false;
                });
            },

            openLoginModal() {
                jQuery(this.$refs['login-modal']).modal('show');
            },

            loginUser(user) {
                this.currentUser = user;
                HW.setAdditionalHeaders({
                    'Authorisation': user.token
                });
            },

            logoutUser() {
                this.currentUser = null;
                HW.setAdditionalHeaders({});
            }
        }

    };
})();