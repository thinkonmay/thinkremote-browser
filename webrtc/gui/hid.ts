import { ConnectionEvent, Log, LogConnectionEvent, LogLevel } from "../utils/log";
import { EventCode } from "../models/keys.model";
import { HIDMsg, KeyCode, Shortcut, ShortcutCode } from "../models/keys.model";




class Screen {
    constructor() {
        this.ClientHeight = 0;
        this.ClientWidth = 0;
        this.ClientLeft = 0;
        this.ClientTop = 0;
        this.Streamheight = 0;
        this.StreamWidth = 0;
        this.desiredRatio = 0;
    }
    /*
    * client resolution display on client screen
    */
    public ClientWidth: number;
    public ClientHeight: number;
    /*
    * client resolution display on client screen
    */
    public ClientTop: number;
    public ClientLeft: number;

    public StreamWidth: number;
    public Streamheight: number;
    
    public desiredRatio: number;
}

export class HID {
    private prev_buttons : Map<number,boolean>;
    private prev_sliders : Map<number,number>;
    private prev_axis    : Map<number,number>;

    private shortcuts: Array<Shortcut>

    private relativeMouse : boolean
    private Screen : Screen;


    private video: HTMLVideoElement
    private SendFunc: ((data: string) => (void))
    private ResetVideo: (() => (void))

    constructor(videoElement: HTMLVideoElement, 
                Sendfunc: ((data:string)=>(void)),
                ResetVideo: (() => (void))){
        this.prev_buttons = new Map<number,boolean>();
        this.prev_sliders = new Map<number,number>();
        this.prev_axis    = new Map<number,number>();


        this.video = videoElement;
        this.SendFunc = Sendfunc;
        this.ResetVideo = ResetVideo;
        this.Screen = new Screen();

        /**
         * video event
         */
        this.video.addEventListener('contextmenu',   ((event: Event) => {event.preventDefault()})); ///disable content menu key on remote control

        /**
         * mouse event
         */
        this.video.addEventListener('wheel',          this.mouseWheel.bind(this));
        this.video.addEventListener('mousemove',      this.mouseButtonMovement.bind(this));
        this.video.addEventListener('mousedown',      this.mouseButtonDown.bind(this));
        this.video.addEventListener('mouseup',        this.mouseButtonUp.bind(this));
        
        /**
         * keyboard event
         */
        window.addEventListener('keydown',        this.keydown.bind(this));
        window.addEventListener('keyup',          this.keyup.bind(this));

        window.addEventListener("gamepadconnected",     this.connectGamepad.bind(this));
        window.addEventListener("gamepaddisconnected",  this.disconnectGamepad.bind(this));

        /**
         * mouse lock event
         */
        this.video.addEventListener('mouseleave',     this.mouseLeaveEvent.bind(this));
        this.video.addEventListener('mouseenter',     this.mouseEnterEvent.bind(this));




        this.shortcuts = new Array<Shortcut>();
        this.shortcuts.push(new Shortcut(ShortcutCode.Fullscreen,[KeyCode.Ctrl,KeyCode.Shift,KeyCode.F],(()=> { this.video.parentElement.requestFullscreen(); })))
        this.shortcuts.push(new Shortcut(ShortcutCode.PointerLock,[KeyCode.Ctrl,KeyCode.Shift,KeyCode.P],this.lockPointer.bind(this)))

        setInterval(() => this.runButton(), 1);
        setInterval(() => this.runAxis(), 1);
        setInterval(() => this.runSlider(), 1);
        setInterval(() => {
            this.relativeMouse = !(document.pointerLockElement == null);
        }, 100);
    }

    private isFullscreen(): boolean { 
        return document.fullscreenElement != null;
    };


    public lockPointer() : void {
        if(!document.pointerLockElement) {
            this.SendFunc((new HIDMsg(EventCode.RelativeMouseOn,{ }).ToString()))
            this.video.requestPointerLock();
        } else {
            this.SendFunc((new HIDMsg(EventCode.RelativeMouseOff,{ }).ToString()))
            document.exitPointerLock();
        }
    }

    connectGamepad (event: GamepadEvent) : void {
        if (event.gamepad.mapping === "standard") {
            this.SendFunc((new HIDMsg(EventCode.GamepadConnect,{
                gamepad_id: event.gamepad.index,
            }).ToString()))
        } 
    };

    disconnectGamepad (event: GamepadEvent) : void {
        if (event.gamepad.mapping === "standard") {
            this.SendFunc((new HIDMsg(EventCode.GamepadDisconnect,{
                gamepad_id: event.gamepad.index,
            }).ToString()))
        }
    };

