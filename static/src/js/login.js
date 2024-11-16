/** @odoo-module **/
import { Component, useState, onWillStart, onWillUnmount, xml } from "@odoo/owl";
import { api } from "./api.js";
export class Login extends Component {
    static template ="todos.login" ;
    setup() {
        this.state = useState({
            isRegistering: false
        });
    }

    async handleLoginSubmit(ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        const username = formData.get("username").trim();
        const password = formData.get("password").trim();
    
        try {
            const response = await api.login(username, password);
    
            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }
    
            const data = await response.json();
    
            if (response.status === 401) {
                throw new Error('Invalid username or password.');
            }
    
            if (data.error) {
                throw new Error(data.error);
            }
    
            window.location.hash = '/main';
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    }

    async handleRegisterSubmit(ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        const username = formData.get("username").trim();
        const password = formData.get("password").trim();
    
        try {
            const response = await api.register(username, password);
    
            if (!response.ok) {
                throw new Error('Registration failed. Please check your credentials.');
            }
    
            const data = await response.json();
    
            if (response.status === 409) {
                throw new Error('Username already exists. Please choose a different username.');
            }
    
            if (data.error) {
                throw new Error(data.error);
            }
    
            window.location.hash = '/main';
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message);
        }
    }

    toggleRegistering() {
        this.state.isRegistering = !this.state.isRegistering;
    }
}
