import React, { useState, useContext , useEffect} from 'react';
import '../Styles/login.css'
import axios from 'axios';
// import { useHistory } from 'react-router';
export const AuthContext = React.createContext();
//custom hook that allows components to access context data
export function useAuth() {
    return useContext(AuthContext)
}
// sync -> if you have a user or not on login and logout 
// It also exposes you lossley coupled auth functions
// 
function AuthProvider({ children }) {
    // const history = useHistory();
    


    
    const [user, userSet] = useState("");
    const [loading, setLoading] = useState(false);
    //for defining resetPass and sendingOtp 
    const [ resetPasswordEmail  , setResetEmail ] = useState(null);
    const [ otpPassEmail , setOtpPassEmail] = useState(null);
    

    async function signUp(name, password, email, confirm) {
        try {
            console.log("signup will be here");
            let res = await axios.post
                ("https://foodappbackend-lk5m.onrender.com/api/v1/auth/signup", {
                    name: name,
                    password: password,
                    confirmPassword: confirm,
                    email
                })
                // if(res.status === 400){
                // alert("improper user data entry")
                // }
                setLoading(false);
            // console.log("data", res.data);

        } catch (err) {
            console.log("err", err.message);
            if(err.message === "Request failed with status code 400"){
                alert("improper user data entry")
            }
            setLoading(false);
        }
    }
    async function login(email, password ,e ) {
        let flag =  true;
        

        try {
            setLoading(true);
            
            const res = await axios.post("http://localhost:3000/api/v1/auth/login", {
                email: email,
                password: password
            });
            
            userSet(res.data.user);
            console.log(res.data.result);
            if(res.data.result  === "ok"){
                window.localStorage.setItem("user" , res.data.user._id);
                window.localStorage.setItem("loggedIn" ,true);

            }


            setLoading(false);  
            // whenever user is successfully logged in the isloggedin variable will be vreated and marked to true 
            
            return flag;
        }
        catch (err) {
            flag = false;
            console.log(err);
            if (err.message === "Request failed with status code 404") {
                alert("Password or email may be wrong");
                flag = false;
            } else if (err.message === "Request failed with status code 400") {
                alert("user not found kindly login");
                flag = false;
            } else if (err.message === "Request failed with status code 500") {
                alert("Internal server error");
                flag = false;
            }else if(err.message === "Request failed with status code 403"){
                alert("email or password is wrong")
                flag = false;
            }
            setLoading(false);
            return flag;
        }
        // console.log("login will be here");
    }
    function logout() {
        
        window.localStorage.removeItem("user")
        userSet(null);
        
    }

    const value = {
        user,
        login,
        signUp,
        logout,
        resetPasswordEmail,
        setResetEmail,
        otpPassEmail,
        setOtpPassEmail
    }
    return (
        < AuthContext.Provider value={value} >
            {/* if not loading show childrens  */}
            {!loading && children}
        </AuthContext.Provider >
    )
}
export default AuthProvider
