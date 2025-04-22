import { getFirestore, doc, runTransaction ,Timestamp} from "firebase/firestore";
import { Order } from "../models/Order";
import { Product } from "../models/Products";
import { ORDERS,SYSTEM , PRODUCTS} from "../dbUtils";
import { db } from "./firebaseConfig";
import { NEW_ORDER } from "../utils/parcelsStatus";


export async function placeNewOrder(order: Order , fromWebsite:boolean) {
  const systemRef = doc(db, SYSTEM, "order_counter");

  try {

    const result = await runTransaction(db, async (transaction) => {
      // 1. Read the system document first
      const systemDoc = await transaction.get(systemRef);
      
      // 2. Read all product documents and validate stock
      const stockUpdates: { productRef: any, productData:Product, updatedSizes :{ [size: number]: number }[] ,availableStock:number, }[] = [];
      const productDataMap: { [key: string]: Product } = {};

      for (const item of order.orderItems || []) {
        const productRef = doc(db, PRODUCTS, item.productId || "");
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error(`Product with itemCode ${item.productId} not found.`);
        }

        const productData = productDoc.data() as Product;
        productDataMap[item.productId || ""] = productData;

        if (!productData.sizes) {
          throw new Error(`Sizes not found for product ${item.itemCode}`);
        }
        if (!productData.stock){
          throw new Error(`Stock not found for product ${item.itemCode}`);
        }

        let totalBuyQuantity = 0
        let updatedSizes :{ [size: number]: number }[] =[]

        for (const [size, qty] of Object.entries(item.sizes || {})) {
          const sizeNumber = Number(size);
          const availableQuantity = productData.sizes[sizeNumber] || 0;

          if (availableQuantity < qty) {
            throw new Error(`Not enough stock for size ${sizeNumber} of product ${item.itemCode}`);
          }

          const newStock = availableQuantity - qty;
          totalBuyQuantity += qty
          updatedSizes.push({[size]:newStock})
        }
        const availableStock = productData.stock -totalBuyQuantity
        stockUpdates.push({ productRef, productData ,updatedSizes, availableStock});
      }
      
      let newOrderId = 0;
      // 3. Determine the new order ID after all reads are done
      if(fromWebsite){
        const lastOrderId = systemDoc.exists() ? systemDoc.data().lastOrderIdWebsite : 1000;
        newOrderId = lastOrderId + 1;
      }else{
        if(order.orderId){
          newOrderId = order.orderId;
        }else{
          const lastOrderId = systemDoc.exists() ? systemDoc.data().lastOrderIdManual : 1000;
          newOrderId = lastOrderId + 1;
        }
      }

      
      const orderRef = doc(db, ORDERS, `${newOrderId}`);
      const orderDoc = await transaction.get(orderRef);
      
      if (orderDoc.exists()) {
        throw new Error(`Order with ID ${newOrderId} already exists.`);
      }

      // 4. Update the system document (set or update based on existence)

      if(fromWebsite){
          if (!systemDoc.exists()) {
            transaction.set(systemRef, { lastOrderIdWebsite: newOrderId });
          } else {
            transaction.update(systemRef, { lastOrderIdWebsite: newOrderId });
          }
      }else{
          if (!systemDoc.exists()) {
            transaction.set(systemRef, { lastOrderIdManual: newOrderId });
          } else {
            transaction.update(systemRef, { lastOrderIdManual: newOrderId });
          }
      }

      // 5. Create the new order document
      transaction.set(orderRef, {
        ...order,
        orderId: newOrderId,
        createdAt:  Timestamp.fromDate(new Date()),
        status: NEW_ORDER,
        fromWebsite:fromWebsite,
      });

      // 6. Update product stock levels
      stockUpdates.forEach(({ productRef, updatedSizes, availableStock , productData}) => {
        console.log(productRef);

        // Merging updated sizes into the existing sizes field
        const updatedSizesMap = updatedSizes.reduce((acc, sizeStock) => {
          Object.entries(sizeStock).forEach(([sizeStr, newStock]) => {
            // Type assertion: sizeStr is a string but we know it's a number in the original data
            const size = Number(sizeStr); // Convert size from string to number
            acc[size] = newStock; // Update or add new stock for each size
          });
          return acc;
        }, {} as { [size: number]: number }); // Ensure the accumulator is of the correct type

        transaction.update(productRef, {
          sizes: {
            ...productData.sizes, // Preserve existing sizes
            ...updatedSizesMap // Merge the new sizes updates
          },
          stock: availableStock
        });
      });

      return { success: true, orderId: newOrderId };
    });




    return result;
  } catch (error: unknown) {
    console.error("Error placing order:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unknown error occurred" };
  }
}