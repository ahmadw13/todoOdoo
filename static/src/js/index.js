/** @odoo-module **/
import { mount } from "@odoo/owl";
import { Root } from "./root.js";  
import { Login } from "./login.js";
import { MainPage } from "./main.js";
import { Settings } from "./settings.js";
import { templates } from "@web/core/assets";
import { makeEnv, startServices } from "@web/env";

const routes = [
    { path: '/login', component: Login },
    { path: '/main', component: MainPage },
    { path: '/settings', component: Settings },
    { path: '/', component: Login } 
];
console.log("runninng index.js");
owl.whenReady(() => {
    
    const env = makeEnv();
    console.log(env);
    console.log("runninng index.js");
    startServices(env).then(() => {
        mount(Root, document.body, {
            env,
            templates,
            props: { routes },
            dev: true,
        });
    });
});
