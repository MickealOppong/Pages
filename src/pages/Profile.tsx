import { useState, type ChangeEvent } from "react";
import { FiBriefcase, FiCamera, FiMapPin } from "react-icons/fi";
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
import { countries, POLISH_CITIES, professions } from "../util/util";
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
                    country,city,preference,lookingFor,education,gender,height,pets,drinking,smoking,language,username} = data.data;

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



const dispatch=useDispatch()

    //user id
    const userId = useAppSelector((state)=>state.userSlice.id);

    //update user details hook
    const [updateUserDetails] = useUpdateUserDetailsMutation()
    
    const [charLength_one,setCharLength_one] = useState<number>(0)
    const [charLength_two,setCharLength_two] = useState<number>(0)
    const [image,setImgae] = useState<string>(profileImage);
    const [isEditProfile,setIsEditProfile]=useState<boolean>(false)


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
    

   
    
            // 4. CRITICAL: Grab the actual binary file blob from the file array
            if (imageInput && imageInput.files && imageInput.files[0]) {
                dataToSend.append("media", imageInput.files[0]); // Gets the raw file blob
                 
            }

           console.log(Object.fromEntries(dataToSend));
           
           
            
            try{
                  const response = await updateUserDetails(dataToSend);
                  console.log(response.data);


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
                                <h1>My profile</h1>
                                <div className="edit-btn">
                                    <button onClick={()=>handleEditProfileButton()}>{isEditProfile?'Cancel edit':'Edit profile'}</button>
                                </div>
                            </div>
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
                                        <p>{city}<LuDot/>{country}</p>
                                    </div>
                                </div>
                                <div className="file_upload" >
                                    <input type="file" name="new_image" id="image" className="new_file" onChange={handleFileChange}/>
                                    <div className="change_foto" style={{display:isEditProfile?'flex':'none'}}>
                                        <FiCamera/>
                                        <span>Change Photo</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="basic_container">
                                <div className="basic_header">
                                    <h2>Basic Information</h2>
                                </div>
                                <div className="basic_data">
                                    <div className="input_group">
                                            <label htmlFor="firstName">First Name</label>
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
                                            <label htmlFor="lastName">Last Name</label>
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
                                            <label htmlFor="date_of_birth">Date of Birth</label>
                                            <div>
                                                    {
                                                        isEditProfile?<p>{new Date(date_of_birth).toLocaleDateString()}</p>:<p>{new Date(date_of_birth).toLocaleDateString()}</p>
                                                    }
                                            </div>
                                    </div>
                                       <div className="input_group">
                                            <label htmlFor="username">Email</label>
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
                                        <label htmlFor="gender">Gender</label>
                                            {
                                                isEditProfile? <select name="gender" defaultValue={genderU}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Non-binary">Non-binary</option>
                                                </select>:<p>{genderU}</p>
                                            }
                                        </div>
                                        <div className="input_group">
                                        <label htmlFor="city">City</label>
                                                {
                                                    isEditProfile? <select name="city" defaultValue={cityU}>
                                                {
                                                    POLISH_CITIES.map((city)=>{
                                                        return <option value={city} key={city}>{city}</option>
                                                    })
                                                }
                                                </select>:<p>{cityU}</p>
                                                }
                                        </div>
                                        <div className="input_group">
                                        <label htmlFor="country">Country</label>
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
                                            <label htmlFor="height">{`Height(cm)`}</label>
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
                                    <h2>About me</h2>
                                </div>
                                <div className="bio_title">
                                    <p>Short bio</p>
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
                                    <h2>What i'm looking for</h2>
                                </div>
                                <div className="bio_title">
                                    <p>Ideal preference</p>
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
                                    <h2>Looking for</h2>
                                </div>
                                <div className="preferences">
                                        <div className="input_group">
                                        <label htmlFor="lookingFor">Looking For</label>
                                                {
                                                    isEditProfile?<select name="lookingFor" defaultValue={lookingForU}>
                                                <option value="Long-term Relationship">Long-term Relationship</option>
                                                <option value="Friendship">Friendship</option>
                                                <option value="Still not decided">Not sure</option>
                                                <option value="Short-term relationship">Short-term Relationship</option>
                                                </select>:<p>{lookingForU}</p>
                                                }
                                        </div>
                                        <div className="input_group">
                                        <label htmlFor="preference">Interested in</label>
                                                {
                                                    isEditProfile?<select name="preference" defaultValue={preferenceU}>
                                                <option value="Female">Women</option>
                                                <option value="Male">Men</option>
                                                <option value="Non-binary">Other</option>
                                                </select>:<p>{preferenceU}</p>
                                                }
                                        </div>
                                </div>
                            </div>
                            <div className="lifestyle_container">
                                <div className="lifestyle_header">
                                    <h2>Lifestyle</h2>
                                </div>
                                <div className="lifestyles">
                                        <div className="life_group">
                                            <MdOutlineLanguage/>
                                            <div className="input_container">
                                                <label htmlFor="language">Language</label>
                                                {
                                                    isEditProfile?<select name="language" defaultValue={languageU}>
                                                <option value="English">English</option>
                                                <option value="Polish">Polish</option>
                                                <option value="French">French</option>
                                                <option value="Other">other</option>
                                                </select>:<p>{languageU}</p>
                                                }
                                            </div>
                                                
                                        </div>
                                        <div className="life_group">
                                            <IoSchool/>
                                                <div className="input_container">
                                                    <label htmlFor="education">Education</label>
                                                {
                                                    isEditProfile?<select name="education" defaultValue={educationU}>
                                                <option value="Master's degree">Master's degree</option>
                                                <option value="Bachelor's degree">Bachelor's degree</option>
                                                <option value="PDH">PHD</option>
                                                <option value="High School">High School</option>
                                                </select>   :<p>{educationU}</p>
                                                }
                                                    
                                                </div>
                                                
                                        </div>
                                        <div className="life_group">
                                                <FiBriefcase/>
                                        <div className="input_container">
                                            <label htmlFor="profession">Profession</label>
                                            {
                                                isEditProfile? <select name="profession" defaultValue={professionU}>
                                                {
                                                    professions.map((prof)=>{
                                                        return <option value={prof} key={prof}>{prof}</option>
                                                    })
                                                }
                                                </select>:<p>{professionU}</p>
                                            }
                                        </div>
                                        </div>
                                        <div className="life_group">
                                            <PiBeerBottle/>
                                        <div className="input_container">
                                            <label htmlFor="drinking">Drinks</label>
                                            {
                                                isEditProfile? <select name="drinking" defaultValue={drinkingU}>
                                                <option value="Socially">Socially</option>
                                                <option value="Ocassionally">Ocassionally</option>
                                                <option value="=Frequent">Frequent</option>
                                                <option value="Don't drink">Don't drink</option>
                                                </select>:<p>{drinkingU}</p>
                                            }
                                        </div>
                                        </div>
                                        <div className="life_group">
                                        <PiCigarette/>
                                        <div className="input_container">
                                            <label htmlFor="smoking" >Smoking</label>
                                            {
                                                isEditProfile? <select name="smoking"  defaultValue={smokingU}>
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>
                                                <option value="Not sure">Not sure</option>
                                                </select>:<p>{smokingU}</p>
                                            }
                                        </div>
                                        </div>
                                        <div className="life_group">
                                            <MdPets/>
                                        <div className="input_container">
                                            <label htmlFor="pets" >Pets</label>
                                                {
                                                    isEditProfile?<select name="pets" defaultValue={petsU}>
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>
                                                <option value="Not sure">Not sure</option>
                                                </select>:<p>{petsU}</p>
                                                }
                                        </div>
                                        </div>
                                </div>
                            </div>

                            <div className="btns">
                                <button className="cancel-btn" style={{display:'none'}}><span>Cancel</span></button>
                                <button className="update-btn" style={{display:isEditProfile?'flex':'none'}}><span>Update</span></button>
                            </div>
                        </form>
                        </div>
                        </section>
            }
            return  <Loading/>

  
};

export default Profile