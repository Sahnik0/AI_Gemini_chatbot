import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { fields, files } = await new Promise((resolve, reject) => {
                const form = new formidable.IncomingForm();
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    else resolve({ fields, files });
                });
            });
            const msg = fields.msg || "";
            res.status(200).send(`Received message: ${msg}`);
        } catch (error) {
            console.error("Form parsing error:", error);
            res.status(500).send("Server Error");
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}