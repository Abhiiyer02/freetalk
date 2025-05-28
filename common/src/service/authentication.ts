import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

const scryptAsync = promisify(scrypt);

export class AuthenticationService{
    async pwdToHash(password:string){
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password,salt,64)) as Buffer
        return `${buf.toString('hex')}.${salt}`
    }

    async compare(storedPassword: string, enteredPassword: string){
        const [hasedPassword, salt] = storedPassword.split('.');
        const buf = ((await scryptAsync(enteredPassword,salt,64))) as Buffer
        return hasedPassword === buf.toString('hex')
    }
}

export const authenticationService = new AuthenticationService();