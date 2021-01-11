import { Response } from 'express'

// declare global {

//     interface Response {
//         writeError(status: number, message: string): Response;
//     }
// }

// Response.prototype.writeError = function (status: number, message: string ) {
//     this.status(status).json({ error: message })
//     return this
// }