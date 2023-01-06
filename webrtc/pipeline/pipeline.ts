import { createProcessedMediaStream, FrameTransform } from "./transform/frametransform";
import { MediaStreamSink } from "./sink/sink";





/**
 * Assembles a MediaStreamSource, FrameTransform, and MediaStreamSink together.
 */
export class Pipeline { // eslint-disable-line no-unused-vars
    codec             : string;
    frameTransform_   : FrameTransform
    sink_             : MediaStreamSink
    abortController_  : AbortController;

    source_           : MediaStream;
    processedStream_  : MediaStream;

    constructor(codec: string) {
        this.codec = codec
        this.frameTransform_ = null;
        this.sink_ = null;
        this.source_ = null;
        this.processedStream_ = null;
        this.abortController_ = new AbortController();
    }


    /**
     * Sets a new source for the pipeline.
     */
    async updateSource(mediaStreamSource: MediaStream) {
        this.source_ = mediaStreamSource;
        console.log(
            '[Pipeline] Updated source.',
            'debug.pipeline.source_ = ', this.source_);
        await this.maybeStartPipeline_();
    }

    /**
     * Sets a new transform for the pipeline.
     */
    async updateTransform(frameTransform: FrameTransform) {
        if (this.frameTransform_) this.frameTransform_.destroy();
            this.frameTransform_ = frameTransform;
            console.log(
                '[Pipeline] Updated frame transform.',
                'debug.pipeline.frameTransform_ = ', this.frameTransform_);

        if (this.processedStream_) {
            await this.frameTransform_.init(this.codec);
        } else {
            await this.maybeStartPipeline_();
        }
    }

    /**
     * Sets a new sink for the pipeline.
     */
    async updateSink(mediaStreamSink: MediaStreamSink) {
        if (this.sink_) this.sink_.destroy();
            this.sink_ = mediaStreamSink;
            console.log(
                '[Pipeline] Updated sink.', 'debug.pipeline.sink_ = ', this.sink_);
            if (this.processedStream_) {
            await this.sink_.setMediaStream(this.processedStream_);
        } else {
            await this.maybeStartPipeline_();
        }
    }












    /** @private */
    async maybeStartPipeline_() {
        if (this.processedStream_ || !this.source_ || !this.frameTransform_ || !this.sink_) {
            return;
        }

        const sourceStream = this.source_;
        await this.frameTransform_.init(this.codec);
        try {
        this.processedStream_ = createProcessedMediaStream(
            sourceStream, async (frame, controller) => {
                if (this.frameTransform_) {
                    await this.frameTransform_.transform(frame, controller);
                }

                return
            }, this.abortController_.signal);
        } catch (e) {
        this.destroy();
        return;
        }
        await this.sink_.setMediaStream(this.processedStream_);
        console.log(
            '[Pipeline] Pipeline started.',
            'debug.pipeline.abortController_ =', this.abortController_);
    }
    /** Frees any resources used by this object. */
    destroy(): void {
        console.log('[Pipeline] Destroying Pipeline');
        this.abortController_.abort();
        if (this.frameTransform_) this.frameTransform_.destroy();
        if (this.sink_) this.sink_.destroy();
    }
}
