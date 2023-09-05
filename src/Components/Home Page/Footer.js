import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/footer.css';

function Footer() {
    const[loading , setLoading] = useState(false);

    useEffect(() => {
        async function loadingTimer(){
            setLoading(true);
            setTimeout(() => {
          setLoading(false);
        }, 2000);
        }
        loadingTimer();
    }, []);
    
    return (<>
        {loading  ? (
            <div className="spinner-container">
            <div className="loading-spinner">
            </div>
            </div>
       ) :(
        <div className='footerImg'>
            <footer>
                <div className="footer-parent">
                    <ul className="footer-text">
                        <li className="text-value">
                            <Link to="#">About us</Link>
                        </li>
                        <li className="text-value">
                            <Link to="#">ios App</Link>
                        </li>
                        <li className="text-value">
                            <Link to="#">Android App</Link>
                        </li>
                    </ul>
                    
                    <ul className="social-link">
                        <li>
                            <Link to="https://www.facebook.com/foodyy.chaachaa">
                            </Link>
                        </li>
                        <li>
                            <Link to="https://www.instagram.com/foddy_chaachaa">
                                
                            </Link>
                        </li>
                        <li>
                            <Link to="https://twitter.com/ChaaFoody">
                                
                            </Link>
                        </li>
                        <li>
                            <Link to="#">
                                
                            </Link>
                        </li>
                    </ul>
                </div>

                <p className="footer-p">
                    Copyright © 2023 EVERYONE. All rights reserved.
                </p>
            </footer>
        </div>
    )
}
</>)
}

export default Footer
