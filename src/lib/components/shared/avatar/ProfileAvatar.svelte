<script lang="ts">
import ProfileAvatarNoneSrc from '$lib/components/shared/assets/profile-avatar-none.svg';
export let imageSrc: string | undefined = undefined;
export let imageAlt: string | undefined = undefined;

$: src = imageSrc || ProfileAvatarNoneSrc;

</script>

<img class="avatar-component" {src} alt={imageAlt}/>

<style lang="scss">
.avatar-component {
    border-radius: 100%;

}
</style>