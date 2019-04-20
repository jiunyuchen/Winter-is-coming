// Use components
Vue.component('town-switcher', Components.TownSwitcher);
Vue.component('auth', Components.Auth);

// Define the routes
const routes = [{
    path: '/',
    component: Components.Pages.Landing
  },
  {
    path: '/town/:name',
    component: Components.Pages.Town,
    children: [{
        path: '',
        component: Components.Pages.TownLanding
      },
      {
        path: 'forum',
        component: Components.Pages.TownForum
      },
      {
        path: 'gallery',
        component: Components.Pages.TownGallery
      },
      {
        path: 'news',
        component: Components.Pages.TownNews
      },
      {
        path: 'transport',
        component: Components.Pages.TownTransport
      },
      {
        path: 'music',
        component: Components.Pages.TownMusic
      }
    ]
  },
];

// Create the router
const router = new VueRouter({
  routes // short for `routes: routes`
});

// Create the event bus
const Events = new Vue();

// Crate the app instance
const app = new Vue({
  router,

  methods: {
    townSwitcher() {
      return this.$refs['townSwitcher'];
    },

    auth() {
      return this.$refs['auth'];
    }
  },

  computed: {
    town() {
      return this.townSwitcher().town;
    },
    user() {
      return this.auth().currentUser;
    }
  }
}).$mount('#app');