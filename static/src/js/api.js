/** @odoo-module **/
const API_BASE_URL = 'http://localhost:3000';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();

        if (response.status === 404) {
            throw new Error('Resource not found.');
        }

        if (response.status === 500) {
            throw new Error('Internal server error. Please try again later.');
        }

        throw new Error(error.message || "Failed to fetch data.");
    }
    return response;
};

const handleAuthResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();

        if (response.status === 401) {
            throw new Error('Invalid username or password.');
        }

        if (response.status === 403) {
            throw new Error('You are not authorized to perform this action.');
        }

        throw new Error(error.message || "Authentication failed.");
    }
    return response;
};

export const api = {
    fetchUser: () =>
        fetch(`${API_BASE_URL}/auth/user`, {
            credentials: "include"
        }).then(handleResponse),

    deleteCategory: (categoryId) =>
        fetch(`${API_BASE_URL}/categories/custom-categories/${categoryId}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        }).then(handleResponse),

    fetchCategories: () =>
        fetch(`${API_BASE_URL}/categories/custom-categories`, {
            credentials: "include",
        }).then(handleResponse),

    fetchTodos: () =>
        fetch(`${API_BASE_URL}/todo`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        }).then(handleResponse),

    addTodo: (todoData) =>
        fetch(`${API_BASE_URL}/todo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(todoData),
        }).then(handleResponse),

    deleteAllTodos: () =>
        fetch(`${API_BASE_URL}/todo/all`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        }).then(handleResponse),

    saveCategory: (category) =>
        fetch(`${API_BASE_URL}/categories/custom-categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ category }),
        }).then(handleResponse),

    updateTodo: (todoId, todoData) =>
        fetch(`${API_BASE_URL}/todo/${todoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(todoData),
        }).then(handleResponse),

    deleteAllCategories: () =>
        fetch(`${API_BASE_URL}/categories/custom-categories`, {
            method: "DELETE",
            credentials: "include",
        }).then(handleResponse),

    deleteTodo: (todoId) =>
        fetch(`${API_BASE_URL}/todo/${todoId}`, {
            method: "DELETE",
            credentials: "include",
        }).then(handleResponse),

    logout: () =>
        fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        }).then(handleResponse),

    login: async (username, password) => {
        console.log("Login request started");
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });
        console.log("Login request completed");
        return handleAuthResponse(response);
    },

    register: async (username, password) => {
        console.log("Register request started");
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });
        console.log("Register request completed");
        return handleAuthResponse(response);
    }
};