import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FcPlanner } from "react-icons/fc";
import { FiActivity, FiBriefcase, FiCamera, FiMapPin } from "react-icons/fi";
import { GiTimeSynchronization } from "react-icons/gi";
import { IoSchool } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { MdOutlineLanguage, MdPets } from "react-icons/md";
import { PiBeerBottle, PiCigarette } from "react-icons/pi";
import { RiCameraAiFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useLoaderData } from "react-router-dom";
import type { Store } from "redux";
import { Loading } from "../components/index";
import { useLazyGetSearchedLocationQuery } from "../features/api/authApi";
import { userApi, useUpdateUserDetailsMutation } from "../features/api/userApi";
import { updateProfileImage } from "../features/slice/userSlice";
import { useAppSelector, type AppDispatch, type RootState } from "../store";
import type { TLocationResponse } from "../types/TLocationResponse";
import type { TUserDataDto } from "../types/TUserDataDto";
import {
    DRINKING_RESPONSES,
    OPTIONS_CHRONO,
    OPTIONS_EDUCATION,
    OPTIONS_GENDER,
    OPTIONS_LANGUAGE,
    OPTIONS_LOOKINGFOR,
    OPTIONS_PLANNING,
    OPTIONS_PREFERENCE,
    OPTIONS_SOCIAL,
    professions,
    QUESTION_RESPONSES,
    sanitizeBackendKey,
    sanitizeKey
} from "../util/util";
import defaultPic from "./../assets/default.jpeg";
import "./../css/Profile.css";
import "./../css/loading.css";

export const loader = (store: Store<RootState>) => async () => {
  const userId = store.getState().userSlice.id;

  const dispatch = store.dispatch as AppDispatch;

  const promise = await dispatch(
    userApi.endpoints.getUserProfile.initiate(userId, { forceRefetch: true }),
  );

  const response = promise.data as TUserDataDto;

  return response;
};

