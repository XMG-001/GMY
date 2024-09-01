<template>
    <div :class="[settingStore.layout === 'default'? 'personal-container': 'personal-container-transverse']">
        <el-dropdown size="large" class="personal-el-dropdown">
            <div class="personal" :class="settingStore.isCollapse  ? 'is-collapse' : ''">
                <el-tooltip class="box-item" effect="light" :content="'用户:' + userInfoStore.userInfo.username"
                    placement="right" :disabled="!settingStore.isCollapse || isNotDefault">
                    <div style="flex: 1; margin: 0 10px">
                        <el-avatar :icon="UserFilled" />
                    </div>
                </el-tooltip>
                <div class="personal-span" style="flex: 2">
                    <span v-show="!settingStore.isCollapse || isNotDefault">
                        {{userInfoStore.userInfo.username}}</span>
                </div>
            </div>
            <template #dropdown>
                <el-dropdown-menu class="personal-el-dropdown-menu">
                    <el-dropdown-item>
                        <div v-show="!settingStore.isCollapse || isNotDefault">
                            <el-icon>
                                <Place />
                            </el-icon>
                            <span>&nbsp;个人中心</span>
                        </div>
                        <div v-show="settingStore.isCollapse && !isNotDefault">
                            <el-icon style="margin-right: 0px">
                                <Place />
                            </el-icon>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item @click="clearUserInfo">
                        <div v-show="!settingStore.isCollapse || isNotDefault">
                            <el-icon>
                                <SwitchButton />
                            </el-icon>
                            <span>&nbsp;注&emsp;&emsp;销</span>
                        </div>
                        <div v-show="settingStore.isCollapse && !isNotDefault">
                            <el-icon style="margin-right: 0px">
                                <SwitchButton />
                            </el-icon>
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { UserFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "@/router";
import useSettingStore from "@/store/modules/setting";
import useUserInfoStore from "@/store/modules/userInfo";
import useMenuInfoStore from "@/store/modules/menuInfo";
import { logoutFn } from "@/api/modules/login";
import { computed } from "vue";

const settingStore = useSettingStore();
const userInfoStore = useUserInfoStore();
const menuInfoStore = useMenuInfoStore();

const isNotDefault = computed(()=>{
return settingStore.layout !== 'default'
})

const clearUserInfo = () => {
    {
        ElMessageBox.confirm("将会退出登录。继续?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            draggable: true,
        })
            .then(async () => {
                // localStorage.removeItem('currentUser');//指定清除
                //注意 先发送注销请求再把token清空，不然无请求头
                await logoutFn();
                await userInfoStore.resetAll();
                await menuInfoStore.resetAll();
                await settingStore.resetAll();
                sessionStorage.clear();
                await router.replace({ name: "Login" });
            })
            .catch(() => {
                console.log("取消注销");
            });
    }
};
</script>

<style scoped>
.personal-container {
    position: absolute;
    width: 100%;
    height: 60px;
    text-align: center;
    bottom: 0;
}

.personal-container-transverse{
    position: relative;
    max-width: 180px;
    min-width: 180px;
    height: 50px;
}

.personal-el-dropdown {
    width: 90%;
}

.personal {
    border-radius: 5px;
    width: 100%;
    /* background-color: rgba(255, 255, 255, 0.3); */
    background: #0000000f;
    height: 50px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s ease;
}

.personal-container span{
    color: #f1f1f1;
}

.personal-container-transverse span{
    font-weight: bold;
}

.personal-span {
    height: 100%;
    line-height: 50px;
    margin-right: 5px;
    text-align: left;
    font-size: larger;
    overflow: hidden;
    /* 确保超出容器的内容被裁剪 */
    white-space: nowrap;
    /* 确保文本在一行内显示 */
    text-overflow: ellipsis;
    /* 超出部分显示省略号 */
}

.personal:focus-visible {
    outline: none;
}

/* .personal-el-dropdown-menu{
} */

.is-collapse {
    background-color: transparent;
}

a {
    text-decoration: none;
}
</style>

<style lang="scss">
.el-dropdown__popper {
    &.el-popper__arrow {
        display: none;
    }

    &.el-popper {
        overflow: hidden;
        border-radius: 20px;
    }

    &.el-dropdown-menu {
        background-color: #fff;
    }
}

.el-dropdown-menu {
    li {
        height: 30px;

        span {
            letter-spacing: 0.6rem;
            font-size: 15px;
        }
    }
}

.el-dropdown-menu__item {
    &:not(.is-disabled):hover {
        background-color: rgba(220, 220, 220, 0.3);
        color: #666;
    }
}
</style>

<!-- <style>
.el-dropdown__popper.el-popper__arrow {
    display: none;
}

.el-dropdown__popper.el-popper {
    overflow: hidden;
    border-radius: 20px;
}

.el-dropdown__popper.el-dropdown-menu {
    width: 180px;
    background-color: #fff;
}

.el-dropdown-menu li {
    height: 30px;
}

.el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: rgba(220, 220, 220, 0.3);
    color: #666;
}

.el-dropdown-menu li span {
    letter-spacing: 0.6rem;
    font-size: 15px;
}
</style> -->
