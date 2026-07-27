
import { redirect } from "react-router-dom"
import type { Store } from "redux"
import type { RootState } from "../store"
import { LoginPage } from "./index"

export const loader =(store:Store<RootState>)=>async ()=>{
    const authenticated = store.getState().userSlice.username

    if(authenticated){

      return null;
      
    }else{
        return redirect("/")
    }
    
}

const Landing = ()=>{

    return  <section className="landing">
            <LoginPage/>
    </section>
}
export default Landing


