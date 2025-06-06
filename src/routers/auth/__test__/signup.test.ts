import request from 'supertest';
import {app } from '../../../app'


it('retunrns a 201 on successful signup',async ()=>{
    return request(app).post('/signup').send({
        email: 'tGZmZ@example.com',
        password: 'password'
    }).expect(201);
})
it('sets the cookie after successful signup',async ()=>{
    const res = await request(app).post('/signup').send({
        email: 'tGZmZ@example.com',
        password: 'password'
    }).expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
})