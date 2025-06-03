import { MongoMemoryServer } from "mongodb-memory-server";
import Request from "supertest";
import mongoose from "mongoose";
import { app }  from "../app";
// import { request } from "express";

let mongo: any;

declare global{
    var signin: ()=>Promise<string[]>
    }

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfadad';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);

});

beforeEach(async () => {
    const collections = await mongoose.connection.db?.collections();
    if(collections){
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});


afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.signin = async():Promise<string[]>=>{
    const res = await Request(app).post('/signup').send({
        email: 'tGZmT@example.com',
        password: 'password'
    }).expect(201);

    const cookie =  res.get('Set-Cookie');
    return cookie || [] as string[]
}