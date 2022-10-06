//
// <div class='container'>
//   <form>
//     鲶鱼精 <input type='checkbox' name='鲶鱼精' id=''>
//   <button>保存</button>
//   </form>
//   </div>

import { createApp } from 'vue'; // Vue 3.x 引入 vue 的形式
import App from './app.vue'; // 引入 APP 页面组建

const app = createApp(App); // 通过 createApp 初始化 app
app.mount('#app'); // 将页面挂载到 root 节点




