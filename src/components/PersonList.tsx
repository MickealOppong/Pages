import { Person } from ".";
import def from './../assets/profile.jpeg';
import './../css/PersonList.css';
export interface UserProfileItem {
  userId: number;
  image: string;
  firstName: string;
  date_of_birth: string;
  profession: string;
}

export const POSTS_MOCK_DATA: UserProfileItem[] = [
  {
    userId: 1,
    image: def, // Landscape Action View
    firstName: "Katarzyna",
    date_of_birth: "1998-04-12", // 28 years old
    profession: "UX/UI Designer"
  },
  {
    userId: 2,
    image: def, // HTML5 Mp4 Video Format
    firstName: "Mateusz",
    date_of_birth: "1995-09-25", // 30 years old
    profession: "Software Engineer"
  },
  {
    userId: 3,
    image: def, // Portrait Layout
    firstName: "Aneta",
    date_of_birth: "2003-11-05", // 22 years old
    profession: "Architect"
  },
  {
    userId: 4,
    image: def,
    firstName: "Jan",
    date_of_birth: "1989-02-17", // 37 years old
    profession: "Physiotherapist"
  },
  {
    userId: 5,
    image: def,
    firstName: "Aleksandra",
    date_of_birth: "1996-07-30", // 30 years old
    profession: "Graphic Designer"
  }
];

const PersonList = ()=>{
   
    return <div className="person-list">
        {
            POSTS_MOCK_DATA.map((person)=>{
                return  <Person {...person} key={person.userId}/>
            })
        }
    </div>
}
export default PersonList