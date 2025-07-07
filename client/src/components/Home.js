import React from 'react';
import TodoList from './todos/TodoList';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Bienvenue sur votre Todo List, {user?.username} !</h1>
        <p>Gérez efficacement vos tâches quotidiennes</p>
      </div>
      <TodoList />
    </div>
  );
};

export default Home;
