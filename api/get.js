import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false, 
    },
};

export default function handler(req, res) {
    if (req.method === "POST") {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).send("Server Error");
                return;
            }
            const msg = fields.msg || "";
            res.status(200).send(`Received message: ${msg}`);
        });
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}