<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Video upload component using FilePond                                          │
│ ➤ Handles: client validation → init API → Firebase upload → complete API         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  import { createEventDispatcher } from 'svelte';
  import { ref, uploadBytesResumable } from 'firebase/storage';
  import { storage } from '$lib/firebase/init.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let authorId: number;
  export let visible = false;

  const dispatch = createEventDispatcher();

  const
    ALLOWED_EXTS = ['mp4', 'mov', 'webm'],
    ALLOWED_MIMES = ['video/mp4', 'video/quicktime', 'video/webm'],
    MAX_BYTES = 6 * 1024 * 1024 * 1024,
    MAX_DURATION_SEC = 7200
  ;

  let
    containerEl: HTMLDivElement,
    uploading = false,
    progress = 0,
    errorMessage = ''
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  async function handleFileSelect(event: Event)
  {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    errorMessage = '';

    // ╭─────
    // │ NOTE: Client-side validation.
    // ╰─────
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (!ALLOWED_EXTS.includes(ext))
    {
      errorMessage = `Invalid file type: .${ext}. Allowed: ${ALLOWED_EXTS.join(', ')}`;
      input.value = '';
      return;
    }

    if (!ALLOWED_MIMES.includes(file.type))
    {
      errorMessage = `Invalid MIME type: ${file.type}`;
      input.value = '';
      return;
    }

    if (file.size > MAX_BYTES)
    {
      errorMessage = `File too large: ${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB. Max: 6 GB`;
      input.value = '';
      return;
    }

    // ╭─────
    // │ NOTE: Check duration using HTMLVideoElement.
    // ╰─────
    let durationSec = 0;

    try
    {
      durationSec = await getVideoDuration(file);

      if (durationSec > MAX_DURATION_SEC)
      {
        errorMessage = `Video too long: ${Math.round(durationSec)}s. Max: ${MAX_DURATION_SEC}s (2 hours)`;
        input.value = '';
        return;
      }
    }
    catch
    {
      // Duration check failed; proceed anyway, server will validate.
    }

    // ╭─────
    // │ NOTE: Start upload flow.
    // ╰─────
    await startUpload(file, ext, durationSec);
    input.value = '';
  }

  function getVideoDuration(file: File): Promise<number>
  {
    return new Promise((resolve, reject) =>
    {
      const video = document.createElement('video');
      video.preload = 'metadata';

      const url = URL.createObjectURL(file);
      video.src = url;

      video.onloadedmetadata = () =>
      {
        URL.revokeObjectURL(url);
        resolve(video.duration);
      };

      video.onerror = () =>
      {
        URL.revokeObjectURL(url);
        reject(new Error('Could not read video metadata'));
      };
    });
  }

  async function startUpload(file: File, ext: string, durationSec: number)
  {
    uploading = true;
    progress = 0;
    errorMessage = '';

    try
    {
      // ╭─────
      // │ STEP 1: Init API call.
      // ╰─────
      const initRes = await fetch
      (
        '/api/media/video/init',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify
          (
            {
              authorId,
              ext,
              mime: file.type,
              bytes: file.size
            }
          )
        }
      );

      const initData = await initRes.json();

      if (!initData.success)
      {
        errorMessage = initData.message || 'Init failed';
        uploading = false;
        return;
      }

      const { assetId, storagePath } = initData;

      // ╭─────
      // │ NOTE: Dispatch event so editor can insert placeholder node.
      // ╰─────
      dispatch('uploadstart', { assetId, ext });

      // ╭─────
      // │ STEP 2: Firebase resumable upload.
      // ╰─────
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on
      (
        'state_changed',
        (snapshot) =>
        {
          progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (err) =>
        {
          errorMessage = err.message || 'Upload failed';
          uploading = false;
        },
        async () =>
        {
          // ╭─────
          // │ STEP 3: Complete API call.
          // ╰─────
          try
          {
            const completeRes = await fetch
            (
              '/api/media/video/complete',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetId, durationSec })
              }
            );

            const completeData = await completeRes.json();

            if (!completeData.success)
            {
              errorMessage = completeData.message || 'Complete failed';
              uploading = false;
              return;
            }

            dispatch('uploaded', { assetId, ext });
            uploading = false;
            progress = 100;
            visible = false;
          }
          catch (e: any)
          {
            errorMessage = e.message || 'Complete failed';
            uploading = false;
          }
        }
      );
    }
    catch (e: any)
    {
      errorMessage = e.message || 'Upload failed';
      uploading = false;
    }
  }

  function close()
  {
    if (!uploading)
      visible = false;
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

{#if visible}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    class="video-uploader-overlay"
    on:click|self={close}
    on:keydown={(e) => e.key === 'Escape' && close()}
    role="dialog"
    tabindex="-1"
  >
    <div class="video-uploader-modal" bind:this={containerEl}>
      <div class="header">
        <span>Upload Video</span>
        <button class="close-btn" on:click={close} disabled={uploading}>&times;</button>
      </div>

      {#if uploading}
        <div class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {progress}%"></div>
          </div>
          <span class="progress-text">{progress}%</span>
        </div>
      {:else}
        <div class="upload-area">
          <label class="file-label">
            <input
              type="file"
              accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm"
              on:change={handleFileSelect}
              hidden
            />
            <span>Click to select a video file</span>
            <span class="hint">MP4, MOV, WebM — Max 6 GB, 2 hours</span>
          </label>
        </div>
      {/if}

      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
    </div>
  </div>
{/if}

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">
  .video-uploader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .video-uploader-modal {
    background: var(--colors-background-bg-primary, #fff);
    border-radius: 12px;
    padding: 24px;
    width: 480px;
    max-width: 90vw;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 600;
    color: var(--colors-text-text-primary, #111);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--colors-text-text-secondary, #666);
    padding: 4px 8px;
    border-radius: 4px;

    &:hover {
      background: var(--colors-background-bg-secondary, #f5f5f5);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .upload-area {
    border: 2px dashed var(--colors-border-border-primary, #ddd);
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--component-colors-components-buttons-primary-button-primary-bg, #0066ff);
    }
  }

  .file-label {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--colors-text-text-secondary, #666);

    .hint {
      font-size: 13px;
      color: var(--colors-text-text-tertiary, #999);
    }
  }

  .upload-progress {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 0;
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background: var(--colors-background-bg-secondary, #eee);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--component-colors-components-buttons-primary-button-primary-bg, #0066ff);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    min-width: 40px;
    text-align: right;
    font-size: 14px;
    font-weight: 600;
    color: var(--colors-text-text-primary, #111);
  }

  .error-message {
    margin-top: 12px;
    padding: 8px 12px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    color: #dc2626;
    font-size: 14px;
  }
</style>
