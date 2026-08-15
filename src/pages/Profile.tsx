import { useState, type ChangeEvent } from "react";
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
import { userApi, useUpdateUserDetailsMutation } from "../features/api/userApi";
import { updateProfileImage } from "../features/slice/userSlice";
import { useAppSelector, type AppDispatch, type RootState } from "../store";
import type { TUserDataDto } from "../types/TUserDataDto";
import { countries, POLISH_CITIES, professions, sanitizeBackendKey, sanitizeKey } from "../util/util";
import defaultPic from './../assets/default.jpeg';
import "./../css/Profile.css";
import "./../css/loading.css";


export const loader =(store:Store<RootState>)=>async ()=>{

    const userId = store.getState().userSlice.id;


    const dispatch = store.dispatch as AppDispatch;

    const promise = await dispatch(userApi.endpoints.getUserProfile.initiate(userId,{forceRefetch:true}));

    
   const response = promise.data as TUserDataDto;


    
    return response;
}
    
const Profile = () => {

const data = useLoaderData() as TUserDataDto;
  const {aboutMe,aboutThem,firstName,lastName,profession,profileImage,date_of_birth,
                    country,city,preference,lookingFor,education,gender,height,pets,drinking,smoking,language,username,socialEnergy,planningStyle,chronoType} = data.data;

//state variables
const[genderU,setGenderU]=useState<string>(gender)
const[cityU,setCityU]=useState<string>(city)
const[countryU,setCountryU]=useState<string>(country)
const[aboutMeU,setAboutMeU]=useState<string>(aboutMe)
const[aboutThemU,setAboutThemU]=useState<string>(aboutThem)
const[lookingForU,setLookingForU]=useState<string>(lookingFor)
const[preferenceU,setPreferenceU]=useState<string>(preference)
const[educationU,setEducationU]=useState<string>(education)
const[drinkingU,setDrinkingU]=useState<string>(drinking)
const[smokingU,setSmokingU]=useState<string>(smoking)
const[petsU,setPetsU]=useState<string>(pets)
const[professionU,setProfessionU]=useState<string>(profession)
const[languageU,setLanguageU]=useState<string>(language)
const[heightU,setHeightU]=useState<string>(height)
const[chronoTypeU,setChronoTypeU]=useState<string>(chronoType)
const[planningStyleU,setPlanningStyleU]=useState<string>(planningStyle)
const[socialEnergyU,setSocialEnergyU]=useState<string>(socialEnergy)



const dispatch=useDispatch()

    //user id
    const userId = useAppSelector((state)=>state.userSlice.id);

    //update user details hook
    const [updateUserDetails] = useUpdateUserDetailsMutation()
    
    const [charLength_one,setCharLength_one] = useState<number>(0)
    const [charLength_two,setCharLength_two] = useState<number>(0)
    const [image,setImgae] = useState<string>(profileImage);
    const [isEditProfile,setIsEditProfile]=useState<boolean>(false)
    const[imageError,setImageError] = useState<string>('');

    //translation hook
    const {t} = useTranslation();

    //function for textarea inout change
        const handleTextInputAboutMe=(e:ChangeEvent<HTMLTextAreaElement>)=>{
            e.preventDefault();
            const text = e.target.value;
            const textLength = text.length
            setCharLength_one(()=>textLength)     
        }

    //function for textarea inout change
           const handleTextInputAboutThem=(e:ChangeEvent<HTMLTextAreaElement>)=>{
            e.preventDefault();
            const text = e.target.value;
            const textLength = text.length
            setCharLength_two(()=>textLength)     
        }
    
        //handle form

        const handleFormSubmit =async (e:ChangeEvent<HTMLFormElement>)=>{
            e.preventDefault();
                         // 1. Create a clean, empty FormData container
    const dataToSend = new FormData();
    
    
    // 2. Safely grab your form elements from the HTML page
    const formElement = e.target;
    
   // const firstNameInput = formElement.elements.namedItem("firstName") as HTMLInputElement;
   // const lastNameInput = formElement.elements.namedItem("lastName") as HTMLInputElement;
    //const dobInput = formElement.elements.namedItem("date_of_birth") as HTMLInputElement;
    const imageInput = formElement.elements.namedItem("image") as HTMLInputElement;
    const cityInput = formElement.elements.namedItem("city") as HTMLInputElement;
    const countryInput = formElement.elements.namedItem("country") as HTMLInputElement;
    const aboutInput = formElement.elements.namedItem("aboutMe") as HTMLInputElement;
    const aboutThemInput = formElement.elements.namedItem("aboutThem") as HTMLInputElement;
    const lookingForInput = formElement.elements.namedItem("lookingFor") as HTMLInputElement;
    const  preferenceInInput = formElement.elements.namedItem("preference") as HTMLInputElement;
    const  languageInput = formElement.elements.namedItem("language") as HTMLInputElement;
    const  educationInput = formElement.elements.namedItem("education") as HTMLInputElement;
    const  professionInput = formElement.elements.namedItem("profession") as HTMLInputElement;
    const  drinkingInput = formElement.elements.namedItem("drinking") as HTMLInputElement;
    const  smokingInput = formElement.elements.namedItem("smoking") as HTMLInputElement;
    const  petsInput = formElement.elements.namedItem("pets") as HTMLInputElement;
    const  genderInput = formElement.elements.namedItem("gender") as HTMLInputElement;
    const  heightInput = formElement.elements.namedItem("height") as HTMLInputElement;
    const  chronoTypeInput = formElement.elements.namedItem("chronoType") as HTMLInputElement;
    const  socialEnergyInput = formElement.elements.namedItem("socialEnergy") as HTMLInputElement;
    const  planningStyleInput = formElement.elements.namedItem("planningStyle") as HTMLInputElement;


   
    // 3. Append text values straight to the container
    //dataToSend.append("firstName", firstNameInput?.value || "");
    //dataToSend.append("lastName", lastNameInput?.value || "");
    //dataToSend.append("date_of_birth", dobInput?.value || "");
    dataToSend.append('userId',userId.toString() ||'');
    dataToSend.append("city", cityInput?.value || "");
    dataToSend.append("country", countryInput?.value || "");
    dataToSend.append("aboutMe", aboutInput?.value || "");
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
                    if(imageInput.files[0].size>maxAllowedSize){
                        setImageError("This image/video is too large! Maximum allowed size is 30MB.");
                        return;
                    }
                dataToSend.append("media", imageInput.files[0]); // Gets the raw file blob
                 
            }

          // console.log(Object.fromEntries(dataToSend));
           
           
            
            try{
                  const response = await updateUserDetails(dataToSend);
      
                  if(response.data){
                    setGenderU(()=>genderInput.value)
                    setLanguageU(()=>languageInput.value)
                    setCountryU(()=>countryInput.value)
                    setCityU(()=>cityInput.value)
                    setAboutMeU(()=>aboutInput.value)
                    setAboutThemU(()=>aboutThemInput.value)
                    setDrinkingU(()=>drinkingInput.value)
                    setPetsU(()=>petsInput.value)
                    setLookingForU(()=>lookingForInput.value)
                    setPreferenceU(()=>preferenceInInput.value)
                    setSmokingU(()=>smokingInput.value)
                    setProfessionU(()=>professionInput.value);
                    setEducationU(()=>educationInput.value)
                    setHeightU(()=>heightInput.value)
                    setChronoTypeU(()=>chronoTypeInput.value)
                    setSocialEnergyU(()=>socialEnergyInput.value)
                    setPlanningStyleU(()=>planningStyleInput.value)

                    setIsEditProfile(()=>false)
                    dispatch(updateProfileImage(image))
                  }
                  
                                  
            }catch{

            }
     
            
        }

        




        const handleFileChange=(e:ChangeEvent<HTMLInputElement>)=>{
                          e.preventDefault();
               if(e.target.files){
                 const text = e.target.files[0];
                 const file = URL.createObjectURL(text);
                setImgae(()=>file)
                  dispatch(updateProfileImage(file))
               
               } else{
                setImgae(()=>profileImage)
               }    
        }

            const handleEditProfileButton =()=>{
                setIsEditProfile(()=>!isEditProfile)
            }
            
        
            

            if(data){


                return <section className="settings">
                 
                        <div className="settings_center">
                            <div className="pageHeader">
                                <h1>{t('ProfilePage.title')}</h1>
                                <div className="edit-btn">
                                    <button onClick={()=>handleEditProfileButton()}>{isEditProfile?t('ProfilePage.cancel_btn'):t('ProfilePage.edit_btn')}</button>
                                </div>
                            </div>
                               {/** IMAGE SIZE ERROR */}
                                   {imageError &&  <p className="image_error" style={{color:'red'}}>{imageError}</p>}
                        <form className="settings_container" onSubmit={handleFormSubmit}>
                            
                            <div className="pic_container">
                                <div className="img">
                                    
                                       <img src={image?image:defaultPic||'https://unsplash.com'} alt={firstName}/>
                                    
                                    <div className="svg_container">
                                        <RiCameraAiFill/>
                                    </div>
                               
                                </div>
                                <div className="data">
                                    <h2>{firstName+" "+lastName}</h2>
                                    <div className="location">
                                        <FiMapPin/>
                                        <p>{t(`Cities.${sanitizeBackendKey(city)}`)}<LuDot/>{country}</p>
                                    </div>
                                </div>
                                <div className="file_upload" >
                                    <input type="file" name="new_image" id="image" className="new_file" onChange={handleFileChange} accept="image/jpeg,image/png,image/webp"/>
                                    <div className="change_foto" style={{display:isEditProfile?'flex':'none'}}>
                                        <FiCamera/>
                                        <span>{t('ProfilePage.change_image_btn')}</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="basic_container">
                                <div className="basic_header">
                                    <h2>{t('ProfilePage.sections.basic_information.title')}</h2>
                                </div>
                                <div className="basic_data">
                                    <div className="input_group">
                                            <label htmlFor="firstName">{t('ProfilePage.sections.basic_information.fields.first_name')}</label>
                                            <div>
                                                {
                                                    isEditProfile?<input
                                                type="text"
                                                placeholder={firstName} name="firstName" readOnly
                                                />:<p>{firstName}</p>
                                                }
                                            </div>
                                    </div>
                                    <div className="input_group">
                                            <label htmlFor="lastName">{t('ProfilePage.sections.basic_information.fields.last_name')}</label>
                                            <div>
                                                {
                                                    isEditProfile?<input
                                                type="text"
                                                placeholder={lastName} name="lastName" readOnly
                                                />:<p>{lastName}</p>
                                                }
                                            </div>
                                    </div>
                                    <div className="input_group">
                                            <label htmlFor="date_of_birth">{t('ProfilePage.sections.basic_information.fields.date_of_birth')}</label>
                                            <div>
                                                    {
                                                        isEditProfile?<p>{new Date(date_of_birth).toLocaleDateString()}</p>:<p>{new Date(date_of_birth).toLocaleDateString()}</p>
                                                    }
                                            </div>
                                    </div>
                                       <div className="input_group">
                                            <label htmlFor="username">{t('ProfilePage.sections.basic_information.fields.email')}</label>
                                            <div>
                                                    {
                                                        isEditProfile?<input defaultValue={username}
                                                type="text"
                                                name="username" disabled
                                                />:<p>{username}</p>
                                                    }
                                            </div>
                                    </div>
                                    <div className="input_group">
                                        <label htmlFor="gender">{t('ProfilePage.sections.basic_information.fields.gender')}</label>
                                            {
                                                isEditProfile? <select name="gender" defaultValue={t(`Options.Gender.${genderU.toUpperCase()}`)}>
                                                <option value="Male">{t('Options.Gender.MALE')}</option>
                                                <option value="Female">{t('Options.Gender.FEMALE')}</option>
                                                <option value="Non-binary">{t('Options.Gender.NON_BINARY')}</option>
                                                </select>:<p>{t(`Options.Gender.${genderU.toUpperCase()}`)}</p>
                                            }
                                        </div>
                                        <div className="input_group">
                                        <label htmlFor="city">{t('ProfilePage.sections.basic_information.fields.city')}</label>
                                                {
                                                    isEditProfile? <select name="city" defaultValue={t(`Cities.${sanitizeBackendKey(cityU)}`)}>
                                                {
                                                    POLISH_CITIES.sort((a,b)=>{
                                                        const keyA = sanitizeBackendKey(a);
                                                        const keyB = sanitizeBackendKey(b);
                                                        return t(`Cities.${keyA}`).localeCompare(t(`Cities.${keyB}`))
                                                    }).map((city)=>{
                                                        return <option value={city} key={city}>{t(`Cities.${sanitizeBackendKey(city)}`)}</option>
                                                    })
                                                }
                                                </select>:<p>{t(`Cities.${sanitizeBackendKey(cityU)}`)}</p>
                                                }
                                        </div>
                                        <div className="input_group">
                                        <label htmlFor="country">{t('ProfilePage.sections.basic_information.fields.country')}</label>
                                            {
                                                isEditProfile? <select name="country" defaultValue={countryU}>
                                                {
                                                    countries.map((country)=>{
                                                        return <option value={country} key={country}>{country}</option>
                                                    })
                                                }
                                                </select>:<p>{countryU}</p>
                                            }
                                        </div>
                                                 <div className="input_group">
                                            <label htmlFor="height">{t('ProfilePage.sections.basic_information.fields.height')}</label>
                                            <div>
                                                {
                                                    isEditProfile?<input
                                                type="text"
                                                placeholder={heightU} name="height"
                                                />:<p>{heightU}</p>
                                                }
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div className="aboutMe_container">
                                <div className="about_header">
                                    <h2>{t('ProfilePage.sections.about_me.title')}</h2>
                                </div>
                                <div className="bio_title">
                                    <p>{t('ProfilePage.sections.about_me.fields.bio_label')}</p>
                                </div>
                                {
                                    isEditProfile?<textarea name="aboutMe" onChange={handleTextInputAboutMe} maxLength={250} defaultValue={aboutMeU||''}></textarea>:<p>{aboutMeU||''}</p>
                                }
                                <div className="text_counter">
                                    <p>{charLength_one}/ 250</p>
                                </div>
                            </div>
                            <div className="aboutMe_container">
                                <div className="about_header">
                                    <h2>{t('ProfilePage.sections.what_im_looking_for.title')}</h2>
                                </div>
                                <div className="bio_title">
                                    <p>{t('ProfilePage.sections.what_im_looking_for.fields.ideal_preference')}</p>
                                </div>
                                {
                                    isEditProfile?<textarea name="aboutThem" onChange={handleTextInputAboutThem} maxLength={250}  defaultValue={aboutThemU}></textarea>:<p>{aboutThemU}</p>
                                }
                                <div className="text_counter">
                                    <p>{charLength_two}/ 250</p>
                                </div>
                            </div>
                                  <div className="preference_container">
                                <div className="pref_header">
                                    <h2>{t('ProfilePage.sections.looking_for_meta.title')}</h2>
                                </div>
                                <div className="preferences">
                                        <div className="input_group">
                                        <label htmlFor="lookingFor">{t('ProfilePage.sections.looking_for_meta.fields.looking_for_label')}</label>
                                                {
                                                    isEditProfile?<select name="lookingFor" defaultValue={lookingForU}>
                                                <option value="Long-term Relationship">{t('Options.LookingFor.LONG_TERM_RELATIONSHIP')}</option>
                                                <option value="Not decided">{t('Options.LookingFor.NOT_DECIDED')}</option>
                                                <option value="Short-term relationship">{t('Options.LookingFor.SHORT_TERM_RELATIONSHIP')}</option>
                                                </select>:<p>{t(`Options.LookingFor.${sanitizeBackendKey(lookingForU)}`)}</p>
                                                }
                                        </div>
                                        <div className="input_group">
                                        <label htmlFor="preference">{t('ProfilePage.sections.looking_for_meta.fields.interested_in_label')}</label>
                                                {
                                                    isEditProfile?<select name="preference" defaultValue={t(`Options.Preference.${sanitizeBackendKey(preferenceU)}`)}>
                                                <option value="Female">{t('Options.Preference.FEMALE')}</option>
                                                <option value="Male">{t('Options.Preference.MALE')}</option>
                                                <option value="Non-binary">{t('Options.Preference.NON_BINARY')}</option>
                                                </select>:<p>{t(`Options.Preference.${sanitizeBackendKey(preferenceU)}`)}</p>
                                                }
                                        </div>
                                </div>
                            </div>
                            <div className="lifestyle_container">
                                <div className="lifestyle_header">
                                    <h2>{t('ProfilePage.sections.lifestyle.title')}</h2>
                                </div>
                                <div className="lifestyles">
                                        <div className="life_group">
                                            <MdOutlineLanguage/>
                                            <div className="input_container">
                                                <label htmlFor="language">{t('ProfilePage.sections.lifestyle.fields.language')}</label>
                                                {
                                                    isEditProfile?<select name="language" defaultValue={t(`Options.language.${sanitizeKey(languageU)}`)}>
                                                <option value="English">{t(`Options.language.ENGLISH`)}</option>
                                                <option value="Polish">{t(`Options.language.POLISH`)}</option>
                                                <option value="French">{t(`Options.language.FRENCH`)}</option>
                                                <option value="Other">{t(`Options.language.OTHER`)}</option>
                                                </select>:<p>{languageU===null?t(`Options.language.OTHER`):t(`Options.language.${sanitizeKey(languageU)}`)}</p>
                                                }
                                            </div>
                                                
                                        </div>
                                        <div className="life_group">
                                            <IoSchool/>
                                                <div className="input_container">
                                                    <label htmlFor="education">{t('ProfilePage.sections.lifestyle.fields.education')}</label>
                                                {
                                                    isEditProfile?<select name="education" defaultValue={t(`Options.education.${sanitizeBackendKey(educationU)}`)}>
                                                <option value="Master's degree">{t(`Options.education.MASTERS_DEGREE`)}</option>
                                                <option value="Bachelor's degree">{t(`Options.education.BACHELORS_DEGREE`)}</option>
                                                <option value="PDH">{t(`Options.education.PHD`)}</option>
                                                <option value="High School">{t(`Options.education.HIGH_SCHOOL`)}</option>
                                                </select>   :<p>{educationU===null?t(`Options.education.HIGH_SCHOOL`):t(`Options.education.${sanitizeBackendKey(educationU)}`)}</p>
                                                }
                                                    
                                                </div>
                                                
                                        </div>
                                        <div className="life_group">
                                                <FiBriefcase/>
                                        <div className="input_container">
                                            <label htmlFor="profession">{t('ProfilePage.sections.lifestyle.fields.profession')}</label>
                                            {
                                                isEditProfile? <select name="profession" defaultValue={t(`Professions.${sanitizeBackendKey(professionU)}`)}>
                                                {
                                                    professions.sort((a,b)=>{
                                                        if(a==="OTHER") return 1;
                                                        if(b==="OTHER") return -1;

                                                        const keyA = sanitizeBackendKey(a);
                                                        const keyB = sanitizeBackendKey(b);
                                                        
                                                        return t(`Professions.${keyA}`).localeCompare(t(`Professions.${keyB}`))
                                                    }).map((prof)=>{
                                                        return <option value={prof} key={prof}>{t(`Professions.${sanitizeBackendKey(prof)}`)}</option>
                                                    })
                                                }
                                                </select>:<p>{profession===null?t(`Professions.OTHER`):t(`Professions.${sanitizeBackendKey(profession)}`)}</p>
                                            }
                                        </div>
                                        </div>
                                        <div className="life_group">
                                            <PiBeerBottle/>
                                        <div className="input_container">
                                            <label htmlFor="drinking">{t('ProfilePage.sections.lifestyle.fields.drinks')}</label>
                                            {
                                                isEditProfile? <select name="drinking" defaultValue={t(`Options.drinks.${sanitizeBackendKey(drinkingU)}`)}>
                                                <option value="Yes">{t('Options.drinks.YES')}</option>
                                                <option value="Occasional">{t('Options.drinks.OCCASIONAL')}</option>
                                                <option value="No">{t('Options.drinks.NO')}</option>
                                                <option value="Don't drink">{t('Options.drinks.DONT_DRINK')}</option>
                                                </select>:<p>{drinkingU===null?t(`Options.drinks.NO`):t(`Options.drinks.${sanitizeBackendKey(drinkingU)}`)}</p>
                                            }
                                        </div>
                                        </div>
                                        <div className="life_group">
                                        <PiCigarette/>
                                        <div className="input_container">
                                            <label htmlFor="smoking" >{t('ProfilePage.sections.lifestyle.fields.smoking')}</label>
                                            {
                                                isEditProfile? <select name="smoking"  defaultValue={`Options.drinks.${sanitizeBackendKey(smokingU)}`}>
                                             <option value="No">{t(`Options.Questions.NO`)}</option>
                                                <option value="Yes">{t(`Options.Questions.YES`)}</option>
                                                <option value="Indifferent">{t(`Options.Questions.INDIFFERENT`)}</option>
                                                <option value="Love to">{t(`Options.Questions.LOVE_TO`)}</option>
                                                </select>:<p>{smokingU===null?t(`Options.Questions.NO`):t(`Options.Questions.${sanitizeBackendKey(smokingU)}`)}</p>
                                            }
                                        </div>
                                        </div>
                                        <div className="life_group">
                                            <MdPets/>
                                        <div className="input_container">
                                            <label htmlFor="pets" >{t('ProfilePage.sections.lifestyle.fields.pets')}</label>
                                                {
                                                    isEditProfile?<select name="pets" defaultValue={petsU}>
                                               <option value="No">{t(`Options.Questions.NO`)}</option>
                                                <option value="Yes">{t(`Options.Questions.YES`)}</option>
                                                <option value="Indifferent">{t(`Options.Questions.INDIFFERENT`)}</option>
                                                <option value="Love to">{t(`Options.Questions.LOVE_TO`)}</option>
                                                </select>:<p>{petsU===null?t(`Options.Questions.NO`):t(`Options.Questions.${sanitizeBackendKey(petsU)}`)}</p>
                                                }
                                        </div>
                                        </div>
                                           <div className="life_group">
                                            <GiTimeSynchronization/>
                                        <div className="input_container">
                                            <label htmlFor="pets" >{t('ProfilePage.sections.lifestyle.fields.chronoType')}</label>
                                                {
                                                    isEditProfile?<select name="chronoType" defaultValue={chronoTypeU}>
                                               <option value="Early bird">{t(`Options.chronoType.EARLY_BIRD`)}</option>
                                                <option value="Night owl">{t(`Options.chronoType.NIGHT_OWL`)}</option>
                                                <option value="Flexible">{t(`Options.chronoType.FLEXIBLE`)}</option>
                                                </select>:<p>{chronoTypeU===null?t(`Options.chronoType.FLEXIBLE`):t(`Options.chronoType.${sanitizeBackendKey(chronoTypeU)}`)}</p>
                                                }
                                        </div>
                                        </div>
                                           <div className="life_group">
                                            <FiActivity/>
                                        <div className="input_container">
                                            <label htmlFor="pets" >{t('ProfilePage.sections.lifestyle.fields.socialEnergy')}</label>
                                                {
                                                    isEditProfile?<select name="socialEnergy" defaultValue={socialEnergyU}>
                                               <option value="Introvert">{t(`Options.socialEnergy.INTROVERT`)}</option>
                                                <option value="Extrovert">{t(`Options.socialEnergy.EXTROVERT`)}</option>
                                                <option value="Balanced">{t(`Options.socialEnergy.BALANCED`)}</option>
                                                </select>:<p>{socialEnergyU===null?t(`Options.socialEnergy.BALANCED`):t(`Options.socialEnergy.${sanitizeBackendKey(socialEnergyU)}`)}</p>
                                                }
                                        </div>
                                        </div>
                                             <div className="life_group">
                                            <FcPlanner/>
                                        <div className="input_container">
                                            <label htmlFor="pets" >{t('ProfilePage.sections.lifestyle.fields.planningStyle')}</label>
                                                {
                                                    isEditProfile?<select name="planningStyle" defaultValue={planningStyleU}>
                                               <option value="Spontaneous">{t(`Options.planningStyle.SPONTANEOUS`)}</option>
                                                <option value="Structured planner">{t(`Options.planningStyle.STRUCTURED_PLANNER`)}</option>
                                                <option value="Balanced">{t(`Options.planningStyle.BALANCED`)}</option>
                                                </select>:<p>{planningStyleU===null?t(`Options.planningStyle.BALANCED`):t(`Options.planningStyle.${sanitizeBackendKey(planningStyleU)}`)}</p>
                                                }
                                        </div>
                                        </div>
                                </div>
                            </div>

                            <div className="btns">
                                <button className="cancel-btn" style={{display:'none'}}><span>Cancel</span></button>
                                <button className="update-btn" style={{display:isEditProfile?'flex':'none'}}><span>{t('ProfilePage.update_btn')}</span></button>
                            </div>
                        </form>
                        </div>
                        </section>
            }
            return  <Loading/>

  
};

export default Profile