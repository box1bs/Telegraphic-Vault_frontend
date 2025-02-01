import { useEffect, useState } from 'react';
import { fetchNotes } from '../services/api';
import CreateDialog from "../components/CreateDialog";

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const loadData = async () => {
        const response = await fetchNotes();
        setNotes(response.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateSuccess = (newNote) => {
        setShowCreateDialog(false);
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setSelectedNote(newNote);
    };

    const renderDetailView = () => {
        if (!selectedNote) {
            return (
                <div style={sharedStyles.placeholderView}>
                    <div style={sharedStyles.placeholderContent}>
                        <div style={sharedStyles.placeholderEmoji}>♦</div>
                        <p>Select a note to view details</p>
                    </div>
                </div>
            );
        }

        return (
            <div style={sharedStyles.detailView}>
                <h1 style={sharedStyles.detailTitle}>{selectedNote.title}</h1>
                <div style={sharedStyles.detailMeta}>
                    <span>{new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{new Date(selectedNote.createdAt).toLocaleTimeString()}</span>
                </div>
                <div style={sharedStyles.detailContent}>{selectedNote.content}</div>
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                    <div style={sharedStyles.tagContainer}>
                        {selectedNote.tags.map((tag, index) => (
                            <span key={index} style={sharedStyles.tag}>
                {tag}
              </span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={sharedStyles.container}>
            <div style={sharedStyles.listPanel}>
                <div style={sharedStyles.header}>
                    <h1 style={sharedStyles.title}>Notes</h1>
                    <button
                        onClick={() => setShowCreateDialog(true)}
                        style={sharedStyles.createButton}
                    >
                        <span>♦</span>
                        <span>New Note</span>
                    </button>
                </div>
                <div style={sharedStyles.listContainer}>
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            style={{
                                ...sharedStyles.listItem,
                                ...(selectedNote?.id === note.id ? sharedStyles.listItemSelected : {}),
                                ':hover': sharedStyles.listItemHover,
                            }}
                            onClick={() => setSelectedNote(note)}
                        >
                            <h3 style={sharedStyles.itemTitle}>{note.title}</h3>
                            <p style={sharedStyles.itemPreview}>
                                {note.content.substring(0, 100)}...
                            </p>
                            <div style={sharedStyles.itemMeta}>
                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                {note.tags && (
                                    <span>{note.tags.length} tags</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={sharedStyles.detailPanel}>
                {renderDetailView()}
            </div>

            <CreateDialog
                isOpen={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default NotesPage;

const sharedStyles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100%',
        backgroundColor: '#1c1c1e',
        color: '#e4e4e7',
    },
    listPanel: {
        width: '33.333%',
        borderRight: '1px solid #3a3a3c',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        padding: '1rem',
        borderBottom: '1px solid #3a3a3c',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#e4e4e7',
    },
    createButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#444',
        color: '#e4e4e7',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
    },
    listContainer: {
        overflowY: 'auto',
        flex: 1,
    },
    listItem: {
        padding: '1rem',
        borderBottom: '1px solid #3a3a3c',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    listItemSelected: {
        backgroundColor: '#3a3a3c',
    },
    listItemHover: {
        backgroundColor: '#2c2c2e',
    },
    itemTitle: {
        fontWeight: '500',
        color: '#e4e4e7',
        marginBottom: '0.5rem',
    },
    itemPreview: {
        color: '#a1a1aa',
        fontSize: '0.875rem',
        marginBottom: '0.5rem',
    },
    itemMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#71717a',
        fontSize: '0.75rem',
    },
    detailPanel: {
        flex: 1,
        overflowY: 'auto',
    },
    detailView: {
        padding: '2rem',
    },
    detailTitle: {
        fontSize: '1.875rem',
        fontWeight: '700',
        color: '#e4e4e7',
        marginBottom: '1rem',
    },
    detailMeta: {
        display: 'flex',
        gap: '0.5rem',
        color: '#a1a1aa',
        fontSize: '0.875rem',
        marginBottom: '2rem',
    },
    detailContent: {
        color: '#e4e4e7',
        lineHeight: 1.6,
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginTop: '2rem',
    },
    tag: {
        backgroundColor: '#3a3a3c',
        color: '#e4e4e7',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.875rem',
    },
    placeholderView: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#71717a',
    },
    placeholderContent: {
        textAlign: 'center',
    },
    placeholderEmoji: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    url: {
        color: '#60a5fa',
        textDecoration: 'none',
        marginBottom: '1rem',
        display: 'block',
    },
};