const Profile = () => {
  const data = useLoaderData() as TUserDataDto;
  const {
    aboutMe,
    aboutThem,
    firstName,
    lastName,
    profession,
    profileImage,
    date_of_birth,
    country,
    city,
    preference,
    lookingFor,
    education,
    gender,
    height,
    pets,
    drinking,
    smoking,
    language,
    username,
    socialEnergy,
    planningStyle,
    chronoType,
  } = data.data;


  //location search hook
    const [getSearchLocation] = useLazyGetSearchedLocationQuery();

  //global address data
  const [longitude, setLongitude] = useState<number>(0.0);
  const [latitude, setLatitude] = useState<number>(0.0);
  const [countryCode, setCountryCode] = useState<string>("");

  const [extractedData, setExtracted] = useState<boolean>(false);

  const [location, setLocation] = useState<string>(``);
  const [locationList, setLocationList] = useState<TLocationResponse[]>([]);

  //state variables
  const [genderU, setGenderU] = useState<string>(gender);
  const [cityU, setCityU] = useState<string>(city);
  const [countryU, setCountryU] = useState<string>(country);
  const [aboutMeU, setAboutMeU] = useState<string>(aboutMe);
  const [aboutThemU, setAboutThemU] = useState<string>(aboutThem);
  const [lookingForU, setLookingForU] = useState<string>(lookingFor);
  const [preferenceU, setPreferenceU] = useState<string>(preference);
  const [educationU, setEducationU] = useState<string>(education);
  const [drinkingU, setDrinkingU] = useState<string>(drinking);
  const [smokingU, setSmokingU] = useState<string>(smoking);
  const [petsU, setPetsU] = useState<string>(pets);
  const [professionU, setProfessionU] = useState<string>(profession);
  const [languageU, setLanguageU] = useState<string>(language);
  const [heightU, setHeightU] = useState<string>(height);
  const [chronoTypeU, setChronoTypeU] = useState<string>(chronoType);
  const [planningStyleU, setPlanningStyleU] = useState<string>(planningStyle);
  const [socialEnergyU, setSocialEnergyU] = useState<string>(socialEnergy);

  const dispatch = useDispatch();

  //user id
  const userId = useAppSelector((state) => state.userSlice.id);

  //update user details hook
  const [updateUserDetails] = useUpdateUserDetailsMutation();

  const [charLength_one, setCharLength_one] = useState<number>(0);
  const [charLength_two, setCharLength_two] = useState<number>(0);
  const [image, setImgae] = useState<string>(profileImage);
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string>("");


    //locale for date trqnslation
  const locale = localStorage.getItem("i18nextLng") as string;

  //translation hook
  const { t } = useTranslation();

  //function for textarea inout change
  const handleTextInputAboutMe = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.target.value;
    const textLength = text.length;
    setCharLength_one(() => textLength);
  };

  //function for textarea inout change
  const handleTextInputAboutThem = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.target.value;
    const textLength = text.length;
    setCharLength_two(() => textLength);
  };

  //handle form

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 1. Create a clean, empty FormData container
    const dataToSend = new FormData();

    // 2. Safely grab your form elements from the HTML page
    const formElement = e.target;

    // const firstNameInput = formElement.elements.namedItem("firstName") as HTMLInputElement;
    // const lastNameInput = formElement.elements.namedItem("lastName") as HTMLInputElement;
    //const dobInput = formElement.elements.namedItem("date_of_birth") as HTMLInputElement;
    const imageInput = formElement.elements.namedItem(
      "image",
    ) as HTMLInputElement;

    const aboutInput = formElement.elements.namedItem(
      "aboutMe",
    ) as HTMLInputElement;
    const aboutThemInput = formElement.elements.namedItem(
      "aboutThem",
    ) as HTMLInputElement;
    const lookingForInput = formElement.elements.namedItem(
      "lookingFor",
    ) as HTMLInputElement;
    const preferenceInInput = formElement.elements.namedItem(
      "preference",
    ) as HTMLInputElement;
    const languageInput = formElement.elements.namedItem(
      "language",
    ) as HTMLInputElement;
    const educationInput = formElement.elements.namedItem(
      "education",
    ) as HTMLInputElement;
    const professionInput = formElement.elements.namedItem(
      "profession",
    ) as HTMLInputElement;
    const drinkingInput = formElement.elements.namedItem(
      "drinking",
    ) as HTMLInputElement;
    const smokingInput = formElement.elements.namedItem(
      "smoking",
    ) as HTMLInputElement;
    const petsInput = formElement.elements.namedItem(
      "pets",
    ) as HTMLInputElement;
    const genderInput = formElement.elements.namedItem(
      "gender",
    ) as HTMLInputElement;
    const heightInput = formElement.elements.namedItem(
      "height",
    ) as HTMLInputElement;
    const chronoTypeInput = formElement.elements.namedItem(
      "chronoType",
    ) as HTMLInputElement;
    const socialEnergyInput = formElement.elements.namedItem(
      "socialEnergy",
    ) as HTMLInputElement;
    const planningStyleInput = formElement.elements.namedItem(
      "planningStyle",
    ) as HTMLInputElement;
     const latInput = formElement.elements.namedItem(
      "lat",
    ) as HTMLInputElement;
     const lonInput = formElement.elements.namedItem(
      "lon",
    ) as HTMLInputElement;
      const countryCodeInput = formElement.elements.namedItem(
      "countryCode",
    ) as HTMLInputElement;

      const city = location.trim().split(",")[0];
    const country = location.split(",")[1];


    // 3. Append text values straight to the container
    //dataToSend.append("firstName", firstNameInput?.value || "");
    //dataToSend.append("lastName", lastNameInput?.value || "");
    //dataToSend.append("date_of_birth", dobInput?.value || "");
    dataToSend.append("userId", userId.toString() || "");
    dataToSend.append("city", city || "");
    dataToSend.append("country", country || "");
    dataToSend.append("aboutMe", aboutInput?.value || "");
    dataToSend.append("lat", latInput?.value || '0.0');
    dataToSend.append("lon", lonInput?.value || '0.0');
    dataToSend.append("countryCode", countryCodeInput?.value || "");
    dataToSend.append("aboutThem", aboutThemInput?.value || "");
    dataToSend.append("lookingFor", lookingForInput?.value || "");
    dataToSend.append("preference", preferenceInInput?.value || "");
    dataToSend.append("language", languageInput?.value || "");
    dataToSend.append("education", educationInput?.value || "");
    dataToSend.append("profession", professionInput?.value || "");
    dataToSend.append("drinking", drinkingInput?.value || "");
    dataToSend.append("smoking", smokingInput?.value || "");
    dataToSend.append("pets", petsInput?.value || "");
    dataToSend.append("gender", genderInput?.value || "");
    dataToSend.append("height", heightInput?.value || "");
    dataToSend.append("chronoType", chronoTypeInput?.value || "");
    dataToSend.append("planningStyle", planningStyleInput?.value || "");
    dataToSend.append("socialEnergy", socialEnergyInput?.value || "");

    // 4. CRITICAL: Grab the actual binary file blob from the file array
    if (imageInput && imageInput.files && imageInput.files[0]) {
      const maxAllowedSize = 30 * 1024 * 1024;
      if (imageInput.files[0].size > maxAllowedSize) {
        setImageError(
          "This image/video is too large! Maximum allowed size is 30MB.",
        );
        return;
      }
      dataToSend.append("media", imageInput.files[0]); // Gets the raw file blob
    }

     //console.log(Object.fromEntries(dataToSend));

    try {
      const response = await updateUserDetails(dataToSend).unwrap();

      //console.log(response);
      

        const {httpStatus} = response as {data:boolean,httpStatus:string,message:string}
      
      if (httpStatus==='200 OK') {
        setGenderU(() => genderInput.value);
        setLanguageU(() => languageInput.value);
        setCityU(() => city);
        setCountryU(()=>country);
        setAboutMeU(() => aboutInput.value);
        setAboutThemU(() => aboutThemInput.value);
        setDrinkingU(() => drinkingInput.value);
        setPetsU(() => petsInput.value);
        setLookingForU(() => lookingForInput.value);
        setPreferenceU(() => preferenceInInput.value);
        setSmokingU(() => smokingInput.value);
        setProfessionU(() => professionInput.value);
        setEducationU(() => educationInput.value);
        setHeightU(() => heightInput.value);
        setChronoTypeU(() => chronoTypeInput.value);
        setSocialEnergyU(() => socialEnergyInput.value);
        setPlanningStyleU(() => planningStyleInput.value);

        setIsEditProfile(() => false);
        dispatch(updateProfileImage(image));
      }
    } catch {}
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const text = e.target.files[0];
      const file = URL.createObjectURL(text);
      setImgae(() => file);
      dispatch(updateProfileImage(file));
    } else {
      setImgae(() => profileImage);
    }
  };

  const handleEditProfileButton = () => {
    setIsEditProfile(() => !isEditProfile);
  };

    async function findUserLocationManually() {
     // setLocationError("");
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
      setLongitude(lon );
      setCountryCode(countryCode);
    }
  };

  if (data) {
    return (
      <section className="settings">
        <div className="settings_center">
          <div className="pageHeader">
            <h1>{t("ProfilePage.title")}</h1>
            <div className="edit-btn">
              <button onClick={() => handleEditProfileButton()}>
                {isEditProfile
                  ? t("ProfilePage.cancel_btn")
                  : t("ProfilePage.edit_btn")}
              </button>
            </div>
          </div>
          {/** IMAGE SIZE ERROR */}
          {imageError && (
            <p
              className="image_error"
              style={{ color: "red" }}
            >
              {imageError}
            </p>
          )}
          <form
            className="settings_container"
            onSubmit={handleFormSubmit}
          >
            <div className="pic_container">
              <div className="img">
                <img
                  src={image ? image : defaultPic || "https://unsplash.com"}
                  alt={firstName}
                />

                <div className="svg_container">
                  <RiCameraAiFill />
                </div>
              </div>
              <div className="data">
                <h2>{firstName + " " + lastName}</h2>
                <div className="location">
                  <FiMapPin />
                  <p>
                    {cityU}
                    <LuDot />
                    {country}
                  </p>
                </div>
              </div>
              <div className="file_upload">
                <input
                  type="file"
                  name="new_image"
                  id="image"
                  className="new_file"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                />
                <div
                  className="change_foto"
                  style={{ display: isEditProfile ? "flex" : "none" }}
                >
                  <FiCamera />
                  <span>{t("ProfilePage.change_image_btn")}</span>
                </div>
              </div>
            </div>
            <div className="basic_container">
              <div className="basic_header">
                <h2>{t("ProfilePage.sections.basic_information.title")}</h2>
              </div>
              <div className="basic_data">
                <div className="input_group">
                  <label htmlFor="firstName">
                    {t(
                      "ProfilePage.sections.basic_information.fields.first_name",
                    )}
                  </label>
                  <div>
                    {isEditProfile ? (
                      <input
                        type="text"
                        placeholder={firstName}
                        name="firstName"
                        readOnly
                      />
                    ) : (
                      <p>{firstName}</p>
                    )}
                  </div>
                </div>
                <div className="input_group">
                  <label htmlFor="lastName">
                    {t(
                      "ProfilePage.sections.basic_information.fields.last_name",
                    )}
                  </label>
                  <div>
                    {isEditProfile ? (
                      <input
                        type="text"
                        placeholder={lastName}
                        name="lastName"
                        readOnly
                      />
                    ) : (
                      <p>{lastName}</p>
                    )}
                  </div>
                </div>
                <div className="input_group">
                  <label htmlFor="date_of_birth">
                    {t(
                      "ProfilePage.sections.basic_information.fields.date_of_birth",
                    )}
                  </label>
                  <div>
                    {isEditProfile ? (
                      <p>{new Date(date_of_birth).toLocaleDateString()}</p>
                    ) : (
                      <p>{new Date(date_of_birth).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="input_group">
                  <label htmlFor="username">
                    {t("ProfilePage.sections.basic_information.fields.email")}
                  </label>
                  <div>
                    {isEditProfile ? (
                      <input
                        defaultValue={username}
                        type="text"
                        name="username"
                        disabled
                      />
                    ) : (
                      <p>{username}</p>
                    )}
                  </div>
                </div>
                <div className="input_group">
                  <label htmlFor="gender">
                    {t("ProfilePage.sections.basic_information.fields.gender")}
                  </label>
                  {isEditProfile ? (
                    <select
                      name="gender"
                      defaultValue={t(
                        `Options.Gender.${genderU.toUpperCase()}`,
                      )}
                    >
                      {OPTIONS_GENDER.map((item) => {
                        return (
                          <option
                            key={item.label}
                            value={item.value}
                          >
                            {t(
                              `Options.Gender.${sanitizeBackendKey(item.label)}`,
                            )}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <p>{t(`Options.Gender.${genderU.toUpperCase()}`)}</p>
                  )}
                </div>
                <div className="input_group">
                  <label htmlFor="city">
                    {t("ProfilePage.sections.basic_information.fields.city")}
                  </label>
                  {isEditProfile ? (
                     <input
                        type="text"
                        name="location"
                        value={location}
                        onChange={(e) =>
                          handleLocationInputChange(e.target.value)
                        }
                        placeholder=""
                        autoComplete="address-level2"
                        list="polish-cities"
                      />
                  ) : (
                    <p>{cityU}</p>
                  )}
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
       
                <div className="input_group">
                  <label htmlFor="height">
                    {t("ProfilePage.sections.basic_information.fields.height")}
                  </label>
                  <div>
                    {isEditProfile ? (
                      <input
                        type="text"
                        placeholder={heightU}
                        name="height"
                      />
                    ) : (
                      <p>{heightU}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="aboutMe_container">
              <div className="about_header">
                <h2>{t("ProfilePage.sections.about_me.title")}</h2>
              </div>
              <div className="bio_title">
                <p>{t("ProfilePage.sections.about_me.fields.bio_label")}</p>
              </div>
              {isEditProfile ? (
                <textarea
                  name="aboutMe"
                  onChange={handleTextInputAboutMe}
                  maxLength={250}
                  defaultValue={aboutMeU || ""}
                ></textarea>
              ) : (
                <p>{aboutMeU || ""}</p>
              )}
              <div className="text_counter">
                <p>{charLength_one}/ 250</p>
              </div>
            </div>
            <div className="aboutMe_container">
              <div className="about_header">
                <h2>{t("ProfilePage.sections.what_im_looking_for.title")}</h2>
              </div>
              <div className="bio_title">
                <p>
                  {t(
                    "ProfilePage.sections.what_im_looking_for.fields.ideal_preference",
                  )}
                </p>
              </div>
              {isEditProfile ? (
                <textarea
                  name="aboutThem"
                  onChange={handleTextInputAboutThem}
                  maxLength={250}
                  defaultValue={aboutThemU}
                ></textarea>
              ) : (
                <p>{aboutThemU}</p>
              )}
              <div className="text_counter">
                <p>{charLength_two}/ 250</p>
              </div>
            </div>
            <div className="preference_container">
              <div className="pref_header">
                <h2>{t("ProfilePage.sections.looking_for_meta.title")}</h2>
              </div>
              <div className="preferences">
                <div className="input_group">
                  <label htmlFor="lookingFor">
                    {t(
                      "ProfilePage.sections.looking_for_meta.fields.looking_for_label",
                    )}
                  </label>
                  {isEditProfile ? (
                    <select
                      name="lookingFor"
                      defaultValue={lookingForU}
                    >
                      {OPTIONS_LOOKINGFOR.map((item) => {
                        return (
                          <option
                            key={item.label}
                            value={item.value}
                          >
                            {t(
                              `Options.LookingFor.${sanitizeBackendKey(item.label)}`,
                            )}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <p>
                      {t(
                        `Options.LookingFor.${sanitizeBackendKey(lookingForU)}`,
                      )}
                    </p>
                  )}
                </div>
                <div className="input_group">
                  <label htmlFor="preference">
                    {t(
                      "ProfilePage.sections.looking_for_meta.fields.interested_in_label",
                    )}
                  </label>
                  {isEditProfile ? (
                    <select
                      name="preference"
                      defaultValue={preferenceU}
                    >
                      {OPTIONS_PREFERENCE.map((item) => {
                        return (
                          <option
                            key={item.label}
                            value={item.value}
                          >
                            {t(`Options.Preference.${item.label}`)}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <p>
                      {t(
                        `Options.Preference.${sanitizeBackendKey(preferenceU)}`,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="lifestyle_container">
              <div className="lifestyle_header">
                <h2>{t("ProfilePage.sections.lifestyle.title")}</h2>
              </div>
              <div className="lifestyles">
                <div className="life_group">
                  <MdOutlineLanguage />
                  <div className="input_container">
                    <label htmlFor="language">
                      {t("ProfilePage.sections.lifestyle.fields.language")}
                    </label>
                    {isEditProfile ? (
                      <select
                        name="language"
                        defaultValue={languageU}
                      >
                        {OPTIONS_LANGUAGE.map((item) => {
                          return (
                            <option
                              key={item.label}
                              value={item.value}
                            >
                              {t(`Options.language.${item.label}`)}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <p>
                        {languageU === null
                          ? t(`Options.language.OTHER`)
                          : t(`Options.language.${sanitizeKey(languageU)}`)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="life_group">
                  <IoSchool />
                  <div className="input_container">
                    <label htmlFor="education">
                      {t("ProfilePage.sections.lifestyle.fields.education")}
                    </label>
                    {isEditProfile ? (
                      <select
                        name="education"
                        defaultValue={educationU}
                      >
                        {OPTIONS_EDUCATION.map((item) => {
                          return (
                            <option
                              key={item.label}
                              value={item.value}
                            >
                              {t(`Options.education.${item.label}`)}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <p>
                        {educationU === null
                          ? t(`Options.education.HIGH_SCHOOL`)
                          : t(
                              `Options.education.${sanitizeBackendKey(educationU)}`,
                            )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="life_group">
                  <FiBriefcase />
                  <div className="input_container">
                    <label htmlFor="profession">
                      {t("ProfilePage.sections.lifestyle.fields.profession")}
                    </label>
                    {isEditProfile ? (
                      <select
                        name="profession"
                        defaultValue={professionU}
                      >
                        {professions
                          .sort((a, b) => {
                            if (a === "OTHER") return 1;
                            if (b === "OTHER") return -1;

                            const keyA = sanitizeBackendKey(a);
                            const keyB = sanitizeBackendKey(b);

                            return t(`Professions.${keyA}`).localeCompare(
                              t(`Professions.${keyB}`),
                            );
                          })
                          .map((prof) => {
                            return (
                              <option
                                value={prof}
                                key={prof}
                              >
                                {t(`Professions.${sanitizeBackendKey(prof)}`)}
                              </option>
                            );
                          })}
                      </select>
                    ) : (
                      <p>
                        {profession === null
                          ? t(`Professions.OTHER`)
                          : t(`Professions.${sanitizeBackendKey(professionU)}`)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="life_group">
                  <PiBeerBottle />
                  <div className="input_container">
                    <label htmlFor="drinking">
                      {t("ProfilePage.sections.lifestyle.fields.drinks")}
                    </label>
                    {isEditProfile ? (
                      <select
                        name="drinking"
                        defaultValue={drinkingU}
                      >
                        {DRINKING_RESPONSES.map((item) => {
                          return (
                            <option
                              key={item.label}
                              value={item.value}
                            >
                              {t(`Options.drinks.${item.label}`)}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <p>
                        {drinkingU === null
                          ? t(`Options.drinks.NO`)
                          : t(
                              `Options.drinks.${sanitizeBackendKey(drinkingU)}`,
                            )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="life_group">
                  <PiCigarette />
                  <div className="input_container">
                    <label htmlFor="smoking">
                      {t("ProfilePage.sections.lifestyle.fields.smoking")}
                    </label>
                    {isEditProfile ? (
                      <select
                        name="smoking"
                        defaultValue={smokingU}
                      >
                        {QUESTION_RESPONSES.map((item) => {
                          return (
                            <option
                              key={item.label}
                              value={item.value}
                            >
                              {t(`Options.Questions.${item.label}`)}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <p>
                        {smokingU === null
                          ? t(`Options.Questions.NO`)
                          : t(
                              `Options.Questions.${sanitizeBackendKey(smokingU)}`,
                            )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="life_group">
                  <MdPets />
                  <div className="input_container">
                    <label htmlFor="pets">
                      {t("ProfilePage.sections.lifestyle.fields.pets")}
                    </label>
                    {isEditProfile ? (
                      <select
                        name="pets"
                        defaultValue={petsU}
                      >
                        {QUESTION_RESPONSES.map((item) => {
                          return (
                            <option
                              key={item.label}
                              value={item.value}
                            >
                              {t(`Options.Questions.${item.label}`)}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <p>
                        {petsU === null
                          ? t(`Options.Questions.NO`)
                          : t(`Options.Questions.${sanitizeBackendKey(petsU)}`)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="life_group">
                  <GiTimeSynchronization />
                  <div className="input_container">
                    <label htmlFor="pets">
                      {t("ProfilePage.sections.lifestyle.fields.chronoType")}
                    </label>
                    {isEditProfile ? (
                      <select
                        name="chronoType"
                        defaultValue={chronoTypeU}
                      >
                        {OPTIONS_CHRONO.map((item) => {
                          return (
                            <option
                              key={item.label}
                              value={item.value}
                            >
                              {t(
                                `Options.chronoType.${sanitizeBackendKey(item.label)}`,
                              )}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <p>
                        {chronoTypeU === null
                          ? t(`Options.chronoType.FLEXIBLE`)
                          : t(
                              `Options.chronoType.${sanitizeBackendKey(chronoTypeU)}`,
                            )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="life_group">
                  <FiActivity />
                  <div className="input_container">
                    <label htmlFor="pets">
                      {t("ProfilePage.sections.lifestyle.fields.socialEnergy")}
                    </label>
                    {isEditProfile ? (
                      <select
                        name="socialEnergy"
                        defaultValue={socialEnergyU}
                      >
                        {OPTIONS_SOCIAL.map((item) => {
                          return (
                            <option
                              key={item.label}
                              value={item.value}
                            >
                              {t(
                                `Options.socialEnergy.${sanitizeBackendKey(item.label)}`,
                              )}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <p>
                        {socialEnergyU === null
                          ? t(`Options.socialEnergy.IT_DEPENDS`)
                          : t(
                              `Options.socialEnergy.${sanitizeBackendKey(socialEnergyU)}`,
                            )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="life_group">
                  <FcPlanner />
                  <div className="input_container">
                    <label htmlFor="pets">
                      {t("ProfilePage.sections.lifestyle.fields.planningStyle")}
                    </label>
                    {isEditProfile ? (
                      <select
                        name="planningStyle"
                        defaultValue={planningStyleU}
                      >
                        {OPTIONS_PLANNING.map((item) => {
                          return (
                            <option
                              key={item.label}
                              value={item.value}
                            >
                              {t(
                                `Options.planningStyle.${sanitizeBackendKey(item.label)}`,
                              )}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <p>
                        {planningStyleU === null
                          ? t(`Options.planningStyle.IT_DEPENDS`)
                          : t(
                              `Options.planningStyle.${sanitizeBackendKey(planningStyleU)}`,
                            )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="btns">
              <button
                className="cancel-btn"
                style={{ display: "none" }}
              >
                <span>Cancel</span>
              </button>
              <button
                className="update-btn"
                style={{ display: isEditProfile ? "flex" : "none" }}
              >
                <span>{t("ProfilePage.update_btn")}</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
  return <Loading />;
};

export default Profile;
