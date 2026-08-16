import { useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FiHeart } from 'react-icons/fi';
import { useNavigate, useNavigation } from 'react-router-dom';
import { Loading } from '../components';
import { useResetPasswordMutation } from '../features/api/authApi';
import './../css/PasswordReset.css';


const PasswordReset= () => {

const [error,setError]=useState<string>('')
  const navigation = useNavigation()
  const navigate = useNavigate()

  //translation hook
  const {t}=useTranslation();

  //reset hook
  const[resetPassword,{isLoading}] = useResetPasswordMutation()

  const handleFormSubmit = async (e:ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    const username = formValues.username as string
    const date_of_birth = formValues.dob as string
    const location = formValues.location as string
    const newPassword = formValues.newPassword as string
    const confirmNewPassword = formValues.confirmNewPassword as string

    
    const response = await resetPassword({username,date_of_birth,location,newPassword,confirmNewPassword}).unwrap()
  

      if(!response.data){
        setError(response.message)
       return 
      }
      navigate('/')

  };

  if(isLoading){
    return <Loading/>
  }

  return (
  <div className='password-reset-container'>
    
      <div className="reset-viewport-shell">
         <div className="reset-interactive-card">        
          <h1>{t('DiscoverFeed.brand_name')}</h1>
          <FiHeart  size={16} className="reset-brand-heart-ico"/>
        </div>

        <div className='title'>
          <h2>{t('Settings.Reset_password.title')}</h2>
        </div>
         {error && <p className='error_message'>{error}</p>}
           <form className='form-input' onSubmit={handleFormSubmit}>
                <div className='form-center'>
                   <div className="account-field-group">
                  <label>{t('Settings.Reset_password.fields.email_label')}</label>
                  <input type="email" name="username" placeholder="Email" />
                 
                </div>
                  <div className="account-field-group">
                  <label>{t('Settings.Reset_password.fields.date_of_birth_label')}</label>
                  <input type="date" name="dob" defaultValue={new Date().toISOString().split('T')[0]}/>
                </div>
                <div className="account-field-group">
                  <label>{t('Settings.Reset_password.fields.location')}</label>
                  <input type="text" name="location" placeholder={t('Settings.Reset_password.fields.location')} />
                </div>
                   <div className="account-field-group">
                  <label>{t('Settings.Reset_password.fields.new_password_label')}</label>
                  <input type="password" name="newPassword" placeholder={t('Settings.Reset_password.fields.password_placeholder')} />
                </div>
                  <div className="account-field-group">
                  <label>{t('Settings.Reset_password.fields.confirm_password_label')}</label>
                  <input type="password" name="confirmNewPassword" placeholder={t('Settings.Reset_password.fields.password_placeholder')}/>
                </div>
                </div>
                <div className="account-field-group">
                  <button type="submit" className="account-btn-inline-confirm" >
                    {navigation.state==='loading'?'loading':t('Settings.Reset_password.fields.btn')}
                  </button>
                </div>
               
            </form>        
      </div>
  </div>
  );
}
export default PasswordReset;
