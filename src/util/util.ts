import {
  FaBicycle,
  FaBook,
  FaCamera,
  FaDog,
  FaGamepad,
  FaHandsHelping,
  FaHeart,
  FaHiking,
  FaMusic,
  FaPaintBrush,
  FaPlane,
  FaRunning,
  FaSwimmer,
  FaTree,
  FaUtensils,
} from "react-icons/fa";
import {
  FiBook,
  FiBriefcase,
  FiCamera,
  FiCoffee,
  FiCompass,
  FiHeart,
  FiHome,
  FiMap,
  FiMusic,
  FiShoppingBag,
  FiSun,
  FiUsers,
} from "react-icons/fi";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const storeToLocalStorage=(name:string,data:string)=>{
    localStorage.setItem(name,data)
}

export const fromLocalStorage=(name:string)=>{
   return localStorage.getItem(name);
}


export const removeFromLocalStorage=(name:string)=>{
    localStorage.removeItem(name);
}


  export const POLISH_CITIES = [
    "Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", 
    "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Białystok", 
    "Katowice", "Gdynia", "Częstochowa", "Radom", "Rzeszów", 
    "Toruń", "Sosnowiec", "Kielce", "Gliwice", "Olsztyn", 
    "Zabrze", "Bielsko-Biała", "Bytom", "Zielona Góra", "Rybnik", 
    "Ruda Śląska", "Opole", "Tychy", "Gorzów Wielkopolski", "Elbląg"
  ];

  
export const getDaysFromNow=(inputDate:Date|string)=>{
    const past = new Date(inputDate).getTime();
  const now = Date.now();
    
  const diffInMs = now - past;

  
  
  // Math.abs handles both past and future dates
  const diff = Math.abs(diffInMs); 
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
    
    if(minutes <1){
        
         return "now" ;
    }

    if(minutes <60){
        
         return minutes=== 1 ? "a m ago" : `${minutes} m ago`;
    }

     if(hours <24){
         return hours === 1 ? "hr ago" : `${hours} hr ago`;
    }
      if(days <31){
         return days === 1 ? "1d ago" : `${days} d ago`;
    }

     return years === 1 ? "1 yr ago" : `${years} yr ago`;
     
}


export const getAgeFromDateOfBirth =(date:string)=>{
  
  const today = new Date();
  const birthDate = new Date(date);

  let age = today.getFullYear() - birthDate.getFullYear();
  
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Reduce age by 1 if the birthday has not occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}



export const ACTIVITY_ICONS = [
  {
    value: "photography",
    label: "Photography",
    icon: FaCamera,
  },
  {
    value: "hiking",
    label: "Hiking",
    icon: FaHiking,
  },
  {
    value: "cycling",
    label: "Cycling",
    icon: FaBicycle,
  },
  {
    value: "running",
    label: "Running",
    icon: FaRunning,
  },
  {
    value: "swimming",
    label: "Swimming",
    icon: FaSwimmer,
  },
  {
    value: "music",
    label: "Music",
    icon: FaMusic,
  },
  {
    value: "reading",
    label: "Reading",
    icon: FaBook,
  },
  {
    value: "pets",
    label: "Pets",
    icon: FaDog,
  },
  {
    value: "food",
    label: "Food",
    icon: FaUtensils,
  },
  {
    value: "travel",
    label: "Travel",
    icon: FaPlane,
  },
  {
    value: "gaming",
    label: "Gaming",
    icon: FaGamepad,
  },
  {
    value: "dating",
    label: "Dating",
    icon: FaHeart,
  },
  {
    value: "art",
    label: "Art",
    icon: FaPaintBrush,
  },
  {
    value: "camping",
    label: "Camping",
    icon: FaTree,
  },
  {
    value: "volunteering",
    label: "Volunteering",
    icon: FaHandsHelping,
  },
];



