import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Here you would typically make an API call to your backend to handle the forgot password logic
        // For example:
        // const response = await fetch('/api/forgot-password', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ email }),
        // });
        // const data = await response.json();
        // setMessage(data.message);

        // For now, we'll just simulate a successful response
        setMessage('If an account with that email exists, you will receive a password reset link.');
    };

    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;