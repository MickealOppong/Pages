import { useState, type ChangeEvent } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiChevronDown,
  FiHeart,
  FiLock,
  FiMail,
  FiUser
} from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";
import "./../css/Register.css";

import { useTranslation } from "react-i18next";
import { PiGenderIntersex } from "react-icons/pi";
import LocationSelector from "../components/LocationSelector";
import { useAddUserMutation } from "../features/api/authApi";
import { useLocationSelector } from "../hooks/useLocationSelector";
import type { TErrorResponse } from "../types/TErrorResponse";
import type { TvalidationErrors } from "../types/TValidationErrors";

const Register = () => {
  const [register] = useAddUserMutation();
  const navigate = useNavigate();

  //translation hook
  const { t } = useTranslation();

  //specific error messages
  const [emailError, setEmailError] = useState<string>("");
  const [emailExistError, setEmailExistError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [dobError, setDobError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");
  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);

// 1. Initialize the custom location hook inside the parent file
  const locationSelectorProps = useLocationSelector();


  const handleFirstNameInputFocus =()=>{
         setFirstNameError('')

  }

    const handleLastNameInputFocus =()=>{

         setLastNameError('')

  }

     const handleDateOfBirthInputFocus =()=>{

         setDobError('')
  }


     const handleEmailInputFocus =()=>{
       setEmailError('')
       setEmailExistError('')
  }


       const handlePasswordInputFocus =()=>{
       setPasswordError('')
  }

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    const firstName = formValues.firstName as string;
    const lastName = formValues.lastName as string;
    const gender = formValues.gender as string;
    const dob = new Date(formValues.dob as string);
    const password = formValues.password as string;
    const latitude =parseFloat( formValues.lat as string) ||locationSelectorProps.getFallbackData().lat;
    const longitude = parseFloat(formValues.lon as string) ||locationSelectorProps.getFallbackData().lon;
    const countryCode = formValues.countryCode as string|| locationSelectorProps.getFallbackData().countryCode;
    const email = formValues.email as string;

    //from useLocationSelector hook
    const city = locationSelectorProps.location.trim().split(",")[0]||locationSelectorProps.getFallbackData().city;
    const country = locationSelectorProps.location.split(",")[1]||locationSelectorProps.getFallbackData().country;

   

    if (isTermsChecked) {
      try {
        // 1. .unwrap() forces RTK-Query to throw an error if the HTTP status is not 2xx
        
        await register({
          firstName,
          lastName,
          dob,
          email,
          password,
          gender,
          city,
          countryCode,
          latitude,
          longitude,
          country,
          isTermsChecked,
        }).unwrap();
        

        // 2. SUCCESS FLOW: Since we unwrapped, we know the backend returned a 2xx success code
        //console.log('Registration Successful:', payload);



        // Redirect the user right away
       navigate("/");
      } catch (error: any) {

        const {status} = error as {status:number|string,message:string}

          
        // Handle Redux Network Level Errors (FETCH_ERROR)
        if (status === "FETCH_ERROR") {
          setFetchError("NETWORK_ERROR");
          return;
        }

        if (status === 500 || status === 401) {

          
          const errorResponse = error.data as {
            error: string;
            status: number;
            message: string;
          };
          
          setFetchError(errorResponse.error);
          
        }

       
        if (status === 409) {
          const errorResponse = error.data as {
            error: string;
            status: number;
            message: string;
          };

          setEmailExistError(() => errorResponse.error);
        }

        
        // Handle Client-Side Field Validation Errors (403 Forbidden)
        if (status === 403) {
          // const errorResponse = error  as FetchBaseQueryError;
          const errorData = error as { status: number; data: TErrorResponse };
          const errors = errorData.data.error as TvalidationErrors;
         const {firstName,lastName,password,dob,email} = errors;
         setEmailError(()=>email)
         setPasswordError(()=>password)
         setFirstNameError(()=>firstName)
         setLastNameError(()=>lastName)
         setDobError(()=>dob)         
          
        }
      }
    } else {
      setMessage("Please accept terms and condition to proceed");
    }
  };

  /*
    {error && (
                <span className="error">
                  {t("RegisterPage.fields.email.email_taken")}
                </span>
              )}
  */

  return (
    <>
 {fetchError && (
  <div className="fetch_error">
    {/* Optional: Add a clean react warning icon directly into the template wrapper if wanted */}
    <h2>{t(`DiscoverFeed.NETWORK_ERROR`)}</h2>
  </div>
)}

      <div className="register-page">
        <div className="register-card">
          {/* BRAND */}
          <div className="brand">
            <FiHeart className="register-heart" />
            <h1>{t("RegisterPage.brand_name")}</h1>
          </div>

          {/* HEADER */}
          <div className="register-heading">
            <h2>{t("RegisterPage.title")}</h2>
            <p>{t("RegisterPage.subtitle")}</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            {/* NAME */}
            <div className="register-form-row">
              <div>
                <div className="register-input-group">
                  <FiUser className="input-icon" />
                  <div className="input-group_div">
                    <label htmlFor="firstName">
                      {t("RegisterPage.fields.firstName.placeholder")}
                    </label>
                    <input
                      className="register-input"
                      type="text"
                      name="firstName"
                      placeholder=""
                      autoComplete="given-name"
                      onFocus={()=>handleFirstNameInputFocus()}
                      required
                    />
                  </div>
                </div>
                {firstNameError && (
                  <span className="error">
                    {t("RegisterPage.fields.firstName.firstname_error")}
                  </span>
                )}
              </div>

              <div>
                <div className="register-input-group">
                  <FiUser className="input-icon" />
                  <div className="input-group_div">
                    <label htmlFor="firstName">
                      {t("RegisterPage.fields.lastName.placeholder")}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder=""
                      autoComplete="family-name"
                            onFocus={()=>handleLastNameInputFocus()}
                            required
                    />
                  </div>
                </div>
                    {lastNameError && (
                <span className="error">
                  {t("RegisterPage.fields.lastName.lastname_error")}
                </span>
              )}
              </div>
          
            </div>

            {/* DATE OF BIRTH */}
            <div>
              <div className="register-input-group">
                <FiCalendar className="input-icon" />
                <div className="input-group_div">
                  <label htmlFor="dob">
                    {t("RegisterPage.fields.Other.date_of_birth")}
                  </label>
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                
                    defaultValue={new Date().toISOString().split("T")[0]}
                          onFocus={()=>handleDateOfBirthInputFocus()}
                          required
                  />
                </div>
              </div>
              {dobError && (
                <span className="error">
                  {t("RegisterPage.fields.dob_error")}
                </span>
              )}
            </div>
            {/* GENDER */}
            <div className="register-input-group select-group">
              <PiGenderIntersex className="input-icon" />
              <div className="input-group_div">
                <label htmlFor="gender">
                  {t("RegisterPage.fields.Other.gender")}
                </label>
                <select
                  name="gender"
                  required
                >
                  <option value="Male">{t("Options.Gender.MALE")}</option>
                  <option value="Female">{t("Options.Gender.FEMALE")}</option>
                  <option value="Non-binary">
                    {t("Options.Gender.NON_BINARY")}
                  </option>
                </select>
              </div>
              <FiChevronDown className="select-arrow" />
            </div>

            {/* EMAIL */}
            <div>
              <div className="register-input-group">
                <FiMail className="input-icon" />
                <div className="input-group_div">
                  <label htmlFor="email">
                    {t("RegisterPage.fields.email.placeholder")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder=""
                    autoComplete="email"
                          onFocus={()=>handleEmailInputFocus()}
                          required
                  />
                </div>
              </div>

              {emailError && (
                <span className="error">
                  {t("RegisterPage.fields.email.email_error")}
                </span>
              )}
              {emailExistError && (
                <span className="error">
                  {t("RegisterPage.fields.email.email_taken")}
                </span>
              )}
            </div>

            {/* LOCATION */}
            <div className="location-field">
              <div className="register-input-group location-input-container">
              
                <div className="input-group_div">
                  <label htmlFor="location">
                    {t("RegisterPage.fields.Other.location")}
                  </label>
                  <LocationSelector {...locationSelectorProps} />
                </div>
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="register-input-group">
                <FiLock className="input-icon" />
                <div className="input-group_div">
                  <label htmlFor="password">
                    {t("RegisterPage.fields.password.placeholder")}
                  </label>
                  <input
                    type="password"
                    placeholder=""
                    name="password"
                    autoComplete="new-password"
                        onFocus={()=>handlePasswordInputFocus()}
                        required
                  />
                </div>
              </div>
              {passwordError && (
                <span className="error">
                  {t("RegisterPage.fields.password.password_error")}
                </span>
              )}
       
            </div>

            {/* TERMS */}
            <label className="terms">
              <input
                type="checkbox"
                required
                name="agreeToTerms"
                onChange={(e) => setIsTermsChecked(e.target.checked)}
              />
              <span>
                {t("RegisterPage.fields.terms_and_privacy.link")}{" "}
                <Link
                  to="/terms"
                  className="legal-link"
                  target="_blank"
                >
                  {t("RegisterPage.fields.terms_and_privacy.terms")}{" "}
                </Link>{" "}
                {t("RegisterPage.fields.terms_and_privacy.and")}{" "}
                <Link
                  to="/terms"
                  className="legal-link"
                  target="_blank"
                >
                  {t(
                    "RegisterPage.fields.terms_and_privacy.privacy_policy",
                  )}{" "}
                </Link>
                {t("RegisterPage.fields.terms_and_privacy.brand_name")}
              </span>
            </label>
            {message && <span className="error">{message}</span>}

            {/* SUBMIT */}
            <button
              type="submit"
              className="register-btn"
            >
              {t("RegisterPage.fields.submit_btn")}
              <FiArrowRight />
            </button>
          </form>

          {/* LOGIN */}
          <div className="login-link">
            <span>{t("RegisterPage.fields.login_prompt.text")}</span>
            <Link to={"/"}> {t("RegisterPage.fields.login_prompt.link")}</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
