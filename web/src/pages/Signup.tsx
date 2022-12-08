// React modules
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// Components
import SignupForm from "../components/signup-form/SignupForm";

function Signup() {
  const [ cookies ] = useCookies();
  const nav = useNavigate();

  useEffect(()=>{
    if(cookies.csrftoken) {
      nav('/', {replace: true});
    }
  });

  return (
    <div className="center">
      <SignupForm />
    </div>
  );
}

export default Signup;