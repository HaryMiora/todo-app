import api from './api';

export const getAllTodos = async () => {
  try {
    const response = await api.get('/todos');
    return response.data.todos;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
  }
};

export const getTodoById = async (id) => {
  try {
    const response = await api.get(`/todos/${id}`);
    return response.data.todo;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
  }
};

export const createTodo = async (todoData) => {
  try {
    const response = await api.post('/todos', todoData);
    return response.data.todo;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
  }
};

export const updateTodo = async (id, todoData) => {
  try {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data.todo;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
  }
};