    runButton() : void {
        navigator.getGamepads().forEach((gamepad: Gamepad,gamepad_id: number) =>{
            if (gamepad == null) 
                return;
                
            
            gamepad.buttons.forEach((button: GamepadButton,index: number) => {
                if (index == 6 || index == 7) { // slider
                } else {
                    var pressed = button.pressed

                    if(this.prev_buttons.get(index) == pressed)
                        return;

                    this.SendFunc((new HIDMsg(pressed ?  EventCode.GamepadButtonUp : EventCode.GamepadButtonDown,{ 
                        gamepad_id: gamepad_id,
                        index: index
                    }).ToString()))

                    this.prev_buttons.set(index,pressed);
                }
            })
        })
    };
    runSlider() : void {
        navigator.getGamepads().forEach((gamepad: Gamepad,gamepad_id: number) =>{
            if (gamepad == null) 
                return;

            gamepad.buttons.forEach((button: GamepadButton,index: number) => {
                if (index == 6 || index == 7) { // slider
                    var value = button.value

                    if(Math.abs(this.prev_sliders.get(index) - value) < 0.000001) 
                        return;
                    

                    this.SendFunc((new HIDMsg(EventCode.GamepadSlide, {
                        gamepad_id: gamepad_id,
                        index: index,
                        val: value
                    }).ToString()))

                    this.prev_sliders.set(index,value)
                } 
            })
        })
    };
    runAxis() : void {
        navigator.getGamepads().forEach((gamepad: Gamepad,gamepad_id: number) =>{
            if (gamepad == null) 
                return;

            gamepad.axes.forEach((value: number, index: number) => {
                if(Math.abs(this.prev_axis.get(index) - value) < 0.000001) 
                    return;
                
                this.SendFunc((new HIDMsg(EventCode.GamepadAxis,{ 
                    gamepad_id: gamepad_id,
                    index: index,
                    val: value
                }).ToString()))

                this.prev_axis.set(index,value)
            })
        })
    };



    mouseEnterEvent(event: MouseEvent) {
        Log(LogLevel.Debug,"Mouse enter")
        this.SendFunc((new HIDMsg(EventCode.KeyReset,{ }).ToString()))
        this.ResetVideo();
    }
    mouseLeaveEvent(event: MouseEvent) {
        Log(LogLevel.Debug,"Mouse leave")
        this.SendFunc((new HIDMsg(EventCode.KeyReset,{ }).ToString()))
        this.ResetVideo();
    }
    keydown(event: KeyboardEvent) {
        event.preventDefault();

        let disable_send = false;
        this.shortcuts.forEach((element: Shortcut) => {
            let triggered = element.HandleShortcut(event);

            if (triggered) 
                disable_send = true;
        })

        if((event.key == "Esc" || event.key == "Escape") && this.isFullscreen()) {
            this.shortcuts.forEach((element: Shortcut) => {
                if (element.code == ShortcutCode.PointerLock) {
                    element.ManualTrigger();
                }
            })
        }


        if (disable_send) 
            return;


        let jsKey = event.key;
        let code = EventCode.KeyDown
        this.SendFunc((new HIDMsg(code,{
            key: jsKey,
        })).ToString());
    }
    keyup(event: KeyboardEvent) {
        let jsKey = event.key;
        let code = EventCode.KeyUp;
        this.SendFunc((new HIDMsg(code,{
            key: jsKey,
        })).ToString());
        event.preventDefault();
    }
    mouseWheel(event: WheelEvent){
        let code = EventCode.MouseWheel
        this.SendFunc((new HIDMsg(code,{
            deltaY: Math.round(event.deltaY),
        })).ToString());
    }
    mouseButtonMovement(event: MouseEvent){
        this.elementConfig(this.video)

        if (!this.relativeMouse) {
            let code = EventCode.MouseMoveAbs
            let mousePosition_X = this.clientToServerX(event.clientX);
            let mousePosition_Y = this.clientToServerY(event.clientY);
            this.SendFunc((new HIDMsg(code,{
                dX: mousePosition_X,
                dY: mousePosition_Y,
            })).ToString());
        } else {
            let code = EventCode.MouseMoveRel
            this.SendFunc((new HIDMsg(code,{
                dX: event.movementX,
                dY: event.movementY,
            })).ToString());
        }
    }
    mouseButtonDown(event: MouseEvent){
        let code = EventCode.MouseDown
        this.SendFunc((new HIDMsg(code,{
            button: event.button
        })).ToString());
    }
    mouseButtonUp(event: MouseEvent){
        let code = EventCode.MouseUp
        this.SendFunc((new HIDMsg(code,{
            button: event.button
        })).ToString());
    }



    clientToServerY(clientY: number): number
    {
        return (clientY - this.Screen.ClientTop) / this.Screen.ClientHeight;
    }

    clientToServerX(clientX: number): number 
    {
        return (clientX - this.Screen.ClientLeft) / this.Screen.ClientWidth;
    }

    elementConfig(VideoElement: HTMLVideoElement) 
    {
        this.Screen.ClientWidth  =  VideoElement.offsetWidth;
        this.Screen.ClientHeight =  VideoElement.offsetHeight;
        this.Screen.ClientTop    =  VideoElement.offsetTop;
        this.Screen.ClientLeft   =  VideoElement.offsetLeft;

        this.Screen.StreamWidth  =  VideoElement.videoWidth;
        this.Screen.Streamheight =  VideoElement.videoHeight;

        let desiredRatio = this.Screen.StreamWidth / this.Screen.Streamheight;
        let HTMLVideoElementRatio = this.Screen.ClientWidth / this.Screen.ClientHeight;

        if (HTMLVideoElementRatio > desiredRatio) {
            let virtualWidth = this.Screen.ClientHeight * desiredRatio
            let virtualLeft = ( this.Screen.ClientWidth - virtualWidth ) / 2;

            this.Screen.ClientWidth = virtualWidth
            this.Screen.ClientLeft = virtualLeft
        }
    }
}