import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { LuFileText, LuImagePlus, LuList, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useRevalidator } from "react-router-dom";
import { useCreatePostMutation } from "../features/api/transApi";
import { hideForm } from "../features/slice/utilSlice";
import { MOMENT_OPTIONS, sanitizeBackendKey } from "../util/util";
import "./../css/CreateBroadcast.css";

const  CreateBroadcast = () =>{
  const dispatch = useDispatch();
  const {revalidate}= useRevalidator()
  const[textContent,setTextContent] = useState<string>('')
  const[inputValue,setInputValue] = useState<string>('')
  const [charLength, setCharLength] = useState<number>(0);
  const [mediaUrl, setMediaUrl] = useState<string|null>(null); // Renamed variable from 'image' to represent both states
  const [isMediaSelected, setIsMediaSelected] = useState<boolean>(false);
  const [isFileTypeVideo, setIsFileTypeVideo] = useState<boolean>(false); // 
  const [mediaOrientation, setMediaOrientation] = useState<string>('');

  //error message
  const[mediaError,setMediaError] = useState<string>('')
  const[activityError,setActivityError] = useState<string>('')
  const[contentError,setContentError] = useState<string>('')
  const[visibilityError,setVisibilityError] = useState<string>('')

  // Post hooks
  const [createPost] = useCreatePostMutation();

  //translation hook
  const {t}= useTranslation()

  // Function to send data input to database
  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Create a clean, empty FormData container
    const dataToSend = new FormData();

    // 2. Safely grab your form elements from the HTML page
    const formElement = e.target;

    const activityInput = formElement.elements.namedItem("activity") as HTMLInputElement;
    const contentInput = formElement.elements.namedItem("content") as HTMLInputElement;
    const visibilityInput = formElement.elements.namedItem("visibility") as HTMLInputElement;
    const mediaInput = formElement.elements.namedItem("image") as HTMLInputElement;

    // 3. Append text values straight to the container
    dataToSend.append("activity", activityInput?.value || "");
    dataToSend.append("content", contentInput?.value || "");
    dataToSend.append("visibility", visibilityInput?.value || "");
    dataToSend.append("userId", localStorage.getItem("id") || "");
    dataToSend.append("mediaOrientation", mediaOrientation || "");

    // 4. CRITICAL: Grab the actual binary media file blob from the input array
    if (mediaInput && mediaInput.files && mediaInput.files[0]) {
      dataToSend.append("media", mediaInput.files[0]); // Pushes your raw image or short video blob safely
    
      
    }

    try {
      const response = await createPost(dataToSend);     
        
      if(response.error){
        
        const errorResponse = response.error as {data:{},status:number}
        if(errorResponse.status===413){
           const {message} =errorResponse.data as {error:string, message:string}
            setMediaError(()=>message)
        }

          if(errorResponse.status===403){
           const errors =errorResponse.data as {error:{activity:string,content:string,visibility:string},messgae:string}
          const {activity,content,visibility} = errors.error;
            
          setActivityError(()=>activity)
          setContentError(()=>content);
          setVisibilityError(()=>visibility)
        }
       
         
      }
      
    
      if (response?.data) {
        activityInput.value = "";
        contentInput.value = "";
        visibilityInput.value = "";
        setTextContent('');
        setMediaUrl(() => "");
        setIsMediaSelected(() => false);
        setIsFileTypeVideo(() => false);
        dispatch(hideForm());
        revalidate();
      }
    } catch (error) {
      console.error(error);
    }
    
  };

  const handleSelectActivity=(e:ChangeEvent<HTMLSelectElement>)=>{

    const activity = e.target.value
   setInputValue(()=>activity);
   
  }




  useEffect(()=>{
    if(!inputValue){
      setTextContent('')
      return
    }
     const text =t(`Moment_captions.${sanitizeBackendKey(inputValue)}`)
     
    setTextContent(()=>text) 
    setCharLength(()=>text.length)
  },[inputValue])

  // Function to return number of characters typed
  const handleTextInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.target.value;
    const textLength = text.length;
    setCharLength(() => textLength);
  };

    // Function to return number of characters typed
  const handleTextInputFocus = () => {
    setContentError('')
  };

    const handleSelectInputFocus = () => {
    setActivityError('');
      setContentError('')
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  
    if (e.target.files && e.target.files[0]) {
      const targetFile = e.target.files[0];
      
      //  CHECK TYPE: Detect if file MIME format matches video headers natively
     // const isVideo = targetFile.type.startsWith('video/');
       // Create localized data stream link
      const objectUrl = URL.createObjectURL(targetFile);
        setMediaUrl(objectUrl);  

      if(targetFile.type.startsWith('video/')){
        setIsFileTypeVideo(() => true);
       //setMediaUrl(() => objectUrl);
        setIsMediaSelected(() => true);
    
         const video = document.createElement('video');
          video.src = objectUrl;
          video.onloadedmetadata = () => {
          const orientation = video.videoWidth > video.videoHeight ? 'landscape' : 'portrait';
          setMediaOrientation(orientation);
        };
       
      }else if (targetFile.type.startsWith('image/')){
      
        const img = new Image();
        img.src = objectUrl;     
    
        img.onload = () => {
       const orientation = img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait';
       setMediaOrientation(orientation);
       
       };
         setIsMediaSelected(() => true);
         setIsFileTypeVideo(() => false);
    } 
    

  }else {
      setIsMediaSelected(() => false);
    }
}


