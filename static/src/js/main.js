/** @odoo-module **/
import {
  Component,
  useState,
  onWillStart,
  onMounted,
} from "@odoo/owl";
import { api } from "./api.js";
export class MainPage extends Component {
  setup() {
    this.state = useState({
      displayUsername: "",
      todos: [],  
      isEditDialogOpen: false,
      currentTodo: null,
      showAddModal: false,
      categories: [],
      searchTerm: "",
      selectedCategory: "All Categories",
      isLoading: true,  
    });

    onWillStart(async () => {
      await this.fetchUsername();
      await this.loadCategories();
    });

    onMounted(async () => { 
      await this.initHttp(); 
      this.loadSavedCategory();
    });
}

async initHttp() {
  try {
      this.state.isLoading = true;  
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

  async fetchUsername() {
    try {
      const response = await api.fetchUser();
      if (response.ok) {
        const user = await response.json();
        this.state.displayUsername = `Welcome, ${user.username}`;
      } else {
        alert("Failed to fetch user details.");
      }
    } catch (error) {
      alert("Error fetching user details:", error);
    }
  }

  async loadCategories() {
    try {
      const response = await api.fetchCategories();
      const customCategories = await response.json();
      const defaultCategories = ["Work", "Personal", "Other"];
      this.state.categories = [
        ...customCategories.map((category) => category.category_name),
        ...defaultCategories,
      ];
    } catch (error) {
      alert("Error loading categories:", error);
    }
  }

  loadSavedCategory() {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
      this.state.selectedCategory = savedCategory;
    }
  }

  handleSettingsClick() {
    window.location.hash = "/settings";
  }

  async handleLogout() {
    try {
      const response = await api.logout();
      if (response.ok) {
        window.location.hash = "/";
      } else {
        alert("Failed to log out.");
      }
    } catch (error) {
      alert("Error during logout:", error);
    }
  }
  async handleToggleDone(todo) {
    const updatedTodo = {
      ...todo,
      done: !todo.done,
    };

    try {
      this.state.todos = this.state.todos.map((t) =>
        t.id === todo.id ? updatedTodo : t
      );

      const response = await api.updateTodo(todo.id, updatedTodo);
      if (!response.ok) {
        this.state.todos = this.state.todos.map((t) =>
          t.id === todo.id ? todo : t
        );
        throw new Error("Failed to update todo");
      }
      await api.fetchTodos();
    } catch (error) {
      console.error("Error updating todo status:", error);
      this.state.todos = this.state.todos.map((t) =>
        t.id === todo.id ? todo : t
      );
    }
  }

  handleAddTodo = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTodo = {
        title: formData.get('todoTitle'),
        description: formData.get('todoDescription'),
        date_time: formData.get('todoDateTime'),
        category: formData.get('todoCategory'),
    };

    try {
        const response = await api.addTodo(newTodo);
        
        if (response.ok) {
            const addedTodo = await response.json();

            this.state.todos.push(addedTodo);
            this.state.filteredTodos = [...this.state.todos];
            this.state.showAddModal = false; 
        } else {
            throw new Error("Failed to add todo");
        }
    } catch (error) {
        console.error("Error adding todo:", error);
        alert(error.message || "Error adding todo");
    }
};



  handleEditTodo(todo) {
    this.state.currentTodo = todo;
    this.state.isEditDialogOpen = true;
  }

  async handleDeleteTodo(todoId) {
    try {
      await api.deleteTodo(todoId);
      this.state.todos = this.state.todos.filter((todo) => todo.id !== todoId);
    } catch (error) {
      alert("Error deleting todo:", error);
    }
  }

  async handleSaveChanges(ev) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const updatedTodo = {
      ...this.state.currentTodo,
      title: formData.get("editTitle"),
      description: formData.get("editDescription"),
      date_time: formData.get("editDate"),
      category: formData.get("editCategory"),
    };

    try {
      const response = await api.updateTodo(
        this.state.currentTodo.id,
        updatedTodo
      );
      if (response.ok) {
        const updatedTodoData = await response.json();
        this.state.todos = this.state.todos.map((todo) =>
          todo.id === this.state.currentTodo.id ? updatedTodoData : todo
        );
        this.state.isEditDialogOpen = false;
        this.state.currentTodo = null;
        alert("Todo updated successfully");
      } else {
        throw new Error("Failed to update todo");
      }
    } catch (error) {
      alert(error.message || "Error updating todo");
    }
  }

  handleSearchInput(ev) {
    this.state.searchTerm = ev.target.value.toLowerCase();
  }

  get filteredTodos() {
    return this.state.todos.filter((todo) => {
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(this.state.searchTerm);
      const matchesCategory =
        this.state.selectedCategory === "All Categories" ||
        todo.category === this.state.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }
  static template = "todos.main";
}