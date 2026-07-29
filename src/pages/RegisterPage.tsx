import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState, type ChangeEvent } from "react";
import { FiCalendar, FiHeart, FiLock, FiMail, FiMapPin, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAddUserMutation } from "../features/api/authApi";
import type { TErrorResponse } from "../types/TErrorResponse";
import type { TvalidationErrors } from "../types/TValidationErrors";
import { isFetchBaseQueryError, POLISH_CITIES } from "../util/util";
import "./../css/RegisterPage.css";



const RegisterPage = ()=> {

  const[isTermsChecked,setIsTermsCheck]=useState<boolean>(false)

  const[message,setMessage] = useState<string>('')
  const[errorMessages,setErrorMessages] = useState<TvalidationErrors>()

      const [register]= useAddUserMutation()
        const navigate = useNavigate();


      
    
        const handleFormSubmit = async (e:ChangeEvent<HTMLFormElement>)=>{
            
                    e.preventDefault();                            
                    const formData = new FormData(e.target);
                     const formValues = Object.fromEntries(formData)
    
  
                  
                    try{
                        const firstName = formValues.firstName as string
                    const lastName = formValues.lastName as string
                    const gender= formValues.gender as string
                    const dob = new Date(formValues.dob as string)
                    const password = formValues.password as string
                    const location = formValues.location as string
                    const email = formValues.email as string
                
                        
                    
                    
                        if(isTermsChecked){
                           const response=await register({firstName,lastName,dob,email,password,gender,location,isTermsChecked})  
                      
                          // console.log(response);
                           if(response.error && isFetchBaseQueryError(response.error)){
                            const errorResponse = response.error  as FetchBaseQueryError;
                            const {error} = errorResponse.data as TErrorResponse
                           const data = error as TvalidationErrors
                      
                          
                           setErrorMessages(()=>data)
                            
                           }
                           
                              if(response.data){
                                navigate('/');
                              }
                        }else{
                          setMessage(()=>"Please accet terms and condition to proceed")
                        }
                  
        
                   
                    }   catch(error){
                                                    
                            
                    }
                   
                    
        
        }


    
  return (
    <div className="register-page">
   
      <div className="register-card">

        <div className="brand">
               <FiHeart size={16} className="heart"/>
          <h1>spotkac</h1>
        </div>

        <h2>Create Account</h2>
        <p>Find someone that matches your fever</p>

        <form onSubmit={handleFormSubmit}>
          <div className="row">
           <div>
             <div className="input-group">
              <FiUser size={18} />
              <input
                type="text" 
                placeholder="First Name" name="firstName"
              />
                         
            </div>
            {
              errorMessages?.firstName && <span>{errorMessages.firstName}</span>
            }
           </div>

            <div>
              <div className="input-group">
              <FiUser size={18} />
              <input
                type="text"
                placeholder="Last Name" name="lastName"
              />
            </div>
              {
              errorMessages?.lastName && <span>{errorMessages.lastName}</span>
            }
            </div>
          </div>

         <div>
           <div className="input-group">
            <FiCalendar size={18} />
            <input type="date" name="dob" defaultValue={new Date().getDate()}/>
          </div>
             {
              errorMessages?.dob && <span>{errorMessages.dob}</span>
            }
         </div>

         <div>
           <div className="input-group">
            <FiMail size={18} />
            <input
              type="email" required
              placeholder="Email Address" name="email"
            />
          </div>
            {
              errorMessages?.email && <span>{errorMessages.email}</span>
            }
         </div>

          <div className="row">
          <div>
              <div className="input-group">
            <FiUser size={18} />
            <select name="gender" required>
              <option disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          
          </div>
              {
              errorMessages?.gender && <span>{errorMessages.gender}</span>
            }
          </div>
 
          <div>
              <div className="input-group">
              <FiMapPin size={18} />
              <select
                id="city-select"
                name="location" required
              >
                <option disabled>-- Choose a city --</option>
                {POLISH_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
             {
              errorMessages?.location && <span>{errorMessages.location}</span>
            }
          </div>
       </div>

          <div>
            <div className="input-group">
            <FiLock size={18} />
            <input
              type="password" required
              placeholder="Password" name="password"
            />
          </div>
             {
              errorMessages?.password && <span>{errorMessages.password}</span>
            }
          </div>
          <div className="form-group terms-condition-group">
              <div className="checkbox-wrapper">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="agreeToTerms" 
                    required
                    checked={isTermsChecked}
                    onChange={()=>setIsTermsCheck(()=>!isTermsChecked)} 
                  />
                  <span className="checkbox-text">
                    I accept the <Link to="/terms" className="legal-link" target="_blank">Terms of Service</Link> and <Link to="/terms" className="legal-link" target="_blank">Privacy Policy</Link> of Spotkac.
                  </span>
                </label>
              </div>
            </div>
           {message && <span>{message}</span>}

          <button
            type="submit"
            className="register-btn"
          >
            Create Account
          </button>
        </form>

        <div className="login-link">
          Already have an account?
          <Link to={'/'}> Log In</Link>
        </div>

      </div>
    </div>

  );
}
export default RegisterPage