import { type ChangeEvent, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useToggle } from "./../hooks/useToggle";


const FormInputPassword = ({ name, label, defValue, value, handleChange, hasError }: { name: string, placeholder: string, label: string, width: string, defValue?: string, value?: string, handleChange(e: ChangeEvent<HTMLInputElement>): void, hasError?: boolean }) => {
  const [isActive, toggle] = useToggle()
  const [type, setType] = useState<string>('password');
  (false);


  const handleClick = () => {
    toggle()
    if (type === 'password') {
      setType(() => 'text')
    } else {
      setType(() => 'password')
    }
  }
  return <div className={`${hasError ? 'error' : ''}`} style={{ borderColor: hasError ? 'red' : '' }}>
    <label className="label" htmlFor={label} style={{ color: hasError ? 'red' : '' }}>{label}</label>
    <div className="input-container">
      <input type={type} name={name} className={`input`} id={label} defaultValue={defValue} value={value} onChange={handleChange} />
      <button type="button" className="eye-btn" onClick={() => handleClick()}>{
        isActive ? <IoEye /> : <IoEyeOff />}</button>
    </div>
  </div>
}

export default FormInputPassword