import { useEffect, useState, type ChangeEvent } from "react";
import { LuFileText, LuImagePlus, LuList, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useRevalidator } from "react-router-dom";
import { useCreatePostMutation } from "../features/api/transApi";
import { hideForm } from "../features/slice/utilSlice";
import { MOMENT_OPTIONS } from "../util/util";
import "./../css/CreateBroadcast.css";

const  CreateBroadcast = () =>{
  const dispatch = useDispatch();
  const {revalidate}= useRevalidator()

  const [charLength, setCharLength] = useState<number>(0);
  const [mediaUrl, setMediaUrl] = useState<string|null>(null); // Renamed variable from 'image' to represent both states
  const [isMediaSelected, setIsMediaSelected] = useState<boolean>(false);
  const [isFileTypeVideo, setIsFileTypeVideo] = useState<boolean>(false); // 
  const [mediaOrientation, setMediaOrientation] = useState<string>('');


  // Post hooks
  const [createPost] = useCreatePostMutation();

  

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
      dataToSend.append("image", mediaInput.files[0]); // Pushes your raw image or short video blob safely
    
      
    }

    //console.log(Object.fromEntries(dataToSend));
    

    try {
      const response = await createPost(dataToSend);
    
      if (response?.data) {
        activityInput.value = "";
        contentInput.value = "";
        visibilityInput.value = "";
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

  // Function to return number of characters typed
  const handleTextInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.target.value;
    const textLength = text.length;
    setCharLength(() => textLength);
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
  }


  


  
return (
    <div className="create-post">
  <div className="create-post__header">
  <h1>Share a Moment</h1>
  <small>Photo or a video (max file size: 30 MB).</small>
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
              <h3>Upload Media</h3>
              <p>Drag & drop or click to browse files</p>
            </label>
          )}
        </div>

        {/* 2. FORM CONFIGURATION GROUPS */}
        <div className="form-group">
          <label htmlFor="activity-select">Moment</label>
          <div className="input-wrapper">
            <LuList size={18} aria-hidden="true" />
            <select name="activity" id="activity-select" required>
              <option value="">Select moment</option>
              {MOMENT_OPTIONS.map((activity) => (
                <option value={activity.label} key={activity.label}>
                  {activity.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CHANGED FROM SELECT DROPDOWN TO RADIO BUTTONS */}
        <div className="form-group">
          <label>Visibility</label>
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
                <span>Public <small>(Everyone)</small></span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="MATCH_ONLY" 
                />
                <span>Match only <small>(Locked for matches)</small></span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description-textarea">Caption</label>
          <div className="textarea-wrapper">
            <LuFileText size={18} aria-hidden="true" />
            <textarea
              id="description-textarea"
              maxLength={250}
              minLength={0}
              name="content"
               // Fix: Transforms into a controlled React state node
              placeholder="what does this moment say about you."
              onChange={handleTextInput}
            />
          </div>
          <span className="counter" aria-live="polite">
            {charLength} / 250
          </span>
        </div>

        {/* 3. SUBMIT ACTIONS */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancelEvent}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            share
          </button>
        </div>
      </form>
    </div>
  );

}

export default CreateBroadcast