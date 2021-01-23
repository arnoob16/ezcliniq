import React,{useState,useEffect} from "react";
import {BrowserRouter,Switch,Route} from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Header from "./components/layout/Header";
import axios from 'axios';

import './styles.css';
import UserContext from "./context/UserContext";

function App() 
{
  const[userData,setUserData]=useState({
    token:undefined,
    user:undefined
  })

  useEffect(()=>{
    const checkLoggedIn = async ()=>{
      let token = localStorage.getItem("auth-token");
      if(token==null)
      {
        localStorage.setItem("auth-token","")
        token=""
      }
      const tokenRes = await axios.post('http://localhost:5000/users/tokenIsValid',null,
      {headers:{'auth-token':token}})

      //console.log("Tokendata :",tokenRes.data)
      if(tokenRes.data)
      {
        const userRes = await axios.get("http://localhost:5000/users/",
        {headers:{"auth-token":token}})

        setUserData({
          token,
          user:userRes.data
        })
      }
    }
    checkLoggedIn();
  },[])
  return(
    <>
    <BrowserRouter>
    <UserContext.Provider value={{userData,setUserData}}>
      <Header/>
        <Switch>
          <Route exact path="/" component={home}/>
          <div className="container">
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </div>
        </Switch>
    </UserContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App;
