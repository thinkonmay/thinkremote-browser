export enum LogLevel {
    Debug,
    Infor,
    Warning,
    Error,
    Fatal
}

export enum ConnectionEvent {
    ApplicationStarted,

    WebSocketConnecting,
    WebSocketConnected,
    WebSocketDisconnected,

    WaitingAvailableDevice,
    WaitingAvailableDeviceSelection,

    ExchangingSignalingMessage,

    WebRTCConnectionChecking,
    WebRTCConnectionDoneChecking,

    ReceivedVideoStream,
    ReceivedAudioStream,
    ReceivedDatachannel,
}


class Logger {
    logs: Array<string>
    failNotifiers: Array<((message: string) => (void))>
    connectionState: string


    constructor() {
        this.logs = new Array<string>();
        this.failNotifiers = new Array<((message: string) => (void))>();
    }

    filterEvent(data: string){
        this.logs.push(data);
    }

    getConnectionState() {
        return this.connectionState;
    }

    AddNotifier(notifier: ((message :string) => (void))) {
        this.failNotifiers.push(notifier);
    }
}

var init = false;
var loggerSingleton: Logger;
function getLoggerSingleton(): Logger{
    if(!init) {
        loggerSingleton = new Logger();
        init = true;
    }

    return loggerSingleton;
}



export function AddNotifier(notifier: (message :string) => (void)){
    let logger = getLoggerSingleton()
    logger.AddNotifier(notifier);
}



export function Log(a : LogLevel, message: string) {
    let logger = getLoggerSingleton()
    logger.filterEvent(JSON.stringify(a));
    console.log(a);
}

export function LogConnectionEvent(a : ConnectionEvent) {
    let logger = getLoggerSingleton()
    logger.filterEvent(JSON.stringify(a));
    console.log(a);
}