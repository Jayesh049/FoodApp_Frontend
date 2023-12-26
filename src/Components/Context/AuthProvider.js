import React, { useState, useContext } from 'react';
import '../Styles/login.css'
import axios from 'axios';

export const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

function AuthProvider({ children }) {

    const [user, userSet] = useState("");
    const [loading, setLoading] = useState(false);
    const [ resetPasswordEmail  , setResetEmail ] = useState(null);
    const [ otpPassEmail , setOtpPassEmail] = useState(null);

    window.onload = () => {
        let reloading = sessionStorage.getItem("reloading");
        if (reloading) {
            sessionStorage.removeItem("reloading");

        }
    }


    async function signUp(name, password, email, confirm) {
        try {

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

            if(err.message === "Request failed with status code 400"){
                alert("improper user data entry")
            }
            setLoading(false);
        }
    }
    async function login(email, password ) {
        let flag =  true;


        try {
            setLoading(true);

            const res = await axios.post("https://foodappbackend-lk5m.onrender.com/api/v1/auth/login", {
                email: email,
                password: password
            });

            userSet(res.data.user);
            console.log(res);
            if(res.data.result  === "ok"){
                window.localStorage.setItem("user" , res.data.user._id);
                window.localStorage.setItem("loggedIn" ,true);

            }

            if("loggedIn" === true){
            sessionStorage.setItem("reloading", "false");
            window.location.reload(false); 
            }

            setLoading(false);  
            // whenever user is successfully logged in the isloggedin variable will be vreated and marked to true 

            return flag;
        }
        catch (err) {
            flag = false;


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

    }
    function logout() {

        localStorage.clear();
        window.localStorage.setItem("loggedIn" ,false);
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