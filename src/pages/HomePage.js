import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const {authTokens, logout} = useContext(AuthContext);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    const response = await fetch('http://localhost:4000/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authTokens.access}`,
      },
    });
    const data = await response.json();

    if (response.status === 200) {
      setNotes(data);
    } else if (response.statusText === 'Unauthorized') {
      logout();
    }
  };

  return (
    <div>
      <p>You are logged to the home page!</p>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
