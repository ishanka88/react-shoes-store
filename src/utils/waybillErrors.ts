// Define a type for all allowed error codes
export type WaybillErrorCode = 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 |
                               211 | 212 | 213 | 214 | 215 | 216 | 217 | 218;

// Create a record type to map error codes to their messages
export const waybillErrorMessages: Record<WaybillErrorCode, string> = {
  201: "Incorrect waybill type. Only allow CRE or CCP",
  202: "The waybill is used",
  203: "The waybill is not yet assigned",
  204: "Inactive Client",
  205: "Invalid order id",
  206: "Invalid weight",
  207: "Empty or invalid parcel description",
  208: "Empty or invalid name",
  209: "Invalid contact number 1",
  210: "Invalid contact number 2",
  211: "Empty or invalid address",
  212: "Empty or invalid amount (If you have CRE numbers, you can ignore or set as a 0 value to this)",
  213: "Invalid city",
  214: "Parcel insert unsuccessfully",
  215: "Invalid or inactive client",
  216: "Invalid API key",
  217: "Invalid exchange value",
  218: "System maintain mode is activated"
};
