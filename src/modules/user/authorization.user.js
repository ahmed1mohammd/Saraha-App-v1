import { roleEnum } from "../../DB/models/user.model.js";
export const endPoint = {
    profile:[roleEnum.user , roleEnum.admin],
    restoreAccount:[roleEnum.admin],
    hardDeleteAccount:[roleEnum.admin]

    
} 