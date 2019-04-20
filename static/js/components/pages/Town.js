(function() {
  window.Components.Pages.Town = {

    template: `<div>

    <div v-if="$root.town">

        <h1>{{ town.name }}</h1>

        <hr/>

        <div class="row">
            <div class="col-sm-3">

                <router-link :to="town.route('landing')">Overview</router-link>
                <hr/>
                <router-link :to="town.route('forum')">Forum</router-link>
                <hr/>
                <router-link :to="town.route('gallery')">Gallery</router-link>
                <hr/>
                <router-link :to="'/town/'+$route.params.name+'/news'">News</router-link>
                <hr/>
                <router-link :to="'/town/'+$route.params.name+'/transport'">Transport</router-link>
                <hr/>
                <router-link :to="'/town/'+$route.params.name+'/music'">Music</router-link>
                <hr/>

            </div>
            <div class="col-sm-9">
                <router-view v-if="town"></router-view>
            </div>
        </div>

    </div>

</div>

        `,

    data() {
      return {};
    },

    computed: {
      town() {
        return this.$root.town;
      }
    },

    methods: {},

    mounted() {
      console.log("Mounted Town component");
      // If current town is not defined, retrigger the select
      if (!this.town) {
        this.$root.townSwitcher().refetch();
      }
    }

  };
})();