// "use client";

// import { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://rcymjxtpdbbhdkppcakr.supabase.co'; // Thay bằng URL của bạn
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeW1qeHRwZGJiaGRrcHBjYWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTc5MjEsImV4cCI6MjA1OTEzMzkyMX0.aKlG0gau8DiDHaanV-_T5VITcnpFyOkmYN8J9pPp854'; // Thay bằng khóa của bạn
// const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'todo_app' } }); // Thêm schema option

// export default function Todos() {
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   const fetchTodos = async () => {
//     const { data, error } = await supabase.from('todos').select('*');

//     if (error) {
//       setError(error.message);
//     } else {
//       setTodos(data || []);
//     }
//   };

//   const addTodo = async () => {
//     if (!newTodo.trim()) return;

//     const { data, error } = await supabase.from('todos').insert([{ title: newTodo }]);

//     if (error) {
//       setError(error.message);
//     } else {
//       setTodos([...todos, data[0]]);
//       setNewTodo('');
//     }
//   };

//   const deleteTodo = async (id: number) => {
//     const { error } = await supabase.from('todos').delete().eq('id', id);

//     if (error) {
//       setError(error.message);
//     } else {
//       setTodos(todos.filter((todo) => todo.id !== id));
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Todos</h2>

//         <div className="flex space-x-2 mb-4">
//           <input
//             type="text"
//             placeholder="Thêm todo mới"
//             value={newTodo}
//             onChange={(e) => setNewTodo(e.target.value)}
//             className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={addTodo}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Thêm
//           </button>
//         </div>

//         {error && <p className="text-red-500 text-center mt-2">{error}</p>}

//         <ul>
//           {todos.map((todo) => (
//             <li key={todo.id} className="flex items-center justify-between p-3 border-b border-gray-200">
//               {todo.title}
//               <button
//                 onClick={() => deleteTodo(todo.id)}
//                 className="text-red-500 hover:text-red-700 focus:outline-none"
//               >
//                 Xóa
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }