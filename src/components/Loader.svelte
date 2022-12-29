<script lang="ts">
</script>

<div class="loader-container">
    <div class="loader"></div>
</div>

<style>
    .loader {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 200px;
        height: 200px;
        border: 20px solid;
        border-top-color: rgb(230, 62, 62);
        border-bottom-color: rgb(90, 204, 90);
        border-right-color: rgb(73, 52, 167);
        border-left-color: rgb(240, 203, 41);
        border-radius: 50%;
        animation: spin 2s infinite linear;
    }

    @keyframes spin {
        from {
            transform: translate(-50%,-50%) rotate(0deg);
        }
        to {
            transform: translate(-50%,-50%) rotate(360deg);
        }
    }

    .loader-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #242424;
    }
</style>