<script lang="ts">
import ProfileAvatarNoneSrc from '$lib/components/shared/assets/profile-avatar-none.svg';
export let imageSrc: string | undefined = undefined;
export let imageAlt: string | undefined = undefined;

$: src = imageSrc || ProfileAvatarNoneSrc;
$: alt = imageSrc ? imageAlt: "No avatar";
</script>

<img class="avatar-component" {src} {alt}/>

<style lang="scss">
.avatar-component {
    border-radius: 100%;
}
</style>