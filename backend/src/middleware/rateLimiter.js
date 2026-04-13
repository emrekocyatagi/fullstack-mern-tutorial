import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const {success} = await ratelimit.limit("my-limit-key");//in future we are going to put identifier here instead of "my-limit-key
        if (!success) {
            return res.status(429).json({message: "Too many requests. Please try again later."});
        }
        next();
    } catch (error) {
        console.error("Error in rate limiter middleware:", error);
        next(error);
    }
}


export default rateLimiter;