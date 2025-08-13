import { AsyncHandler } from "../utils/response.js";
import { decodedToken } from "../utils/security.js/token.security.js";

export const authentication = AsyncHandler(async (req, res, next) => {
 
   const { user , decoded}= await decodedToken({ authorization: req.headers.authorization, next }) || {};
   req.user = user;
  req.decoded = decoded;
  return next();
});

export const authorization = (accessRoles = []) => {
  return AsyncHandler(async (req, res, next) => {
    console.log({ accessRoles, role: req.user.role, result: accessRoles.includes(req.user.role) });

    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("Not authroized account", { cause: 403 }));
    }

    return next();
  });
};