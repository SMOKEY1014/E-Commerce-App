export class User {
    constructor(
        public email: string,
        public password:string,
        public phone?: string,
        public name?: string,
        public _id?: string,
        public type?: string,
        public status?: string
    ) {}
}