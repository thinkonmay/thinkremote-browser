/*
 *  Copyright (c) 2020 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

import { MediaStreamSink } from "../sink";


/**
 * Displays the output stream in a video element.
 */
export class VideoSink implements MediaStreamSink{ // eslint-disable-line no-unused-vars
    video_: HTMLVideoElement
    debugPath_ : string

    constructor(video: HTMLVideoElement) {
        this.video_ = video;
        this.debugPath_ = 'debug.pipeline.sink_';
    }

    /**
     * Sets the path to this object from the debug global var.
     * @param {string} path
     */
    setDebugPath(path: string) {
        this.debugPath_ = path;
    }

    async setMediaStream(stream) {
        console.log('[VideoSink] Setting sink stream.', stream);
        this.video_.srcObject = stream;
        this.video_.play();
    }


    destroy() {
        if (this.video_) {
        console.log('[VideoSink] Stopping sink video');
        this.video_.pause();
        this.video_.srcObject = null;
        this.video_.parentNode.removeChild(this.video_);
        }
    }
}
