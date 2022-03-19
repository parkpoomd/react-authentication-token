import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import useAxios from '../utils/useAxios';
import fetchInstance from '../utils/fetchInstance';

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const {authTokens, logout} = useContext(AuthContext);

  const api = useAxios();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    const {response, data} = await fetchInstance('/api/notes');
    // const response = await axiosInstance.get('/api/notes');
    // const response = await api.get('/api/notes');
    // if (response.status === 200) {
    //   setNotes(response.data);
    // }
    // const response = await fetch('http://localhost:4000/api/notes', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${authTokens.access}`,
    //   },
    // });
    // const data = await response.json();

    // if (response.status === 200) {
    //   setNotes(data);
    // } else if (response.statusText === 'Unauthorized') {
    //   logout();
    // }
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
