import request from 'supertest';
import {app } from '../../../app'


it('should fetch the current user',async ()=>{
    const cookie = await global.signin();
    const res = await request(app).get('/current-user').set('Cookie',cookie).send().expect(200);
    expect(res.body.currentUser.email).toEqual('tGZmT@example.com');
})