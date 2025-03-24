<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog, dlogv2, PR_P_STY, PR_P_TAG, PR_P_TOG } from '$lib/utils/debug';


  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

	const dispatch = createEventDispatcher();

	export let
	  modal_pic_crop_show: boolean = false
  ;

	let crop_selected: boolean = false
	 ,offset: [number, number] = [0, 0];
	let new_img_crop: string;
	let reset_crop: boolean = false
	  ,resize_selected: boolean = false
	  ,reset_resize: boolean = false;
  let selected_corner: 't-right' | 'b-right' | 't-left' | 'b-left';
  let original_touch: any = undefined

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 📌 MAIN
   * @author
   * @migbash
	 * @description
   * Sets target image with uploaded file ready for crop action.
	 * Kickstarts 'eventListeners' for crop action.
	 * DOC: https://www.webtrickshome.com/forum/how-to-display-uploaded-image-in-html-using-javascript
	 * IMPORTANT
   * { export } allows for a parent to access.
	 * @param
   * { File } file
   * @returns
   * NaN { void }
	 */
	export function load_picture
	(
	  file: File
	): void
	{
	  let image: HTMLImageElement = document.getElementById('profile-image') as HTMLImageElement
	    ,resize_elemnts: HTMLCollectionOf<Element> = document.getElementsByClassName('resize-dot')
	    ,imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop')
	    ,imageResizeBox: HTMLElement = document.getElementById('profile-cricle-img-crop-resize');

	  image.src = URL.createObjectURL(file);

	  image.onload = function ()
	  {
	    // [ℹ] apply reset-class to selectors
	    reset_crop = true;
	    reset_resize = true;
	    // [ℹ] adjust to image width x height
	    // [ℹ] if image is of lower dimensions
	    if (image.width < 150)
	    {
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

	    for (const element of resize_elemnts)
	    {
	      element.addEventListener('touchstart', mousedown_resize_event, true);
	      element.addEventListener('mousedown', mousedown_resize_event, true);
	    }
	  };
	}

	/**
   * @summary
   * 🔹 HELPER
   * @author
   * @migbash
	 * @description
   * 'event' that bubbles up to parent, signal to 'shutdown' (this) component.
	 * IMPORTANT NOTE:
   * in addition, removes 'eventListeners' no longer being used;
   * @returns
   * NaN { void }
	 */
	function toggle_modal
	(
	): void
	{
	  clear_event_listeners();

	  reset_crop = true;
	  reset_resize = true;

	  dispatch
	  (
	    'toggle_delete_modal'
	  );
	}

	/**
   * @summary
   * 🔹 HELPER
   * @author
   * @migbash
	 * @description
   * bubbles up to parent event
	 * to trigger target method; shutsdown (this) component;
	 * NOTE:IMPORTANT removes eventListeners no longer used;
	 * DOC: https://stackoverflow.com/questions/37752098/remove-event-handler-function-from-window
   * @returns
   * NaN { void }
	 */
	function upload_selected_img
	(
	): void
	{
	  clear_event_listeners()
	  reset_crop = true;
	  reset_resize = true;
	  dispatch
	  (
	    'upload_selected_img',
	    {
			  img: new_img_crop
		  }
	  );
	}

  /**
   * @description
   * ➫ 'eventListener' 'onMouseUp' / 'onTouchEnd'
   * ➫ function, for the Image Crop (Move) Container. Declares variables
   * ➫ and sets UI and actions for (upcoming) drag (mousemove/touchmove)
   * @param
   * { any } event
   * @returns
   * NaN { void }
   */
	function mousedown_event
	(
	  event: any
	): void
	{
	  let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop');
	  event.preventDefault();
	  reset_state_position_boxes()
	  crop_selected = true;
	  dlog(`${PR_P_TAG} ℹ imageCropBox.offsetLeft: ${imageCropBox.offsetLeft}`, PR_P_TOG, PR_P_STY)
	  dlog(`${PR_P_TAG} ℹ imageCropBox.offsetTop: ${imageCropBox.offsetTop}`, PR_P_TOG, PR_P_STY)
	  const left_val = imageCropBox.offsetLeft - (event?.clientX || event?.touches[0].clientX)
		 ,right_val = imageCropBox.offsetTop - (event?.clientY || event?.touches[0].clientY);
	  dlogv2(
	    PR_P_TAG + 'mousedown_event()',
	    [
	      `left_val: ${left_val}`
	      ,`right_val: ${right_val}`
	    ],
	    PR_P_TOG,
	    PR_P_STY
	  );
	  offset = [left_val, right_val];
	}

  /**
   * @summary
   * 📌 MAIN
   * @author
   * @migbash
   * @description
   * ➫ 'eventListener' for 'onMouseUp' / 'onTouchEnd'
   * ➫ function, for the Image Crop (Resize) Container. Declares variables
   * ➫ and sets UI and actions for (upcoming) drag (mousemove/touchmove)
   * @param
   * { any } event
   * @returns
   * { void }
   */
  function mousedown_resize_event
  (
    event: any
  ): void
  {
    let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop')
      ,imageResizeBox: HTMLElement = document.getElementById('profile-cricle-img-crop-resize');

    event.preventDefault(); // [?]
    const className: string = event?.target?.className;

    if (className.includes('t-right'))
      selected_corner = 't-right';

    if (className.includes('b-right'))
      selected_corner = 'b-right';

    if (className.includes('t-left'))
      selected_corner = 't-left';

    if (className.includes('b-left'))
      selected_corner = 'b-left';


    reset_state_position_boxes();

    resize_selected = true;
    original_touch = event;

    // ### NOTE:
    // ### prevent scroll of page on resize/crop
    document.documentElement.classList.add('no-touch');
    document.body.classList.add('no-touch');

    const left_val = imageCropBox.offsetLeft - (event?.clientX || event?.touches[0].clientX)
		 ,right_val = imageCropBox.offsetTop - (event?.clientY || event?.touches[0].clientY);

    // [🐞]
    dlogv2
    (
      PR_P_TAG + 'mousedown_resize_event()',
      [
        'touchedby:'
        ,event
        ,`selected_corner: ${selected_corner}`
        ,`left_val: ${left_val}`
        ,`right_val: ${right_val}`
      ],
      PR_P_TOG,
      PR_P_STY
    );

    offset = [left_val, right_val];
  }

  $: dlog(`${PR_P_TAG} 🔵 reset_resize: ${reset_resize}`, PR_P_TOG, PR_P_STY)

  /**
   * @summary
   * 📌 MAIN
   * @author
   * @migbash
   * @description
   * ➫ resets the values of the Resize & Crop
   * ➫ box actions from their previous use, and sets their
   * ➫ positions on first touch and mouse-click;
   * @returns
   * { void }
   */
  function reset_state_position_boxes
  (
  ): void
  {
    let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop')
      ,imageResizeBox: HTMLElement = document.getElementById('profile-cricle-img-crop-resize');

    // ### NOTE:
    // ### Instant 'assign' USER position of 'down' event of 'ResizeBox' (mask).
    if (reset_resize)
    {
      // [🐞]
      dlog
      (
        `${PR_P_TAG} reset_resize: ${reset_resize}`,
        PR_P_TOG,
        PR_P_STY
      );

      let set_dimensions_wh:
      [
        number,
        number,
        number,
        number
      ] = [
        imageResizeBox.offsetLeft
        ,imageResizeBox.offsetTop
        ,imageResizeBox.offsetWidth
        ,imageResizeBox.offsetHeight
      ];

		  reset_resize = false;
      imageResizeBox.style.left = 'unset';
      imageResizeBox.style.top = 'unset';
      imageResizeBox.style.width = 'unset';
      imageResizeBox.style.height = 'unset';
      imageResizeBox.style.left = `${set_dimensions_wh[0]}px`;
      imageResizeBox.style.top = `${set_dimensions_wh[1]}px`;
      imageResizeBox.style.width = `${set_dimensions_wh[2]}px`;
      imageResizeBox.style.height = `${set_dimensions_wh[3]}px`;
    }

    // ### NOTE:
    // ### Instant 'assign' USER position of 'down' event of 'CropBox' (mask).
    if (reset_crop)
    {
      dlog
      (
        `${PR_P_TAG} reset_crop: ${reset_crop}`,
        PR_P_TOG,
        PR_P_STY
      );

      let set_dimensions_wh:
      [
        number,
        number,
        number,
        number
      ] = [
        imageCropBox.offsetLeft
        ,imageCropBox.offsetTop
        ,imageCropBox.offsetWidth
        ,imageCropBox.offsetHeight
      ];

      reset_crop = false;
      imageCropBox.style.left = 'unset';
      imageCropBox.style.top = 'unset';
      imageCropBox.style.width = 'unset';
      imageCropBox.style.height = 'unset';
      imageCropBox.style.left = `${set_dimensions_wh[0]}px`;
      imageCropBox.style.top = `${set_dimensions_wh[1]}px`;
      imageCropBox.style.width = `${set_dimensions_wh[2]}px`;
      imageCropBox.style.height = `${set_dimensions_wh[3]}px`;
    }
  }

  /**
   * @summary
   * 📌 MAIN
   * @author
   * @migbash
   * @description
   * ➫ (main) component function. Contains logic and actions
   * ➫ to crop / resize, and generate a exact copy of a
   * ➫ target image selection using 'Canvas's' for respective selection.
   * ➫ DOC: https://stackoverflow.com/questions/32069156/javascript-resize-and-crop-on-mobile-devices
   * @param
   * { any } event
   * @returns
   * { void }
   */
	function mousemove_event
	(
	  event: any
	): void
	{
	  let image: HTMLImageElement = document.getElementById('profile-image') as HTMLImageElement
		 ,imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop')
	    ,imageResizeBox: HTMLElement = document.getElementById('profile-cricle-img-crop-resize');

	  // ### CHECK:
	  // ### For change in 'crop' and/or 'resize' values.
	  if (crop_selected || resize_selected)
	  {
	    event.preventDefault() // [?]

	    if (crop_selected) dlog('selector (move)!', true);
	    if (resize_selected) dlog('selector (resize)!', true);

	    let mousePosition
      = {
        x: event?.clientX || event?.touches[0].clientX
        ,y: event?.clientY || event?.touches[0].clientY
      };

	    const image_left = mousePosition.x + offset[0]
			 ,image_top = mousePosition.y + offset[1];

	    let original_image_dimensions:
      [
        number,
        number
      ] = [
        image.offsetWidth
        ,image.offsetHeight
      ];

	    const crop_resize_box_wh:
      [
        number,
        number,
        number,
        number
      ] = [
        imageResizeBox.offsetLeft
        ,imageResizeBox.offsetTop
        ,imageResizeBox.offsetWidth
        ,imageResizeBox.offsetHeight
      ];

	    let crop_width_a: number = imageCropBox.offsetWidth
			 ,crop_height_a: number = imageCropBox.offsetHeight;

	    // ### Validation [2] [main]
	    // ### prevent from going beyound image dimensions
	    const if_M_0: boolean
        = image_left <= 0
				|| image_top <= 0
				|| (image_left + imageCropBox.offsetWidth) >= original_image_dimensions[0]
				|| (image_top + imageCropBox.offsetHeight) >= original_image_dimensions[1]
      ;
	    if (if_M_0)
	    {
	      // [🐞]
	      dlogv2
	      (
	        PR_P_TAG + '🔴 Image has reached its bounds...',
	        [
	          `image_left: ${image_left}`
	          ,`image_top: ${image_top}`
	          ,original_image_dimensions
	          ,crop_resize_box_wh
	          ,mousePosition
	          ,`imageCropBox.offsetWidth: ${imageCropBox.offsetWidth}`
	          ,`imageCropBox.offsetHeight: ${imageCropBox.offsetHeight}`
	        ],
	        PR_P_TOG,
	        PR_P_STY
	      );

	      return;
	    }

	    // ### NOTE:
	    // ### User 'resizing' action.
	    if (resize_selected)
	    {
	      // ### NOTE:
	      // ### Adjusting 'width', 'height' & 'position'.
	      let width: number;
	      let height: number;

	      let touchMovementX: number
          = original_touch != undefined
          && original_touch?.touches != undefined
            ? (event?.touches?.[0]?.clientX - original_touch?.touches?.[0]?.clientX)
            : undefined
	        ,touchMovementY: number
          = original_touch != undefined
          && original_touch?.touches != undefined
            ? (event?.touches[0]?.clientY - original_touch?.touches[0]?.clientY)
            : undefined
        ;

	      if (selected_corner == 't-right')
	      {
	        width = imageCropBox.offsetWidth + (event?.movementX || touchMovementX);
	        height = imageCropBox.offsetHeight - (event?.movementY || touchMovementY);

	        const if_M_0: boolean = valid_image_dimensions
	        (
	          width,
	          height
	        );
	        if (!if_M_0) return;

	        imageCropBox.style.top = `${image_top}px`;
	        imageResizeBox.style.top = `${image_top}px`;
	      }
	      if (selected_corner == 'b-right')
	      {
	        width = imageCropBox.offsetWidth + (event?.movementX || touchMovementX);
	        height = imageCropBox.offsetHeight + (event?.movementY || touchMovementY);

	        const if_M_0: boolean = valid_image_dimensions
	        (
	          width,
	          height
	        );
	        if (!if_M_0) return;
	      }
	      if (selected_corner == 't-left')
	      {
	        width = imageCropBox.offsetWidth - (event?.movementX || touchMovementX);
	        height = imageCropBox.offsetHeight - (event?.movementY || touchMovementY);

	        const if_M_0: boolean = valid_image_dimensions
	        (
	          width,
	          height
	        );
	        if (!if_M_0) return;

	        imageCropBox.style.top = `${image_top}px`;
	        imageCropBox.style.left = `${image_left}px`;
	        imageResizeBox.style.top = `${image_top}px`;
	        imageResizeBox.style.left = `${image_left}px`;
	      }
	      if (selected_corner == 'b-left')
	      {
	        width = imageCropBox.offsetWidth - (event?.movementX || touchMovementX);
	        height = imageCropBox.offsetHeight + (event?.movementY || touchMovementY);

	        const if_M_0 = valid_image_dimensions
	        (
	          width,
	          height
	        );
	        if (!if_M_0) return;

	        imageCropBox.style.left = `${image_left}px`;
	        imageResizeBox.style.left = `${image_left}px`;
	      }

	      // ### NOTE:
	      // ### Keep dimensions 'equal' for both 'height' & 'width'.
	      imageCropBox.style.height = imageCropBox.style.width = `${width}px`;
	      imageCropBox.style.width = imageCropBox.style.height = `${height}px`;
	      imageResizeBox.style.height = imageResizeBox.style.width = `${width}px`;
	      imageResizeBox.style.width = imageResizeBox.style.height = `${height}px`;

	      const doc: HTMLElement = document.documentElement;

	      doc.style.setProperty
	      (
	        '--imageCropBox-mask-width',
	        `${width}px`
	      );
			  doc.style.setProperty
	      (
	        '--imageCropBox-mask-height',
	        `${height}px`
	      );

	      // ### NOTE:
	      // ### Calculate Mask 'position' & 'dimensions'.

	      const mask_left: number = (imageCropBox.offsetLeft + width/2) + 5
	        ,mask_top: number = (imageCropBox.offsetTop + height/2) + 5;

	      doc.style.setProperty
	      (
	        '--imageCropBox-mask-left',
	        `${mask_left}px`
	      );
	      doc.style.setProperty
	      (
	        '--imageCropBox-mask-top',
	        `${mask_top}px`
	      );

	      // [🐞]
	      dlogv2
	      (
	        PR_P_TAG + 'mousemove_event (resize)',
	        [
	          event
	          ,`selected_corner: ${selected_corner}`
	          ,`movementX: ${event?.movementX} | movementY: ${event?.movementY}`
	          ,`image_left: ${image_left} | image_top: ${image_top}`
	          ,`mousePosition.x: ${mousePosition.x} | mousePosition.y: ${mousePosition.y}`
	          ,`touchMovementX: ${touchMovementX} | touchMovementY: ${touchMovementY}`
	        ],
	        PR_P_TOG,
	        PR_P_STY
	      );
	    }

	    // ### NOTE:
	    // ### User 'cropping' action.
	    if (crop_selected)
	    {
	      imageCropBox.style.left = `${image_left}px`;
	      imageCropBox.style.top = `${image_top}px`;
	      imageResizeBox.style.left = `${image_left}px`;
	      imageResizeBox.style.top = `${image_top}px`;

	      // ### NOTE:
	      // ### Use 'pre-set' (initial) dimension of circle,
	      // ### and 'half-it' (add top/left) from circle select,
	      // ### to get the actual Mask position on targe container.
	      const doc: HTMLElement = document.documentElement
	        ,width: string = imageCropBox.style.height
	        ,height: string = imageCropBox.style.width;

	      doc.style.setProperty
	      (
	        '--imageCropBox-mask-width',
	        `${width}`
	      );
			  doc.style.setProperty
	      (
	        '--imageCropBox-mask-height',
	        `${height}`
	      );

	      const mask_left: number = (image_left + crop_width_a / 2) + 5
	        ,mask_top: number = (image_top + crop_height_a / 2) + 5;

	      doc.style.setProperty
	      (
	        '--imageCropBox-mask-left',
	        `${mask_left}px`
	      );
			  doc.style.setProperty
	      (
	        '--imageCropBox-mask-top',
	        `${mask_top}px`
	      );
	    }

	    // [🐞]
	    // dlog(image, false);

	    // ### NOTE:
	    // ### Draw image to canvas, and get image data.
	    // ### DOC: https://stackoverflow.com/questions/28538913/crop-an-image-displayed-in-a-canvas
	    // ### DOC: https://stackoverflow.com/questions/4200374/copy-and-crop-images-in-javascript

	    var canvas: HTMLCanvasElement = document.createElement('canvas');
	    canvas.width = image.width // image.width; // initial_image_dimensions[0] - requires multiplication of image_left by Diff
	    canvas.height = image.height // image.height; // initial_image_dimensions[1] - requires multiplication of image_left by Diff
	    var ctx: CanvasRenderingContext2D = canvas.getContext('2d');

	    // ### NOTE:
	    // ### Draw target image on our canvas (dx, dy, dw, dh).
	    ctx.drawImage
	    (
	      image,
	      0,
	      0,
	      image.width,
	      image.height
	    );

	    // ### NOTE:
	    // ### Get canvas image information: sx / sy / sw / sh
	    var imageData: ImageData = ctx.getImageData
	    (
	      image_left,
	      image_top,
	      crop_width_a,
	      crop_height_a
	    )

	      // ### NOTE:
	      // ### Create destiantion canvas.
			 ,canvas1: HTMLCanvasElement = document.createElement('canvas');

	    canvas1.width = crop_width_a;
	    canvas1.height = crop_height_a;

	    var ctx1: CanvasRenderingContext2D = canvas1.getContext('2d');
	    ctx1.rect
	    (
	      0,
	      0,
	      crop_width_a,
	      crop_height_a
	    );
	    ctx1.fillStyle = 'white';
	    ctx1.fill();
	    ctx1.putImageData
	    (
	      imageData,
	      0,
	      0
	    );

	    // [🐞]
	    dlog
	    (
	      canvas1.toDataURL('image/png'),
	      false
	    );

	    // ### NOTE:
	    // ### Save 'base64' url of NEW 'image' selection.
	    new_img_crop = canvas1.toDataURL('image/png');
	  }
	}

  /**
   * @summary
   * 📌 MAIN
   * @author
   * @migbash
   * @description
   * ➫ 'eventListener' logic for 'onMouseUp' / 'onTouchEnd' function.
   * ➫ Removes any toggled active actions, and resets variables.
   * @returns
   * { void }
   */
  function mouseup_event
  (
  ): void
  {
    // [🐞]
    dlog
    (
      PR_P_TAG + 'ℹ️ mouse is up!',
      PR_P_TOG,
      PR_P_STY
    );

    crop_selected = false;
    resize_selected = false;
    original_touch = undefined;
  }

  /**
   * @summary
   * 🔹 HELPER
   * @description
   * ➫ check for wether the resized-image is
   * ➫ of correct allowed dimensions.
   * @param
   * { number } width
   * @param
   * { number } height
   * @returns
   * { boolean }
   */
  function valid_image_dimensions
  (
    width: number,
    height: number
  ): boolean
  {
    const if_M_0: boolean
      = width <= 100
      || height <= 100
    ;
    if (if_M_0)
    {
      // [🐞]
      dlog
      (
        '🔴 Image has reached its bounds... 100x100 allowed',
        true
      );

      return false;
    }

    return true;
  }

  /**
   * @summary
   * 🔹 HELPER
   * @description
   * ➫ removes All 'eventListeners'
   * ➫ declared inside 'this' widget.
   * @returns
   * { void }
   */
  function clear_event_listeners
  (
  ): void
  {
    document.documentElement.classList.remove('no-touch');
    document.body.classList.remove('no-touch');

    let imageCropBox: HTMLElement = document.getElementById('profile-cricle-img-crop')
      ,resize_elemnts: HTMLCollectionOf<Element> = document.getElementsByClassName('resize-dot');

    imageCropBox.removeEventListener
    (
      'touchstart',
      mousedown_event,
      true
    );
    imageCropBox.removeEventListener
    (
      'mousedown',
      mousedown_event,
      true
    );
    window.removeEventListener
    (
      'touchend',
      mouseup_event,
      true
    );
    window.removeEventListener
    (
      'touchmove',
      mousemove_event,
      true
    );
    window.removeEventListener
    (
      'mouseup',
      mouseup_event,
      true
    );
    window.removeEventListener
    (
      'mousemove',
      mousemove_event,
      true
    );

    for (const element of resize_elemnts)
    {
      element.removeEventListener
      (
        'touchstart',
        mousedown_resize_event,
        true
      );
      element.removeEventListener
      (
        'mousedown',
        mousedown_resize_event,
        true
      );
    }
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
MAIN WIDGET BACKGROUND - MODAL
-->
<div
  id="background-modal-blur"
  class:display-none={!modal_pic_crop_show}
  on:click={() => {return toggle_modal()}} in:fade
/>

<!--
MAIN WIDGET - MODAL
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
			{profileTrs?.profile?.profile_photo}
		</p>

		<!--
    [ℹ] close modal icon (cross)
    -->
		<img
			id="close-vector"
			class="cursor-pointer"
			src="/assets/svg/close.svg"
			alt="close-svg"
			on:click={() => {return toggle_modal()}}
		/>

	</div>

	<!--
  [ℹ] image widget select
  -->
	<div
    id="image-box-out"
    class="m-b-20"
  >
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
			<img id="profile-image" src="" alt="default alt text" width="50" height="50" draggable="false" />
		</div>
	</div>

	<!--
  [ℹ] main widget action
  <-contents->
  [ℹ] delete account (btn)
  [ℹ] cancel action (btn)
  -->
	<div
    class="row-space-end"
  >

		<!--
    [ℹ] cancel action (btn)
    -->
		<button
			class="
        btn-hollow
        m-r-16
        color-black-2
      "
			on:click={() => {return toggle_modal()}}
		>
			{profileTrs?.profile?.cancel_expression}
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
			on:click={() => {return upload_selected_img()}}
		>
			{profileTrs?.profile?.save_photo}
		</button>

	</div>

</div>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	div#background-modal-blur
  {
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

	div#modal-delete-box
  {
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

	div#image-box-out
  {
		/* position */
		position: relative;
		/* style */
		height: 240px;
		max-height: 240px;
		width: 100%;
    overflow: hidden;
		background-color: var(--dark-theme);
	}
	div#image-box-out > div#image-box-in
  {
		height: inherit;
		width: fit-content; /* was :fit-content */
		position: relative;
		overflow: hidden;
	}
	div#image-box-out > div#image-box-in > img#profile-image
  {
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

	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop
  {
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
	} div#image-box-out > div#image-box-in > div#profile-cricle-img-crop.reset-crop
  {
    top: 0 !important;
		bottom: 0 !important;
		right: 0 !important;
		left: 0 !important;
		margin: auto !important;
    width: 150px;
    height: 150px;
	}	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop:active
  {
		/* (Optional) Apply a "closed-hand" cursor during drag operation. */
		cursor: grabbing;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
	}

  div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize
  {
		/* position */
		position: absolute;
		/* style */
    z-index: 2;
    width: 150px;
    height: 150px;
    margin: 5px;
  } div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize.reset-resize
  {
    top: 0 !important;
		bottom: 0 !important;
		right: 0 !important;
		left: 0 !important;
		margin: auto !important;
    width: 150px;
    height: 150px;
  } div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.resize-dot
  {
		position: absolute;
    width: 15px;
		height: 15px;
		transform: translate(50%, -50%);
		border-radius: 50%;
		background: #ffffff;
		mix-blend-mode: darken;
  }	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.t-right
  {
		top: 0px;
		right: 0px;
    cursor: sw-resize;
	}	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.t-left
  {
		top: 0px;
		left: -15px;
    cursor: se-resize;
	}	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.b-right
  {
		bottom: -15px;
		right: 0px;
    cursor: nw-resize;
	}	div#image-box-out > div#image-box-in > div#profile-cricle-img-crop-resize > div.b-left
  {
		bottom: -15px;
		left: -15px;
    cursor: ne-resize;
	}

  :global(body.no-touch)
  {
    touch-action: none;
    -ms-touch-action: none;
    overflow-y: hidden;
  }

  /*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 575px)
  {
		div#modal-delete-box
    {
			width: 502px;
			max-width: 502px;
		}
	}

  /*
  =============
  DARK-THEME
  =============
  */

	div#modal-delete-box.dark-background-1
  {
		box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
		background-color: var(--dark-theme-1) !important;
	}

</style>
