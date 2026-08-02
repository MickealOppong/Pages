import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillHeartFill } from 'react-icons/bs';
import { FiBriefcase, FiCalendar, FiHeart, FiMapPin } from 'react-icons/fi';
import { GoPerson } from 'react-icons/go';
import { HiLanguage } from 'react-icons/hi2';
import { MdPets } from 'react-icons/md';
import { PiBeerBottle, PiCigarette, PiPerson, PiRuler } from 'react-icons/pi';
import { TbSchool } from 'react-icons/tb';
import { useLazyGetUserViewProfileQuery } from '../features/api/userApi';
import type { TUserData } from '../types/TUserData';
import type { TUserPost } from '../types/TUserPost';
import { getAgeFromDateOfBirth, sanitizeBackendKey, sanitizeKey } from '../util/util';
import './../css/ViewProfile.css';
import { RecentActivities } from './index';



const Profile = ({userId,requestorUserId}:{userId:number,requestorUserId:number})=>{
   const [data,setData] = useState<TUserData>()


    const [getUserData] = useLazyGetUserViewProfileQuery()

    const getUserDataQuery=async()=>{
         const response=  await getUserData({userId,requestorUserId})
         setData(()=>response.data?.data as TUserData)
    }

    //translation hook
    const {t} = useTranslation()

    
   useEffect(()=>{
        getUserDataQuery()
   },[userId,requestorUserId])


    
    if(data){

                 const {aboutMe,aboutThem,firstName,lastName,profession,profileImage,date_of_birth,
                    country,city,preference,lookingFor,education,gender,height,pets,drinking,smoking,language} = data

                    return <section className='view-profile-page'>
            <section className='view-profile_container'>
                <div className='component-header'>
                    <h2>{`${firstName} ${lastName}'s profile`}</h2>
                </div>
                <div className='view-profile_header'>
                    <img src={profileImage} alt="" />
                 <div className='view-profile'>
                       <div className='profile_data'>
                        <p>{firstName + " "+lastName}</p>
                         <span>{getAgeFromDateOfBirth(date_of_birth)}</span>
                    </div>
                    <div className='location_status'>
                        <p>{city},{country}</p>
                    </div>
                 </div>
                <div className='request-btn' style={{display:'none'}}>
                     <button >Interested</button>
                </div>
                </div>
                  <section className='main'>
                    <div className='main_left'>
                    <div className='personal_info'>
                     <div className='data'>
                        <div className='attribute_container'>
                           <div className='svg'>
                             <PiRuler/>
                           </div>
                        <div className='attribute'>
                            <h2>{height||''}</h2>
                            <p>{t('ProfilePage.sections.basic_information.fields.height')}</p>
                        </div>
                        </div>
                        <div className='attribute_container'>
                           <div className='svg'>
                             <FiBriefcase/>
                           </div>
                        <div className='attribute'>
                            <h2>{t(`Professions.${sanitizeBackendKey(profession)}`)}</h2>
                            <p>{t('ProfilePage.sections.basic_information.fields.profession')}</p>
                        </div>
                        </div>
                         <div className='attribute_container'>
                           <div className='svg'>
                             <PiPerson/>
                           </div>
                        <div className='attribute'>
                            <h2>{t(`Options.Gender.${sanitizeKey(gender)}`)}</h2>
                            <p>{t('ProfilePage.sections.basic_information.fields.gender')}</p>
                        </div>
                        </div>
                          <div className='attribute_container'>
                           <div className='svg'>
                             <FiCalendar/>
                           </div>
                        <div className='attribute'>
                            <h2>{getAgeFromDateOfBirth(date_of_birth)}</h2>
                            <p>{t('ProfilePage.sections.basic_information.fields.age')}</p>
                        </div>
                        </div>
                          <div className='attribute_container'>
                           <div className='svg'>
                             <GoPerson/>
                           </div>
                        <div className='attribute'>
                            <h2>{t(`Options.Preference.${sanitizeBackendKey(preference)}`)}</h2>
                            <p>{t('ProfilePage.sections.basic_information.fields.preference')}</p>
                        </div>
                        </div>
                        <div className='attribute_container'>
                           <div className='svg'>
                             <FiMapPin/>
                           </div>
                        <div className='attribute'>
                            <h2>{t(`Cities.${sanitizeBackendKey(city)}`)}</h2>
                            <p>{t('ProfilePage.sections.basic_information.fields.from')}</p>
                        </div>
                        </div>
                        
                         <div className='attribute_container'>
                           <div className='svg'>
                             <HiLanguage/>
                           </div>
                        <div className='attribute'>
                            <h2>{t(`Options.language.${sanitizeKey(language)}`)}</h2>
                            <p>{t('ProfilePage.sections.basic_information.fields.speaks')}</p>
                        </div>
                        </div>
                    </div>
                </div>
                <div className='about_container'>
                    <div className='about'>
                        <div className='about_me'>
                            <h4>{t('ProfilePage.sections.about_me.title')}</h4>
                             <p>{aboutMe}</p>
                        </div>
                        <div className='basic_container'>
                            <h4>{t('ProfilePage.sections.about_me.title')}</h4>
                          <div className='basic_info'>
                              <div className='attribute_container'>
                                <div className='svg'>
                                    <FiHeart/>
                                </div>
                                <div className='attribute'>
                                    <h2>{t('ProfilePage.sections.about_me.fields.relationship')}</h2>
                                    <p>{t(`Options.LookingFor.${sanitizeBackendKey(lookingFor)}`)}</p>
                                </div>
                            </div>
                             <div className='attribute_container'>
                                <div className='svg'>
                                    <TbSchool/>
                                </div>
                                <div className='attribute'>
                                    <h2>{t('ProfilePage.sections.about_me.fields.education')}</h2>
                                    <p>{t(`Options.education.${sanitizeKey(education)}`)}</p>
                                </div>
                            </div>
                             <div className='attribute_container'>
                                <div className='svg'>
                                    <PiBeerBottle/>
                                </div>
                                <div className='attribute'>
                                    <h2>{t('ProfilePage.sections.about_me.fields.drinks')}</h2>
                                    <p>{t(`Options.drinks.${sanitizeKey(drinking)}`)}</p>
                                </div>
                            </div>
                            <div className='attribute_container'>
                                <div className='svg'>
                                    <PiCigarette/>
                                </div>
                                <div className='attribute'>
                                    <h2>{t('ProfilePage.sections.about_me.fields.smokes')}</h2>
                                    <p>{t(`Options.Questions.${smoking}`)}</p>
                                </div>
                            </div>
                             <div className='attribute_container'>
                                <div className='svg'>
                                    <MdPets/>
                                </div>
                                <div className='attribute'>
                                    <h2>{t('ProfilePage.sections.about_me.fields.pets')}</h2>
                                    <p>{t(`Options.Questions.${pets}`)}</p>
                                </div>
                            </div>
                          </div>
                        </div>
                    </div>
     
                </div>
                    </div>
                <div className='main_right' >            
                  <div className='expect_container'>
                    <div className='expect'>
                        <h2>{t('ProfilePage.sections.what_im_looking_for.title')}</h2>
                        <p>{aboutThem}</p>
                        <div className='heart'>
                            <BsFillHeartFill/>
                        </div>
                    </div>
                  </div>
                </div>
            </section>
                <div className='activity_container'>
                    <div>
                        <RecentActivities activities={data.postDtoList as TUserPost[]}/>
                    </div>

                </div>
            </section>
          
        </section>
    }
    /*
    return <Loading/>
    */
}
export default Profile