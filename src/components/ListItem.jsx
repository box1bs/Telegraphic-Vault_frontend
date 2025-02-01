import 'react';
import { format } from 'date-fns';

// eslint-disable-next-line react/prop-types
const ListItem = ({ item, isSelected, onClick, type }) => {
    return (
        <div
            onClick={() => onClick(item)}
            className={`
        p-4 border-b border-[#3a3a3c] cursor-pointer
        ${isSelected ? 'bg-[#3a3a3c]' : 'hover:bg-[#2c2c2e]'}
        transition-colors
      `}
        >
            <div className="flex items-start justify-between mb-2">
                {/* eslint-disable-next-line react/prop-types */}
                <h3 className="font-medium text-white truncate flex-1">{item.title}</h3>
                <span className="text-xl ml-2">
          {type === 'note' ? '♦' : '♠'}
        </span>
            </div>

            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                {/* eslint-disable-next-line react/prop-types */}
                {type === 'note' ? item.content : item.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
                {/* eslint-disable-next-line react/prop-types */}
                <span>{format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
                {/* eslint-disable-next-line react/prop-types */}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                        <span>•</span>
                        {/* eslint-disable-next-line react/prop-types */}
                        <span>{item.tags.length} tags</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListItem;