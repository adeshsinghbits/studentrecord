import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../fireaseconfig/firebase'; // Make sure this is your Firebase configuration


const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Sign the user out when this component is mounted
    const logoutUser = async () => {
      try {
        await signOut(auth);
        navigate('/sign-in'); // Redirect the user to the sign-in page after logout
      } catch (error) {
        console.error('Error signing out:', error.message);
      }
    };

    logoutUser(); // Call the logout function
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
      <p>Please wait while we log you out.</p>
    </div>
  );
};

export default Logout;
