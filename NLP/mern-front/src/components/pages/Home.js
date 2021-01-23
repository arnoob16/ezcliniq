import React,{useEffect,useContext,useState} from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from "../../context/UserContext";
import Loader from '../Loader/Loader'
import Axios from 'axios'

const Home = () => {

    const {userData} = useContext(UserContext);
    const history = useHistory();
    const[search,setSearch]=useState();
    const[response,setResponse]=useState();
    const[checkMap,setcheckMap] = useState(false)
    const[loader,setLoader] = useState(false)

    useEffect(()=>{
        if(!userData.user)
        {
            history.push("/login")
        }
    })

    const submit = async (e) =>{
        e.preventDefault();
        setLoader(true)
        const newSearch = {search}
        await Axios.post('http://localhost:5000/users/search',newSearch)
        .then((res)=>{
            console.log(JSON.parse(res.data[0]))
            console.log("Orig",res.data)
            setResponse(res.data)
            setLoader(false)
            setcheckMap(true)
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return (
            <div className="page">
            <h2>Home</h2>
            <form className="form" onSubmit={submit}>
                <label htmlFor="search">Search</label>
                <input id="search" type="text" onChange={e=>setSearch(e.target.value)}/>
                <input type="submit" value="Search"/>
            </form>

            {
                loader ? <Loader/> : null
            }

            {checkMap ? 
                response.map((data)=>{
                    return(
                    <ul>
                        <li>
                            {JSON.parse(data).idstr}
                        </li>
                        <li>
                            {JSON.parse(data).created_at}
                        </li>
                        <li>
                            {JSON.parse(data).text}
                        </li>
                        <li>
                            {JSON.parse(data).polarity}
                        </li>
                        <li>
                            {JSON.parse(data).subjectivity}
                        </li>
                        <li>
                            {JSON.parse(data).user_created_at}
                        </li>
                        <li>
                            {JSON.parse(data).user_location}
                        </li>
                        <li>
                            {JSON.parse(data).user_description}
                        </li>
                        <li>
                            {JSON.parse(data).user_followers_count}
                        </li>
                        <li>
                            {JSON.parse(data).longitude}
                        </li>
                        <li>
                            {JSON.parse(data).latitude}
                        </li>
                        <li>
                            {JSON.parse(data).retweet_count}
                        </li>
                        <li>
                            {JSON.parse(data).favorite_count}
                        </li>
                    </ul>
                    )
                }) : null
            }

            {/**
             *      "idstr":str(id_str),
                    "created_at":str(created_at),
                    "text":str(text),
                    "polarity":str(polarity),
                    "subjectivity":str(subjectivity),
                    "user_created_at":str(user_created_at),
                    "user_location":str(user_location),
                    "user_description":str(user_description),
                    "user_followers_count":str(user_followers_count),
                    "longitude":longitude,
                    "latitude":latitude,
                    "retweet_count":retweet_count,
                    "favorite_count":favorite_count
             */}

            </div>
    )
}

export default Home;