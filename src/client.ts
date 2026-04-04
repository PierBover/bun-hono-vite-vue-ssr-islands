import {createSSRApp} from 'vue';
import Page from './Page.vue';

// use createSSRApp instead of createApp for hydration
const app = createSSRApp(Page);

app.mount('#vue');