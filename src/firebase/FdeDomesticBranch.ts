// branchesService.ts
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { STATIC_DATA } from "../dbUtils";
import { FdeDomesticBranch } from "../models/FdeDomesticBranch";

const branchesDocRef = doc(db, STATIC_DATA, "branches");



const phoneNumberRegex = /^(?:\+94|0)(71|72|75|76|77|78|79|11|21|22|23|24|25|26|27|28|29|31|32|33|34|35|36|37|38|39|41|42|43|44|45|46|47|48|49|51|52|53|54|55|56|57|58|59|61|62|63|64|65|66|67|68|69|81|82|83|84|85|86|87|88|89|91|92|93|94|95|96|97|98|99)\d{7}$/;


const normalizePhoneNumber = (input: string): string | null => {
    const trimmed = input.trim();

    if (phoneNumberRegex.test(trimmed)) {
        // If already starts with +94, return as-is
        if (trimmed.startsWith("+94")) {
        return trimmed;
        }

        // If starts with 0, convert to +94
        if (trimmed.startsWith("0")) {
        return "+94" + trimmed.slice(1);
        }
    }

    return null; // Not valid
};

/**
 * Get all branch names
 */
export const getAllBranchData = async (): Promise<FdeDomesticBranch[]> => {
  const snap = await getDoc(branchesDocRef);
  if (!snap.exists()) return [];

  const data = snap.data() as FdeDomesticBranch[];
  return data
};

/**
 * Add a new branch or update an existing one
 */
export const addOrUpdateBranch = async (
  branchName: string,
  data: { phones: string[]; address: string }
): Promise<void> => {
  try { 
    if (!branchName.trim()) {
      throw new Error("Branch name cannot be empty.");
    }
    if (data && typeof data !== "object") {
      throw new Error("Invalid data format.");
    }
    if (data.phones && !Array.isArray(data.phones)) {
      throw new Error("Phones must be an array.");
    }
    if (data.address && typeof data.address !== "string") {
      throw new Error("Address must be a string.");
    }
    // Normalize phone numbers
    const normalizedPhones = data.phones ? data.phones.map((phone) => normalizePhoneNumber(phone)).filter(Boolean) : [];

    // Check if the branch already exists
    const snap = await getDoc(branchesDocRef);
    if (!snap.exists()) {
      throw new Error("Branches document does not exist.");
    }
    const existingData = snap.data();
    const branch = existingData[branchName];
    if (branch) {
      throw new Error("Branch already exists. Use update to modify it.");
    } 
    // Add or update the branch 
    await updateDoc(branchesDocRef, {
      [branchName]: {
        ...data,
        phones: normalizedPhones,
      },
    });
    console.log(`Branch "${branchName}" added/updated successfully.`);
  } catch (error) {
    console.error("Firestore update failed:", error);
    throw new Error("Failed to update Firestore. Please try again later.");
  }
};



/**
 * Add a phone number to a branch (if not already present)
 */
export const addPhoneNumber = async (
  branchName: string,
  newPhone: string
): Promise<void> => {
  try {
    if (!branchName.trim()) {
      throw new Error("Branch name is required.");
    }

    if (!phoneNumberRegex.test(newPhone)) {
      throw new Error("Invalid phone number format.");
    }

    const normalizedPhone = normalizePhoneNumber(newPhone);
    if (!normalizedPhone) {
      throw new Error("Failed to normalize phone number.");
    }

    const snap = await getDoc(branchesDocRef);
    if (!snap.exists()) {
      throw new Error("Branches document does not exist.");
    }

    const data = snap.data();
    const branch = data[branchName];
    if (!branch) {
      throw new Error(`Branch "${branchName}" not found.`);
    }

    const phones: string[] = Array.isArray(branch.phones) ? branch.phones : [];
    if (phones.includes(normalizedPhone)) {
      throw new Error("This phone number already exists.");

    }

    const updatedPhones = [...phones, normalizedPhone];

    await updateDoc(branchesDocRef, {
      [`${branchName}.phones`]: updatedPhones,
    });

    console.log(`Phone number ${normalizedPhone} added to branch "${branchName}".`);
  } catch (error) {
    console.error("Failed to add phone number:", error);
    throw error; // Rethrow if you want the caller to handle it
  }
};


/**
 * Remove a phone number from a branch
 */
export const removePhoneNumber = async (
  branchName: string,
  phoneToRemove: string
): Promise<void> => {
  const snap = await getDoc(branchesDocRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const branch = data[branchName];
  if (!branch) return;

  const phones = (branch.phones || []).filter(
    (phone: string) => phone !== phoneToRemove
  );

  await updateDoc(branchesDocRef, {
    [`${branchName}.phones`]: phones,
  });
};

/**
 * Update address of a branch only
 */
export const updateBranchAddress = async (
  branchName: string,
  newAddress: string
): Promise<void> => {
  await updateDoc(branchesDocRef, {
    [`${branchName}.address`]: newAddress,
  });
};
