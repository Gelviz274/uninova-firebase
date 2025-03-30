import React from 'react';

export default function RecommendedUsers() {
  const recommendedUsers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      username: '@sarahj',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      id: '2',
      name: 'Michael Chen',
      username: '@mchen',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      username: '@ewilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    }
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-2">
      <h2 className="text-lg font-bold mb-4">Who to follow</h2>
      <div className="space-y-4">
        {recommendedUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-neutral-500">{user.username}</p>
              </div>
            </div>
            <button className="px-4 py-1 text-sm bg-brown-600 hover:bg-brown-700 text-white rounded-full transition-colors">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}