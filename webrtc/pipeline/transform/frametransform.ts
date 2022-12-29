/*
 *  Copyright (c) 2021 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/**
 * Interface implemented by all video transforms that the user can select. A
 * common interface allows the user to choose a transform independently of the
 * source and sink.
 * @interface
 */
export interface FrameTransform { // eslint-disable-line no-unused-vars
  /** Initializes state that is reused across frames. */
  init(codec: string) 

  /**
   * Applies the transform to frame. Queues the output frame (if any) using the
   * controller.
   */
  transform(frame: VideoFrame, controller: TransformStreamDefaultController<VideoFrame>) 

  /** Frees any resources used by this object. */
  destroy()
}


type FrameTransformFn = (arg0: VideoFrame,args1: TransformStreamDefaultController<VideoFrame>) => Promise<void>


/**
 * Creates a pair of MediaStreamTrackProcessor and MediaStreamTrackGenerator
 * that applies transform to sourceTrack. This function is the core part of the
 * sample, demonstrating how to use the new API.
 * 
 */
export function createProcessedMediaStreamTrack(sourceTrack: MediaStreamVideoTrack, transform: FrameTransformFn, signal: AbortSignal) {
  let processor: MediaStreamTrackProcessor<VideoFrame>;

  try {
    processor = new MediaStreamTrackProcessor({track: sourceTrack});
  } catch (e) {
    alert(`MediaStreamTrackProcessor failed: ${e}`);
    throw e;
  }


  // Create the MediaStreamTrackGenerator.
  let generator : MediaStreamTrackGenerator<VideoFrame>;
  try {
    generator = new MediaStreamTrackGenerator({kind: 'video',});
  } catch (e) {
    alert(`MediaStreamTrackGenerator failed: ${e}`);
    throw e;
  }

  const source = processor.readable;
  const sink   = generator.writable;

  // Create a TransformStream using our FrameTransformFn. (Note that the
  // "Stream" in TransformStream refers to the Streams API, specified by
  // https://streams.spec.whatwg.org/, not the Media Capture and Streams API,
  // specified by https://w3c.github.io/mediacapture-main/.)
  /** @type {!TransformStream<!VideoFrame, !VideoFrame>} */
  const transformer = new TransformStream({transform});

  // Apply the transform to the processor's stream and send it to the
  // generator's stream.
  const promise = source.pipeThrough(transformer, {signal}).pipeTo(sink);

  promise.catch((e) => {
    if (signal.aborted) {
      console.log(
          '[createProcessedMediaStreamTrack] Shutting down streams after abort.');
    } else {
      console.error(
          '[createProcessedMediaStreamTrack] Error from stream transform:', e);
    }
    source.cancel(e);
    sink.abort(e);
  });

  console.log(
      '[createProcessedMediaStreamTrack] Created MediaStreamTrackProcessor, ' +
      'MediaStreamTrackGenerator, and TransformStream.',
      'debug.processor =', processor, 'debug.generator =', generator,
      'debug.transformStream =', transformer);

  return generator;
}

/**
 * Wrapper around createProcessedMediaStreamTrack to apply transform to a
 * MediaStream.
 */
export function createProcessedMediaStream(sourceStream: MediaStream, transform: FrameTransformFn, signal: AbortSignal): MediaStream {
  // For this sample, we're only dealing with video tracks.
  /** @type {!MediaStreamTrack} */
  const sourceTrack = sourceStream.getVideoTracks()[0];

  const processedTrack = createProcessedMediaStreamTrack(sourceTrack, transform, signal);

  // Create a new MediaStream to hold our processed track.
  const processedStream = new MediaStream();
  processedStream.addTrack(processedTrack);

  return processedStream;
}