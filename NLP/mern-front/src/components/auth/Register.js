import React,{useState,useContext} from 'react';
import axios from 'axios'
import UserContext from "../../context/UserContext"
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../misc/ErrorNotice';
import Loader from '../Loader/Loader';

const Register = () => {

    const[email,setEmail] = useState();
    const[password,setPassword] = useState();
    const[passwordCheck,setPasswordCheck] = useState();
    const[displayName,setDisplayName] = useState();
    const[error,setError] = useState()
    const[submitState,setSubmitState]=useState(false);

    const{setUserData} = useContext(UserContext)

    const history = useHistory();

    const submit = async (e) =>{
        e.preventDefault();
        setSubmitState(true)
        try
        {
            const newUser = {email,password,passwordCheck,displayName};
            await axios.post('http://localhost:5000/users/register',newUser)

           /* const loginRes = await axios.post('http://localhost:5000/users/login',
            {
                email,
                password
            }) 

            setUserData({
                token:loginRes.data.token,
                user:loginRes.data.user
            })

            localStorage.setItem("auth-token",loginRes.data.token)
            history.push("/") */
            history.push("/login")
        }
        catch(err)
        {
            setSubmitState(false)
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    const showPassword = () =>{
        var x = document.getElementById("register-password");
        if (x.type === "password")
        {
            x.type = "text";
        }
        else
        {
            x.type = "password";
        }
    }

    return (
        <div className="page">
            <h2>Register</h2>
            {error && <ErrorNotice message={error} clearError={()=>{
                setError(undefined)
            }}/>}
            <form className="form" onSubmit={submit}>
                <label htmlFor="register-email">Email</label>
                <input id="register-email" type="email" onChange={e=>setEmail(e.target.value)}/>

                <label htmlFor="register-password">Password</label>
                <input id="register-password" type="password" onChange={e=>setPassword(e.target.value)}/>
                <input type="checkbox" onClick={showPassword}/>Show Password
                <input type="password" placeholder="Verify Password" onChange={e=>setPasswordCheck(e.target.value)}/>

                <label htmlFor="display-Name">Name</label>
                <input id="display-Name" type="text" onChange={e=>setDisplayName(e.target.value)}/>

                <input type="submit" value="Register"/>
            </form>
            {
                submitState ? <Loader/> : null
            }
        </div>
    )
}

// #endregion

export default Register;