export class UserModel {
    public username: string;
    public hashedPassword: string;
    public databaseName: string;
    // The menu items the user has access to
    public menuItems: number[];
}