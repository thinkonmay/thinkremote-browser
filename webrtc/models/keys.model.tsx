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

    GamepadConnect,
    GamepadDisconnect,
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

    public ManualTrigger(): void {
        this.Handler();
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
    data: Map<string,string | number>
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
                return `ku|${this.data.get("key")}`
            case EventCode.KeyDown:
                return `kd|${this.data.get("key")}`
            case EventCode.KeyReset:
                return `kr`

            case EventCode.MouseUp:
                return `mu|${this.data.get("button")}`
            case EventCode.MouseDown:
                return `md|${this.data.get("button")}`

            case EventCode.MouseMoveRel:
                return `mmr|${this.data.get("dX")}|${this.data.get("dY")}`
            case EventCode.MouseMoveAbs:
                return `mma|${this.data.get("dX")}|${this.data.get("dY")}`
            case EventCode.MouseWheel:
                return `mw|${this.data.get("deltaY")}`

            case EventCode.GamepadConnect:
                return `gcon|${this.data.get("gamepad_id")}`
            case EventCode.GamepadDisconnect:
                return `gdis|${this.data.get("gamepad_id")}`

            case EventCode.GamepadButtonUp:
                return `gb|${this.data.get("gamepad_id")}|${this.data.get("index")}|1`
            case EventCode.GamepadButtonDown:
                return `gb|${this.data.get("gamepad_id")}|${this.data.get("index")}|0`
            case EventCode.GamepadAxis:
                return `ga|${this.data.get("gamepad_id")}|${this.data.get("index")}|${this.data.get("val")}`
            case EventCode.GamepadSlide:
                return `gs|${this.data.get("gamepad_id")}|${this.data.get("index")}|${this.data.get("val")}`

            default:
            return ""
        }
    }
}


