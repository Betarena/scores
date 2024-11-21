/**
 * @description
 *  📣 Create an image element from a URL.
 * @param {string} url - The URL of the image.
 * @returns {Promise<HTMLImageElement>} - A promise that resolves to the image element.
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) =>
  {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
    image.src = url;
  });

/**
 * @description
 *  📣 Convert degrees to radians.
 * @param {number} degreeValue - The value in degrees.
 * @returns {number} - The value in radians.
 */
function getRadianAngle(degreeValue: number): number
{
  return (degreeValue * Math.PI) / 180;
}

/**
 * @description
 *  📣 Get the cropped image.
 * @param {string} imageSrc - The source URL of the image.
 * @param {Object} pixelCrop - The crop object.
 * @param {number} rotation - The rotation angle in degrees.
 * @returns {Promise<string>} - A promise that resolves to the cropped image as a data URL.
 */
export async function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }, rotation = 0): Promise<string>
{
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimension to double the largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by the canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on the image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotated image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // As Base64 string
  return canvas.toDataURL('image/png');
}

/**
 * @description
 *  📣 Get the rotated image.
 * @param {string} imageSrc - The source URL of the image.
 * @param {number} rotation - The rotation angle in degrees.
 * @returns {Promise<string>} - A promise that resolves to the rotated image as a data URL.
 */
export async function getRotatedImage(imageSrc: string, rotation = 0): Promise<string>
{
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const orientationChanged =
    rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270;
  if (orientationChanged)
  {
    canvas.width = image.height;
    canvas.height = image.width;
  } else
  {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  return canvas.toDataURL('image/png');
}