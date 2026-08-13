import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaEye } from "react-icons/fa";
import { FiHeart, FiLock, FiMail } from "react-icons/fi";
import { RiEyeOffFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLoginMutation } from "../features/api/authApi";
import { loginUser } from "../features/slice/userSlice";
import "./../css/LoginPage.css";

const  LoginPage =()=> {

      const [showText,setShowText] = useState<String>('password');
      const[errorEmail,setErrorEmail]=useState<string>('')
      const[errorPassword,setErrorPassword]=useState<string>('')
        const[fetchError,setFetchError] = useState<string>('')
      const navigate = useNavigate();
      //http request
      const [login] = useLoginMutation()
    
      //userslice update
      const dispatch = useDispatch()

      //translation hook
      const {t} = useTranslation()
    
      const handleEyeClick = (type:String)=>{

        
        if(type=='password'){
          setShowText(()=>'password')
          return
        }
        setShowText(()=>'text')
      }
    
      const handleLoginRequest=async (e:ChangeEvent<HTMLFormElement>)=>{
         e.preventDefault()
           
        
          const formData = new FormData(e.target);
          const formValues = Object.fromEntries(formData)


          
    
            const username = formValues.username as string
            const password = formValues.password as string

    
           try{
              const response = await login({username,password}).unwrap()
              
              if(response.httpStatus==='202 ACCEPTED'){
                dispatch(loginUser(response.data))
                navigate('/rules')
              }
              
   
              if(response.httpStatus==='401 UNAUTHORIZED'){
        
                if(response.message.toLowerCase().startsWith('username')){
                   setErrorEmail(()=>response.message)
                    setErrorPassword('')
                }else{
                   setErrorPassword(()=>response.message)
                    setErrorEmail('');
                }

              }
            
           }catch(error: any){
            
              // Handle Redux Network Level Errors (FETCH_ERROR)
                            if (error.status === 'FETCH_ERROR') {
                              setFetchError('Oops network down, please try again in few minutes.');
                                   setErrorPassword('')
                                  setErrorEmail('');
                              return;
                            }
            
           }    
      }
      
  return (
 <>
   {
    fetchError &&  <div className="error">
    <h2>{t(fetchError)}</h2>
   </div>
  }
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <FiHeart size={16} className="heart"/>
          <h1>{t('LoginPage.brand_name')}</h1>
        </div>

        <h2>{t('LoginPage.title')}</h2>
        <p>{t('LoginPage.subtitle')}</p>

        <form onSubmit={handleLoginRequest}>
          <div>
            <div className="input-group">
            <FiMail size={18} />
            <input
              type="email"
              placeholder={t('LoginPage.email.placeholder')}
              name="username"
            />
          </div>
           {
              errorEmail && <span className="error-text">{t('LoginPage.email.email_error')}</span>
            }
          </div>

          <div>
              <div className="input-group">
            <FiLock size={18} />
            <input
           type={`${showText==='password'?'password':'text'}`}
              placeholder={t('LoginPage.password.placeholder')} name="password"
            />
           <span onClick={()=>handleEyeClick('password')}  style={{display:showText==='text'?'flex':'none'}}><FaEye/></span>
            <span onClick={()=>handleEyeClick('text')} style={{display:showText==='password'?'flex':'none'}}><RiEyeOffFill/></span>
          </div>
            {
              errorPassword && <span className="error-text">{t('LoginPage.email.password_error')}</span>
            }
          </div>

          <button
            type="submit"
            className="login-btn"
          >
           {t('LoginPage.submit_btn')}
          </button>
        </form>
      

        <div className="divider">
          <span> {t('LoginPage.divider_text')}</span>
        </div>
        <Link to={'/reset'} className="reset-password-link">{t('LoginPage.forgot_password_link')}</Link>
        <button className="social-btn" style={{display:'none'}}>
          Continue with Google
        </button>

        <button className="social-btn" style={{display:'none'}}>
          Continue with Apple
        </button>

        <div className="signup-link">
        {t('LoginPage.signup_prompt.text')}
          <a href="/register"> {t('LoginPage.signup_prompt.link')}</a>
        </div>
      </div>
    </div>
    <LanguageSwitcher/>
    </>
  );
}

export default LoginPage