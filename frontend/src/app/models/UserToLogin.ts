export class UserToLogin {

    userName?: String;
    password?: String;

    constructor({ userName, password }: { userName?: string, password?: String }) {
        this.userName = userName;
        this.password = password;
    }

}