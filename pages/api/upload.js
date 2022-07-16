import fs from "fs";
import AWS from "aws-sdk";
import formidable from "formidable";

const s3Client = new AWS.S3({
    endpoint:process.env.DO_SPACES_URL,
    region:"fra1",
    credentials:{
        accessKeyId:process.env.DO_SPACES_ID,
        secretAccessKey:process.env.DO_SPACES_SECRET
    }
});

export const config = {
    api:{
        bodyParser:false
    }
}

// export default  async function handler(req,res){
//     const form = formidable();
//     form.parse(req,async(err,fields,files,{
//     if(!files.demo){
//         res.status(400).send("No file Upload ");
//     }
//     }))
// }

export default async function handler(req, res){
    const form = formidable();
    form.parse(req,async(err,fields,files)=>{
        if(!files.demo){
            res.status(400).send("NO file Uploaded");
            return;
        }

        try{
            return s3Client.putObject({
                Bucket:process.env.DO_SPACES_BUCKET,
                Key:files.demo.originalFilename,
                Body:fs.createReadStream(files.demo.filepath),
                ACL:"public-read",

            },
            async() => res.status(201).send("Successfully uploaded")
            );
        
         } catch(e){
        
        console.log("Error uploading");
        res.status(500).send("Error uploading");
        };
    
    });
}