import { useEffect, useState } from 'react';
import { BsFillHeartFill } from 'react-icons/bs';
import { CgGym } from 'react-icons/cg';
import { FiBriefcase, FiCalendar, FiHeart, FiMapPin } from 'react-icons/fi';
import { GoPerson } from 'react-icons/go';
import { HiLanguage } from 'react-icons/hi2';
import { MdPets } from 'react-icons/md';
import { PiBeerBottle, PiCigarette, PiPerson, PiRuler } from 'react-icons/pi';
import { TbSchool } from 'react-icons/tb';
import { useLazyGetUserViewProfileQuery } from '../features/api/userApi';
import type { TUserData } from '../types/TUserData';
import type { TUserPost } from '../types/TUserPost';
import { getAgeFromDateOfBirth } from '../util/util';
import './../css/ViewProfile.css';
import { RecentActivities } from './index';



const Profile = ({userId,requestorUserId}:{userId:number,requestorUserId:number})=>{
   const [data,setData] = useState<TUserData>()


    const [getUserData] = useLazyGetUserViewProfileQuery()

    const getUserDataQuery=async()=>{
         const response=  await getUserData({userId,requestorUserId})
         setData(()=>response.data?.data as TUserData)
    }

    console.log(data);
    

    
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
                        <p>{city},Poland</p>
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
                            <h2>{`${height}cm`}</h2>
                            <p>Height</p>
                        </div>
                        </div>
                        <div className='attribute_container'>
                           <div className='svg'>
                             <FiBriefcase/>
                           </div>
                        <div className='attribute'>
                            <h2>{profession}</h2>
                            <p>Profession</p>
                        </div>
                        </div>
                         <div className='attribute_container'>
                           <div className='svg'>
                             <PiPerson/>
                           </div>
                        <div className='attribute'>
                            <h2>{gender}</h2>
                            <p>Gender</p>
                        </div>
                        </div>
                          <div className='attribute_container'>
                           <div className='svg'>
                             <FiCalendar/>
                           </div>
                        <div className='attribute'>
                            <h2>{getAgeFromDateOfBirth(date_of_birth)}</h2>
                            <p>Age</p>
                        </div>
                        </div>
                          <div className='attribute_container'>
                           <div className='svg'>
                             <GoPerson/>
                           </div>
                        <div className='attribute'>
                            <h2>{preference}</h2>
                            <p>Preference</p>
                        </div>
                        </div>
                        <div className='attribute_container'>
                           <div className='svg'>
                             <FiMapPin/>
                           </div>
                        <div className='attribute'>
                            <h2>{`${city}, ${country}`}</h2>
                            <p>From</p>
                        </div>
                        </div>
                        
                         <div className='attribute_container'>
                           <div className='svg'>
                             <HiLanguage/>
                           </div>
                        <div className='attribute'>
                            <h2>{language}</h2>
                            <p>Speaks</p>
                        </div>
                        </div>
                    </div>
                </div>
                <div className='about_container'>
                    <div className='about'>
                        <div className='about_me'>
                            <h4>About me</h4>
                             <p>{aboutMe}</p>
                        </div>
                        <div className='basic_container'>
                            <h4>Basics</h4>
                          <div className='basic_info'>
                              <div className='attribute_container'>
                                <div className='svg'>
                                    <FiHeart/>
                                </div>
                                <div className='attribute'>
                                    <h2>Relationship</h2>
                                    <p>{lookingFor}</p>
                                </div>
                            </div>
                             <div className='attribute_container'>
                                <div className='svg'>
                                    <TbSchool/>
                                </div>
                                <div className='attribute'>
                                    <h2>Education</h2>
                                    <p>{education}</p>
                                </div>
                            </div>
                             <div className='attribute_container'>
                                <div className='svg'>
                                    <PiBeerBottle/>
                                </div>
                                <div className='attribute'>
                                    <h2>Drinks</h2>
                                    <p>{drinking}</p>
                                </div>
                            </div>
                            <div className='attribute_container'>
                                <div className='svg'>
                                    <PiCigarette/>
                                </div>
                                <div className='attribute'>
                                    <h2>Smokes</h2>
                                    <p>{smoking}</p>
                                </div>
                            </div>
                             <div className='attribute_container'>
                                <div className='svg'>
                                    <MdPets/>
                                </div>
                                <div className='attribute'>
                                    <h2>Pets</h2>
                                    <p>{pets}</p>
                                </div>
                            </div>
                             <div className='attribute_container'>
                                <div className='svg'>
                                    <CgGym/>
                                </div>
                                <div className='attribute'>
                                    <h2>Exercise</h2>
                                    <p>Regularly</p>
                                </div>
                            </div>
                          </div>
                        </div>
                    </div>
     
                </div>
                    </div>
                <div className='main_right' >
                  {/**
                   * 
                   * <div className='interests_container'>
                 
                     <div className='interests'>
                           <h2>Interests</h2>
                           {
                            data?.activities?.map((item)=>{
                                return <span key={item}>{item}</span>
                            })
                           }
                       
                      </div>
                  </div>
                   */}
                  
                  <div className='expect_container'>
                    <div className='expect'>
                        <h2>what i'm looking for</h2>
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