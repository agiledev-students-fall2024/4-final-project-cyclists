import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Post from './Post';
import Profile from './Profile';
import EditProfile from './EditProfile'; 
import Map from './Map';
import SavedRoutes from './SavedRoutes';
import Login from './Login'; 
import Signup from './Signup'; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/map" element={<Map />} />
        <Route path="/saved-routes" element={<SavedRoutes />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
      </Routes>
    </Router>
  );
}

export default App;
