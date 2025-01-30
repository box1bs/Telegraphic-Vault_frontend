import { useState } from 'react';
import { X } from 'lucide-react';
import { apiClient } from "../services/api.js";
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
const CreateDialog = ({ isOpen, onClose, onSuccess }) => {
    const {isAuthenticated } = useAuth();
    const [contentType, setContentType] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState(null);

    const handleClose = () => {
        setContentType(null);
        setTitle('');
        setContent('');
        setUrl('');
        setTags('');
        setError(null);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setError('You must be logged in to create content');
            return;
        }

        try {
            const response = await apiClient.post(`/app/${contentType}s`, {
                title,
                [contentType === 'note' ? 'content' : 'url']: contentType === 'note' ? content : url,
                description: contentType === 'bookmark' ? content : undefined,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            });

            if (response.status === 201 || response.status === 200) {
                onSuccess(contentType);
                handleClose();
            }
        } catch (error) {
            console.error('Creation failed:', error);
            setError(error.message || 'Failed to create content');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#2c2c2e] rounded-xl w-full max-w-md overflow-hidden border border-[#3a3a3c]">
                {/* Header section */}
                <div className="border-b border-[#3a3a3c] p-4 relative">
                    <h2 className="text-xl font-semibold text-white text-center">
                        Create New {contentType ? contentType.charAt(0).toUpperCase() + contentType.slice(1) : 'Item'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-500 mx-4 mt-4 rounded">
                        {error}
                    </div>
                )}

                {/* Main content area */}
                <div className="p-6">
                    {!contentType ? (
                        <div className="space-y-4">
                            <p className="text-gray-400 text-center mb-6">Select the type of content you want to create</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setContentType('note')}
                                    className="flex flex-col items-center gap-3 p-6 rounded-lg bg-[#1c1c1e] border border-[#3a3a3c] hover:border-[#505050] transition-colors group"
                                >
                                    <span className="text-3xl group-hover:scale-110 transition-transform">♦</span>
                                    <span className="text-white font-medium">Note</span>
                                </button>
                                <button
                                    onClick={() => setContentType('bookmark')}
                                    className="flex flex-col items-center gap-3 p-6 rounded-lg bg-[#1c1c1e] border border-[#3a3a3c] hover:border-[#505050] transition-colors group"
                                >
                                    <span className="text-3xl group-hover:scale-110 transition-transform">♠</span>
                                    <span className="text-white font-medium">Bookmark</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#1c1c1e] border border-[#3a3a3c] rounded-lg p-2 text-white focus:border-[#505050] transition-colors"
                                    required
                                />
                            </div>

                            {contentType === 'bookmark' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        URL
                                    </label>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="w-full bg-[#1c1c1e] border border-[#3a3a3c] rounded-lg p-2 text-white focus:border-[#505050] transition-colors"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    {contentType === 'note' ? 'Content' : 'Description'}
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full bg-[#1c1c1e] border border-[#3a3a3c] rounded-lg p-2 text-white h-32 focus:border-[#505050] transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full bg-[#1c1c1e] border border-[#3a3a3c] rounded-lg p-2 text-white focus:border-[#505050] transition-colors"
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer section with actions */}
                <div className="border-t border-[#3a3a3c] p-4 bg-[#1c1c1e] flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg bg-[#2c2c2e] text-white hover:bg-[#3a3a3c] transition-colors"
                    >
                        Cancel
                    </button>
                    {contentType && (
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-lg bg-[#444] text-white hover:bg-[#505050] transition-colors"
                        >
                            Create
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateDialog;