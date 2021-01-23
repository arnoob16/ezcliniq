import React,{useContext} from 'react';
import { useHistory } from "react-router-dom";
import UserContext from '../../context/UserContext';

const AuthOptions = () => {

    const {userData,setUserData} = useContext(UserContext);

    const history = useHistory();

    const registor = () =>{
        history.push("/register") //go to the different page
    }
    const login = () =>{
        history.push("/login")
    }

    const logout = ()=>{
        setUserData({
            token : undefined,
            user:undefined
        })
        localStorage.setItem("auth-token","")
    }
    return (
        <nav className="auth-options">
            {
                userData.user ?
                (<button onClick={logout}>Log Out</button>) : (
                    <>
                        <button onClick={registor}>Register</button>
                        <button onClick={login}>Login</button>
                    </>
                )
            }
        </nav>
    );
}


export default AuthOptions;