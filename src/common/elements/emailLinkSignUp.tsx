import React, { useState } from 'react';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';

const EmailLinkSignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendLink = async () => {
    if (!email) return;

    const auth = getAuth(); // Initialize auth
    const actionCodeSettings = {
      url: 'https://www.example.com/finishSignUp',
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings); // Correct method
      window.localStorage.setItem('emailForSignIn', email); // Store email
      setMessage('Check your email for the sign-in link!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Email Link Sign-Up</h2>
      <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" />
      <button onClick={handleSendLink}>Send Sign-In Link</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailLinkSignUp;
