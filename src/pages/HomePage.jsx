import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import CreateDialog from "../components/CreateDialog.jsx";

const Homepage = () => {
    const { user, logoutUser } = useAuth();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    const handleCreateSuccess = (type) => {
        setShowCreateDialog(false);
        navigate(type === 'note' ? '/notes' : '/bookmarks');
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Background cubes */}
            <div style={styles.background}>
                {Array.from({length: 16}).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.backgroundSquare,
                            width: `${Math.random() * 200 + 100}px`,
                            height: `${Math.random() * 200 + 100}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            backgroundImage: `url(/assets/image/${index}.png)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    ></div>
                ))}
            </div>

            {/* Main content */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <span style={styles.emoji}>♝</span>
                    <span style={styles.workspaceTitle}>Workspace</span>
                </div>
                <div style={styles.sidebarMenu}>
                    <Link to="/notes" style={styles.menuItem}>
                        <span style={styles.emoji}>♞</span>
                        <span>Notes</span>
                    </Link>
                    <Link to="/bookmarks" style={styles.menuItem}>
                        <span style={styles.emoji}>♜</span>
                        <span>Bookmarks</span>
                    </Link>
                </div>
                <div style={styles.sidebarFooter}>
                    {currentUser ? (
                        <div style={styles.userSection}>
                            <div style={styles.userInfo}>
                                <span style={styles.emoji}>👤</span>
                                <span style={styles.username}>{currentUser.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{...styles.menuItem, border: 'none', width: '100%'}}
                            >
                                <span style={styles.emoji}>⇥</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" style={styles.menuItem}>
                            <span style={styles.emoji}>⚇</span>
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>

            <div style={styles.main}>
                <div style={styles.searchBar}>
                    <div style={styles.searchInputContainer}>
                        <span style={styles.emoji}>☞</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            style={styles.searchInput}
                        />
                    </div>
                    <button onClick={() => setShowCreateDialog(true)} style={styles.createButton}>
                        <span style={styles.emoji}>𓀚</span>
                        <span>Create</span>
                    </button>
                </div>

                {/* Welcome message with username */}
                <div style={styles.hero}>
                    <h1 style={styles.heroTitle}>
                        {currentUser
                            ? `Welcome to Your Workspace, ${currentUser.username}!`
                            : 'Welcome to Your Digital Workspace'}
                    </h1>
                    <div style={styles.emoji}>
                        <CreateDialog
                            isOpen={showCreateDialog}
                            onClose={() => setShowCreateDialog(false)}
                            onSuccess={handleCreateSuccess}
                        />
                    </div>
                    <p style={styles.heroDescription}>
                        Organize your ideas, save important resources, and create notes all
                        in one place. Work smart, stay focused, and achieve more with a
                        powerful, streamlined experience.
                    </p>
                </div>
                <div style={styles.featuresGrid}>
                    <div style={styles.featureCard}>
                        <h2 style={styles.featureTitle}>♦ Smart Notes</h2>
                        <p style={styles.featureDescription}>
                        Create, organize, and share notes with an easy-to-use editor and
                            Markdown support. Use tags, nested pages, and built-in databases
                            to structure your information effectively.
                        </p>
                    </div>
                    <div style={styles.featureCard}>
                        <h2 style={styles.featureTitle}>♠ Smart Bookmarks</h2>
                        <p style={styles.featureDescription}>
                            Save and categorize important resources with automatic metadata
                            extraction. Add notes to bookmarks and organize them into
                            collections seamlessly.
                        </p>
                    </div>
                    <div style={styles.featureCard}>
                        <h2 style={styles.featureTitle}>♣ Team Collaboration</h2>
                        <p style={styles.featureDescription}>
                            Share notes and bookmark collections with your team or friends.
                            Customize access rights and track changes in real time.
                        </p>
                    </div>
                    <div style={styles.featureCard}>
                        <h2 style={styles.featureTitle}>♥ Powerful Integrations</h2>
                        <p style={styles.featureDescription}>
                            Connect your favorite tools and automate workflows. Import data
                            from other services and set up automatic updates effortlessly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    userSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        width: '100%',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        backgroundColor: '#3a3a3c',
        borderRadius: '0.5rem',
        marginBottom: '0.5rem',
        transition: 'background-color 0.2s',
    },
    username: {
        color: '#ffffff',
        fontWeight: '500',
        fontSize: '0.875rem',
        letterSpacing: '0.5px',
    },
    container: {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#1c1c1e",
        color: "#e4e4e7",
        position: "relative",
        overflow: "hidden",
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
    },
    backgroundSquare: {
        position: "absolute",
        backgroundColor: "",
        opacity: 0.1,
        borderRadius: "8px",
        filter: "blur(2px)",
        animation: "float 20s ease-in-out infinite",
    },
    sidebar: {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "260px",
        backgroundColor: "#2c2c2e",
        padding: "1rem",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
    },
    sidebarHeader: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "2rem",
    },
    workspaceTitle: {
        fontWeight: "600",
        color: "#e4e4e7",
    },
    sidebarMenu: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    menuItem: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem",
        borderRadius: "0.375rem",
        textDecoration: "none",
        color: "#e4e4e7",
        transition: "background-color 0.2s",
        cursor: "pointer",
        backgroundColor: "transparent",
        ":hover": {
            backgroundColor: "#3a3a3c",
        },
    },
    sidebarFooter: {
        marginTop: "auto",
    },
    emoji: {
        fontSize: "1.5rem",
    },
    main: {
        marginLeft: "260px",
        padding: "2rem",
        zIndex: 2,
        flex: 1,
    },
    searchBar: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "2rem",
    },
    searchInputContainer: {
        display: "flex",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#2c2c2e",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
    },
    searchInput: {
        border: "none",
        background: "transparent",
        width: "100%",
        marginLeft: "0.5rem",
        fontSize: "1rem",
        color: "#e4e4e7",
        outline: "none",
    },
    createButton: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "#444",
        color: "white",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
    },
    hero: {
        marginBottom: "3rem",
    },
    heroTitle: {
        fontSize: "2.5rem",
        fontWeight: "700",
        color: "#e4e4e7",
    },
    heroDescription: {
        fontSize: "1.25rem",
        color: "#a1a1aa",
    },
    featuresGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "2rem",
    },
    featureCard: {
        backgroundColor: "#2c2c2e",
        border: "1px solid #3a3a3c",
        borderRadius: "0.75rem",
        padding: "1.5rem",
    },
    featureTitle: {
        fontSize: "1.25rem",
        fontWeight: "600",
        color: "#e4e4e7",
    },
    featureDescription: {
        color: "#d1d1d6",
    },
};

export default Homepage;