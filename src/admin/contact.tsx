import React, { useState, useEffect } from "react";
import { Product } from "../models/Products";
import { Card, CardBody, Col, Form, Input, Label, Container, Nav, NavItem, NavLink, Row, TabContent, Modal, TabPane } from "reactstrap";
import { toast } from "react-toastify";
import { AdminService } from "../services/AdminService";
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import Swal from "sweetalert2";
import { Contact } from "../models/Contactus";
import{db} from "../firebase/firebaseConfig"


const classNames = require("classnames");

const generateItemCode = (): string => {
    const randomNumbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Random three-digit number
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter (A-Z)
    return `${randomLetter}${randomNumbers}`;
};


const ContactData: React.FC = () => {
    const [contactUs, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'ContactUs'));
            const fetchedProducts: Contact[] = [];
            for (const doc of querySnapshot.docs) {
                const productData = doc.data();
                fetchedProducts.push({ id: doc.id, ...productData });
            }
            setLoading(false);
            setContacts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <React.Fragment>
            <div className="content-wrapper ">
                <main>
                    <div className="container">
                        <div className="row row--30  mb-3 mt-10">
                            <div className="col-lg-12  mb-3 mt-20">
                                <div className="course-sidebar-3 sidebar-top-position">
                                    <div className="edu-course-widget widget-course-summery ">
                                                <div className="row">
                                                    {contactUs !== undefined && contactUs.length > 0 ? (
                                                        <>

                                                            <div className="table-responsive">
                                                                <table className="table cart-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col" className="product-subtotal">Name</th>
                                                                            <th scope="col" className="product-subtotal">Email</th>
                                                                            <th scope="col" className="product-subtotal">Subject</th>
                                                                            <th scope="col" className="product-subtotal">Message</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {contactUs.map(contact => (
                                                                            <tr key={contact.id}>
                                                                                <td>{contact.name}</td>
                                                                                <td>{contact.email}</td>
                                                                                <td>{contact.subject}</td>
                                                                                <td>{contact.message}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </>
                                                    ) : (
                                                        loading ? (
                                                            <div className="loading-text">Loading...</div>
                                                        ) : (
                                                            <div>No Contacts Available</div>
                                                        )
                                                    )}
                                                </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main >
            </div >

        </React.Fragment >
    );
};

export default ContactData;

