import request from "supertest";
import app from "../app";
import "dotenv/config";
import User from "../models/User.js";
import Message from "../models/Message.js";

beforeAll(function () {
    expect.extend({
        tobeNullOrUndefined(received) {
            if (received === null || received === undefined) return { pass: true };
            else return { message: () => `Is not equal to Null or Undefined.`, pass: false };
        }
    })
});

var token;
var id;
var tokenTwo;

describe("first, lets insert some values to the database", () => {
    it("...", async () => {
        await User.deleteMany({});
        await Message.deleteMany({});
        await request(app).post("/api/v1/users/signup/").send({ username: "tester-admin", password: "P@ssW0rd24" });
        const response = await request(app).post("/api/v1/users/signin/").send({ username: "tester-admin", password: "P@ssW0rd24" });
        token = response.text;
    });
});

describe("adding messages", () => {

    it("inserting a message", async () => {
        await request(app).post("/api/v1/messages/create/").set("Authorization", `Bearer ${token}`).send({ message: "message test" });
    });

    it("inserting a message, but wierd token(Authorization header)", async () => {
        await request(app).post("/api/v1/messages/create/").set("Authorization", `Bearer vdfvdf.fvfdfd.dfgsf`).send({ message: "bad" });
    });

    it("inseting a message without token", async () => {
        await request(app).post("/api/v1/messages/create/").send({ message: "without" });
    });

});

describe("getting messages test", () => {

    var data;

    it("getting data from the server.", async () => {
        const response = await request(app).post("/api/v1/messages/").set("Authorization", `Bearer ${token}`);
        data = eval(response.text);
    });

    it("this is from the first 'it', which is testing insertion of regular message.", () => {
        expect(data[0].message).toEqual("message test");
        expect(data[0].creator).toEqual("tester-admin");
        expect(data[0].user).toEqual("");
        id = data[0]._id;
    });

    it("this is from the second 'it', which is testing insertion of regular message with weird token, thus, I must not see another message.", () => {
        expect(data[1]).tobeNullOrUndefined();
    });

    it("this is from the third 'it', which is testing insertion of regular message without token, thus, I must not see another message.", () => {
        expect(data[2]).tobeNullOrUndefined();
    });

});

describe("removing the message test", () => {
    it("remove the message", async () => {
        await request(app).post("/api/v1/messages/delete/").set("Authorization", `Bearer ${token}`).send({ id: id });
        const response = await request(app).post("/api/v1/messages/").set("Authorization", `Bearer ${token}`);
        const data = eval(response.text);
        expect(data).toEqual([]);
    });
});

describe("inserting a message with new user and trying to delete it with the first user with id", () => {
    
    it("inserting accounts", async () => {
        await request(app).post("/api/v1/users/signup/").send({ username: "tester-admin-2", password: "P@ssW0rd24" });
        const response = await request(app).post("/api/v1/users/signin/").send({ username: "tester-admin-2", password: "P@ssW0rd24" });
        tokenTwo = response.text;
    });

    it("inserting messages", async () => {
        await request(app).post("/api/v1/messages/create/").set("Authorization", `Bearer ${token}`).send({ message: "message test, but delete with other user" });
        const response = await request(app).post("/api/v1/messages/").set("Authorization", `Bearer ${tokenTwo}`);
        const data = eval(response.text);
        expect(data[0].user).not.toEqual("");
        id = data[0]._id;
    });

    it("trying to delete them with the second user and checking whether the data is deleted or not", async () => {
        await request(app).delete("/api/v1/messages/delete/").set("Authorization", `Bearer ${tokenTwo}`).send({ id: id });
        const response = await request(app).post("/api/v1/messages/").set("Authorization", `Bearer ${token}`);
        const data = eval(response.text);
        expect(data).not.toEqual([]);
    });

});
