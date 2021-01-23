import React,{useState,useContext} from 'react';
import axios from 'axios'
import UserContext from "../../context/UserContext"
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../misc/ErrorNotice';
import Loader from '../Loader/Loader';

const Login = () => {

    const[email,setEmail] = useState();
    const[password,setPassword] = useState();
    const[error,setError] = useState();
    const[submitState,setSubmitState]=useState(false);

    const{setUserData} = useContext(UserContext)

    const history = useHistory();

    const submit = async (e) =>{
        e.preventDefault();
        setSubmitState(true)
        try
        {
            const loginUser = {email,password};

            const loginRes = await axios.post('http://localhost:5000/users/login',loginUser)

            setUserData({
                token:loginRes.data.token,
                user:loginRes.data.user
            })

            localStorage.setItem("auth-token",loginRes.data.token)
            history.push("/")
        }
        catch(err)
        {
            setSubmitState(false)
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    const showPassword = () =>{
        var x = document.getElementById("login-password");
        if (x.type === "password")
        {
            x.type = "text";
        }
        else
        {
            x.type = "password";
        }
    }

    return(
        <div className="page">
            <h2>Login</h2>
            {error && <ErrorNotice message={error} clearError={()=>{
                setError(undefined)
            }}/>}
            <form className="form" onSubmit={submit}>
                <label htmlFor="login-email">Email</label>
                <input id="login-email" type="email" onChange={e=>setEmail(e.target.value)}/>

                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" onChange={e=>setPassword(e.target.value)}/>
                <input type="checkbox" onClick={showPassword}/>Show Password

                <input type="submit" value="Login"/>
            </form>
            {
                submitState ? <Loader/> : null
            }
        </div>
    )
}
export default Login;