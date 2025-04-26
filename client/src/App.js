import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchNotes();
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`/api/users/${selectedUser}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleInputChange = (e) => {
    setNewNote({
      ...newNote,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/users/${selectedUser}/notes`, newNote);
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`/api/users/${selectedUser}/notes/${noteId}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Notes App</h1>
        <div className="user-selector">
          <label htmlFor="user-select">Select User: </label>
          <select id="user-select" value={selectedUser} onChange={handleUserChange}>
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </select>
        </div>
      </header>

      <main>
        {selectedUser && (
          <div className="notes-container">
            <form onSubmit={handleSubmit} className="note-form">
              <input
                type="text"
                name="title"
                placeholder="Note title"
                value={newNote.title}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="content"
                placeholder="Note content"
                value={newNote.content}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Add Note</button>
            </form>

            <div className="notes-list">
              {notes.map(note => (
                <div key={note._id} className="note">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 