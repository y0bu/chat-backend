import request from "supertest";
import app from "../app";
import "dotenv/config";
import User from "../models/User.js";
import Message from "../models/Message.js";

beforeAll(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
});

describe("signup testing", () => {

    it("signup regularly", async () => {
        const response = await request(app).post("/api/v1/users/signup/").send({ username: "yoav", password: "P@ssW0rd24" });
        expect(response.text).toEqual("OK");
        expect(response.statusCode).toEqual(201);
    });

    it("signup with taken username", async () => {
        const response = await request(app).post("/api/v1/users/signup/").send({ username: "yoav", password: "P@ssW0rd24" });
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("username already exists");
    });

    it("signup with bad password", async () => {
        const response = await request(app).post("/api/v1/users/signup/").send({ username: "test", password: "p" });
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("Password is either too long or too short.");
    });

    it("signup with bad password", async () => {
        const response = await request(app).post("/api/v1/users/signup/").send({ username: "test", password: "ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp" });
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("Password is either too long or too short.");
    });

    it("signup with bad password", async () => {
        const response = await request(app).post("/api/v1/users/signup/").send({ username: "test", password: "aaaaaaaaaa" });
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("Password must have atleast two uppercase characters.");
    });

    it("signup with bad password", async () => {
        const response = await request(app).post("/api/v1/users/signup/").send({ username: "test", password: "AAAAAAAAAA" });
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("Password must have atleast two lowercase characters.");
    });

    it("signup with bad password", async () => {
        const response = await request(app).post("/api/v1/users/signup/").send({ username: "test", password: "aaAAAAAAAA" });
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("Password must have atleast two digits.");
    });

    it("signup with bad password", async () => {
        const response = await request(app).post("/api/v1/users/signup/").send({ username: "test", password: "aa12AAAAAA" });
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("Password must have atleast one symbol.");
    });

});

describe("signin testing", () => {

    it("regular signin", async () => {
        const response = await request(app).post("/api/v1/users/signin/").send({ username: "yoav", password: "P@ssW0rd24" });
        expect(response.statusCode).toEqual(201);
        expect(response.text).not.toBeNull();
        expect(response.text).not.toBeUndefined();
        expect(response.text).not.toEqual("");
    });
    
    it("signin, but username is incorrect", async () => {
        const response = await request(app).post("/api/v1/users/signin/").send({ username: "y0@v", password: "P@ssW0rd24" });
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("either username or password are incorrect.");
    });

    it("signin, but password is incorrect", async () => {
        const response = await request(app).post("/api/v1/users/signin/").send({ username: "yoav", password: "P@ssW0rd24!!!" });
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("either username or password are incorrect.");
    });

});
