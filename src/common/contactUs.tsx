import React, { useEffect, useState } from "react";
import { Contact } from "../models/Contactus";
import { AdminService } from "../services/AdminService";
import Swal from "sweetalert2";

const containerStyle = {
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const position = {
    lat: 6.0535,
    lng: 80.2209
};

const ContactUs: React.FC = () => {
    const [contact, setContact] = useState<Contact>({} as Contact);

    const addProduct = async () => {
        if (!contact?.name) {
            Swal.fire({
                icon: "error",
                title: "Name required",
                confirmButtonColor: "#FD7F00",
            });
        } else if (!contact?.email) {
            Swal.fire({
                icon: "error",
                title: "Email required",
                confirmButtonColor: "#FD7F00",
            });

        } else if (!contact?.message) {
            Swal.fire({
                icon: "error",
                title: "Message required",
                confirmButtonColor: "#FD7F00",
            });

        } else {
            const updatedProduct: Contact = {
                name: contact?.name,
                email: contact.email,
                subject: contact?.subject,
                message: contact?.message
            }

            AdminService.addContact(updatedProduct).then(res => {
                setContact({ ...contact, name: "", email: "", message: "", subject: "" })
            });
        }
    }
    return (
        <React.Fragment>
            <div className="content-wrapper ">
                <main>

                    <div className="slider-area ">
                        <div className="slider-active">
                            <div className="single-slider hero-overly2  slider-height2 d-flex align-items-center slider-bg2">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-8 col-md-8">
                                            <div className="hero__caption hero__caption2">
                                                <h1 data-animation="fadeInUp" data-delay=".4s">Contact Us</h1>
                                                <nav aria-label="breadcrumb">
                                                    <ol className="breadcrumb">
                                                        <li className="breadcrumb-item"><a href="index-2.html">Home</a></li>
                                                        <li className="breadcrumb-item"><a href="#">Contact</a></li>
                                                    </ol>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <section className="contact-section">
                        <div className="container">


                            <div className="d-none d-sm-block mb-5 pb-4">
                                <div className="row">
                                    <div className="col-12">
                                        <h2 className="contact-title">Get in Touch</h2>
                                    </div>
                                    <div className="col-lg-8">
                                        <form className="form-contact contact_form"

                                            id="contactForm" >
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <input className="form-control valid" name="name" type="text"
                                                            value={contact?.name}
                                                            onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                                            placeholder="Enter your name" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <input className="form-control valid" name="email" type="email"
                                                            value={contact?.email}
                                                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                                            placeholder="Email" />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <input className="form-control" name="subject" type="text"
                                                            value={contact?.subject}
                                                            onChange={(e) => setContact({ ...contact, subject: e.target.value })}
                                                            placeholder="Enter Subject" />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <textarea className="form-control w-100 h-10" name="message"
                                                            value={contact?.message}
                                                            onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder=" Enter Message" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group mt-3" >
                                                <button type="button" onClick={addProduct} className="button button-contactForm boxed-btn">Send</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-lg-3 offset-lg-1">
                                        <div className="media contact-info">
                                            <span className="contact-info__icon"><i className="ti-home"></i></span>
                                            <div className="media-body">
                                                <h3>Galle, Sri Lanka.</h3>
                                                <p>Galle, CA 91770</p>
                                            </div>
                                        </div>
                                        <div className="media contact-info">
                                            <span className="contact-info__icon"><i className="ti-tablet"></i></span>
                                            <div className="media-body">
                                                <h3>+94 77 986 365</h3>
                                                <p>Mon to Fri 9am to 6pm</p>
                                            </div>
                                        </div>
                                        <div className="media contact-info">
                                            <span className="contact-info__icon"><i className="ti-email"></i></span>
                                            <div className="media-body">
                                                <h3><a href="$"
                                                    className="__cf_email__"
                                                    data-cfemail="5c2f292c2c332e281c3f3330332e30353e723f3331">[email&#160;protected]</a>
                                                </h3>
                                                <p>Send us your query anytime!</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>
            </div>

        </React.Fragment>
    );
};

export default ContactUs;
