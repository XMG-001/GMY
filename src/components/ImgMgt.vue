<template>
    <div>
        <el-upload class="upload-demo" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖拽文件至此 <em>点击上传</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    jpg/png 文件大小至少 500kb
                </div>
            </template>
        </el-upload>
        <ImgPre></ImgPre>
    </div>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import ImgPre from './ImgPre.vue';
</script>