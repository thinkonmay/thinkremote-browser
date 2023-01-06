import { FrameTransform } from "../frametransform"



/**
 * Encodes and decodes frames using the WebCodec API.
 * @implements {FrameTransform} in pipeline.js
 */
export class WebCodecTransform implements FrameTransform{ // eslint-disable-line no-unused-vars


    decoder_ : VideoDecoder
    encoder_ : VideoEncoder
    controller_ : TransformStreamDefaultController<VideoFrame>

    constructor() {
        // Encoder and decoder are initialized in init()
        this.decoder_ = null;
        this.encoder_ = null;
        this.controller_ = null;
    }

    /** @override */
    async init(cd: string) {
        // console.log('[WebCodecTransform] Initializing encoder and decoder');
        // this.decoder_ = new VideoDecoder({
        //     output: frame => this.handleDecodedFrame(frame),
        //     error: this.error
        // });
        // this.encoder_ = new VideoEncoder({
        //     output: frame => this.handleEncodedFrame(frame),
        //     error: this.error
        // });
        // this.decoder_.configure({codec: 'h264' });
        // this.encoder_.configure({codec: 'h264', height: 1080, width: 1920 });

        console.log('[WebCodecTransform] Initializing encoder and decoder');
        this.decoder_ = new VideoDecoder({
        output: frame => this.handleDecodedFrame(frame),
        error: this.error
        });
        this.encoder_ = new VideoEncoder({
        output: frame => this.handleEncodedFrame(frame),
        error: this.error
        });
        this.encoder_.configure({codec: 'vp8', width: 640, height: 480});

        // interface VideoDecoderConfig {
        //     codec: string;
        //     codedHeight?: number | undefined;
        //     codedWidth?: number | undefined;
        //     colorSpace?: VideoColorSpaceInit | undefined;
        //     description?: AllowSharedBufferSource | undefined;
        //     displayAspectHeight?: number | undefined;
        //     displayAspectWidth?: number | undefined;
        //     hardwareAcceleration?: HardwarePreference | undefined;
        //     optimizeForLatency?: boolean | undefined;
        // }
        this.decoder_.configure({codec: 'vp8' });

    }

    /** @override */
    async transform(frame: VideoFrame, controller: TransformStreamDefaultController<VideoFrame>) {
        if (!this.encoder_) {
            frame.close();
            return;
        }


        try {
            this.controller_ = controller;
            this.encoder_.encode(frame);
        } finally {
            frame.close();
        }
    }

    destroy() {}

    /* Helper functions */
    handleEncodedFrame(encodedFrame) {
        this.decoder_.decode(encodedFrame);
    }

    handleDecodedFrame(videoFrame) {
        if (!this.controller_) {
            videoFrame.close();
            return;
        }
        this.controller_.enqueue(videoFrame);
    }

    error(e) {
        console.log('[WebCodecTransform] Bad stuff happened: ' + e);
    }
}
