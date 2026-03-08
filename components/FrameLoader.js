/**
 * FrameLoader — Preloads all animation frame images and provides caching.
 * Returns a promise that resolves with an array of loaded Image objects.
 */

const TOTAL_FRAMES = 240;
const FRAME_PATH = '/frames/ezgif-frame-';

/**
 * Pads a number with leading zeros.
 */
function padNumber(num, size = 3) {
    return String(num).padStart(size, '0');
}

export function getFrameUrl(frameNumber) {
    return `${FRAME_PATH}${padNumber(frameNumber)}.jpg`;
}

/**
 * Preloads all frame images and returns them as an array.
 * @param {function} onProgress - Callback with progress (0-1)
 * @returns {Promise<HTMLImageElement[]>}
 */
export function preloadImages(onProgress) {
    return new Promise((resolve, reject) => {
        const images = new Array(TOTAL_FRAMES);
        let loadedCount = 0;

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = getFrameUrl(i + 1);

            img.onload = () => {
                images[i] = img;
                loadedCount++;

                if (onProgress) {
                    onProgress(loadedCount / TOTAL_FRAMES);
                }

                if (loadedCount === TOTAL_FRAMES) {
                    resolve(images);
                }
            };

            img.onerror = () => {
                loadedCount++;
                images[i] = null;

                if (onProgress) {
                    onProgress(loadedCount / TOTAL_FRAMES);
                }

                if (loadedCount === TOTAL_FRAMES) {
                    resolve(images);
                }
            };
        }
    });
}

export { TOTAL_FRAMES };
