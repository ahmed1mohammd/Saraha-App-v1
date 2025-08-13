

import path from 'node:path';
import * as dotenv from 'dotenv';
// dotenv.config({path:path.join('./src/config/.env.prod')})
dotenv.config({})
import cors from 'cors'
import express from 'express';
import connectDB from './DB/connection.js';
import authController from './modules/auth/auth.controller.js'
import { globalErrorHandling } from './utils/response.js';
import userController from './modules/user/user.controller.js'
import messageController from './modules/message/message.controller.js'
import { startTokenCleanupCron } from './utils/security.js/token.security.js';
import morgan from 'morgan';
import helmet from 'helmet';
import {rateLimit} from 'express-rate-limit';

const bootstrap= async()=>{
const app = express()
const port = process.env.PORT ||5000
//db
await connectDB();
startTokenCleanupCron();
app.use(cors());
app.use(helmet())
app.use(morgan('common'))

const limit = rateLimit({
    windowMs:60* 60 * 1000,
    limit:200
})
app.use(limit)

app.use("/uploads", express.static(path.resolve('./src/uploads')));

app.use(express.json())
//App-routing
app.get('/', (req, res) => res.send('Hello World❤️😍'))
app.use("/auth" , authController)
app.use("/user" , userController)
app.use("/message" , messageController)

//Error Handling
app.use(globalErrorHandling)

app.listen(port, () => console.log(`Server runnig on port ${port}🚀✅`))

}


export default bootstrap