export const MOMENT_OPTIONS = [
  { label: "Having coffee", icon: FiCoffee },
  { label: "Walking my dog", icon: FiHeart },
  { label: "Working out at the gym", icon: FiHeart },
  { label: "Cooking dinner", icon: FiHome },
  { label: "Baking", icon: FiHome },
  { label: "Reading a book", icon: FiBook },
  { label: "Watching a movie", icon: FiHome },
  { label: "Playing video games", icon: FiHome },
  { label: "Playing board games", icon: FiUsers },
  { label: "Out with friends", icon: FiUsers },
  { label: "Having brunch", icon: FiCoffee },
  { label: "Dining out", icon: FiCoffee },
  { label: "Hiking", icon: FiCompass },
  { label: "Going for a run", icon: FiCompass },
  { label: "Cycling", icon: FiCompass },
  { label: "At the beach", icon: FiSun },
  { label: "Watching the sunset", icon: FiSun },
  { label: "On vacation", icon: FiMap },
  { label: "Road trip", icon: FiMap },
  { label: "Camping", icon: FiCompass },
  { label: "Taking photos", icon: FiCamera },
  { label: "Making art", icon: FiCamera },
  { label: "Playing music", icon: FiMusic },
  { label: "Dancing", icon: FiMusic },
  { label: "Shopping", icon: FiShoppingBag },
  { label: "Volunteering", icon: FiUsers },
  { label: "Studying", icon: FiBook },
  { label: "Working", icon: FiBriefcase },
  { label: "Relaxing at home", icon: FiHome },
  { label: "Trying something new", icon: FiCompass },
];

export interface ActivityColor {
    background: string;
    color: string;
}

export type ActivityType =
  | "Having coffee"
  | "Walking my dog"
  | "Working out at the gym"
  | "Cooking dinner"
  | "Baking"
  | "Reading a book"
  | "Watching a movie"
  | "Playing video games"
  | "Playing board games"
  | "Out with friends"
  | "Having brunch"
  | "Dining out"
  | "Hiking"
  | "Going for a run"
  | "Cycling"
  | "At the beach"
  | "Watching the sunset"
  | "On vacation"
  | "Road trip"
  | "Camping"
  | "Taking photos"
  | "Making art"
  | "Playing music"
  | "Dancing"
  | "Shopping"
  | "Volunteering"
  | "Studying"
  | "Working"
  | "Relaxing at home"
  | "Trying something new"

export const activityColors: Record<ActivityType, ActivityColor> = {
  "Having coffee": {
    background: "#FCE7F3",
    color: "#BE185D",
  },

  "Walking my dog": {
    background: "#DCFCE7",
    color: "#15803D",
  },

  "Working out at the gym": {
    background: "#FEE2E2",
    color: "#DC2626",
  },

  "Cooking dinner": {
    background: "#FEF3C7",
    color: "#B45309",
  },

  Baking: {
    background: "#FDE68A",
    color: "#92400E",
  },

  "Reading a book": {
    background: "#E0E7FF",
    color: "#4338CA",
  },

  "Watching a movie": {
    background: "#EDE9FE",
    color: "#7C3AED",
  },

  "Playing video games": {
    background: "#F5D0FE",
    color: "#A21CAF",
  },

  "Playing board games": {
    background: "#FED7AA",
    color: "#C2410C",
  },

  "Out with friends": {
    background: "#FBCFE8",
    color: "#BE185D",
  },

  "Having brunch": {
    background: "#FEF9C3",
    color: "#A16207",
  },

  "Dining out": {
    background: "#FFE4E6",
    color: "#BE123C",
  },

  Hiking: {
    background: "#D9F99D",
    color: "#4D7C0F",
  },

  "Going for a run": {
    background: "#FECACA",
    color: "#B91C1C",
  },

  Cycling: {
    background: "#CCFBF1",
    color: "#0F766E",
  },

  "At the beach": {
    background: "#BAE6FD",
    color: "#0369A1",
  },

  "Watching the sunset": {
    background: "#FED7AA",
    color: "#EA580C",
  },

  "On vacation": {
    background: "#C7D2FE",
    color: "#3730A3",
  },

  "Road trip": {
    background: "#DDD6FE",
    color: "#6D28D9",
  },

  Camping: {
    background: "#BBF7D0",
    color: "#166534",
  },

  "Taking photos": {
    background: "#BFDBFE",
    color: "#1D4ED8",
  },

  "Making art": {
    background: "#F5D0FE",
    color: "#A21CAF",
  },

  "Playing music": {
    background: "#F9A8D4",
    color: "#9D174D",
  },

  Dancing: {
    background: "#E9D5FF",
    color: "#7E22CE",
  },

  Shopping: {
    background: "#FBCFE8",
    color: "#DB2777",
  },

  Volunteering: {
    background: "#A7F3D0",
    color: "#047857",
  },

  Studying: {
    background: "#DBEAFE",
    color: "#1E40AF",
  },

  Working: {
    background: "#E5E7EB",
    color: "#374151",
  },

  "Relaxing at home": {
    background: "#DDD6FE",
    color: "#5B21B6",
  },

  "Trying something new": {
    background: "#FDE68A",
    color: "#B45309",
  },
};



