import { useState, type ChangeEvent } from "react";
import { FaEye } from "react-icons/fa";
import { FiHeart, FiLock, FiMail } from "react-icons/fi";
import { RiEyeOffFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/api/authApi";
import { loginUser } from "../features/slice/userSlice";
import "./../css/LoginPage.css";

const  LoginPage =()=> {

      const [showText,setShowText] = useState<String>('password');
      const[error,setError]=useState<string>('')
      const[errorEmail,setErrorEmail]=useState<string>('')
      const[errorPassword,setErrorPassword]=useState<string>('')
        const[fetchError,setFetchError] = useState<string>('')
      const navigate = useNavigate();
      //http request
      const [login] = useLoginMutation()
    
      //userslice update
      const dispatch = useDispatch()
    
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
                navigate('/landing')
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
    <h2>{fetchError}</h2>
   </div>
  }
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <FiHeart size={16} className="heart"/>
          <h1>spotkac</h1>
        </div>

        <h2>Welcome back</h2>
        <p>Discover people through their experiences.</p>

        <form onSubmit={handleLoginRequest}>
          <div>
            <div className="input-group">
            <FiMail size={18} />
            <input
              type="email"
              placeholder="Email address" name="username"
            />
          </div>
           {
              errorEmail && <span className="error-text">{errorEmail}</span>
            }
          </div>

          <div>
              <div className="input-group">
            <FiLock size={18} />
            <input
           type={`${showText==='password'?'password':'text'}`}
              placeholder="Password" name="password"
            />
           <span onClick={()=>handleEyeClick('password')}  style={{display:showText==='text'?'flex':'none'}}><FaEye/></span>
            <span onClick={()=>handleEyeClick('text')} style={{display:showText==='password'?'flex':'none'}}><RiEyeOffFill/></span>
          </div>
            {
              errorPassword && <span className="error-text">{errorPassword}</span>
            }
          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Log In
          </button>
        </form>
      

        <div className="divider">
          <span>or</span>
        </div>
        <Link to={'/reset'} className="reset-password-link">Reset password</Link>
        <button className="social-btn" style={{display:'none'}}>
          Continue with Google
        </button>

        <button className="social-btn" style={{display:'none'}}>
          Continue with Apple
        </button>

        <div className="signup-link">
          Don't have an account?
          <a href="/register"> Sign up</a>
        </div>
      </div>
    </div></>
  );
}

export default LoginPage