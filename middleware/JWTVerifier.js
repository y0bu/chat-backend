import jwt from "jsonwebtoken";

export const KEY = "ISRAEL";

const auth = async (request, response, next) => {
    try {
        const token = request.headers.authorization.split(" ")[1];
        let decodedData = jwt.verify(token, KEY);
        request.userId = decodedData?.id;
        next();
    }
    catch (error) {
        return response.status(401).send(error);
    }
}

export default auth;
