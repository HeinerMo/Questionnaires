export class MessageDTO{
  
    id?: number;
    message?: string;

    constructor({ id, message }: {id?:number, message?:string}) {
        this.id = id;
        this.message = message;
    }

}