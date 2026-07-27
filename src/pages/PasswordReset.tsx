import { type ChangeEvent } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useNavigate, useNavigation } from 'react-router-dom';
import { Loading } from '../components';
import { useResetPasswordMutation } from '../features/api/authApi';
import './../css/PasswordReset.css';


const PasswordReset= () => {


  const navigation = useNavigation()
  const navigate = useNavigate()

  //reset hook
  const[resetPassword,{isLoading}] = useResetPasswordMutation()

  const handleFormSubmit = async (e:ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);
    console.log(formValues);
    const username = formValues.username as string
    const date_of_birth = formValues.dob as string
    const location = formValues.location as string
    const newPassword = formValues.newPassword as string
    const confirmNewPassword = formValues.confirmNewPassword as string

    
    const response = await resetPassword({username,date_of_birth,location,newPassword,confirmNewPassword})
    console.log(response);
    
      if(response.data){
        navigate('/')
      }
    
  };

  if(isLoading){
    return <Loading/>
  }

  return (
  <div className='password-reset-container'>
      <div className="reset-viewport-shell">
         <div className="reset-interactive-card">        
          <h1>spotkac</h1>
          <FiHeart  size={16} className="reset-brand-heart-ico"/>
        </div>

        <div className='title'>
          <h2>Reset Password</h2>
        </div>
           <form className='form-input' onSubmit={handleFormSubmit}>
                <div className='form-center'>
                   <div className="account-field-group">
                  <label>Email</label>
                  <input type="email" name="username" placeholder="Email" />
                </div>
                  <div className="account-field-group">
                  <label>Date of birth</label>
                  <input type="date" name="dob" placeholder="" />
                </div>
                <div className="account-field-group">
                  <label>Location</label>
                  <input type="text" name="location" placeholder="Location" />
                </div>
                   <div className="account-field-group">
                  <label>New Password</label>
                  <input type="password" name="newPassword" placeholder="Minimum 8 characters" />
                </div>
                  <div className="account-field-group">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmNewPassword" placeholder="Minimum 8 characters" />
                </div>
                </div>
                <div className="account-field-group">
                  <button type="submit" className="account-btn-inline-confirm" >
                    {navigation.state==='loading'?'loading':'Password Change'}
                  </button>
                </div>
               
            </form>        
      </div>
  </div>
  );
}
export default PasswordReset;
