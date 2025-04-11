import React, { useState, useEffect } from 'react';
import { Input, List, Spin, Typography } from 'antd';
import { supabase } from '@/lib/supabaseClient';

const { Text } = Typography;

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

        const debounceFetch = setTimeout(fetchUsers, 300);
        return () => clearTimeout(debounceFetch);
    }, [query]);

    return (
        <div>
            <Input
                placeholder="Search by email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                allowClear
                size="large"
            />
            {loading ? (
                <div className="mt-4 flex justify-center">
                    <Spin tip="Loading..." />
                </div>
            ) : (
                <List
                    bordered
                    dataSource={results}
                    className="mt-4"
                    renderItem={(user) => (
                        <List.Item
                            onClick={() => onSelect(user)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Text>{user.email}</Text>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default SearchUser;
