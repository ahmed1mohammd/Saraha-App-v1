import { v2 as cloudinary } from "cloudinary";



export const cloud = ()=>{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    }) 
    return cloudinary;
}

export const uploadsingle= async({file = {} , path="genaral"}={})=>{
    return await cloud().uploader.upload(file.path ,{
        folder:`${process.env.APPLICATION_NAME}/${path}`,
    });
}

export const uploadFiles = async ({ files = [], path = "general" } = {}) => {
    if (!Array.isArray(files)) throw new Error("files must be an array");
    const attachments = [];
    for (const file of files) {
        const { secure_url, public_id } = await uploadsingle({ file, path });
        attachments.push({ secure_url, public_id });
    }
    return attachments;
}

export const deleteSingle = async({public_id=""}={})=>{
    if(!public_id) throw new Error("Public ID is required");
    return await cloud().uploader.destroy(public_id);
}   

export const deleteFiles = async ({ public_ids = [], options = {} }) => {
    if (!public_ids.length) {
        
        return;
    }

    const cloudinaryOptions = {
        type: "upload",
        resource_type: "image",
        ...options,
    };

    try {
        const result = await cloud().api.delete_resources(public_ids, cloudinaryOptions);
        
        return result;
    } catch (error) {
        console.error("Error deleting files:", error);
        throw error;
    }
};
 
export const deletFolderByPrefix = async ({
    prefix = "",
} = {}) => {
    const cloudinaryInstance = cloud();
    await cloudinaryInstance.api.delete_resources_by_prefix(
        `${process.env.APPLICATION_NAME}/${prefix}`
    );
    await cloudinaryInstance.api.delete_folder(
        `${process.env.APPLICATION_NAME}/${prefix}`
    );
};
