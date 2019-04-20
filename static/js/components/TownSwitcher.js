(function () {
    window.Components.TownSwitcher = {

        template: `<div>

    <select class="form-control" @change="changeTown" v-model="id" ref="select">
        <option value="" selected>Select town</option>
        <option v-for="t in towns" :value="t.id" v-text="t.name"></option>
    </select>

</div>
`,

        data() {
            return {
                id: '',
                town: null,
                towns: []
            };
        },

        watch: {
            town() {
                Events.$emit('town-switched', this.town);
            }
        },

        methods: {
            changeTown(e) {
                let slug = e.target.value;
                if (slug.length > 0) {
                    router.push('/town/' + slug);
                    this.getTownData(slug);
                } else {
                    // No town selected, navigate to landing
                    this.town = null;
                    router.push('/');
                }
            },

            getTownData(id) {
                // Fetch town data
                API.Towns.getTownById(id).then((town) => {
                    this.town = town;
                });
            },

            refetch() {
                this.id = this.$route.params.name;
                this.getTownData(this.id);
            }
        },

        mounted() {
            // Fetch all the towns
            API.Towns.getAllTowns().then(towns => {
                this.towns = towns;
            });
        }

    };
})();
