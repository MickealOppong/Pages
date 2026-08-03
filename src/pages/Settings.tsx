
import "./../css/Settings.css";



import { useState, type ChangeEvent } from 'react';
import { useTranslation } from "react-i18next";
import { FiBell, FiHelpCircle, FiLock, FiLogOut, FiMail, FiShield, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/api/authApi";
import { useChangePasswordMutation, useDeleteAccountMutation } from "../features/api/userApi";
import { useAppSelector } from "../store";


const Settings= () => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [hideMyAge, setHideMyAge] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();

  //navigate hoot
  const navigate = useNavigate()

  //translation hook
  const {t} = useTranslation()

 //change password hook
 const [chnageMyPassword,{isSuccess}] = useChangePasswordMutation()
 const [deleteAccount] = useDeleteAccountMutation()
 const [logout] = useLogoutMutation()

 //username
 const username = useAppSelector((state)=>state.userSlice.username);

  
  const handleFormSubmit =async (e:ChangeEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const formData =new FormData(e.target);
    const formValues = Object.fromEntries(formData);
    const currentPassword = formValues.currentPassword as string;
    const newPassword = formValues.newPassword as string;
    const confirmNewPassword = formValues.confirmNewPassword as string;
    
      const changePasswordDto={confirmNewPassword,currentPassword,newPassword}
      console.log(changePasswordDto);
      
    try {
          if(currentPassword && newPassword &&confirmNewPassword){

             const response = await chnageMyPassword(changePasswordDto)
             
                if(String(response.data?.httpStatus)==='200 OK'){
                  setMessage(()=>response.data?.message)
                }
          }else{
            setMessage(()=>'Error')
          }
    } catch (error) {
      
    }
    
  }


  const handleAccountDeletion=async()=>{
      try {
        const response = await deleteAccount()
        console.log(response);
        
          if(response.data){
          localStorage.clear()
          navigate("/")
          }        
      } catch (error) {
        
      }
  }

  //logout function
   //set and get current page from local storage
    localStorage.setItem('location',location.pathname);
   //const currentPage = localStorage.getItem('location');

   //refresh token for logout
 const refreshToken = localStorage.getItem('rtk') as string

 const handleUserLogout= async ()=> {
             
        try {
           const response= await logout(refreshToken)
           if(response.data){
            localStorage.removeItem('rtk')
            localStorage.removeItem('tk')
            navigate('/')
           }
           
        } catch (error) {
            
        }
    }

return (
  <section className="account-settings-page">
    <div className="dialog" style={{display:isSuccess?'flex':'none'}}>
      <span>{message}</span>
    </div>
    <div className="account-settings-center">
      
      {/* Component Title Header */}
      <div className="account-page-header">
        <h1>{t('Settings.title')}</h1>
      </div>

      <form className="account-settings-form-shell" onSubmit={handleFormSubmit}>
        
        {/* Section 1: Security & Credentials */}
        <div className="account-card-panel">
          <div className="account-section-header">
            <h2><FiShield />{t('Settings.header')}</h2>
          </div>
          
          <div className="account-credentials-stack">
            <div className="account-field-group">
              <label><FiMail />{t('Settings.fields.email_label')}</label>
              <input type="email" defaultValue={username} name="username" placeholder="yourname@example.com" disabled/>
            </div>

            {!isEditingPassword ? (
              <div className="account-field-group">
                <label><FiLock /> {t('Settings.fields.password_label')}</label>
                <div className="account-password-static-row">
                  <p>••••••••••••</p>
                  <button type="button" className="account-btn-inline" onClick={() => setIsEditingPassword(true)}>
                   {t('Settings.fields.change_password_label')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="account-field-group">
                  <label>{t('Settings.fields.current_password_label')}</label>
                  <input type="password" name="currentPassword" placeholder="Enter current password" />
                </div>
                <div className="account-field-group">
                  <label>{t('Settings.fields.new_password_label')}</label>
                  <input type="password" name="newPassword" placeholder="Minimum 8 characters" />
                </div>
                  <div className="account-field-group">
                  <label>{t('Settings.fields.confirm_password_label')}</label>
                  <input type="password" name="confirmNewPassword" placeholder="Minimum 8 characters" />
                </div>
                <div className="account-field-group">
                  <button type="button" className="account-btn-inline-cancel" onClick={() => setIsEditingPassword(false)}>
                   {t('Settings.fields.cancel_password_change_label')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Notification Center Toggle Elements */}
        <div className="account-card-panel" style={{display:'none'}}>
          <div className="account-section-header">
            <h2><FiBell /> Notifications</h2>
          </div>
          <div className="account-toggles-stack">
            
            <div className="account-switch-row">
              <div className="account-switch-text">
                <label>Email Alerts</label>
                <p className="account-sub-text-hint">Get updates on new matches and incoming likes</p>
              </div>
              <input 
                type="checkbox" 
                className="account-apple-switch" 
                checked={emailNotifications} name=""
                onChange={() => setEmailNotifications(!emailNotifications)} 
              />
            </div>

            <div className="account-switch-row">
              <div className="account-switch-text">
                <label>Push Notifications</label>
                <p className="account-sub-text-hint">Receive instant chat alerts in the browser</p>
              </div>
              <input 
                type="checkbox" 
                className="account-apple-switch" 
                checked={pushNotifications} 
                onChange={() => setPushNotifications(!pushNotifications)} 
              />
            </div>

          </div>
        </div>

        {/* Section 3: Privacy & Account Status Options */}
        <div className="account-card-panel" style={{display:'none'}}>
          <div className="account-section-header">
            <h2><FiShield /> About me</h2>
          </div>
          <div className="account-switch-row account-margin-top-sm">
            <div className="account-switch-text">
              <label>Public Profile</label>
              <p className="account-sub-text-hint">Hide my age</p>
            </div>
            <input 
              type="checkbox" 
              className="account-apple-switch" 
              checked={hideMyAge} name="hideMyAge"
              onChange={(e:ChangeEvent<HTMLInputElement>) => setHideMyAge(()=>e.target.checked)} 
            />
          </div>
        </div>

        {/* Section 4: Support & Help Desk Links */}
        <div className="account-card-panel">
          <div className="account-section-header">
            <h2><FiHelpCircle />{t('Settings.Support_&_Legal.title')}</h2>
          </div>
          <div className="account-support-links-grid">
            <Link to="/help" className="account-support-nav-link">{t('Settings.Support_&_Legal.help_center_link')}</Link>
            <Link to="/terms" className="account-support-nav-link">{t('Settings.Support_&_Legal.privacy_policy')}</Link>
            <Link to="/terms" className="account-support-nav-link">{t('Settings.Support_&_Legal.terms_of_service')}</Link>
          </div>
        </div>

        {/* Form Changes Submission Button */}
        <div className="account-form-actions-bar">
          <button type="submit" className="account-submit-update-btn">
           {t('Settings.Support_&_Legal.btn')}
          </button>
        </div>

        {/* Destructive Zone Component Wrapper */}
        <div className="account-danger-zone-wrapper">
          <div className="account-danger-zone-header">
            <h3>{t('Settings.Danger_zone.title')}</h3>
            <p>{t('Settings.Danger_zone.text')}</p>
          </div>
          <button type="button" className="account-delete-profile-btn" onClick={()=>handleAccountDeletion()}>
            <FiTrash2 /> {t('Settings.Danger_zone.btn')}
          </button>
        </div>

      </form>
      <button className="logout-btn" onClick={handleUserLogout}>
              <FiLogOut size={20} />
              <span>{t('Menu.Log_out')}</span>
            </button>
    </div>

  </section>
);

};

export default Settings;
