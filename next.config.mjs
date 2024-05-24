/** @type {import('next').NextConfig} */
const nextConfig = {
    expiremental:{
        serverActions:true , 
        severComponentsExternalPackage:[
            "mongoose"
        ]
    } , 
    images:{
        remotePatterns:[
            {
                protocol:'https' ,
                hostname:"img.clerk.com"
            },
            { 
                protocol:"https",
                hostname:"img.clerk.dev"
            },
            
            { 
                protocol:"https",
                hostname:"uploadthng.com"
            }, 
            
            { 
                protocol:"https",
                hostname:"placehold.co"
            }
        ]
    }
};

export default nextConfig;
