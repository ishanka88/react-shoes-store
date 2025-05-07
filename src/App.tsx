import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/owl.carousel.min.css";
import "./assets/css/slicknav.css";
import "./assets/css/style.css";
import "./assets/css/slick.css";
import "./assets/css/flaticon.css";
import "./assets/css/progressbar_barfiller.css";
import "./assets/css/price_rangs.css";
import "./assets/css/gijgo.css";
import "./assets/css/animated-headline.css";
import "./assets/css/fontawesome-all.min.css";
import "./assets/css/nice-select.css";
import Main from "./common/main";
import Header from "./common/header";
import Footer from "./common/footer";
import ContactUs from "./common/contactUs";
import Cart from "./common/shoppingCart";
import Checkout from "./common/checkout";
import Products from "./common/products";
import About from "./common/about";
import ProductPage from "./common/productPage";
import UserOrders from "./common/userOrders";
import { RouteName } from "./RouteName";
import { AuthService } from "./services/AuthService";
import AdminFooter from "./admin/footer";
import AdminHeader from "./admin/header";
import AddProducts from "./admin/products";
import Orders from "./admin/orders";
import ContactData from "./admin/contact";



import { useUser,useAuth as clerkUseAuth} from "@clerk/clerk-react";
import { signInWithCustomToken, signOut as firebaseSignOut,onAuthStateChanged,User } from "firebase/auth";
import {auth} from "./firebase/firebaseConfig"

import { UserDetails } from './services/UserDetails';
import { DataProvider } from './context/DataContext';
import { ORDERS } from "./dbUtils";
import AddNewOrder from "./admin/addNewOrder";
import Setting from "./admin/setting";
import { useUserContext } from "./context/UserContext";
import { u } from "framer-motion/dist/types.d-6pKw1mTI";




const App: React.FC = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // const [isModerator, setIsModerator] = useState<boolean>(false);
  const { isAuthenticated, userData, isAdmin, isModerator } = useUserContext();

  const { isLoaded:isLodedClerk, isSignedIn: isSignedInClerk, signOut:signOutClerk ,getToken} = clerkUseAuth() 

  console.log("userData",userData)

  if (!isLodedClerk) {
    // Show loading screen while determining authentication state
    return <div>Loading...</div>;
  }


  return (
    <Router>
       <DataProvider>
          {/* Check if the user is an Admin */}
          {isAdmin && isAuthenticated ? (
            <>
              <AdminHeader />
              <Switch>
                <Route path={RouteName.ADDNEWORDER} component={AddNewOrder} />
                <Route path={RouteName.ORDERS} component={Orders} />
                <Route path={RouteName.ADD_PRODUCTS} component={AddProducts} />
                <Route path={RouteName.CONTACT} component={ContactData} />
                <Route path={RouteName.SETTING} component={Setting} />
              </Switch>
              <AdminFooter />
            </>
          ) : isModerator && isAuthenticated ? (
            // Check if the user is a Moderator
            <>
              <AdminHeader />
              <Switch>
                {/* <Route path={RouteName.ORDERS} component={Orders} /> */}
                <Route path={RouteName.CONTACT} component={ContactData} />
              </Switch>
              <AdminFooter />
            </>
          ) : (
            // Default view for other users (non-admin, non-moderator)
            <>
              <Header />
              <Switch>
                <Route path={"/"} exact component={Main} />
                <Route path={RouteName.MAIN} exact component={Main} />
                <Route path={RouteName.CONTACT} component={ContactUs} />
                <Route path={RouteName.PRODUCTS} component={Products} />
                <Route path={RouteName.ABOUT} component={About} />
                <Route path={RouteName.PRODUCT_PAGE} component={ProductPage} />
                <Route path={RouteName.CART} component={Cart} />
                <Route path={RouteName.ORDERS} component={UserOrders} />
              </Switch>
              <Footer />
            </>
          )}
       </DataProvider>
    </Router>
  );
  

  // return (
  //   <Router>
      
  //     {isAdmin && isAuthenticated?
  //       <Router>
  //         <AdminHeader/>
  //         <Switch>
  //           <Route path={RouteName.ADD_PRODUCTS}>
  //             <AddProducts />
  //           </Route>
  //           <Route path={RouteName.ORDERS}>
  //             <Orders />
  //           </Route>
  //           <Route path={RouteName.CONTACT}>
  //             <ContactData />
  //           </Route>
  //         </Switch>
  //         <AdminFooter />
  //       </Router>
  //       :
  //     {isModerator && isAuthenticated?
  //       <Router>
  //       <Switch>
  //         <Route path={RouteName.ADD_PRODUCTS}>
  //           <AddProducts />
  //         </Route>
  //         <Route path={RouteName.ORDERS}>
  //           <Orders />
  //         </Route>
  //         <Route path={RouteName.CONTACT}>
  //           <ContactData />
  //         </Route>
  //       </Switch>
  //       <AdminFooter />
  //     </Router>

  //       :
  //       <>
  //         <Header/>
  //         <Route path={"/"} exact={true}>
  //           <Main />
  //         </Route>
  //         <Route path={RouteName.MAIN} exact={true}>
  //           <Main />
  //         </Route>
  //         <Route path={RouteName.CONTACT}>
  //           <ContactUs />
  //         </Route>
  //         <Route path={RouteName.PRODUCTS}>
  //           <Products />
  //         </Route>
  //         <Route path={RouteName.ABOUT}>
  //           <About />
  //         </Route>
  //         <Route path={RouteName.ADMIN_LOGIN} >
  //           <AdminLogin />
  //         </Route>
  //         <Route path={RouteName.PRODUCT_PAGE} >
  //           <ProductPage />
  //         </Route>
  //         <Route path={RouteName.CART} >
  //           <Cart />
  //         </Route>
  //         <Footer />
  //       </>




  //     }
  //     }
  //   </Router >
  // );
};


export default App;
