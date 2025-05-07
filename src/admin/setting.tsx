import React, { useState, useEffect, FormEvent } from "react";
import{db} from "../firebase/firebaseConfig"
import { Form } from "react-bootstrap";
import { getBothCurrentAndLastTrackings, getBothWebsiteAndManualOrderIds, getCurrentTracking, updateBothCurrentAndLastTrackings, updateManualLastOrderId, updateWebsiteLastOrderId } from "../firebase/systemDocument";
import { m } from "@clerk/clerk-react/dist/useAuth-BQT424bY";
import { addOrUpdateBranch, addPhoneNumber, getAllBranchData } from "../firebase/FdeDomesticBranch";
import { BranchData, FdeDomesticBranch } from "../models/FdeDomesticBranch";
import { Input, Label } from "reactstrap";
import { c } from "framer-motion/dist/types.d-6pKw1mTI";




const Setting: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);

    const [databaseFirstTracking, setDatabaseFirstTracking] = useState<number>(0);
    const [databaseLastTracking, setDatabaseLastTracking] = useState<number>(0);

    const [databaseWebsiteOrderId, setDatabaseWebsiteOrderId] = useState<number>(0);
    const [databaseManualOrderId, setDatabaseManualOrderId] = useState<number>(0);

    const [firstTracking, setFirstTracking] = useState<number>(0);
    const [lastTracking, setLastTracking] = useState<number>(0);

    const [websiteOrderId, setWebsiteOrderId] = useState<number>(0);
    const [manualOrderId, setManualOrderId] = useState<number>(0);

    const [branches, setBranches] = useState<FdeDomesticBranch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] =  useState<string>("");


    const [newBranch, setNewBranch] = useState<string>("");
    const [contact1, setContact1] = useState<string>("");
    const [contact2, setContact2] = useState<string>("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // To store error messages

      // Regex for validating Sri Lankan contact numbers
    const phoneNumberRegex = /^(?:\+94|0)(71|72|75|76|77|78|79|11|21|22|23|24|25|26|27|28|29|31|32|33|34|35|36|37|38|39|41|42|43|44|45|46|47|48|49|51|52|53|54|55|56|57|58|59|61|62|63|64|65|66|67|68|69|81|82|83|84|85|86|87|88|89|91|92|93|94|95|96|97|98|99)\d{7}$/;


    useEffect(() => {
        fetchProducts();  // Fetch products when component mounts
        fetchBranches();
    }, []);

      
    const fetchBranches = async () => {
        const branchList = await getAllBranchData();
        setBranches(branchList);
      };
    
      
  
    const fetchProducts = async () => {
        setLoading(true);  // Start loading
        try {
            getBothCurrentAndLastTrackings().then((res) => {
                if (res) { 
                    setDatabaseFirstTracking(res[0] || 0); // Set first tracking number
                    setFirstTracking(res[0] || 0); // Set first tracking number

                    setDatabaseLastTracking(res[1] || 0); // Set last tracking number
                    setLastTracking(res[1] || 0); // Set last tracking number
                }
            });
            getBothWebsiteAndManualOrderIds().then((res) => {
                if (res) { 
                    setDatabaseWebsiteOrderId(res[0] || 0); // Set first tracking number
                    setWebsiteOrderId(res[0] || 0); // Set first tracking number

                    setDatabaseManualOrderId(res[1] || 0); // Set last tracking number
                    setManualOrderId(res[1] || 0); // Set last tracking number
                }
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);  // Stop loading
        }
    };
    

    
    // Example of usage:
    const handleConfirmTracking = async () => {
        if (isNaN(firstTracking) || isNaN(lastTracking)) {
            console.error("Invalid tracking values: First Tracking or Last Tracking is NaN");
            alert("Error: One or both tracking values are invalid. Please enter valid numbers.");
            return;
        }
        const confirmed = window.confirm("Are you sure, you want to change tracking numbers?");
        if (!confirmed) {
            return; // User canceled the action
        }else{
   
            if(firstTracking===0 || lastTracking===0){
                alert("Error - Tracking numbers are zero")
                return
            }
    
            if (firstTracking < 0 || lastTracking < 0){
                alert("Error - Tracking numbers should be positive")
                return
            }
            if (firstTracking >= lastTracking){ 
                alert("Error - From tracking number should be less than To tracking number")
                return
            }
    
            if (firstTracking < lastTracking){ 
                if (firstTracking.toString().length !== lastTracking.toString().length ){
                    alert("Attention: The tracking numbers do not have the same number of digits.");
                    const confirmed2 = window.confirm("Are you sure to continue?");
                    if(!confirmed2){
                        return // User canceled the action
                    }
                }

                if(databaseFirstTracking !== firstTracking || databaseLastTracking !== lastTracking){
                    updateBothCurrentAndLastTrackings(firstTracking, lastTracking).then((res) => {
                        if (res) {
                            alert("Tracking numbers updated successfully");
                            console.log("Tracking numbers updated successfully");
                        }else{
                            alert("Failed to update tracking numbers");
                            console.log("Failed to update tracking numbers");
                        }
                    });
                }else{
                    alert("Tracking numbers are not changed, no need to update")
                    console.log("Tracking numbers are not changed,, no need to update");
                }
                return
            }else{

                alert("Error - From tracking number should be less than To tracking number")
                console.log("Error - From tracking number should be less than To tracking number")
                return
            }   
            
        }
  
    };

    const handleCancelTracking = () => {

        setFirstTracking(databaseFirstTracking);
        setLastTracking(databaseLastTracking);
    }


    // Example of usage:
    const handleConfirmWebsiteOrderId = async () => {
        if (isNaN(websiteOrderId)) {
            console.error("Invalid Website Order ID value");
            alert("Error: Order ID can not be empty. Please enter valid number.");
            return;
        }
        const confirmed = window.confirm("Are you sure, you want to change the Website Order ID?");
        if (!confirmed) {
            return; // User canceled the action
        }else{

            if(websiteOrderId===0){
                const confirmed = window.confirm("Are you sure you want to proceed? The website orders order ID is zero.");
                if (!confirmed) {
                    return; // User canceled the action
                }   
            }
    
            if (websiteOrderId < 0){
                alert("Error - Website Order IDs should be positive")
                return
            }
    
 

            if(databaseWebsiteOrderId !== websiteOrderId){
                updateWebsiteLastOrderId(websiteOrderId).then((res) => {
                    if (res) {
                        alert("Website Order ID updated successfully");
                        console.log("TWebsite Order ID updated successfully");
                    }else{
                        alert("Failed to update Website Order ID ");
                        console.log("Failed to update Website Order ID ");
                    }
                });
            }else{
                alert("Website Order ID is not changed, no need to update")
                console.log("Website Order ID  is not changed,, no need to update");
            }
            return
 
        }
    
    };
    const handleCancelWebsiteOrderId = () => {
        // Handle cancel action here
        console.log("Cancel button clicked");
        setWebsiteOrderId(databaseWebsiteOrderId);
    }


    
    // Example of usage:
    const handleConfirmManualOrderId = async () => {
        if (isNaN(manualOrderId)) {
            console.error("Invalid Manual Order ID value");
            alert("Error: Order ID can not be empty. Please enter valid number.");
            return;
        }
        const confirmed = window.confirm("Are you sure, you want to change the manual Order ID?");
        if (!confirmed) {
            return; // User canceled the action
        }else{

            if(manualOrderId===0){
                const confirmed = window.confirm("Are you sure you want to proceed? The website orders order ID is zero.");
                if (!confirmed) {
                    return; // User canceled the action
                }   
            }
    
            if (manualOrderId < 0){
                alert("Error - Website Order IDs should be positive")
                return
            }
    
 

            if(databaseManualOrderId !== manualOrderId){
                updateManualLastOrderId(manualOrderId).then((res) => {
                    if (res) {
                        alert("Manual Order ID updated successfully");
                        console.log("Manual Order ID updated successfully");
                    }else{
                        alert("Failed to update Manual Order ID ");
                        console.log("Failed to update Manual Order ID ");
                    }
                });
            }else{
                alert("Manual Order ID is not changed, no need to update")
                console.log("Manual Order ID  is not changed,, no need to update");
            }
            return
 
        }
    
    };
    const handleCancelManualOrderId = () => {
        // Handle cancel action here
        console.log("Cancel button clicked");
        setManualOrderId(databaseManualOrderId);
    }


    
    const handleAddingContactNumber = async (newContact: string, branchName: string) => {
        // Step 1: Validate input
        let validationErrors: { [key: string]: string } = {};
        if (branchName.trim() === "") {
            alert("Please Select a branch") 
            return
          }
        if (newContact.trim() === "") {
            alert("Please Enter a contact number") 
            return
          }
          
          
        if (newContact && !phoneNumberRegex.test(newContact)) {
            validationErrors.newPhoneNumber = "Invalid number";
        }
      
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        const isConfirmed = window.confirm("Are you sure?");
        if (!isConfirmed) return; // If not confirmed, exit early
      
      
        try {
          await addPhoneNumber(branchName, newContact);
          alert("Contact number added successfully!");
          setNewPhoneNumber(""); // Or however you're managing input state
          setErrors({});
          fetchBranches(); // Refresh data if needed
        } catch (error) {
          console.error("Error updating branch:", error);
          alert(error || "Failed to update branch. Please try again.");
        }
    };

    const handleCancelAddingContactNumber= () => {
        setNewPhoneNumber("");
        setSelectedBranch("");
        setErrors({}); // Clear errors on cancel
        return 
    }
      

    // Handle form submission
    const handleAddingNewBranch= async (newBranch: string,contact1: string,contact2:string) => {

        if(newBranch.trim() === "") {
            alert("Please Enter a branch name")
            return
        }

        const newBranchName = newBranch
        .trim()                      // Remove leading/trailing spaces
        .replace(/\s+/g, " ")        // Replace multiple spaces with a single space
        .toLowerCase()               // Lowercase all letters
        .split(" ")                  // Split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each
        .join(" ");                  // Join back to a string

        // Validate contact numbers
        let validationErrors: { [key: string]: string } = {};
        if (!newBranchName) {
            validationErrors.newBranchName = "Branch name is required";
        }

        if (contact1 && !phoneNumberRegex.test(contact1)) {
            validationErrors.contact1 = "Invalid number";
        }
        if (contact2 && !phoneNumberRegex.test(contact2)) {
            validationErrors.contact2 = "Invalid number";
        }


        // If there are validation errors, set them and don't submit the form
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const matchingBranchName = Object.keys(branches).find(
            branch => branch.toLowerCase() === newBranchName.toLowerCase()
          );

        if (matchingBranchName) {
              alert("Branch name already exists. Please enter a different name.");  
              return; 
          }

          
        const isConfirmed = window.confirm("Are you sure?");
        if (!isConfirmed) return; // If not confirmed, exit early

          
        try {
            const cleanedBranchName = newBranchName;
            const cleanedPhones = [contact1, contact2].filter(Boolean);
            
            const branchData = {
              phones: cleanedPhones,
              address: "", // replace with actual address input if applicable
            };
          
            await addOrUpdateBranch(cleanedBranchName, branchData);
          
            alert("New branch added successfully!");
            setNewBranch("");
            setContact1("");
            setContact2("");
            fetchBranches(); // Refresh the branches
          } catch (error: any) {
            console.error("Error adding new branch:", error);
            alert(error.message || "Failed to add new branch. Please try again.");
          }
          
          

    }

    const handleCancelAddingNewBranch = () => {
        setNewBranch("");
        setContact1("");
        setContact2("");
        setErrors({}); // Clear errors on cancel
        return 
    }

    return (
        <React.Fragment>
            <div className="content-wrapper ">
                <main>
                    <div className="container">
                        <div className="row row--30  mb-3 mt-10">
                            <div className="col-lg-12  mb-3 mt-20">
                                <div className="course-sidebar-3 sidebar-top-position">
                                    <div className="edu-course-widget widget-course-summery ">
                                        <div>
                                            <div>
                                                <h2 style={{paddingBottom:"20px"}}>SETTING</h2>
                                                
                                                

                                            </div>
                                            <div className="course-summery-list">
                                                {loading ? (
                                                    <p>Loading...</p>
                                                ) : (
                                                    
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                                        <div style={{ width: "auto", height: "auto", border: "2px solid black", padding: "20px" }}>
                                                            <div>
                                                                <h3 style={{padding:"0px 0px 10px 0px"}}>Add New FDE Branch Contact Number :</h3>

                                                                <div>
                                                                    <div>
                                                                        <label htmlFor="branchSelect">Select Branch:&nbsp;&nbsp;</label>
                                                                        <select
                                                                            id="branchSelect"
                                                                            value={selectedBranch}
                                                                            onChange={(e) => setSelectedBranch(e.target.value)}
                                                                            >
                                                                            <option value="">Select</option>
                                                                            {Object.entries(branches).map(([branchName]) => (
                                                                                <option key={branchName} value={branchName}>
                                                                                {branchName}
                                                                                </option>
                                                                            ))}
                                                                        </select>

                                                                    </div>
                                                                    <div>
                                                                        
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <Label htmlFor="newContact">Add New Contact :</Label>
                
                                                                        <Input 
                                                                            type="tel" 
                                                                            id="newContact" 
                                                                            className="form-control" 
                                                                            placeholder="Enter number"
                                                                            required
                                                                            value={newPhoneNumber}
                                                                            invalid={!!errors.newPhoneNumber} // Show validation error
                                                                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                                                                        />
                                                                        {errors.newPhoneNumber && <div className="required">{errors.newPhoneNumber}</div>}

                                                                    </div>
                                                                    <div >
                                                                        <button type="submit" className="custom-confirm-button" style={{ marginRight: "10px" }} onClick={() => handleAddingContactNumber(newPhoneNumber, selectedBranch)}>
                                                                            <span>Confirm</span>
                                                                        </button>
                                                                        <button className="custom-cancel-button"  onClick={() => handleCancelAddingContactNumber()}>
                                                                            <span>Cancel</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ width: "auto", height: "auto", border: "2px solid black", padding: "20px" }}>
                                                            <div>
                                                                <h3 style={{padding:"0px 0px 10px 0px"}}>Add New FDE Branch:</h3>
                                                                <div>
                                                                    <div className="form-group">
                                                                        <Label htmlFor="branchName">Branch Name :</Label>
                                                                        <Input 
                                                                            type="text" 
                                                                            id="branchName" 
                                                                            className="form-control"
                                                                            placeholder="Enter branch name"
                                                                            value={newBranch}
                                                                            onChange={(e) => setNewBranch(e.target.value)}
                                                                            
                                                                        />
                                                                    </div>
                                                                    <div>   
                                                                        <Label htmlFor="contact1">
                                                                            Contact Num 01
                                                                        </Label>
                                                                        <Input
                                                                            type="tel"
                                                                            id="contact1"
                                                                            value={contact1}
                                                                            onChange={(e) => setContact1(e.target.value)}
                                                                            placeholder="Enter number"
                                                                            invalid={!!errors.contact1} // Show validation error
                                                                        />
                                                                        {errors.contact1 && <div className="required">{errors.contact1}</div>}
                                                                    </div>
                                                                    <div>   
                                                                        <Label htmlFor="contact2">
                                                                            Contact Num 02
                                                                        </Label>
                                                                        <Input
                                                                            type="tel"
                                                                            id="contact2"
                                                                            value={contact2}
                                                                            onChange={(e) => setContact2(e.target.value)}
                                                                            required
                                                                            placeholder="Enter number"
                                                                            invalid={!!errors.contact2} // Show validation error
                                                                        />
                                                                        {errors.contact2 && <div className="required">{errors.contact2}</div>}
                                                                    </div>
                                                                    <div >
                                                                        <button type="submit" className="custom-confirm-button" style={{ marginRight: "10px" }} onClick={() => handleAddingNewBranch(newBranch,contact1, contact2)}>
                                                                            <span>Confirm</span>
                                                                        </button>
                                                                        <button className="custom-cancel-button"  onClick={() => handleCancelAddingNewBranch()}>
                                                                            <span>Cancel</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ width: "auto", height: "auto", border: "2px solid black", padding: "20px" }}>
                                                            <div>
                                                                <h3 style={{padding:"0px 0px 10px 0px"}}>Set Tracking Numbers :</h3>

                                                                <div>
                                                                    <div className="form-group">
                                                                        <Label htmlFor="firstTracking">From :</Label>
                                                                        <Input 
                                                                            type="number" 
                                                                            id="firstTracking" 
                                                                            className="form-control" 
                                                                            value={firstTracking}
                                                                            onInput={(e) => {
                                                                                const target = e.target as HTMLInputElement;
                                                                                target.value = target.value.replace(/[^0-9]/g, '');
                                                                                setFirstTracking(parseInt(target.value, 10)); // Update state with the new value
                                                                                
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label htmlFor="lastTracking">To :</label>
                                                                        <input 
                                                                            type="number" 
                                                                            id="lastTracking" 
                                                                            className="form-control" 
                                                                            value={lastTracking}
                                                                            onInput={(e) => {
                                                                                const target = e.target as HTMLInputElement;
                                                                                target.value = target.value.replace(/[^0-9]/g, '');
                                                                                setLastTracking(parseInt(target.value, 10)); // Update state with the new value

                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div >
                                                                        <button type="submit" className="custom-confirm-button" style={{ marginRight: "10px" }} onClick={() => handleConfirmTracking()}>
                                                                            <span>Confirm</span>
                                                                        </button>
                                                                        <button className="custom-cancel-button"  onClick={() => handleCancelTracking()}>
                                                                            <span>Cancel</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                        
                                                        <div style={{ width: "auto", height: "auto", border: "2px solid black", padding: "20px" }}>
                                                            <div>
                                                                <h3 style={{padding:"0px 0px 10px 0px"}}>Set Facebook Orders Last Order ID :</h3>

                                                                <div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="facebookLastOrder">Facebook :</label>
                                                                        <input 
                                                                            type="number" 
                                                                            id="facebookLastOrder" 
                                                                            className="form-control" 
                                                                            value={manualOrderId} 
                                                                            onInput={(e) => {
                                                                                const target = e.target as HTMLInputElement;
                                                                                target.value = target.value.replace(/[^0-9]/g, '');
                                                                                setManualOrderId(parseInt(target.value, 10)); // Update state with the new value
                                                                            }} />
                                                                    </div>
                                                                    <div >
                                                                        <button type="submit" className="custom-confirm-button"  style={{ marginRight: "10px" }} onClick={() => handleConfirmManualOrderId()}>
                                                                            <span>Confirm</span>
                                                                        </button>
                                                                        <button className="custom-cancel-button" onClick={() => handleCancelManualOrderId()}>
                                                                            <span>Cancel</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div style={{ width: "auto", height: "auto", border: "2px solid black", padding: "20px" }}>
                                                            <div>
                                                                <h3 style={{padding:"0px 0px 10px 0px"}}>Set Website Orders Last Order ID :</h3>

                                                                <div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="websiteLastOrder">Website :</label>
                                                                        <input 
                                                                            type="number" 
                                                                            id="websiteLastOrder" 
                                                                            className="form-control" 
                                                                            value={websiteOrderId} 
                                                                            onInput={(e) => {
                                                                                const target = e.target as HTMLInputElement;
                                                                                target.value = target.value.replace(/[^0-9]/g, '');
                                                                                setWebsiteOrderId(parseInt(target.value, 10)); // Update state with the new value
                                                                            }}
                                                                            />
                                                                    </div>
                                                                    <div  >
                                                                        <button type="submit" className="custom-confirm-button" style={{ marginRight: "10px" }} onClick={() => handleConfirmWebsiteOrderId()}>
                                                                            <span >Confirm</span>
                                                                        </button>
                                                                        <button className="custom-cancel-button"  onClick={() => handleCancelWebsiteOrderId()}>
                                                                            <span>Cancel</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                            
                                                )}
                                            </div>
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

export default Setting;

