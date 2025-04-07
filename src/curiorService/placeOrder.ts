interface PostData {
    api_key: string;
    client_id: string;
    waybill_id: string;
    order_id: string;
    parcel_weight: string;
    parcel_description: string;
    recipient_name: string;
    recipient_contact_1: string;
    recipient_contact_2: string;
    recipient_address: string;
    recipient_city: string;
    amount: string;
    exchange: string;
  }
  
  const makeFetchRequest = async (url: string, postData: PostData): Promise<any> => {
    try {
      // Make the POST request using the Fetch API
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // or 'application/json' if your API expects JSON
        },
        body: new URLSearchParams(postData as any), // Converts object to query parameters
      });
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response as JSON or text depending on the API response format
      const data = await response.text(); // Use `.json()` if the response is JSON
      return data;
    } catch (error) {
      console.error("Error during fetch request:", error);
      throw error;
    }
  };
  
  // Public function to call the API with dynamic data
  export const sendParcelData = async (
    waybill_id: string,
    order_id: string,
    parcel_weight: string,
    parcel_description: string,
    recipient_name: string,
    recipient_contact_1: string,
    recipient_contact_2: string,
    recipient_address: string,
    recipient_city: string,
    amount: string,
    exchange: string
  ): Promise<any> => {
    const apiEndpoint = "https://www.fdedomestic.com/api/parcel/existing_waybill_api_v1.php";
  
    // Constructing the postData object dynamically
    const postData: PostData = {
      api_key: process.env.REACT_APP_FDEDOMESTIC_API_KEY!, // Secure key from environment variables
      client_id: process.env.REACT_APP_FDEDOMESTIC_CLIENT_ID!, // Secure client ID from environment variables
      waybill_id,
      order_id,
      parcel_weight,
      parcel_description,
      recipient_name,
      recipient_contact_1,
      recipient_contact_2,
      recipient_address,
      recipient_city,
      amount,
      exchange,
    };
  
    // Call the fetch request function
    return makeFetchRequest(apiEndpoint, postData);
  };
  