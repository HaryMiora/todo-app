const pool = require('../config/db');

class Todo {
  static async findAllByUserId(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id, userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM todos WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(todoData) {
    try {
      const { user_id, title, description } = todoData;
      
      const [result] = await pool.query(
        'INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)',
        [user_id, title, description]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userId, todoData) {
    try {
      const { title, description, status } = todoData;
      
      const [result] = await pool.query(
        'UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
        [title, description, status, id, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM todos WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Todo;
