<template>
    <div>
        <el-button @click="generateFiles(10)" type="primary" style="margin-bottom: 10px">点击我增加10张图片</el-button>
        <el-button @click="clearImg" type="danger" style="margin-bottom: 10px">清除图片</el-button>
        <el-upload drag v-model:file-list="fileList" action="#" list-type="picture-card" :auto-upload="false">
            <el-icon>
                <Plus />
            </el-icon>
            <template #file="{ file }">
                <div class="flex-center">
                    <el-space direction="vertical" alignment="flex-start">
                        <el-skeleton style="width: 100%" :loading="loading" animated>
                            <template #template>
                                <el-skeleton-item variant="image" style="
                    width: var(--el-upload-list-picture-card-size);
                    height: var(--el-upload-list-picture-card-size);
                  " />
                            </template>
                            <template #default>
                                <img class="el-upload-list__item-thumbnail" v-lazy="file.url" />
                                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                        <el-icon><zoom-in /></el-icon>
                                    </span>
                                    <span v-if="!disabled" class="el-upload-list__item-delete"
                                        @click="handleDownload(file)">
                                        <el-icon>
                                            <Download />
                                        </el-icon>
                                    </span>
                                    <span v-if="!disabled" class="el-upload-list__item-delete"
                                        @click="handleRemove(file)">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </span>
                                </span>
                            </template>
                        </el-skeleton>
                    </el-space>
                </div>
            </template>
        </el-upload>

        <el-dialog v-model="dialogVisible">
            <img w-full v-lazy="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { UploadFile, UploadUserFile } from "element-plus";
import Sortable from "sortablejs";

onMounted(() => {
    tabsDrop();
});

// tabs 拖拽排序
const tabsDrop = () => {
    Sortable.create(
        document.querySelector(".el-upload-list--picture-card") as HTMLElement,
        {
            draggable: ".el-upload-list__item",
            animation: 500,
            onEnd({ newIndex, oldIndex }) {
                const newList = [...fileList.value];
                const currRow = newList.splice(oldIndex as number, 1)[0];
                newList.splice(newIndex as number, 0, currRow);
                fileList.value = newList;
            },
        }
    );
};

const loading = ref(false);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);

const handleRemove = (file: UploadFile) => {
    console.log(file);
    // 使用 filter 方法过滤掉 uid 等于 file.uid 的对象
    const newFileList = fileList.value.filter((item) => item.uid !== file.uid);
    // 将新的文件列表设置回 fileList.value
    fileList.value = newFileList;
};

const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!;
    dialogVisible.value = true;
};

const handleDownload = (file: UploadFile) => {
    console.log(file);
};

const fileList = ref<UploadUserFile[]>([]);

async function generateFiles(n) {
    loading.value = true;
    const files = [];
    //'https://api.yimian.xyz/img?type=wallpaper'
    const url = [
        "https://www.dmoe.cc/random.php",
        "https://api.yimian.xyz/img",
        "https://api.r10086.com/%E6%A8%B1%E9%81%93%E9%9A%8F%E6%9C%BA%E5%9B%BE%E7%89%87api%E6%8E%A5%E5%8F%A3.php?%E5%9B%BE%E7%89%87%E7%B3%BB%E5%88%97=%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80",
        "https://api.r10086.com/%E6%A8%B1%E9%81%93%E9%9A%8F%E6%9C%BA%E5%9B%BE%E7%89%87api%E6%8E%A5%E5%8F%A3.php?%E5%9B%BE%E7%89%87%E7%B3%BB%E5%88%97=%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E7%B3%BB%E5%88%971",
    ];

    for (let i = 0; i < n; i++) {
        const timestamp = new Date()
            .toISOString()
            .replace(/[-:.]/g, "")
            .slice(0, 17); // 生成时间戳
        const random_number = Math.floor(1000 + Math.random() * 9000); // 添加随机数以确保唯一性
        const name = `${timestamp}_${random_number}.png`;
        let index = Math.floor(Math.random() * url.length);

        files.push({
            name: name as string,
            url: index === 0 ? `${url[index]}?${random_number}` : `${url[index]}` as string,
        });
    }
    // 将生成的文件列表赋值给 fileList
    fileList.value.push(...files);
    setTimeout(() => (loading.value = false), 2000);
}

const clearImg = () => {
    fileList.value = [];
};
</script>

<style lang="scss" scoped>
:deep(.el-upload-dragger) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

:deep(.el-dialog__body) {
    text-align: center;
}
</style>
