import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Đảm bảo đường dẫn đúng với cấu trúc thư mục của bạn


interface User {
    id: string;
    email: string;
}

const SearchUser: React.FC<{ onSelect: (user: User) => void }> = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            if (query.trim() === '') {
                setResults([]);
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('id, email')
                .ilike('email', `%${query}%`)
                .limit(10);

            if (error) {
                console.error('Error fetching users:', error);
                setResults([]);
            } else {
                setResults(data || []);
            }
            setLoading(false);
        };

        const debounceFetch = setTimeout(fetchUsers, 300); // Debounce for 300ms
        return () => clearTimeout(debounceFetch);
    }, [query]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search by email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border p-2 w-full"
            />
            {loading && <p>Loading...</p>}
            <ul className="border mt-2">
                {results.map((user) => (
                    <li
                        key={user.id}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => onSelect(user)}
                    >
                        {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchUser;