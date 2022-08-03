import { setDebug } from "./log";

class UserResponse {
    Id : number;
    Error: string;
    Data: Map<string,string>
    constructor(id : number,
                error: string,
                data: any)
    {
        this.Id = id
        this.Error = error
        var Data = new Map<string,string>();
        Object.keys(data).forEach(function(key) {
            Data.set(key,data[key]);
        });
        this.Data = Data;
    }

    public toString(): string {
        var ret = {
            id: this.Id,
            error: this.Error,
            data: {},
        }
        
        this.Data.forEach((value: string,key: string,map: Map<string,string>) => {
            ret.data[key] = value;
        })

        return JSON.stringify(ret);
    }
}

class UserRequest {
    Id : number;
    Target : string;
    Headers: Map<string,string>
    Data: Map<string,string>

    constructor(id : number,
                target : string,
                headers: Map<string,string>,
                data: Map<string,string>)
    {
        this.Id = id
        this.Target = target


        this.Headers = headers;
        this.Data = data;

    }

    public toString(): string {
        var ret = {
            id: this.Id,
            target: this.Target,
            headers: {},
            data: {},
        }
        
        this.Headers.forEach((value: string,key: string,map: Map<string,string>) => {
            ret.headers[key] = value;
        })
        this.Data.forEach((value: string,key: string,map: Map<string,string>) => {
            ret.data[key] = value;
        })

        return JSON.stringify(ret);
    }
}


export class SignallingClient
{
    state: string | null;
    WebSocketConnection: WebSocket;
    PacketHandler : ((Data : Map<string,string>) => (void));
    ErrorHandler : ((n: void) => (void));


    constructor (url : string,
                 token : string,
                 PacketHandler : ((Data : Map<string,string>) => (void)),
                 ErrorHandler : ((n: void) => (void)))
    {
        this.state = "Disconnected";
        this.PacketHandler = PacketHandler;
        this.ErrorHandler = ErrorHandler;
        this.WebSocketConnection = new WebSocket(`${url}?token=${token}`);

        this.WebSocketConnection.onopen     = ((eve : Event) => { 
            this.onServerOpen(eve)
        });
    }

    /**
     * Fired whenever the signalling websocket is opened.
     * Sends the peer id to the signalling server.
     */
    private onServerOpen(event : Event)
    {
        this.state = 'connected';
        this.WebSocketConnection.onerror    = ((eve : Event) => { 
            this.onServerError()
        });

        this.WebSocketConnection.onmessage  = ((eve : MessageEvent) => { 
            this.onServerMessage(eve)
        });

        this.WebSocketConnection.onclose    = ((eve : Event) => { 
            this.onServerError()
        });
    }
    /**
     * send messsage to signalling server
     * @param {string} request_type 
     * @param {any} content 
     */
    public SignallingSend(Target : string, 
                          Data: Map<string,string>)
    {
        var dat =  new UserRequest(0,
                Target,
                new Map<string,string>(),
                Data).toString();
        setDebug(`sending message : ${dat}`);
        this.WebSocketConnection.send(dat);
    }

    /**
     * Fired whenever the signalling websocket emits and error.
     * Reconnects after 3 seconds.
     */
    private onServerError() 
    {
        this.state = 'disconnected';
        setDebug("websocket connection disconnected");
        this.ErrorHandler();
    }


    /**
     * handle message from signalling server during connection handshake
     * @param {Event} event 
     * @returns 
     */
    private onServerMessage(event : any) 
    {

        var msg = JSON.parse(event.data);
        var response = new UserResponse(msg.id,
                                        msg.error,
                                        msg.data);

        setDebug(`receive message : ${response.toString()}`);
        this.PacketHandler(response.Data);
    }
}



