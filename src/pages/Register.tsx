import { useEffect, useState, type ChangeEvent } from "react";
import {
    FiArrowRight,
    FiCalendar,
    FiChevronDown,
    FiHeart,
    FiLoader,
    FiLock,
    FiMail,
    FiMapPin,
    FiUser,
} from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";
import "./../css/Register.css";

import { useTranslation } from "react-i18next";
import { PiGenderIntersex } from "react-icons/pi";
import {
    useAddUserMutation,
    useGetLocationMutation,
    useLazyGetSearchedLocationQuery,
} from "../features/api/authApi";
import type { TErrorResponse } from "../types/TErrorResponse";
import type { TLocationRequest } from "../types/TLocationRequest";
import type { TLocationResponse } from "../types/TLocationResponse";
import type { TvalidationErrors } from "../types/TValidationErrors";
import { detectUserCoordinates } from "../util/location";

const Register = () => {
  const [register] = useAddUserMutation();
  const navigate = useNavigate();

  //translation hook
  const { t } = useTranslation();

  //locale for date trqnslation
  const locale = localStorage.getItem("i18nextLng") as string;

  //location hook
  const [getLocation] = useGetLocationMutation();
  const [getSearchLocation] = useLazyGetSearchedLocationQuery();

  const [location, setLocation] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<TvalidationErrors>();
  const [message, setMessage] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");
  const [locationList, setLocationList] = useState<TLocationResponse[]>([]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  //global address data
  const [longitude, setLongitude] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);
  const [countryCode, setCountryCode] = useState<string>("");

  const [extractedData, setExtracted] = useState<boolean>(false);


  //capture location input
  const handleLocationInputChange = (inputValue: string) => {
    setLocation(inputValue);

    const matchedCity = locationList.find(
      (item) =>
        `${item.city}, ${item.country}`.trim().toLowerCase() ===
        inputValue.trim().toLowerCase(),
    );
    if (matchedCity) {
      setExtracted(true);
      const { lat, lon, countryCode } = matchedCity as TLocationResponse;
      setLatitude(lat);
      setLongitude(lon);
      setCountryCode(countryCode);
    }
  };

  // Hardware client capture layout targeting reverse geocoding operations
  const handleDetectLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const coordinates = await detectUserCoordinates();

      const latitude = coordinates.latitude;
      const longitude = coordinates.longitude;

      setLatitude(latitude);
      setLongitude(longitude);

      const dto: TLocationRequest = {
        longitude,
        latitude,
        locale,
      };

      const response = await getLocation(dto);

      if (response.error) throw new Error("Network fetch operation failed");

      if (response.data.httpStatus === 200) {
        // Extracts city names cleanly (e.g. "Warsaw" or "Piotrków Trybunalski")
        const { city, country, countryCode } = response.data.locationResponse;
        setLocation(`${city},${country}`);
        setCountryCode(countryCode);
      } else {
        setLocationError("Could not determine your city name automatically.");
      }
    } catch (err) {
      //console.error("Geocoding request failed: ", err);
      setLocationError("Failed to fetch address. Please fill it manually.");
    } finally {
      setIsLocating(false);
    }
  };

  async function findUserLocationManually() {
    setLocationError("");
    const response = await getSearchLocation({
      city: location,
      locale,
    }).unwrap();

    if (response.httpStatus === 200) {
      const cityList = response.locationResponseList;
      setLocationList(() => cityList);
    }
  }

  useEffect(() => {
    findUserLocationManually();
  }, [location]);



  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    const firstName = formValues.firstName as string;
    const lastName = formValues.lastName as string;
    const gender = formValues.gender as string;
    const dob = new Date(formValues.dob as string);
    const password = formValues.password as string;
    const location = formValues.location as string;
    const email = formValues.email as string;

    const city = location.trim().split(",")[0];
    const country = location.split(",")[1];

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

        // Clear old errors on successful registration
        setError("");

        // Redirect the user right away
        navigate("/");
      } catch (error: any) {
        // 3. ERROR FLOW: This catches all 4xx, 5xx, and network ERR_CONNECTION_REFUSED errors
        //console.error('Registration Failed:', error);
        setError(() => "Registration Failed:" + error);

        // Handle Redux Network Level Errors (FETCH_ERROR)
        if (error.status === "FETCH_ERROR") {
          setFetchError("Oops network down, please try again in few minutes.");
          return;
        }

        // Handle Server Errors (401, 500, etc.)
        if (error.status === 500 || error.status === 401) {
          const errorResponse = error.data as {
            error: string;
            status: number;
            message: string;
          };

          setFetchError(errorResponse.error);
        }

        // Handle Server Validation & Response Errors (401, 409, 500, etc.)
        if (error.status === 409) {
          const errorResponse = error.data as {
            error: string;
            status: number;
            message: string;
          };
          //const{error} = errorResponse;
          console.log(errorResponse.error);

          setError(() => errorResponse.error);
        }

        // Handle Client-Side Field Validation Errors (403 Forbidden)
        if (error.status === 403) {
          // const errorResponse = error  as FetchBaseQueryError;
          const errorData = error as { status: number; data: TErrorResponse };
          const errors = errorData.data.error as TvalidationErrors;
          setErrorMessages(() => errors);
        }
      }
    } else {
      setMessage("Please accept terms and condition to proceed");
    }
  };

  return (
    <>
      {fetchError && (
        <div className="error">
          <h2>{fetchError}</h2>
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
                    />
                  </div>
                </div>
                {errorMessages?.firstName && (
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
                      required
                    />
                  </div>
                </div>
              </div>
              {errorMessages?.lastName && (
                <span className="error">
                  {t("RegisterPage.fields.lastName.lastname_error")}
                </span>
              )}
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
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              {errorMessages?.dob && (
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
                    required
                  />
                </div>
              </div>

              {errorMessages?.email && (
                <span className="error">
                  {t("RegisterPage.fields.email.email_error")}
                </span>
              )}
              {error && (
                <span className="error">
                  {t("RegisterPage.fields.email.email_taken")}
                </span>
              )}
            </div>

            {/* LOCATION */}
            <div className="location-field">
              <div className="register-input-group location-input-container">
                <FiMapPin className="input-icon location-icon" />
                <div className="input-group_div">
                  <label htmlFor="location">
                    {t("RegisterPage.fields.Other.location")}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={location}
                    onChange={(e) => handleLocationInputChange(e.target.value)}
                    placeholder=""
                    autoComplete="address-level2"
                    list="polish-cities"
                    required
                  />
                </div>
                <button
                  type="button"
                  className="detect-location-btn"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  title="Detect city automatically"
                >
                  {isLocating ? (
                    <FiLoader className="spin-animate" />
                  ) : (
                    <FiMapPin />
                  )}
                </button>
              </div>

              {/* Hidden inputs are an industry-standard mechanism to ensure standard form submissions catch values flawlessly */}
              {extractedData && (
                <>
                  <input
                    type="hidden"
                    name="lat"
                    value={latitude}
                  />
                  <input
                    type="hidden"
                    name="lon"
                    value={longitude}
                  />
                  <input
                    type="hidden"
                    name="countryCode"
                    value={countryCode}
                  />
                </>
              )}
              <datalist id="polish-cities">
                {locationList.map((city, index) => (
                  <option
                    key={index}
                    value={`${city.city}, ${city.country}`}
                  />
                ))}
              </datalist>

              {locationError && (
                <div className="error location-error-message">
                  {locationError}
                </div>
              )}

              <div className="location-helper">
                <FiMapPin size={14} />
                <span>{t("RegisterPage.location_message")}</span>
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
                    required
                  />
                </div>
              </div>
              {errorMessages?.password && (
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