export const professions = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "Digital Marketer",
  "Financial Analyst",
  "Accountant",
  "Human Resources Specialist",
  "Sales Executive",
  "Customer Support Representative",
  "Registered Nurse",
  "Physician",
  "Pharmacist",
  "Physical Therapist",
  "Teacher",
  "Professor",
  "Graphic Designer",
  "Content Writer",
  "Architect",
  "Civil Engineer",
  "Mechanical Engineer",
  "Data Analyst",
  "Project Manager",
  "Operations Manager",
  "Legal Counsel",
  "Chef",
  "Electrician",
  "Plumber",
  "Real Estate Agent",
  "Photographer"
];


export const countries = [
  "Poland"
];


export function formatLastSentDate(dateInput:Date) {
  if (!dateInput) return "";

  // 1. Convert input (Date object, timestamp, or ISO string) into a standard Date object
  const msgDate = new Date(dateInput);
  const now = new Date()

  // 2. Set up midnight comparisons to isolate true day differences accurately
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayMidnight = new Date(todayMidnight);
  yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);
  
  const sevenDaysAgoMidnight = new Date(todayMidnight);
  sevenDaysAgoMidnight.setDate(sevenDaysAgoMidnight.getDate() - 7);

  // --- SCENARIO 1: SENT TODAY -> Return Time (e.g., "10:15 AM") ---
  if (msgDate >= todayMidnight) {
    return msgDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  // --- SCENARIO 2: SENT YESTERDAY -> Return "Yesterday" ---
  if (msgDate >= yesterdayMidnight && msgDate < todayMidnight) {
    return "Yesterday";
  }

  // --- SCENARIO 3: SENT WITHIN 7 DAYS -> Return Day Name (e.g., "Wednesday") ---
  if (msgDate >= sevenDaysAgoMidnight && msgDate < yesterdayMidnight) {
    return msgDate.toLocaleDateString([], { weekday: 'long' });
  }

  // --- SCENARIO 4: OLDER THAN A WEEK -> Return Calendar Date (e.g., "Jul 09") ---
  return msgDate.toLocaleDateString([], { month: 'short', day: '2-digit' });
}

export const ACTIVITIES_LIST: string[] = [
  "Travel",
  "Photography",
  "Hiking",
  "Running",
  "Cycling",
  "Gym",
  "Swimming",
  "Camping",
  "Cooking",
  "Music",
  "Dancing",
  "Reading",
  "Gaming",
  "Art",
  "Volunteering",
  "Yoga",
  "Tennis",
  "Badminton",
  "Football",
  "Board Games"
]




// Type guard function to check if the error is a standard RTK Query network error
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function sanitizeBackendKey(rawString:string, fallbackKey = 'NOT_DECIDED') {
  if (!rawString) return fallbackKey;
  
  return rawString
    .trim()
    .toUpperCase()
      .replace(/[']+/g, '') // remove apostrophy
    .replace(/\//g, '_')     // CRUCIAL: Converts forward slashes (/) to underscores (_)
    .replace(/[-\s]+/g, '_') // Converts spaces and dashes directly to underscores
    .replace(/__+/g, '_')    // Fixes duplicate underscores (e.g. UX__UI becomes UX_UI)
    .replace(/^_+|_+$/g, ''); // Trims trailing or leading underscores
}
// src/utils/sanitizeCityKey.js
export function sanitizeKey(rawCityString:string) {
  if (!rawCityString) return 'any_city';
  
  return rawCityString
    .trim()
    .replace(/[']+/g, '') // remove apostrophy
    .replace(/[-\s]/g, '_') // Converts all spaces and dashes to underscores cleanly
    .toUpperCase();          // Converts the string to uppercase to match the JSON keys perfectly
}
