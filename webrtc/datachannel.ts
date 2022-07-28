export class DataChannel
{
    HID: RTCDataChannel | null;

    constructor(chan: RTCDataChannel) {
        this.HID = chan;
    }

    public sendMessage (message : string) {
        if (this.HID == null) {
            return;
        }

        this.HID.send(message);
    }
    
    
    /**
     * Control data channel has been estalished, 
     * start report stream stats to slave
     * @param {Event} event 
     */
    
    public onDataChannel(event : RTCDataChannelEvent) 
    {
        this.HID= event.channel;
        var HID = this.HID;
        this.HID.onmessage = (event =>{
            if(event.data == "ping") {
                HID.send("ping");
            }
        });
    }
}

