<!-- ===============
COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { dlog } from '$lib/utils/debug';

	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	const dispatch = createEventDispatcher();

	export let modal_pic_crop_show: boolean = false;

	let crop_selected: boolean = false;
	let offset: number[] = [0, 0];
	let new_img_crop: string;
	let reset_crop: boolean = false;

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	/**
	 * @description bubbles up to parent event
	 * to close (this) modal widget
	 * IMPORTANT removes eventListeners no longer used;
	 */
	function toggle_modal(): void {
		let imageCropBox: HTMLElement =
			document.getElementById(
				'profile-cricle-img-crop'
			);
		imageCropBox.removeEventListener(
			'mousedown',
			mousedown_event,
			true
		);
		window.removeEventListener(
			'mouseup',
			mouseup_event,
			true
		);
		window.removeEventListener(
			'mousemove',
			mousemove_event,
			true
		);
		dispatch('toggle_delete_modal');
	}

	/**
	 * @description bubbles up to parent event
	 * to trigger target method;
	 * IMPORTANT removes eventListeners no longer used;
	 * DOC: https://stackoverflow.com/questions/37752098/remove-event-handler-function-from-window
	 */
	function upload_selected_img(): void {
		let imageCropBox: HTMLElement =
			document.getElementById(
				'profile-cricle-img-crop'
			);
		imageCropBox.removeEventListener(
			'mousedown',
			mousedown_event,
			true
		);
		window.removeEventListener(
			'mouseup',
			mouseup_event,
			true
		);
		window.removeEventListener(
			'mousemove',
			mousemove_event,
			true
		);
		reset_crop = true;
		dispatch('upload_selected_img', {
			img: new_img_crop
		});
	}

	/**
	 * @description allows for a parent function access;
	 * sets target image with uploaded file ready for crop action;
	 * kickstarts eventListeners for crop action;
	 * DOC: https://www.webtrickshome.com/forum/how-to-display-uploaded-image-in-html-using-javascript
	 * @param {*} file
	 */
	export function load_picture(file: File): void {
		let image: HTMLImageElement =
			document.getElementById('profile-image');
		let imageCropBox: HTMLElement =
			document.getElementById(
				'profile-cricle-img-crop'
			);
		image.src = URL.createObjectURL(file);
		image.onload = function () {
			reset_crop = true;
			imageCropBox.addEventListener(
				'touchstart',
				mousedown_event,
				true
			);
			window.addEventListener(
				'touchend',
				mouseup_event,
				true
			);
			window.addEventListener(
				'touchmove',
				mousemove_event,
				true
			);
			imageCropBox.addEventListener(
				'mousedown',
				mousedown_event,
				true
			);
			window.addEventListener(
				'mouseup',
				mouseup_event,
				true
			);
			window.addEventListener(
				'mousemove',
				mousemove_event,
				true
			);
		};
	}

	function mousedown_event(event) {
		let imageCropBox: HTMLElement =
			document.getElementById(
				'profile-cricle-img-crop'
			);
		dlog('imageCropBox clicked!', true);
		// alert('imageCropBox clicked!')
		reset_crop = false;
		crop_selected = true;
		const left_val =
			imageCropBox.offsetLeft -
			(event?.clientX ||
				event?.touches[0].clientX);
		const right_val =
			imageCropBox.offsetTop -
			(event?.clientY ||
				event?.touches[0].clientY);
		dlog(`${left_val}`, true);
		dlog(`${right_val}`, true);
		dlog(event, true);
		// dlog(touchevent, true)
		offset = [left_val, right_val];
	}

	function mouseup_event() {
		dlog('mouse is up!', true);
		// alert('mouse is up!')
		crop_selected = false;
	}

	function mousemove_event(event) {
		let image: HTMLImageElement =
			document.getElementById('profile-image');
		let imageCropBox: HTMLElement =
			document.getElementById(
				'profile-cricle-img-crop'
			);
		if (crop_selected) {
			dlog('moving selector!', true);
			dlog(event, true);
			// alert('moving selector!')
			// event.preventDefault()
			let mousePosition = {
				x:
					event?.clientX ||
					event?.touches[0].clientX,
				y:
					event?.clientY ||
					event?.touches[0].clientY
			};
			const image_left =
				mousePosition.x + offset[0];
			const image_top =
				mousePosition.y + offset[1];
			dlog(`${image_left}`, true);
			dlog(`${image_top}`, true);
			let img_width = image.offsetWidth;
			let img_height = image.offsetHeight;
			let crop_width_a = imageCropBox.offsetWidth;
			let crop_height_a =
				imageCropBox.offsetHeight;
			// [ℹ] prevent from going outside image bounds
			if (
				image_left <= 0 ||
				image_top <= 0 ||
				image_left +
					crop_width_a +
					(event?.movementX || 0) >=
					img_width ||
				image_top +
					crop_height_a +
					(event?.movementY || 0) >=
					img_height
			) {
				return;
			}
			imageCropBox.style.left = `${image_left}px`;
			imageCropBox.style.top = `${image_top}px`;
			// [ℹ] FIXME: need use the pre-set dimension of circle and
			// [ℹ] half-it + (add top/left) from circle select
			// [ℹ] to get the actual MASK position on target container
			const mask_left = image_left + 150 / 2;
			const mask_top = image_top + 150 / 2;
			const doc = document.documentElement;
			doc.style.setProperty(
				'--imageCropBox-mask-left',
				`${mask_left}px`
			);
			doc.style.setProperty(
				'--imageCropBox-mask-top',
				`${mask_top}px`
			);
			// [ℹ] draw image to canvas and get image data
			dlog(image, false);
			// [ℹ] create drawing canvas
			// DOC: https://stackoverflow.com/questions/28538913/crop-an-image-displayed-in-a-canvas
			// DOC: https://stackoverflow.com/questions/4200374/copy-and-crop-images-in-javascript
			var canvas: HTMLCanvasElement =
				document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(image, 0, 0);
			var imageData = ctx.getImageData(
				image_left,
				image_top,
				150,
				150
			);
			// [ℹ] create destiantion canvas
			var canvas1: HTMLCanvasElement =
				document.createElement('canvas');
			canvas1.width = 150;
			canvas1.height = 150;
			var ctx1 = canvas1.getContext('2d');
			ctx1.rect(0, 0, 150, 150);
			ctx1.fillStyle = 'white';
			ctx1.fill();
			ctx1.putImageData(imageData, 0, 0);
			// [ℹ] save base64 url of image selection
			dlog(canvas1.toDataURL('image/png'), false);
			new_img_crop =
				canvas1.toDataURL('image/png');
		}
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~
</script>

<!-- ===============
COMPONENT HTML 
=================-->

<!-- 
[ℹ] main modal widget (background blur)
-->
<div
	id="background-modal-blur"
	class:display-none={!modal_pic_crop_show}
	on:click={() => toggle_modal()}
	in:fade
/>

<!--
[ℹ] main modal widget
-->
<div
	id="modal-delete-box"
	class:display-none={!modal_pic_crop_show}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>
	<!-- 
  [ℹ] modal text
  -->
	<div
		class="
      row-space-out
      m-b-20
    "
	>
		<p
			class="
        w-500
        s-16
        text-left
        color-black-2
      "
		>
			Profile Picture
		</p>
		<!-- 
    [ℹ] close modal icon (cross)
    -->
		<img
			id="close-vector"
			class="cursor-pointer"
			src="/assets/svg/close.svg"
			alt="close-svg"
			on:click={() => toggle_modal()}
		/>
	</div>
	<!-- 
  [ℹ] image widget select
  -->
	<div id="image-box-out" class="m-b-20">
		<div id="image-box-in">
			<div
				id="profile-cricle-img-crop"
				class:reset-crop={reset_crop}
			/>
			<!-- on:mousedown={(event) => mousedown_event(event)}
      on:mouseup={() => mouseup_event()}
      on:mousemove={(event) => mousemove_event(event)} -->
			<img
				id="profile-image"
				src=""
				alt=""
				width="50"
				height="50"
				draggable="false"
				style="pointer-events: none"
			/>
		</div>
		<!-- <canvas id="example" width="150" height="150"></canvas> -->
		<!-- <canvas id="example2" width="150" height="150"></canvas> -->
	</div>
	<!-- 
  [ℹ] main widget action
  <-contents->
  [ℹ] delete account (btn)
  [ℹ] cancel action (btn)
  -->
	<div class="row-space-end">
		<!-- 
    [ℹ] cancel action (btn)
    -->
		<button
			class="
        btn-hollow
        m-r-16
        color-black-2
      "
			on:click={() => toggle_modal()}
		>
			Cancel
		</button>
		<!-- 
    [ℹ] delete action (btn)
    -->
		<button
			class="
        btn-primary-v2
        s-14
        w-500
      "
			on:click={() => upload_selected_img()}
		>
			Save Photo
		</button>
	</div>
</div>

<!-- ===============
COMPONENT STYLE
=================-->
<style>
	div#background-modal-blur {
		/* position */
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 4000;
		/* style */
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	div#modal-delete-box {
		/* position */
		position: fixed;
		z-index: 10000;
		margin: auto;
		width: fit-content;
		width: 92%;
		right: 0;
		left: 0;
		bottom: 0;
		top: 0;
		height: fit-content;
		/* style */
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 20px;
		text-align: -webkit-center;
		overflow: hidden;
	}

	div#image-box-out {
		/* position */
		position: relative;
		/* style */
		height: 240px;
		max-height: 240px;
		width: 100%;
		background-color: var(--dark-theme);
	}
	div#image-box-out > div#image-box-in {
		height: inherit;
		width: fit-content;
		position: relative;
		overflow: hidden;
	}
	div#image-box-out
		> div#image-box-in
		> img#profile-image {
		/* position */
		z-index: 2;
		/* style */
		height: inherit;
		width: auto;
		background-color: var(--white);
		mask-image: radial-gradient(
			150px circle at
				var(--imageCropBox-mask-left)
				var(--imageCropBox-mask-top),
			black 50%,
			rgba(0, 0, 0, 0.5) 50%
		);
		-webkit-mask-image: radial-gradient(
			150px circle at
				var(--imageCropBox-mask-left)
				var(--imageCropBox-mask-top),
			black 50%,
			rgba(0, 0, 0, 0.5) 50%
		);
		/* user-drag: none;  
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    pointer-events: none; */
	}
	div#image-box-out
		> div#image-box-in
		> div#profile-cricle-img-crop {
		/* position */
		position: absolute;
		/* style */
		height: 150px;
		width: 150px;
		border-radius: 50%;
		border: 8px solid var(--white);
		z-index: 2;
		cursor: move; /* fallback if grab cursor is unsupported */
		cursor: grab;
		cursor: -moz-grab;
		cursor: -webkit-grab;
		/* mask-mode: alpha; */
		/* mask-image: radial-gradient(circle, black 50%, rgba(0, 0, 0, 0.5) 50%); */
		/* -webkit-mask-image: radial-gradient(circle, black 50%, rgba(0, 0, 0, 0.5) 50%); */
	}
	div#image-box-out
		> div#image-box-in
		> div#profile-cricle-img-crop.reset-crop {
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		margin: auto;
	}
	div#image-box-out
		> div#image-box-in
		> div#profile-cricle-img-crop:active {
		/* (Optional) Apply a "closed-hand" cursor during drag operation. */
		cursor: grabbing;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
	}

  /* -----------------
    RESPONSIVNESS
  ----------------- */

	@media only screen and (min-width: 575px) {
		div#modal-delete-box  {
			width: 502px;
			max-width: 502px;
		}
	}

  /* -----------------
    WIDGET DARK THEME 
  ----------------- */

  div#modal-delete-box.dark-background-1 {
		box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
		background-color: var(--dark-theme-1) !important;
	}


</style>
