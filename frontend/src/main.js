import { createApp } from 'vue';
// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
// App and Router
import App from './App.vue';
import router from './router';

const vuetify = createVuetify({
  components,
  directives,
});

// Create the app instance
const app = createApp(App);

// Use both Vuetify and Vue Router
app.use(vuetify);
app.use(router);

// Mount the app
app.mount('#app');