(function () {

    let api = new HW('/api/auth');

    window.API.Auth = {
        login(username, password) {
            return api.post('login', {username, password});
        },

        register(username, password, password_confirm) {
            return api.post('register', {username, password, password_confirm});
        }
    };

})();