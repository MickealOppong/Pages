import type { TvalidationErrors } from "../types/TValidationErrors";
import './../css/ErrorMessage.css';

const def ={
     firstName:'', lastName:'', dob:'', email:'', password:'', gender:'', location:'', isTermsChecked:''
}
const ErrorMessage = ({ data }: { data: TvalidationErrors }) => {
    const { firstName, lastName, dob, email, password, gender, location, isTermsChecked } = data||def as TvalidationErrors;
    
return (
        <section className="error-toast-overlay">
            <div className="error-toast-card">
                <span className="error-toast-icon">⚠️</span>
                <h2>Submission Failed</h2>
                <p className="error-toast-subtitle">Please correct the following form inputs to proceed:</p>
                
                <div className="error-toast-list">
                    {firstName && <span className="error-toast-item">{firstName}</span>} 
                    {lastName && <span className="error-toast-item">{lastName}</span>}      
                    {dob && <span className="error-toast-item">{dob}</span>}  
                    {email && <span className="error-toast-item">{email}</span>} 
                    {password && <span className="error-toast-item">{password}</span>} 
                    {gender && <span className="error-toast-item">{gender}</span>} 
                    {location && <span className="error-toast-item">{location}</span>} 
                    {isTermsChecked && <span className="error-toast-item">{isTermsChecked}</span>} 
                </div>
            </div>
        </section>
    );
};
export default ErrorMessage