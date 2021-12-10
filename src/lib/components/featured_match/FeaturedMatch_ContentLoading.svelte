<script lang="ts">
    import type { ContentLoaderProps } from "$lib/model/content-loader-interface"
    import Loader from "./Loader.svelte";

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~~~
     * ... decalring the ContentLoaderProps
     * values through the interface
     */
    let contentLoaderProps: ContentLoaderProps = {
        width: `502`,
        height: `216`,
        primaryColor: "#f9f9f9",
        uniqueKey: "gtr678",
    };
</script>

<Loader {...contentLoaderProps} />