//AsyncHandler
export const AsyncHandler = (fn)=>{
  return async (req , res , next )=>{
    try {
      await fn (req , res , next);
    } catch (error) {
      let cause = (typeof error.cause === 'number') ? error.cause : 500;
      if (error instanceof Error) {
        next (new Error (error.message, { cause }));
      } else {
        next (new Error ("Internal server error", { cause: 500 }));
      }
    }
  }
}

//Success response
export const successResponse = ({res, message = "Done" , status = 200 , data = {}}) =>{
  return res.status(status).json({message ,data})
}

//Error 
export const globalErrorHandling = (error, req, res, next)=>{
return res.status(error.cause || 400).json({
  err_message:error.message 
  })
}
