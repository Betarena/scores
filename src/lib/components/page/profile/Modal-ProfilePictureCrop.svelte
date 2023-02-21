<!-- ===============
COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { page } from '$app/stores';
	import type { REDIS_CACHE_SINGLE_profile_translation } from '$lib/models/profile/account-setting/types';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { dlog, dlogv2, dlogv2open, PR_P_STY, PR_P_TAG, PR_P_TOG } from '$lib/utils/debug';

	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

  let RESPONSE_PROFILE_DATA: REDIS_CACHE_SINGLE_profile_translation
  $: RESPONSE_PROFILE_DATA = $page.data.RESPONSE_PROFILE_DATA;

	const dispatch = createEventDispatcher();

	export let modal_pic_crop_show: boolean = false;

	let crop_selected: boolean = false;
	let offset: [number, number] = [0, 0];
	let new_img_crop: string;
	let reset_crop: boolean = false;
  let resize_selected: boolean = false;
  let reset_resize: boolean = false;
  let selected_corner: 't-right' | 'b-right' | 't-left' | 'b-left';
  let original_touch: any = undefined

  let initial_image_dimensions: [number, number] = [0,0]

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

  // const reader = new FileReader();
  // const img = new Image();

  // const uploadImage = (file) => {
  //   const canvas: HTMLCanvasElement = document.getElementById('example3') as HTMLCanvasElement; // test, enable canvas in HTML below to see live results
  //   reader.onload = () => {
  //     img.onload = () => {
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0);
  //     };
  //     img.src = reader.result;
  //   };
  //   reader.readAsDataURL(file);
  // };

  /**
	 * @description {export} allows for a parent function access;
	 * sets target image with uploaded file ready for crop action;
	 * kickstarts eventListeners for crop action;
	 * DOC: https://www.webtrickshome.com/forum/how-to-display-uploaded-image-in-html-using-javascript
	 * @param {File} file
   * @returns {void}
	 */
	export function load_picture(file: File): void {

    // works [1]
    // uploadImage(file)
    // works [2]
    // img.src = URL.createObjectURL(file);
    // const canvas: HTMLCanvasElement = document.getElementById('example3') as HTMLCanvasElement; // test, enable canvas in HTML below to see live results
    // img.onload = () => {
    //   initial_image_dimensions = [img?.width, img?.height]
    //   canvas.width = 150;
    //   canvas.height = 150;
    //   const ctx = canvas.getContext("2d");
    //   ctx.drawImage(img, 0, 0, 150, 150);
    // }

		let image: HTMLImageElement = document.getElementById('profile-image') as HTMLImageElement;
    let resize_elemnts: HTMLCollectionOf<Element> = document.getElementsByClassName('resize-dot')
    let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop');
    let imageResizeBox: HTMLElement = document.getElementById('profile-cricle-img-crop-resize')
		image.src = URL.createObjectURL(file);
		image.onload = function () {
      // [ℹ] apply reset-class to selectors
      reset_crop = true;
      reset_resize = true;
      // [ℹ] adjust to image width x height
      // [ℹ] if image is of lower dimensions
      if (image.width < 150) { 
        imageCropBox.style.width = `${image.width/1.5}px`
        imageCropBox.style.height = `${image.width/1.5}px`
        imageResizeBox.style.width = `${image.width/1.5}px`
        imageResizeBox.style.height = `${image.width/1.5}px`
      }
      // [ℹ] initiate eventListeners, after image loaded
      imageCropBox.addEventListener('touchstart', mousedown_event, true);
      window.addEventListener('touchend', mouseup_event, true);
      window.addEventListener('touchmove', mousemove_event, true);
      imageCropBox.addEventListener('mousedown', mousedown_event, true);
      window.addEventListener('mouseup', mouseup_event, true);
      window.addEventListener('mousemove', mousemove_event, true);
      for (const element of resize_elemnts) {
        element.addEventListener('touchstart', mousedown_resize_event, true);
        element.addEventListener('mousedown', mousedown_resize_event, true);
      }
		};
	}

	/**
	 * @description bubbles up to parent event
	 * to trigger target method; shutsdown (this) component;
	 * NOTE:IMPORTANT removes eventListeners no longer used;
   * @returns {void}
	 */
	function toggle_modal(): void {
    clear_event_listeners()
    reset_crop = true;
    reset_resize = true;
		dispatch('toggle_delete_modal');
	}

	/**
	 * @description bubbles up to parent event
	 * to trigger target method; shutsdown (this) component;
	 * NOTE:IMPORTANT removes eventListeners no longer used;
	 * DOC: https://stackoverflow.com/questions/37752098/remove-event-handler-function-from-window
   * @returns {void}
	 */
	function upload_selected_img(): void {
		clear_event_listeners()
		reset_crop = true;
    reset_resize = true;
		dispatch('upload_selected_img', {
			img: new_img_crop
		});
	}

  /**
   * @description eventListener onMouseUp / onTouchEnd
   * function, for the Image Crop (Move) Container. Declares variables
   * and sets UI and actions for (upcoming) drag (mousemove/touchmove)
   * @param {*} event
   * @returns {void}
   */
	function mousedown_event(event): void {
		let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop');
    event.preventDefault();
    reset_state_position_boxes()
		crop_selected = true;
    dlog(`${PR_P_TAG} ℹ imageCropBox.offsetLeft: ${imageCropBox.offsetLeft}`, PR_P_TOG, PR_P_STY)
    dlog(`${PR_P_TAG} ℹ imageCropBox.offsetTop: ${imageCropBox.offsetTop}`, PR_P_TOG, PR_P_STY)
		const left_val = imageCropBox.offsetLeft - (event?.clientX || event?.touches[0].clientX);
		const right_val = imageCropBox.offsetTop - (event?.clientY || event?.touches[0].clientY);
		dlogv2(
      PR_P_TAG + `mousedown_event()`, 
      [
        `left_val: ${left_val}`,
        `right_val: ${right_val}`
      ], 
      PR_P_TOG, 
      PR_P_STY
    );
		offset = [left_val, right_val];
	}

  /**
   * @description eventListener onMouseUp / onTouchEnd
   * function, for the Image Crop (Resize) Container. Declares variables
   * and sets UI and actions for (upcoming) drag (mousemove/touchmove)
   * @param {*} event
   * @returns {void}
   */
  function mousedown_resize_event(event): void {
    let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop');
    let imageResizeBox: HTMLElement = document.getElementById('profile-cricle-img-crop-resize')
    event.preventDefault(); // [?]
    const className: string = event?.target?.className
    if (className.includes('t-right')) selected_corner = 't-right'
    if (className.includes('b-right')) selected_corner = 'b-right'
    if (className.includes('t-left')) selected_corner = 't-left'
    if (className.includes('b-left')) selected_corner = 'b-left'
    reset_state_position_boxes()
		resize_selected = true;
    original_touch = event;
    // [ℹ] prevent scroll of page on resize/crop
    document.documentElement.classList.add('no-touch'); 
    document.body.classList.add('no-touch');
		const left_val = imageCropBox.offsetLeft - (event?.clientX || event?.touches[0].clientX);
		const right_val = imageCropBox.offsetTop - (event?.clientY || event?.touches[0].clientY);
		dlogv2(
      PR_P_TAG + `mousedown_resize_event()`, 
      [
        'touchedby:',
        event,
        `selected_corner: ${selected_corner}`,
        `left_val: ${left_val}`,
        `right_val: ${right_val}`,
      ], 
      PR_P_TOG, 
      PR_P_STY
    );
		offset = [left_val, right_val];
  }

  $: dlog(`${PR_P_TAG} 🔵 reset_resize: ${reset_resize}`, PR_P_TOG, PR_P_STY)

  /**
   * @description resets the values of the Resize & Crop
   * box actions from their previous use, and sets their
   * positions on first touch and mouse-click;
   * @returns {void}
   */
  function reset_state_position_boxes(): void {
    let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop');
    let imageResizeBox: HTMLElement = document.getElementById('profile-cricle-img-crop-resize')
    // [ℹ] assign instant position of user "down" event of ResizeBox
    if (reset_resize) {
      dlog(`${PR_P_TAG} reset_resize: ${reset_resize}`, PR_P_TOG, PR_P_STY)
      let set_dimensions_wh: [number, number, number, number] = [imageResizeBox.offsetLeft, imageResizeBox.offsetTop, imageResizeBox.offsetWidth, imageResizeBox.offsetHeight]
		  reset_resize = false;
      imageResizeBox.style.left = 'unset'
      imageResizeBox.style.top = 'unset'
      imageResizeBox.style.width = 'unset'
      imageResizeBox.style.height = 'unset'
      imageResizeBox.style.left = `${set_dimensions_wh[0]}px`
      imageResizeBox.style.top = `${set_dimensions_wh[1]}px`
      imageResizeBox.style.width = `${set_dimensions_wh[2]}px`
      imageResizeBox.style.height = `${set_dimensions_wh[3]}px`
    }
    // [ℹ] assign instant position of user "down" event of CropBox
    if (reset_crop) {
      dlog(`${PR_P_TAG} reset_crop: ${reset_crop}`, PR_P_TOG, PR_P_STY)
      let set_dimensions_wh: [number, number, number, number] = [imageCropBox.offsetLeft, imageCropBox.offsetTop, imageCropBox.offsetWidth, imageCropBox.offsetHeight]
      reset_crop = false;
      imageCropBox.style.left = 'unset'
      imageCropBox.style.top = 'unset'
      imageCropBox.style.width = 'unset'
      imageCropBox.style.height = 'unset'
      imageCropBox.style.left = `${set_dimensions_wh[0]}px`
      imageCropBox.style.top = `${set_dimensions_wh[1]}px`
      imageCropBox.style.width = `${set_dimensions_wh[2]}px`
      imageCropBox.style.height = `${set_dimensions_wh[3]}px`
    }
  }

  /**
   * @description (main) component function. Contains
   * logic and actions to crop / resize & generate a
   * exact copy of a target image selection using Canvas's
   * for respective selection.
   * @param event
   * @returns {void}
   */
	function mousemove_event(event): void {
		let image: HTMLImageElement = document.getElementById('profile-image') as HTMLImageElement;
		let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop');
    let imageResizeBox: HTMLElement = document.getElementById('profile-cricle-img-crop-resize')
    // [ℹ] validation [1] [main]
		if (crop_selected || resize_selected) {
			event.preventDefault() // [?]
      if (crop_selected) dlog('selector (move)!', true);
      if (resize_selected) dlog('selector (resize)!', true);
			let mousePosition = {
				x: event?.clientX || event?.touches[0].clientX,
				y: event?.clientY || event?.touches[0].clientY
			};
			const image_left = mousePosition.x + offset[0];
			const image_top = mousePosition.y + offset[1];
			let original_image_dimensions: [number, number] = [image?.offsetWidth, image?.offsetHeight];
      const crop_resize_box_wh: [number, number, number, number] = [imageResizeBox.offsetLeft, imageResizeBox.offsetTop, imageResizeBox.offsetWidth, imageResizeBox.offsetHeight]
			let crop_width_a = imageCropBox.offsetWidth;
			let crop_height_a = imageCropBox.offsetHeight;
      // [ℹ] validation [2] [main]
      // [ℹ] prevent from going beyound image dimensions
			if (
				image_left <= 0 ||
				image_top <= 0 ||
				image_left + imageCropBox.offsetWidth >= original_image_dimensions[0] ||
				image_top + imageCropBox.offsetHeight >= original_image_dimensions[1]
			) {
        dlogv2(
          PR_P_TAG + '🔴 Image has reached its bounds...',
          [
            `image_left: ${image_left}`,
            `image_top: ${image_top}`,
            original_image_dimensions,
            crop_resize_box_wh,
            mousePosition,
            `imageCropBox.offsetWidth: ${imageCropBox.offsetWidth}`,
            `imageCropBox.offsetHeight: ${imageCropBox.offsetHeight}`
          ],
          PR_P_TOG,
          PR_P_STY
        )
        return
			}
      // [ℹ] validation [1]
      // NOTE: user resizing action
      if (resize_selected) {
        // [ℹ] adjusting width, height & position;
        let width: number;
        let height: number;
        // TODO: touch;
        let touchMovementX = original_touch != undefined && original_touch?.touches != undefined ? event?.touches[0]?.clientX - original_touch?.touches[0]?.clientX : undefined
        let touchMovementY = original_touch != undefined && original_touch?.touches != undefined ? event?.touches[0]?.clientY - original_touch?.touches[0]?.clientY : undefined
        if (selected_corner == 't-right') {
          width = imageCropBox.offsetWidth + (event?.movementX || touchMovementX);
          height = imageCropBox.offsetHeight - (event?.movementY || touchMovementY);
          const valid_dimension = valid_image_dimensions(width, height);
          if (!valid_dimension) return;
          imageCropBox.style.top = `${image_top}px`;
          imageResizeBox.style.top = `${image_top}px`;
        }
        if (selected_corner == 'b-right') {
          width = imageCropBox.offsetWidth + (event?.movementX || touchMovementX);
          height = imageCropBox.offsetHeight + (event?.movementY || touchMovementY);
          const valid_dimension = valid_image_dimensions(width, height);
          if (!valid_dimension) return;
        }
        if (selected_corner == 't-left') {
          width = imageCropBox.offsetWidth - (event?.movementX || touchMovementX);
          height = imageCropBox.offsetHeight - (event?.movementY || touchMovementY);
          const valid_dimension = valid_image_dimensions(width, height);
          if (!valid_dimension) return;
          imageCropBox.style.top = `${image_top}px`;
          imageCropBox.style.left = `${image_left}px`;
          imageResizeBox.style.top = `${image_top}px`;
          imageResizeBox.style.left = `${image_left}px`;
        }
        if (selected_corner == 'b-left') {
          width = imageCropBox.offsetWidth - (event?.movementX || touchMovementX);
          height = imageCropBox.offsetHeight + (event?.movementY || touchMovementY);
          const valid_dimension = valid_image_dimensions(width, height);
          if (!valid_dimension) return;
          imageCropBox.style.left = `${image_left}px`;
          imageResizeBox.style.left = `${image_left}px`;
        }
        // [ℹ] keep dimensions equal for both height & width
        imageCropBox.style.height = imageCropBox.style.width = `${width}px`
        imageCropBox.style.width = imageCropBox.style.height = `${height}px`
        imageResizeBox.style.height = imageResizeBox.style.width = `${width}px`
        imageResizeBox.style.width = imageResizeBox.style.height = `${height}px`
        const doc = document.documentElement;
        doc.style.setProperty('--imageCropBox-mask-width', `${width}px`);
			  doc.style.setProperty('--imageCropBox-mask-height', `${height}px`);
        // [ℹ] mask calc. pos & dimension;
        // const doc = document.documentElement;
        const mask_left = (imageCropBox.offsetLeft + width/2) + 5;
        const mask_top = (imageCropBox.offsetTop + height/2) + 5;
        doc.style.setProperty('--imageCropBox-mask-left', `${mask_left}px`);
        doc.style.setProperty('--imageCropBox-mask-top', `${mask_top}px`);
        dlogv2open(
          PR_P_TAG + `mousemove_event (resize)`,
          [ 
            event,
            `selected_corner: ${selected_corner}`,
            `movementX: ${event?.movementX} | movementY: ${event?.movementY}`,
            `image_left: ${image_left} | image_top: ${image_top}`,
            `mousePosition.x: ${mousePosition.x} | mousePosition.y: ${mousePosition.y}`,
            `touchMovementX: ${touchMovementX} | touchMovementY: ${touchMovementY}`
          ],
          PR_P_TOG,
          PR_P_STY
        )
      }
      // [ℹ] validation [2]
      // NOTE: user cropping action
      if (crop_selected) {
        imageCropBox.style.left = `${image_left}px`;
        imageCropBox.style.top = `${image_top}px`;
        imageResizeBox.style.left = `${image_left}px`;
        imageResizeBox.style.top = `${image_top}px`;
        // [ℹ] FIXME: need use the pre-set dimension of circle and
        // [ℹ] half-it + (add top/left) from circle select
        // [ℹ] to get the actual MASK position on target container
        const doc = document.documentElement;
        const width = imageCropBox.style.height
        const height = imageCropBox.style.width
        doc.style.setProperty('--imageCropBox-mask-width', `${width}`);
			  doc.style.setProperty('--imageCropBox-mask-height', `${height}`);
        const mask_left = (image_left + crop_width_a / 2) + 5;
        const mask_top = (image_top + crop_height_a / 2) + 5;
        doc.style.setProperty('--imageCropBox-mask-left', `${mask_left}px`);
			  doc.style.setProperty('--imageCropBox-mask-top', `${mask_top}px`);
      }
			// [ℹ] draw image to canvas and get image data
			dlog(image, false);
			// [ℹ] create drawing canvas
			// DOC: https://stackoverflow.com/questions/28538913/crop-an-image-displayed-in-a-canvas
			// DOC: https://stackoverflow.com/questions/4200374/copy-and-crop-images-in-javascript
			var canvas: HTMLCanvasElement = document.createElement('canvas');
			// var canvas: HTMLCanvasElement = document.getElementById('example'); // test, enable canvas in HTML below to see live results
      // const widthDiffRatio = initial_image_dimensions[0] / crop_width_a
      // const heightDiffRatio = initial_image_dimensions[1] / crop_height_a
      // dlog(`${PR_P_TAG} ℹ widthDiffRatio: ${widthDiffRatio}`, PR_P_TOG, PR_P_STY)
      // dlog(`${PR_P_TAG} ℹ heightDiffRatio: ${heightDiffRatio}`, PR_P_TOG, PR_P_STY)
			canvas.width = image.width // image.width; // initial_image_dimensions[0] - requires multiplication of image_left by Diff
			canvas.height = image.height // image.height; // initial_image_dimensions[1] - requires multiplication of image_left by Diff
			var ctx = canvas.getContext('2d');
      // [ℹ] draw target image on our canvas (dx, dy, dw, dh)
			ctx.drawImage(image, 0, 0, image.width, image.height);
      // [ℹ] get canvas image information: sx / sy / sw / sh
			var imageData = ctx.getImageData(image_left, image_top, crop_width_a, crop_height_a);
			// var imageData = ctx.getImageData(image_left * widthDiffRatio, image_top * heightDiffRatio, crop_width_a, crop_height_a);
			// [ℹ] create destiantion canvas
			var canvas1: HTMLCanvasElement = document.createElement('canvas');
			// var canvas1: HTMLCanvasElement = document.getElementById('example2'); // test, enable canvas in HTML below to see live results
			canvas1.width = crop_width_a;
			canvas1.height = crop_height_a;
			var ctx1 = canvas1.getContext('2d');
			ctx1.rect(0, 0, crop_width_a, crop_height_a);
			ctx1.fillStyle = 'white';
			ctx1.fill();
			ctx1.putImageData(imageData, 0, 0);
			// [ℹ] save base64 url of image selection
			dlog(canvas1.toDataURL('image/png'), false);
			new_img_crop = canvas1.toDataURL('image/png');
		}
	}

  /**
   * @description eventListener onMouseUp / onTouchEnd
   * function. Removes any toggled active actions, and
   * resets variables.
   * @returns {void}
   */
  function mouseup_event(): void {
		dlog(PR_P_TAG + 'ℹ️ mouse is up!', PR_P_TOG, PR_P_STY);
		crop_selected = false;
		resize_selected = false;
    original_touch = undefined;
	}

  /**
   * @description check for wether the resized-image
   * if of correct allowed dimensions
   * @param {number} width
   * @param {number} height
   * @returns {boolean}
   */
  function valid_image_dimensions (
    width: number,
    height: number
  ): boolean {
    if (width <= 100 || height <= 100) {
      dlog('🔴 Image has reached its bounds... 100x100 allowed', true)
      return false;
    }
    return true;
  }

  /**
   * @description removes all eventListeners
   * declared inside this widget.
   * @returns {void}
   */
  function clear_event_listeners(): void {
    document.documentElement.classList.remove('no-touch'); 
    document.body.classList.remove('no-touch');
		let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop');
    let resize_elemnts: HTMLCollectionOf<Element> = document.getElementsByClassName('resize-dot')
    imageCropBox.removeEventListener('touchstart', mousedown_event, true);
    window.removeEventListener('touchend', mouseup_event, true);
    window.removeEventListener('touchmove', mousemove_event, true);
    imageCropBox.removeEventListener('mousedown', mousedown_event, true);
    window.removeEventListener('mouseup', mouseup_event, true);
    window.removeEventListener('mousemove', mousemove_event, true);
    for (const element of resize_elemnts) {
      element.removeEventListener('touchstart', mousedown_resize_event, true);
      element.removeEventListener('mousedown', mousedown_resize_event, true);
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
<div id="background-modal-blur" class:display-none={!modal_pic_crop_show} on:click={() => toggle_modal()} in:fade />

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
			{RESPONSE_PROFILE_DATA?.profile_photo}
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
      <div 
        id="profile-cricle-img-crop-resize"
        class:reset-resize={reset_resize}>
        <div class="resize-dot t-right" />
				<div class="resize-dot t-left" />
				<div class="resize-dot b-right" />
				<div class="resize-dot b-left" />
      </div>
			<!-- on:mousedown={(event) => mousedown_event(event)}
      on:mouseup={() => mouseup_event()}
      on:mousemove={(event) => mousemove_event(event)} -->
			<img id="profile-image" src="" alt="" width="50" height="50" draggable="false" />
		</div>
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
			{RESPONSE_PROFILE_DATA?.cancel_expression}
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
			{RESPONSE_PROFILE_DATA?.save_photo}
		</button>
	</div>
  <!-- <canvas id="example" width="150" height="150"></canvas>
  <canvas id="example2" width="150" height="150"></canvas>
  <canvas id="example3" width="150" height="150"></canvas> -->
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
    overflow: hidden;
		background-color: var(--dark-theme);
	}
	div#image-box-out > div#image-box-in {
		height: inherit;
		width: fit-content; /* was :fit-content */
		position: relative;
		overflow: hidden;
	}
	div#image-box-out > div#image-box-in > img#profile-image {
		/* position */
		z-index: 0;
		/* style */
    height: inherit;
    /* width: 100%; */
    width: auto;
    /* object-fit: cover; */
		background-color: var(--white);
		mask-image: radial-gradient(
			var(--imageCropBox-mask-width) circle at var(--imageCropBox-mask-left) var(--imageCropBox-mask-top),
			black 50%,
			rgba(0, 0, 0, 0.5) 50%
		);
		-webkit-mask-image: radial-gradient(
			var(--imageCropBox-mask-width) circle at var(--imageCropBox-mask-left) var(--imageCropBox-mask-top),
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

	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop {
		/* position */
		position: absolute;
		/* style */
    margin: 5px;
		height: 150px;
		width: 150px;
		border-radius: 50%;
		border: 8px solid var(--white);
		z-index: 3;
		cursor: move; /* fallback if grab cursor is unsupported */
		cursor: grab;
		cursor: -moz-grab;
		cursor: -webkit-grab;
		/* mask-mode: alpha; */
		/* mask-image: radial-gradient(circle, black 50%, rgba(0, 0, 0, 0.5) 50%); */
		/* -webkit-mask-image: radial-gradient(circle, black 50%, rgba(0, 0, 0, 0.5) 50%); */
	} div#image-box-out > div#image-box-in > div#profile-cricle-img-crop.reset-crop {
    top: 0 !important;
		bottom: 0 !important;
		right: 0 !important;
		left: 0 !important;
		margin: auto !important;
    width: 150px;
    height: 150px;
	}	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop:active {
		/* (Optional) Apply a "closed-hand" cursor during drag operation. */
		cursor: grabbing;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
	}

  div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize {
		/* position */
		position: absolute;
		/* style */
    z-index: 2;
    width: 150px;
    height: 150px;
    margin: 5px;
  } div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize.reset-resize {
    top: 0 !important;
		bottom: 0 !important;
		right: 0 !important;
		left: 0 !important;
		margin: auto !important;
    width: 150px;
    height: 150px;
  } div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.resize-dot {
		position: absolute;
    width: 15px;
		height: 15px;
		transform: translate(50%, -50%);
		border-radius: 50%;
		background: #ffffff;
		mix-blend-mode: darken;
  }	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.t-right {
		top: 0px;
		right: 0px;
    cursor: sw-resize;
	}	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.t-left {
		top: 0px;
		left: -15px;
    cursor: se-resize;
	}	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.b-right {
		bottom: -15px;
		right: 0px;
    cursor: nw-resize;
	}	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.b-left {
		bottom: -15px;
		left: -15px;
    cursor: ne-resize;
	}

  :global(body.no-touch) {
    touch-action: none;
    -ms-touch-action: none;
    overflow-y: hidden;
  }

	/* -----------------
    RESPONSIVNESS
  ----------------- */

	@media only screen and (min-width: 575px) {
		div#modal-delete-box {
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
