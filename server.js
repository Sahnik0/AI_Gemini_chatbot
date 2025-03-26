require('dotenv').config();
const express= require('express')
const path = require('path')
const multer =require('multer')
const fs = require('fs')

const {GoogleGenerativeAI}= require('@google/generative-ai');
const { log } = require('console');

const app = express();

const uploads= multer({dest:"uploads/"})

if(!process.env.GEMINI_API_KEY){
    console.log("Error api key is missing in this env file");
    process.exit(1);    
}

const genAI= new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.post('/get', uploads.single("file"), async(req,res)=>{
    const userInput= req.body.msg;
    const file = req.file;

    try{
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let prompt=[userInput];
        if(file){
            const fileData= fs.readFileSync(file.path);
            const image={
                inlieneData:{
                    data:fileData.toString("base64"),
                    mimeType:file.mimetype,
                },
            };
            prompt.push(image)
        }

        const response = await model.generateContent(prompt);
        res.send(response.response.text());
    }catch(error){
        console.error("Error generating response: ", error);
        res.status(error.status || 500).send("An error occurred while generating the response.")   
    }finally{
        if(file){
            fs.unlinkSync(file.path);
        }
    }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    
})