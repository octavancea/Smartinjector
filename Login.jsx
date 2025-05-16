import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const success = onLogin(username, password);
    if (!success) {
      setError("Credențiale incorecte. Vă rugăm să încercați din nou.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Autentificare</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">Utilizator:</label>
          <input 
            type="text"
            className="border border-gray-300 rounded w-full px-2 py-1 mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
          <label className="block mb-2 text-sm font-medium">Parolă:</label>
          <input 
            type="password"
            className="border border-gray-300 rounded w-full px-2 py-1 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
