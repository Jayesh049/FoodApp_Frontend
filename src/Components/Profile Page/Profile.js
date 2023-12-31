import React, { useState } from 'react';
import '../Styles/profile.css';
import { useAuth } from '../Context/AuthProvider';
import axios from 'axios';

function Profile() {
    const { user } = useAuth();

    console.log(user);
    return (
        <div className="container-grey">

            <div className="form-container">
                <div className='h1Box'>
                    <h1 className='h1'>Profile</h1>
                    <div className="line"></div>
                    <div className="profileImage">
                        <img src={user.pic} />
                    </div>
                </div>
                <div className="loginBox">
                    
                    <div className="entryBox">
                        <div className="entryText">Email</div>
                        <input className="email input" type="email" value={user.email} /> 
                    </div>
                 
                    <div className="entryBox">
                        <div className="entryText">Name</div>
                        <input className="password input" type="text" value={user.name}/>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}

export default Profile
