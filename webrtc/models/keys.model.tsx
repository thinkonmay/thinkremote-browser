import { Log, LogLevel } from "../utils/log";

export enum EventCode{
    MouseWheel,
    MouseUp,
    MouseDown,

    MouseMoveRel,
    MouseMoveAbs,

    KeyUp,
    KeyDown,
    KeyPress,
    KeyReset,

    GamepadSlide,
    GamepadAxis,
    GamepadButtonUp,
    GamepadButtonDown,
    GamepadRumble,
   
    RelativeMouseOff,
    RelativeMouseOn,
}

export enum ShortcutCode{
    Fullscreen,
    PointerLock
}
export enum KeyCode{
    Shift = 0,
    Alt,
    Ctrl,

    F = "KeyF",
    P = "KeyP",
}




export class Shortcut {
    code : ShortcutCode
    keys : Array<KeyCode>
    Handler: ((a: void) => (void))


    constructor(code: ShortcutCode,
                keys : Array<KeyCode>,
                Handler: ((a: void) => (void))){
        this.code = code;
        this.keys = keys;
        this.Handler = Handler;
    }

    public HandleShortcut(event : KeyboardEvent) : Boolean {
        var shift = this.keys.includes(KeyCode.Shift) === event.shiftKey;
        var alt   = this.keys.includes(KeyCode.Alt)   === event.altKey;
        var ctrl  = this.keys.includes(KeyCode.Ctrl)  === event.ctrlKey;

        var key = false;
        this.keys.forEach(element => {
            if(element === event.code) {
                key = true; 
            }
        });

        if (shift && alt && ctrl && key) {
            event.preventDefault();
            Log(LogLevel.Infor,`shortcut fired with code ${this.code}`)
            this.Handler();
            return true;
        }
        return false;
    }
}



export class HIDMsg {
    code: EventCode
    data: Map<string,string>
    constructor(code: EventCode, data: any)
    {
        this.code = code;
        this.data = new Map<string,string>();
        Object.keys(data).forEach(function(key) {
            this.data.set(key,data[key]);
        }.bind(this));
    }

    public ToString() : string
    {
        switch (this.code) {
            case EventCode.KeyUp:
                return `ku|${this.data["button"]}`
            case EventCode.KeyDown:
                return `kd|${this.data["button"]}`
            case EventCode.KeyReset:
                return `kr`

            case EventCode.MouseUp:
                return `mu|${this.data["key"]}`
            case EventCode.MouseDown:
                return `md|${this.data["key"]}`
            case EventCode.MouseMoveRel:
                return `mmr|${this.data["dX"]}|${this.data["dY"]}`
            case EventCode.MouseMoveAbs:
                return `mma|${this.data["dX"]}|${this.data["dY"]}`
            case EventCode.MouseWheel:
                return `mw|${this.data["deltaY"]}`

            case EventCode.GamepadAxis:
                return `ga|${this.data["index"]}|${this.data["val"]}`
            case EventCode.GamepadButtonUp:
                return `gb|${this.data["index"]}|1`
            case EventCode.GamepadButtonDown:
                return `gb|${this.data["index"]}|${this.data["val"]}`
            case EventCode.GamepadSlide:
                return `gs|${this.data["deltaY"]}|${this.data["val"]}`

            default:
            return ""
        }
    }
}


