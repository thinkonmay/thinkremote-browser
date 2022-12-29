import fullscreenTexturedQuadWGSL from './blur/fullscreenTexturedQuad.wgsl';
import blurWGSL from './blur/blur.wgsl';

export class WebGPUTransform { // eslint-disable-line no-unused-vars
	device: GPUDevice
	context: GPUCanvasContext
	adapter: GPUAdapter
	canvas: HTMLCanvasElement

	fullscreenQuadPipeline: GPURenderPipeline
	showResultBindGroup: GPUBindGroup

	vertexBuffer_: GPUBuffer

	constructor(inputCanvas: HTMLCanvasElement) {
		this.canvas = inputCanvas;
	}

	async init() : Promise<Error | null>{
		console.log('[WebGPUTransform] Initializing WebGPU.');

		this.context = this.canvas.getContext('webgpu');
		if (!this.context) {
			const errorMessage = 'Your browser does not support the WebGPU API.' +
						' Please see the note at the bottom of the page.';
			return new Error(errorMessage);
		}

		this.adapter = await navigator.gpu.requestAdapter();
		this.device  = await this.adapter.requestDevice();
		if (!this.device) {
			console.log('[WebGPUTransform] requestDevice failed.');
			return;
		}

		const devicePixelRatio = window.devicePixelRatio || 1;
		const presentationSize = [
			this.canvas.clientWidth * devicePixelRatio,
			this.canvas.clientHeight * devicePixelRatio,
		];


  		const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
		this.context.configure({
			device: this.device,
			size: presentationSize,
			format: presentationFormat,
			alphaMode: 'opaque',
		})

		this.fullscreenQuadPipeline = this.device.createRenderPipeline({
			layout: 'auto',
			vertex: {
			module: this.device.createShaderModule({
				code: fullscreenTexturedQuadWGSL,
			}),
			entryPoint: 'vert_main',
			},
			fragment: {
			module: this.device.createShaderModule({
				code: fullscreenTexturedQuadWGSL,
			}),
			entryPoint: 'frag_main',
			targets: [
				{
				format: presentationFormat,
				},
			],
			},
			primitive: {
			topology: 'triangle-list',
			},
		});

		const sampler = this.device.createSampler({
			magFilter: 'linear',
			minFilter: 'linear',
		});
		

		const textures = [0, 1].map(() => {
			return this.device.createTexture({
			size: {
				width: srcWidth,
				height: srcHeight,
			},
			format: 'rgba8unorm',
			usage:
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.STORAGE_BINDING |
				GPUTextureUsage.TEXTURE_BINDING,
			});
		});
		this.showResultBindGroup = this.device.createBindGroup({
			layout: this.fullscreenQuadPipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: sampler,
				},
				{
					binding: 1,
					resource: textures[1].createView(),
				},
			],
		});














		


		const swapChainFormat = 'bgra8unorm';
		const rectVerts = new Float32Array([
			1.0, 1.0, 0.0, 1.0, 0.0,
			1.0, -1.0, 0.0, 1.0, 1.0,
			-1.0, -1.0, 0.0, 0.0, 1.0,
			1.0, 1.0, 0.0, 1.0, 0.0,
			-1.0, -1.0, 0.0, 0.0, 1.0,
			-1.0, 1.0, 0.0, 0.0, 0.0,
		]);
		// Creates a GPU buffer.
		const vertexBuffer = this.device.createBuffer({
		size: rectVerts.byteLength,
		usage: GPUBufferUsage.VERTEX,
		mappedAtCreation: true,
		});
		// Copies rectVerts to vertexBuffer
		new Float32Array(vertexBuffer.getMappedRange()).set(rectVerts);
		vertexBuffer.unmap();
		this.vertexBuffer_ = vertexBuffer;

		context.configure({
		device,
		format: swapChainFormat
		});

		this.renderPipeline_ = device.createRenderPipeline({
		vertex: {
			module: device.createShaderModule({
			code: wgslShaders.vertex,
			}),
			entryPoint: 'main',
			buffers: [
			{
				arrayStride: 20,
				attributes: [
				{
					// position
					shaderLocation: 0,
					offset: 0,
					format: 'float32x3',
				},
				{
					// uv
					shaderLocation: 1,
					offset: 12,
					format: 'float32x2',
				},
				],
			},
			],
		},
		fragment: {
			module: device.createShaderModule({
			code: wgslShaders.fragment,
			}),
			entryPoint: 'main',
			targets: [
			{
				format: swapChainFormat,
			},
			],
		},
		primitive: {
			topology: 'triangle-list',
		},
		});

		this.videoTexture_ = device.createTexture({
		size: [480 * 2, 270 * 2],
		format: 'rgba8unorm',
		usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.RENDER_ATTACHMENT,
		});

		this.sampler_ = device.createSampler({
		addressModeU: 'repeat',
		addressModeV: 'repeat',
		addressModeW: 'repeat',
		magFilter: 'linear',
		minFilter: 'linear',
		});
	}

	async copyOnTexture(device, videoTexture, frame, xcorr, ycorr) {
		if (!frame) {
		return;
		}
		// Using GPUExternalTexture(when it's implemented for Breakout Box frames) will
		// avoid making extra copies through ImageBitmap.
		const videoBitmap = await createImageBitmap(frame, {resizeWidth: 480, resizeHeight: 270});
		device.queue.copyExternalImageToTexture(
			{source: videoBitmap, origin: {x: 0, y: 0}},
			{texture: videoTexture, origin: {x: xcorr, y: ycorr}},
			{
			// the width of the image being copied
			width: videoBitmap.width,
			height: videoBitmap.height,
			}
		);
		videoBitmap.close();
		frame.close();
	}

	async renderOnScreen(videoSource, gumSource) {
		const device = this.device_;
		const videoTexture = this.videoTexture_;
		if (!device) {
		console.log('[WebGPUTransform] device is undefined or null.');
		return false;
		}

		const videoPromise = videoSource.read().then(({value}) => {
		this.copyOnTexture(device, videoTexture, value, 0, 270);
		});
		const gumPromise = gumSource.read().then(({value}) => {
		this.copyOnTexture(device, videoTexture, value, 480, 0);
		});
		await Promise.all([videoPromise, gumPromise]);

		if (!this.device_) {
		console.log('Check if destroy has been called asynchronously.');
		return false;
		}

		const uniformBindGroup = device.createBindGroup({
		layout: this.renderPipeline_.getBindGroupLayout(0),
		entries: [
			{
			binding: 0,
			resource: this.sampler_,
			},
			{
			binding: 1,
			resource: videoTexture.createView(),
			},
		],
		});

		const commandEncoder = device.createCommandEncoder();
		const textureView = this.context_.getCurrentTexture().createView();

		const renderPassDescriptor = {
		colorAttachments: [
			{
			view: textureView,
			loadValue: {r: 0.0, g: 0.0, b: 0.0, a: 1.0},
			storeOp: 'store',
			},
		],
		};
		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
		passEncoder.setPipeline(this.renderPipeline_);
		passEncoder.setVertexBuffer(0, this.vertexBuffer_);
		passEncoder.setBindGroup(0, uniformBindGroup);
		passEncoder.draw(6, 1, 0, 0);
		passEncoder.endPass();
		device.queue.submit([commandEncoder.finish()]);
		return true;
	}


	async transform(videoStream, gumStream) {
		const videoSource = videoStream.getReader();
		const gumSource = gumStream.getReader();
		while (true) {
		const rendered = await this.renderOnScreen(videoSource, gumSource);
		if (!rendered) {
			break;
		}
		}
		videoSource.cancel();
		gumSource.cancel();
	}

	private frame_callback() {
		// Sample is no longer the active page.
		// if (!pageState.active) return;

		const commandEncoder = this.device.createCommandEncoder();

		const computePass = commandEncoder.beginComputePass();
		computePass.setPipeline(blurPipeline);
		computePass.setBindGroup(0, computeConstants);

		computePass.setBindGroup(1, computeBindGroup0);
		computePass.dispatchWorkgroups(
		Math.ceil(srcWidth / blockDim),
		Math.ceil(srcHeight / batch[1])
		);

		computePass.setBindGroup(1, computeBindGroup1);
		computePass.dispatchWorkgroups(
		Math.ceil(srcHeight / blockDim),
		Math.ceil(srcWidth / batch[1])
		);

		for (let i = 0; i < settings.iterations - 1; ++i) {
		computePass.setBindGroup(1, computeBindGroup2);
		computePass.dispatchWorkgroups(
			Math.ceil(srcWidth / blockDim),
			Math.ceil(srcHeight / batch[1])
		);

		computePass.setBindGroup(1, computeBindGroup1);
		computePass.dispatchWorkgroups(
			Math.ceil(srcHeight / blockDim),
			Math.ceil(srcWidth / batch[1])
		);
		}

		computePass.end();

		let descriptor = {
		colorAttachments: [{
			label: "",
			view: this.context.getCurrentTexture().createView(),
			clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
			loadOp: 'clear',
			storeOp: 'store',
			}],
		} as GPURenderPassDescriptor;

		const passEncoder = commandEncoder.beginRenderPass(descriptor);

		passEncoder.setPipeline(this.fullscreenQuadPipeline);
		passEncoder.setBindGroup(0, this.showResultBindGroup);
		passEncoder.draw(6, 1, 0, 0);
		passEncoder.end();
		device.queue.submit([commandEncoder.finish()]);

		requestAnimationFrame(this.frame_callback);
	}




	destroy() {
		if (this.device_) {
		// Currently being implemented.
		// await this.device_.destroy();
		this.device_ = null;
		this.vertexBuffer_.destroy();
		this.videoTexture_.destroy();
		if (this.canvas_.parentNode) {
			this.canvas_.parentNode.removeChild(this.canvas_);
		}
		console.log('[WebGPUTransform] Context destroyed.',);
		}
	}
}
