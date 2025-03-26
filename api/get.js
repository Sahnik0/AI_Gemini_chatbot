export default function handler(req, res) {
    if (req.method === "POST") {
        const msg = req.body.msg || "";
        
        res.status(200).send(`Received message: ${msg}`);
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}