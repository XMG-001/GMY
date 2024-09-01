<template>
    <div class="popup-overlay">
        <div class="popup">
            <div class="close">
                <span class="close-btn" @click="$emit('close')">✖</span>
            </div>
            <div class="popup-container">
                <div class="popup-header">
                    <slot name="header" :popup="popup"></slot>

                </div>
                <div class="popup-content">
                    <slot name="content" :popup="popup"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        popup: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
/* 弹窗样式 */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup {
    background-image: url(../assets/ctbg-1.png);
    background-size: cover;
    display: block;
    /* 默认显示 */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-width: 75%;
    width: 400px;
    /* 设置最大宽度和固定宽度 */
    max-height: 80vh;
    /* 最大高度为视窗的80% */
    min-height: 250px;
    overflow-y: auto;
    /* 内容超出高度时启用滚动条 */
}

.close {
    position: absolute;
    top: 2%;
    right: 2.5%;
}

.close-btn {
    cursor: pointer;
    font-size: 1.2rem;
    color: #999;
    transition: color 0.3s ease;

}

.close-btn:hover {
    background-color: transparent;
    color: #e973ff;
}
.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    position: relative;
}

.popup-header h2 {
    font-size: 1.5rem;
}

.popup-content {
    padding: 0px 20px;
    letter-spacing: 0.2rem;
}

.popup p {
    margin: 0;
    line-height: 1.6;
}
</style>