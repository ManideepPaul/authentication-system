import jwt from "jsonwebtoken";

// console.log(process.env.SECRET_KEY)

const auth = (req, res, next) => {
    console.log(req.cookies)
    const token =
        req.cookies.token ||
        req.body.token ||
        req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(403).send("token is missing")
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decode)
        req.user = decode;
        // bring in info from DB
    } catch (error) {
        return res.status(401).send('Invalid token')
    }

    return next();
}

export default auth;