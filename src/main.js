import Vue from 'vue';
import App from './App.vue';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import Mermaid from 'mermaid';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

Vue.use(codemirror);

Vue.config.productionTip = false;
Vue.use(mavonEditor);
Vue.use(Mermaid);
Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')