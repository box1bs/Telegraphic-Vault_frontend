import 'react';
import '../styles/Spinner.css';

// eslint-disable-next-line react/prop-types
const Spinner = ({ size = "40px" }) => (
    <div style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `3px solid rgba(255,255,255,.3)`,
        borderRadius: '50%',
        borderTopColor: '#fff',
        animation: 'spin 1s ease-in-out infinite'
    }} />
);

export default Spinner;