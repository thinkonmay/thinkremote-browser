/**
 * Interface implemented by all video sinks that the user can select. A common
 * interface allows the user to choose a sink independently of the source and
 * transform.
 * @interface
 */
export interface MediaStreamSink { // eslint-disable-line no-unused-vars
    setMediaStream(stream: MediaStream) 

    /** Frees any resources used by this object. */
    destroy(): void
}