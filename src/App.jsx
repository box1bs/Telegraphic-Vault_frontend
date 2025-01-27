import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import BookmarksPage from './pages/BookmarksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import Spinner from './components/Spinner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="*" element={<LoadingFallback />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const LoadingFallback = () => (
    <div style={{padding: 20, textAlign: 'center'}}>
      <h2>Initializing application...</h2>
      <Spinner />
    </div>
);

export default App;