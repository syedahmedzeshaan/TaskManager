import dotenv from "dotenv";

dotenv.config(); 

export const PORT=process.env.PORT!;
export const JWT_SECRET=process.env.JWT_SECRET!;
export const MONGOOSE_URI=process.env.MONGOOSE_URI!;

