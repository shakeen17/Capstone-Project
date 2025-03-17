import './App.css';
import { BrowserRouter, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import UserProfile from './components/UserProfile/UserProfile';
import SignUp from './components/Signup/SignUp';
import { useContext } from 'react';

function App() {
  return (
    <div>
      <UserProvider>
        <BrowserRouter>
          <div>
            <Nav />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profiles" element={<UserProfile />} />
            </Routes>
          </div>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

const Nav = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout(); // Calls logout function from context
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/profiles">Profiles</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default App;
