import { useEffect, useState } from 'react';
import { fetchBookmarks } from '../services/api';
import CreateDialog from "../components/CreateDialog.jsx";

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [, setShouldRefresh] = useState(false);
  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    setShouldRefresh(true);
  };

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchBookmarks();
      setBookmarks(response.data);
    };
    loadData();
  }, []);

  return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Bookmarks</h1>
          <button
              onClick={() => setShowCreateDialog(true)}
              style={styles.createButton}
          >
            <span style={styles.buttonEmoji}>♠</span>
            <span>New Bookmark</span>
          </button>
        </div>

        <CreateDialog
            isOpen={showCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onSuccess={handleCreateSuccess}
        />

        <div style={styles.grid}>
          {bookmarks.map((bookmark) => (
              <div key={bookmark.id} style={styles.card}>
                <h2 style={styles.cardTitle}>{bookmark.title}</h2>
                <p style={styles.cardContent}>{bookmark.description}</p>
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                >
                  {bookmark.url}
                </a>
                <div style={styles.tagContainer}>
                  {bookmark.tags.map((tag, index) => (
                      <span key={index} style={styles.tag}>
                  {tag}
                </span>
                  ))}
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#1c1c1e',
    minHeight: '100vh',
    color: '#e4e4e7',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#444',
    color: '#e4e4e7',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  buttonEmoji: {
    fontSize: '1.25rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#2c2c2e',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid #3a3a3c',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
  },
  cardContent: {
    color: '#a1a1aa',
    marginBottom: '0.75rem',
  },
  link: {
    color: '#e4e4e7',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '1rem',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    backgroundColor: '#3a3a3c',
    color: '#e4e4e7',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
  },
};

export default BookmarksPage;