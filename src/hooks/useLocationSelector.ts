import { useEffect, useState } from "react";
import {
  useGetLocationMutation,
  useLazyGetSearchedLocationQuery,
} from "../features/api/authApi";
import type { TLocationResponse } from "../types/TLocationResponse";
import { detectUserCoordinates } from "../util/location";

// 1. Central geographic fallbacks directory
const LOCALE_CITY_FALLBACKS: Record<
  string,
  { lat: number; lon: number; city: string; country: string; countryCode: string }
> = {
  pl: { lat: 52.2297, lon: 21.0122, city: "Warszawa", country: "Polska", countryCode: "PL" },
  de: { lat: 52.52, lon: 13.405, city: "Berlin", country: "Deutschland", countryCode: "DE" },
  fr: { lat: 48.8566, lon: 2.3522, city: "Paris", country: "France", countryCode: "FR" },
  tw: { lat: 5.6037, lon: -0.187, city: "Accra", country: "Ghana", countryCode: "GH" },
  en: { lat: 51.5074, lon: -0.1278, city: "London", country: "United Kingdom", countryCode: "GB" },
};



export function useLocationSelector() {
  const [locationList, setLocationList] = useState<TLocationResponse[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<TLocationResponse | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [extractedData, setExtractedData] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState<boolean>(false);

  const [longitude, setLongitude] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);
  const [countryCode, setCountryCode] = useState<string>("");

  const [getSearchLocation] = useLazyGetSearchedLocationQuery();
  const [getLocation] = useGetLocationMutation();
  const locale = (localStorage.getItem("i18nextLng") as string) || "en";
  const cleanLocale = locale.split("-")[0].toLowerCase();



  // EXPORT METHOD: Allows parent components to dynamically pull the default fallback configuration parameters
  const getFallbackData = () => {
   
    return LOCALE_CITY_FALLBACKS[cleanLocale] || LOCALE_CITY_FALLBACKS.en;
  };

  const handleInputChange = (inputValue: string) => {
    setLocation(inputValue);
    setLocationError(null);

    if (selectedLocation || extractedData) {
      setSelectedLocation(null);
      setExtractedData(false);
      setLatitude(0);
      setLongitude(0);
      setCountryCode("");
    }
  };

  const handleSelectCity = (locationItem: TLocationResponse) => {
    setSelectedLocation(locationItem);
    setLatitude(locationItem.lat);
    setLongitude(locationItem.lon);
    setCountryCode(locationItem.countryCode || "");
    setExtractedData(true);
    setLocation(`${locationItem.city}, ${locationItem.country}`);
    setIsDropdownOpen(false);
    setIsHoveringDropdown(false);
  };

  const handleInputBlur = () => {
    if (isHoveringDropdown) return;


    if (!location.trim()) {
      setIsDropdownOpen(false);
      setExtractedData(false);
      setLatitude(0);
      setLongitude(0);
      setCountryCode("");
      return;
    }

    if (extractedData) return;

    const exactMatch = locationList.find(
      (loc) => `${loc.city}, ${loc.country}`.toLowerCase() === location.trim().toLowerCase()
    );

    if (exactMatch) {
      handleSelectCity(exactMatch);
    } else {
      // Clear out unrecognized text input cleanly without forcing defaults instantly onto the UI screen view
      setLocation("");
      setLocationList([]);
      setIsDropdownOpen(false);
      setExtractedData(false);
      setLocationError("GENERAL_ERROR");
    }
  };

  useEffect(() => {
    if (selectedLocation || extractedData || !location.trim()) {
      setLocationList([]);
      setIsDropdownOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await getSearchLocation({ city: location, locale });
        if (response.isSuccess && response.data?.locationResponseList) {
          setLocationList(response.data.locationResponseList as TLocationResponse[]);
          setIsDropdownOpen(true);
        }
      } catch (err) {
        console.error("Failed fetching manual locations:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [location, selectedLocation, extractedData, locale]);

  const handleDetectLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const coordinates = await detectUserCoordinates();
      const latVal = coordinates.latitude;
      const lonVal = coordinates.longitude;

      const response = await getLocation({ longitude: lonVal, latitude: latVal, locale });

      if (response.error) throw new Error("Network fetch operation failed");

      if (response.data && response.data.httpStatus === 200) {
        const { city, country, countryCode: resCountryCode } = response.data.locationResponse;
        setLatitude(latVal);
        setLongitude(lonVal);
        setCountryCode(resCountryCode);
        setExtractedData(true);
        setLocation(`${city}, ${country}`);
      } else {
        setLocationError("FIND_ERROR");
      }
    } catch (err) {
      console.error("Geocoding request failed: ", err);
      setLocationError("FETCH_ERROR");
    } finally {
      setIsLocating(false);
    }
  };

  return {
    location,
    locationList,
    extractedData,
    isDropdownOpen,
    isLocating,
    locationError,
    latitude,
    longitude,
    countryCode,
    setIsHoveringDropdown,
    handleInputChange,
    handleInputBlur,
    handleSelectCity,
    handleDetectLocation,
    getFallbackData, // Exposed safely to parent
  };
}
