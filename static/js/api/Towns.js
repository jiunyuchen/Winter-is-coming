(function () {

    let api = new HW('/api/towns');

    window.API.Towns = {

        getTownById(id) {

            // @todo
            return new Promise((resolve, reject) => {
                api.get(id).then(res => {
                    resolve(Models.Town.fromJSON(res));
                }).catch(err => reject(err));
            });

        },

        getAllTowns() {
            return new Promise((resolve, reject) => {
                api.get('').then(res => {
                    let towns = [];
                    for (let k in res) {
                        towns.push(Models.Town.fromJSON(res[k]));
                    }

                    resolve(towns);
                }).catch(err => reject(err));
            }).catch(err => reject(err));
        }


    };

})();