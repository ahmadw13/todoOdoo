/** @odoo-module **/
import { Component, useState, useRef, onWillStart, xml, onMounted } from "@odoo/owl";
import { api } from "./api.js";

export class Settings extends Component {
    async initHttp() {
        try {
            const response = await api.fetchTodos();
            const data = await response.json();
            const validTodos = Array.isArray(data) ? data.filter(todo => todo && todo.title) : [];
            this.state.todos = validTodos;
        } catch (error) {
            console.error("Error initializing HTTP:", error);
            alert("Failed to load todos. Please try again.");
        } finally {
            this.state.isLoading = false;  
        }
      }
    

    setup() {
        this.state = useState({
            customCategories: [],
            selectedCategory: "All Categories",
            customCategoryInput: "",
            selectedCategoryForDeletion: "",
            todos: []
        });

        this.fileInputRef = useRef("fileInput");
        this.webSocket = useRef("webSocket");

        onMounted(() => {
            this.initHttp();
        });

        onWillStart(async () => {
            await this.loadCategoriesSettings();
        });
    }

    handleMainClick() {
        window.location.hash = '/main';
    }

    async loadCategoriesSettings() {
        try {
            const response = await api.fetchCategories();
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch custom categories");
            }
            const data = await response.json();
            this.state.customCategories = data;
        } catch (error) {
            alert(`Error loading categories: ${error.message}`);
        }
    }

    async handleBackup() {
        try {
            
            const todos = await this.initWebSocket();  
            const categoriesResponse = await api.fetchCategories(); 
    
            if (!categoriesResponse.ok) {
                const errorData = await categoriesResponse.json();
                throw new Error(errorData.message || "Failed to fetch categories");
            }
     
    
            const backupData = { todos, categories };  
    
            const blob = new Blob([JSON.stringify(backupData)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "backup.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            alert("Backup downloaded successfully!");
        } catch (error) {
            alert(`Error during backup: ${error.message}`);
        }
    }
    
    handleDeleteCategory = async () => {
        const categoryId = this.state.selectedCategoryForDeletion;
        if (!categoryId) {
            this.state.deletionWarning = true; 
            return;
        }
        this.state.deletionWarning = false;
        if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
            try {
                const response = await api.deleteCategory(categoryId);
                if (response.ok) {
                    alert("Category deleted successfully.");
                    await this.loadCategoriesSettings(); 
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Failed to delete category.");
                }
            } catch (error) {
                alert("Error deleting category: " + error.message);
            }
        }
    };
    handleSaveCategory(ev) {
        ev.preventDefault();
        localStorage.setItem("selectedCategory", this.state.selectedCategory);
        alert("Category saved successfully!");
    }

    async handleAddCustomCategory() {
        if (this.state.customCategoryInput.trim()) {
            try {
                const categoryToAdd = this.state.customCategoryInput;
                await this.saveCustomCategoryToDatabase(categoryToAdd);
                this.state.customCategoryInput = "";  
                await this.loadCategoriesSettings();
                alert(`Custom category "${categoryToAdd}" added!`); 
            } catch (error) {
                alert(`Error adding custom category: ${error.message}`);
            }
        } else {
            alert("Please enter a custom category.");
        }
    }
    

    handleRestore(ev) {
        const file = ev.target.files[0];
        if (!file) {
            alert("Please select a file to restore.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const backupData = JSON.parse(e.target.result);

                for (const todo of backupData.todos) {
                    await api.addTodo(todo);
                }

                for (const category of backupData.categories) {
                    await api.saveCategory(category.category_name);
                }

                alert("Data restored successfully!");
                 await this.loadCategoriesSettings();
            } catch (error) {
                alert(`Error restoring data: ${error.message}`);
            }
        };
        reader.readAsText(file);
    }

    async saveCustomCategoryToDatabase(category) {
        try {
            const response = await api.saveCategory(category);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save custom category");
            }
        } catch (error) {
            throw new Error(error.message || "Error saving custom category");
        }
    }

    async handleDeleteAllTodos() {
        if (confirm("Are you sure you want to delete all todos? This action cannot be undone.")) {
            try {
                const response = await api.deleteAllTodos();
                if (response.ok) {
                    alert("All todos deleted successfully.");
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Failed to delete todos.");
                }
            } catch (error) {
                alert("Error deleting all todos: " + error.message);
            }
        }
    }

    async handleDeleteAllCategories() {
        if (confirm("Are you sure you want to delete all custom categories? This action cannot be undone.")) {
            try {
                const response = await api.deleteAllCategories();
                if (response.ok) {
                    alert("All custom categories deleted successfully.");
                    await this.loadCategoriesSettings(); 
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Failed to delete custom categories.");
                }
            } catch (error) {
                alert("Error deleting custom categories: " + error.message);
            }
        }
    }

    static template = "todos.settings";
}