useEffect(() => {

  return () => {
    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }
  };
}, [mediaUrl]);




  function handleCancelEvent() {
    dispatch(hideForm());
  }

  const handleRemoveMedia =()=>{
      setMediaUrl(()=>"")
       setIsMediaSelected(() => false);
       setMediaError('')
  }





  
return (
    <>
    <div className="create-post">
  <div className="create-post__header">
  <h1>{t('My_moments.Create_moment.title')}</h1>
  <small>{t('My_moments.Create_moment.message')}</small>
 
</div>

      <form className="post-form" onSubmit={handleFormSubmit}>
        <div className="image-upload">
          
          {/* 1. CONDITIONAL MEDIA RENDERING PREVIEW SWITCHER */}
          {isMediaSelected && (
            <div className="preview-container">
              {isFileTypeVideo ? (
                <video
                  src={mediaUrl as string}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="upload-preview-media" 
                />
              ) : (
                <img
                  src={mediaUrl as string}
                  alt="Post Preview"
                  className="upload-preview-media" 
                />
              )}
              
              {/* Fix: Clear/remove action overlay lets users swap wrong choices */}
              <button 
                type="button" 
                className="remove-media-btn" 
                onClick={()=>handleRemoveMedia()}
                aria-label="Remove uploaded media"
              >
                <LuX size={18} />
              </button>
            </div>
          )}

          <input
            type="file"
            id="photo"
            accept="image/*,video/*"
            hidden
            onChange={handleFileChange}
            name="image"
          />

          {/* Label changes styling instead of vanishing to support click-to-replace actions */}
          {!isMediaSelected && (
            <label htmlFor="photo" className="upload-label">
              <LuImagePlus size={48} aria-hidden="true" />
              <h3>{t('My_moments.Create_moment.media_title')}</h3>
              <p>{t('My_moments.Create_moment.media_message')}</p>
            </label>
          )}
        </div>
       
           {mediaError && <span className="error_span">{mediaError}</span>}
     

        {/* 2. FORM CONFIGURATION GROUPS */}
        <div className="form-group">
          <label htmlFor="activity-select">{t('My_moments.Create_moment.fields.moment')}</label>
          <div className="input-wrapper">
            <LuList size={18} aria-hidden="true" />
            <select name="activity" id="activity-select" onChange={handleSelectActivity} onFocus={handleSelectInputFocus}>
                <option value=""></option>
              {MOMENT_OPTIONS.map((activity) => (
                <option value={activity.label} key={activity.label}>
                {t(`Moments.${sanitizeBackendKey(activity.label)}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
          {activityError && <span className="error_span">{activityError}</span>}

        {/* CHANGED FROM SELECT DROPDOWN TO RADIO BUTTONS */}
        <div className="form-group">
          <label>{t('My_moments.visibility.visibility')}</label>
          <div className=" visibility-radio-wrapper">
            <div className="radio-options-container">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="PUBLIC" 
                  defaultChecked 
                  required 
                />
                <span>{t('My_moments.visibility.public')}<small>{t('My_moments.visibility.public_text')}</small></span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="MATCH_ONLY" 
                />
                <span>{t('My_moments.visibility.match_only')}<small>{t('My_moments.visibility.match_only_text')}</small></span>
              </label>
            </div>
          </div>
        </div>
          {visibilityError&& <span className="error_span">{visibilityError}</span>}

        <div className="form-group">
          <label htmlFor="description-textarea">{t('My_moments.Create_moment.fields.caption')}</label>
          <div className="textarea-wrapper">
            <LuFileText size={18} aria-hidden="true" />
            <textarea
              id="description-textarea"
              maxLength={250}
              minLength={0}
              name="content"
               // Fix: Transforms into a controlled React state node
              placeholder={t('My_moments.Create_moment.fields.caption_placeholder')}
              onChange={handleTextInput} value={textContent} onFocus={handleTextInputFocus}
            />
          </div>
           {contentError && <span className="error_span">{contentError}</span>}
          <span className="counter" aria-live="polite">
            {charLength} / 250
          </span>
        </div>
         

        {/* 3. SUBMIT ACTIONS */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancelEvent}>
            {t('My_moments.Create_moment.fields.cancel_btn')}
          </button>
          <button type="submit" className="btn-primary">
             {t('My_moments.Create_moment.fields.share_btn')}
          </button>
        </div>
      </form>
    </div>
    </>
  );

}

export default CreateBroadcast