import 'react';
import { format } from 'date-fns';

const DetailView = ({ item, type }) => {
    item.updatedAt = undefined;
    item.createdAt = undefined;

    if (!item) {
        return (
            <div className="flex items-center justify-center h-full p-6">
                <div className="text-center bg-[#2c2c2e] p-8 rounded-xl shadow-lg w-full max-w-2xl">
                    <span className="text-5xl block mb-4 text-gray-400">
                        {type === 'note' ? '♦' : '♠'}
                    </span>
                    <p className="text-lg text-gray-400">Select a {type} to view details</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-full p-6">
            <div className="bg-[#2c2c2e] rounded-xl shadow-lg w-full max-w-2xl overflow-auto">
                <div className="p-6 flex flex-col min-h-[300px]">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white mb-2">{item.title}</h1>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <span>{format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
                            <span>•</span>
                            <span>{format(new Date(item.updatedAt), 'h:mm a')}</span>
                        </div>
                    </div>

                    {type === 'bookmark' && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-4 text-blue-400 hover:underline break-all"
                        >
                            {item.url}
                        </a>
                    )}

                    <div className="prose prose-invert max-w-none mb-6 flex-grow">
                        {type === 'note' ? item.content : item.description}
                    </div>

                    {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-[#3a3a3c]">
                            {item.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-[#3a3a3c] text-sm text-white"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailView;