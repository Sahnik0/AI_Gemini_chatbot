import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { fields, files } = await new Promise((resolve, reject) => {
                const form = new formidable.IncomingForm({
                    uploadDir: path.join(process.cwd(), "uploads"),
                    keepExtensions: true
                });
                
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    else resolve({ fields, files });
                });
            });

            const msg = fields.msg ? fields.msg[0] : "";
            const file = files.file ? files.file[0] : null;

            console.log("Received message:", msg);
            if (file) {
                console.log("Received file:", file.originalFilename);
            }


            const response = `Processing: ${msg}${file ? ` (with file: ${file.originalFilename})` : ''}`;
            
            res.status(200).send(response);

        } catch (error) {
            console.error("Form parsing error:", error);
            res.status(500).send(`Server Error: ${error.message}`);
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}