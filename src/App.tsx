import React, { useEffect, useState,useRef } from "react";
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
import { RouteName } from "./RouteName";
import { AuthService } from "./services/AuthService";
import AdminFooter from "./admin/footer";
import AdminHeader from "./admin/header";
import AdminLogin from "./common/adminLogin";
import AddProducts from "./admin/products";
import Orders from "./admin/orders";
import ContactData from "./admin/contact";

import { Redirect } from 'react-router-dom';
import{auth} from "./firebaseConfig"






const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [isAdmin, setIsAdmin] = useState<boolean>();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);

        AuthService.getUserFromEmail(user.email as string)
        .then((res) => {
              const userData: any = res
              if (userData) {
                  console.log(userData.role)
                  if (userData.role === "ADMIN") {
                      setIsAdmin(true)
                      console.log("awa")
                      // history.push("/dashboard");
                  } else {
                    setIsAdmin(false)
                  }
              } else {
                setIsAdmin(false)
              }
          });
        
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false)
      }
 
    });
  
    unsubscribe();  // Cleanup the listener
  });


  return (
    <Router>


      {isAdmin && isAuthenticated?
        <Router>
          <AdminHeader />
          <Switch>
            <Route path={RouteName.ADD_PRODUCTS}>
              <AddProducts />
            </Route>
            <Route path={RouteName.ORDERS}>
              <Orders />
            </Route>
            <Route path={RouteName.CONTACT}>
              <ContactData />
            </Route>
          </Switch>
          <AdminFooter />
        </Router>
        :
        <>
          <Header/>
          <Route path={"/"} exact={true}>
            <Main />
          </Route>
          <Route path={RouteName.MAIN} exact={true}>
            <Main />
          </Route>
          <Route path={RouteName.CONTACT}>
            <ContactUs />
          </Route>
          <Route path={RouteName.PRODUCTS}>
            <Products />
          </Route>
          <Route path={RouteName.ABOUT}>
            <About />
          </Route>
          <Route path={RouteName.ADMIN_LOGIN} >
            <AdminLogin />
          </Route>
          <Route path={RouteName.PRODUCT_PAGE} >
            <ProductPage />
          </Route>
          <Route path={RouteName.CART} >
            <Cart />
          </Route>
          <Footer />
        </>
      }
    </Router >
  );
};


export default App;
