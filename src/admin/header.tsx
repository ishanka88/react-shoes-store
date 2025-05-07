import React, { useEffect, useState } from "react";
import logo from "../assets/img/logo/logo.png";
import logo2 from "../assets/img/logo/logo2.png";
import img1 from "../assets/img/icon/card.svg";
import { RouteName } from "../RouteName";
import { NavLink } from "react-router-dom";



import { useAuth as clerkUseAuth, useUser as useUserClerk , UserButton } from "@clerk/clerk-react";
import {  signOut as firebaseSignOut,onAuthStateChanged,User } from "firebase/auth";
import {auth} from "../firebase/firebaseConfig"
import { getBothCurrentAndLastTrackings } from "../firebase/systemDocument";







const AdminHeader: React.FC = () => {

        // Destructuring the values returned from the `useAuth()` and `useUser()` hooks
    // Cleark
    const { isLoaded:isLodedClerk, isSignedIn: isSignedInClerk, signOut:signOutClerk } = clerkUseAuth() 
    const { user:userClerk} = useUserClerk() 

    // Firebase
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null); // State can be a User or null
    const [firebaseLoading, setFirebaseLoading] = useState(true); // State to handle loading state

    useEffect(() => {
        // Set up an observer to listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user); // Set the user object when auth state changes
        setFirebaseLoading(false); // Turn off loading once we have the user data
        });

        // Cleanup observer on unmount
        return () => unsubscribe();
    }, []);



    useEffect(() => {
    const handleSignOut = async () => {
        if (!isSignedInClerk ) {
        await Promise.all([
            firebaseSignOut(auth)
        ]);
        }
    };
    handleSignOut();
    }, [isSignedInClerk, signOutClerk, auth]);

    
    useEffect(() => {
        getBothCurrentAndLastTrackings()
          .then((res) => {
            if (res) {
                const [currentTracking, lastTracking] = res;
                if(currentTracking && lastTracking){
                    // Assuming currentTracking and lastTracking are numbers
                    const count = lastTracking - currentTracking;
                    if(count < 50){
                        const flashMessage = document.getElementById("flash-message");
                        if (flashMessage) {
                            flashMessage.innerHTML = `Available tracking numbers - ${count}`;
                            flashMessage.hidden = false; // Show the message
                        } 
                    }

                }
                    
                    
            } else {
              console.log("No tracking data available.");
            }
          })
          .catch((error) => {
            console.error("Error fetching tracking data:", error);
          });
      }, []);
      

    return (
        <React.Fragment>
            <div className="content-wrapper ">
                <header>

                    <div className="header-area">
                        <div className="main-header header-sticky">
                            <div className="container-fluid">
                                <div className="row menu-wrapper align-items-center justify-content-between">
                                    <div className="header-left d-flex align-items-center">
                                        <div className="logo2">
                                            <a href="index-2.html"><img src={logo2} alt="" /></a>
                                        </div>

                                        <div className="main-menu  d-none d-lg-block">
                                            <nav>
                                                <ul id="navigation">
                                                    <li><NavLink to={RouteName.ADDNEWORDER} activeClassName="active">Add New Order</NavLink></li>
                                                    <li><NavLink to={RouteName.ORDERS} activeClassName="active">Orders</NavLink></li>
                                                    <li><NavLink to={RouteName.ADD_PRODUCTS} activeClassName="active">Products</NavLink></li>
                                                    <li><NavLink to={RouteName.CONTACT} activeClassName="active">Contact</NavLink></li>
                                                    <li><NavLink to={RouteName.SETTING} activeClassName="active">Setting</NavLink></li>
                                                </ul>
                                            </nav>
                                        </div>
                                       
                                    </div>
                            
                                    <div className="header-right1 d-flex align-items-center">
                                        <div className="search">
                                            <ul className="d-flex align-items-center">
                                                <li>
                                                    <UserButton
                                                    appearance={{
                                                        elements: {
                                                        formButtonPrimary: {
                                                            width: '50px',
                                                            height: '50px',
                                                            fontSize: '24px', // Optional, increase text size inside the button
                                                        },
                                                        },
                                                    }}
                                                    />
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="mobile_menu d-block d-lg-none"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </header>
                <div 
                    id="flash-message"
                    hidden={true} // Initially hidden
                    style={{
                        width: '100%',
                        background: 'rgb(201, 6, 6)',
                        color: 'yellow',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        padding: '0.5rem',
                      }}
                >
                    {/* Available tracking numbers - 0 */}
                </div>

            </div>
        </React.Fragment>
    );
};
export default AdminHeader;
