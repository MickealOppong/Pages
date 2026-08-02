import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiHeart, FiLock, FiMail, FiMapPin, FiUser } from "react-icons/fi";
import { IoMaleFemaleOutline } from "react-icons/io5";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { Loading } from "../components";
import { useAddUserMutation } from "../features/api/authApi";
import type { TErrorResponse } from "../types/TErrorResponse";
import type { TvalidationErrors } from "../types/TValidationErrors";
import { POLISH_CITIES } from "../util/util";
import "./../css/RegisterPage.css";



const RegisterPage = ()=> {

  const[isTermsChecked,setIsTermsCheck]=useState<boolean>(false)
  const[message,setMessage] = useState<string>('')
  const[errorMessages,setErrorMessages] = useState<TvalidationErrors>()
  const[error,setError] = useState<string>('')
  const[fetchError,setFetchError] = useState<string>('')

      const [register]= useAddUserMutation()
        const navigate = useNavigate();
        const navigation = useNavigation()

  //translation hook
  const {t} = useTranslation();
      
    
        const handleFormSubmit = async (e:ChangeEvent<HTMLFormElement>)=>{
            
                    e.preventDefault();                            
                    const formData = new FormData(e.target);
                     const formValues = Object.fromEntries(formData)
    
  
                  
      
                        const firstName = formValues.firstName as string
                    const lastName = formValues.lastName as string
                    const gender= formValues.gender as string
                    const dob = new Date(formValues.dob as string)
                    const password = formValues.password as string
                    const location = formValues.location as string
                    const email = formValues.email as string
                
                        
                    if (isTermsChecked) {
                          try {
                            // 1. .unwrap() forces RTK-Query to throw an error if the HTTP status is not 2xx
                              await register({
                              firstName, lastName, dob, email, password, gender, location, isTermsChecked
                            }).unwrap();

                            // 2. SUCCESS FLOW: Since we unwrapped, we know the backend returned a 2xx success code
                            //console.log('Registration Successful:', payload);
                            
                            // Clear old errors on successful registration
                            setError('');

                            
                            // Redirect the user right away
                            navigate('/');

                          } catch (error: any) {
                            // 3. ERROR FLOW: This catches all 4xx, 5xx, and network ERR_CONNECTION_REFUSED errors
                           // console.error('Registration Failed:', error);

                            // Handle Redux Network Level Errors (FETCH_ERROR)
                            if (error.status === 'FETCH_ERROR') {
                              setFetchError('Oops network down, please try again in few minutes.');
                              return;
                            }

                             // Handle Server Errors (401, 500, etc.)
                            if ( error.status === 500 || error.status === 401) {
                              const errorResponse = error.data as { error: string; status: number; message: string };
                              setFetchError(errorResponse.error);
                            }

                            // Handle Server Validation & Response Errors (401, 409, 500, etc.)
                            if (error.status === 409) {
                              const errorResponse = error.data as { error: string; status: number; message: string };
                              setError(errorResponse.error);
                            }

                            // Handle Client-Side Field Validation Errors (403 Forbidden)
                            if (error.status === 403) {
                                // const errorResponse = error  as FetchBaseQueryError;
                                 const errorData= error as {status:number,data:TErrorResponse}
                                   const errors = errorData.data.error as TvalidationErrors                              
                                  setErrorMessages(()=>errors);
                            }
                                            }
                  } else {
                    setMessage("Please accept terms and condition to proceed");
                       }
              }

if(navigation.state==='loading'){
  return <Loading/>
}

    
  return (
   <>
  {
    fetchError &&  <div className="error">
    <h2>{fetchError}</h2>
   </div>
  }
    <div className="register-page">
   
      <div className="register-card">

        <div className="brand">
               <FiHeart size={16} className="heart"/>
          <h1>{t('RegisterPage.brand_name')}</h1>
        </div>

        <h2>{t('RegisterPage.title')}</h2>
        <p>{t('RegisterPage.subtitle')}</p>
    
        <form onSubmit={handleFormSubmit}>
          <div className="row">
           <div>
             <div className="input-group">
              <FiUser size={18} />
              <input
                type="text" 
                placeholder={t('RegisterPage.fields.firstName.placeholder')} name="firstName"
              />
                         
            </div>
            {
              errorMessages?.firstName && <span>{t('RegisterPage.fields.firstName.firstname_error')}</span>
            }
           </div>

            <div>
              <div className="input-group">
              <FiUser size={18} />
              <input
                type="text"
                placeholder={t('RegisterPage.fields.lastName.placeholder')} name="lastName"
              />
            </div>
              {
              errorMessages?.lastName && <span>{t('RegisterPage.fields.lastName.lastname_error')}</span>
            }
            </div>
          </div>

         <div>
           <div className="input-group">
            <FiCalendar size={18} />
            <input type="date" name="dob" defaultValue={new Date().toISOString().split('T')[0]}/>
          </div>
             {
              errorMessages?.dob && <span>{t('RegisterPage.fields.dob_error')}</span>
            }
         </div>

         <div>
           <div className="input-group">
            <FiMail size={18} />
            <input
              type="email" required
              placeholder={t('RegisterPage.fields.email.placeholder')} name="email"
            />
          </div>
            {
              errorMessages?.email  && <span>{t('RegisterPage.fields.email.email_error')}</span>
     
            }
              {
             error  && <span>{t('RegisterPage.fields.email.error')}</span>
     
            }
         </div>

          <div className="row">
          <div>
              <div className="input-group">
            <IoMaleFemaleOutline  size={18} />
            <select name="gender" required>
              <option disabled value={'Select Gender'}>
                Select Gender
              </option>
              <option value="Male">{t('Options.Gender.MALE')}</option>
              <option value="Female">{t('Options.Gender.FEMALE')}</option>
              <option value="Non-binary">{t('Options.Gender.NON_BINARY')}</option>
            </select>
          
          </div>
              {
              errorMessages?.gender && <span>{t('RegisterPage.fields.gender_error')}</span>
            }
          </div>
 
          <div>
              <div className="input-group">
              <FiMapPin size={18} />
              <select
                id="city-select"
                name="location" required
              >
                <option disabled value={'Choose a city'}>-- Choose a city --</option>
                {POLISH_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
             {
              errorMessages?.location && <span>{t('RegisterPage.fields.location_error')}</span>
            }
          </div>
       </div>

          <div>
            <div className="input-group">
            <FiLock size={18} />
            <input
              type="password" required
              placeholder={t('RegisterPage.fields.password.placeholder')} name="password"
            />
          </div>
             {
              errorMessages?.password && <span>{t('RegisterPage.fields.password.password_error')}</span>
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
                    onChange={()=>setIsTermsCheck(!isTermsChecked)} 
                  />
                  <span className="checkbox-text">
                   {t('RegisterPage.fields.terms_and_privacy.link')}{" "}<Link to="/terms" className="legal-link" target="_blank">{t('RegisterPage.fields.terms_and_privacy.terms')}{" "}</Link> {t('RegisterPage.fields.terms_and_privacy.and')}{" "}<Link to="/terms" className="legal-link" target="_blank">{t('RegisterPage.fields.terms_and_privacy.privacy_policy')}{" "}</Link>{t('RegisterPage.fields.terms_and_privacy.brand_name')}
                  </span>
                </label>
              </div>
            </div>
           {message && <span>{message}</span>}

          <button
            type="submit"
            className="register-btn"
          >
           {t('RegisterPage.fields.submit_btn')}
          </button>
        </form>

        <div className="login-link">
     {t('RegisterPage.fields.login_prompt.text')}
          <Link to={'/'}> {t('RegisterPage.fields.login_prompt.link')}</Link>
        </div>

      </div>
    </div>
   </>

  );
}
export default RegisterPage