import jwt from "jsonwebtoken";
import "dotenv/config"

const auth = async (request, response, next) => {
    try {
        const token = request.headers.authorization.split(" ")[1];
        let decodedData = jwt.verify(token, process.env.KEY);
        request.userId = decodedData?.id;
        next();
    }
    catch (error) {
        return response.status(401).send(error);
    }
}

export default auth;
