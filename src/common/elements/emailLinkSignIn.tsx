import React, { useEffect, useState } from 'react';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

const EmailLinkSignIn: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const signInWithEmailLinkFn = async () => {
      const email = window.localStorage.getItem('emailForSignIn');
      const auth = getAuth(); // Initialize auth

      if (email && isSignInWithEmailLink(auth, window.location.href)) { // Correct method
        try {
          await signInWithEmailLink(auth, email, window.location.href); // Correct method
          window.localStorage.removeItem('emailForSignIn'); // Clean up email
          history.push('/dashboard'); // Redirect to dashboard after sign-in
        } catch (error: any) {
          setError(`Error: ${error.message}`);
        }
      } else {
        setError('Invalid or expired sign-in link');
      }

      setLoading(false);
    };

    signInWithEmailLinkFn();
  }, [history]);

  if (loading) return <p>Loading...</p>;

  return <div>{error ? <p>{error}</p> : <p>Successfully signed in!</p>}</div>;
};

export default EmailLinkSignIn;
