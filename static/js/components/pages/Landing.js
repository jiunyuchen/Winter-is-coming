(function () {
    window.Components.Pages.Landing = {

        template: `
        
        <div>
        
            <h1>Welcome</h1>
            <hr/>
            
            <p class="lead">Select your town to see the latest weather information, community forum, gallery and more!</p>
            
            <div class="row">
                <div class="col-sm-4" v-for="town in towns" :key="town.id">
                    <h3>
                        <router-link :to="'/town/' + town.id">{{ town.name }}</router-link>
                    </h3>
                    <hr/>
                </div>
            </div>
        
        </div>
        
        `,

        data() {
            return {
                towns: []
            };
        },

        methods: {},

        mounted() {
            API.Towns.getAllTowns().then(towns => {
                this.towns = towns;
            });
        }

    };
})();