<template>
    <div class="container">
        <div class="center-container">
            <div class="login-register" :style="isLogging ? {} : { transform: 'translateX(400px)' }">
                <transition name="slide-fade">
                    <!-- changeIsLogging是RegisterForm组件抛出的emit -->
                    <keep-alive>
                        <component :is="FormBox" @changeIsLogging="changeBox"></component>
                    </keep-alive>
                </transition>
            </div>

            <div class="cover" :style="isLogging ? {} : { transform: 'translateX(-600px)' }">
                <!-- :class="isLogging ? 'bottom-right' : 'bottom-left'" -->

                <div class="cover-title-p">
                    <img src="../assets/tomato.webp" width="200px" alt="">
                </div>
                <div class="cover-bt-p">
                    <el-button v-throttle="changeBox" color="#626aef" :dark="isDark" size="large" round plain>
                        <el-icon>
                            <Promotion />
                        </el-icon>
                        &nbsp;{{ isLogging ? '注册' : '登录' }}
                    </el-button>
                </div>
            </div>

        </div>
    </div>

</template>

<script setup>
import { reactive, ref, shallowRef,onMounted } from 'vue';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import { DEFAULT_PRIMARY } from '@/config';
import { ElNotification } from "element-plus";

onMounted(() => {
  ElNotification({
    title: `公告`,
    dangerouslyUseHTMLString: true,
    message:`<i>平台处于演示状态，暂时禁用注册接口</i><br/><strong>用户名：test<i>（角色：二级管理员）</i></strong><br/><strong>密码：1234</strong>`,
    duration:0,
  });
});

const isLogging = ref(true);
const isDark = ref(false);

const FormBox = shallowRef(LoginForm);

const changeBox = async () => {
    console.log('节流');
    isLogging.value = !isLogging.value;
    FormBox.value = isLogging.value ? LoginForm : RegisterForm;
};

</script>

<style lang="scss" scoped>
$form-width: 300px;

.container {
    height: 100vh;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.container::after{
    content: ''; /* 确保伪元素被渲染 */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height:100%;
    box-sizing: border-box;
    background-image: url('@/assets/login-bg-2.webp');
    background-repeat: no-repeat;
    background-position: center;
    /* 背景图居中 */
    // background-size: contain;
    background-size: cover;
    /* 背景图将完整显示在容器内 */
    filter: blur(2px);
    /* 毛玻璃效果，模糊半径为5px */
    z-index: 0;
}

.center-container {
    // background-image: url(../assets/ctbg-1.png);
    background-size: cover;
    // box-shadow: 0px 0px 10px 0px #d1d9e6;
    overflow: hidden;
    display: flex;
    background-color: #f1f1f1;
    border-radius: 8px;
    width: 1000px;
    height: 600px;
    z-index: 1;
}

.login-register {
    // width: 600px;
    flex: 3;
    height: 100%;
    background-color: transparent;
    transition: transform 1s ease-in-out;
}

// .bottom-right{
//     background: linear-gradient(to bottom right, #95bbfd, #f3d2ee);
//     transition: background 1s ease-in-out;
// }
// .bottom-left{
//     background: linear-gradient(to bottom left, #95bbfd, #f3d2ee);
//     transition: background 1s ease-in-out;
// }

.cover {
    background: linear-gradient(to bottom right, #88aaff, #775ccc);
    /* 粉色#f3d2ee */
    background-size: cover;
    box-shadow: 0px 0px 10px 0px #d1d9e6;
    background-size: cover;
    flex: 2;
    // width: 400px;
    height: 100%;
    background-color: transparent;
    transition: transform 1.2s ease-in-out;
    position: relative;
    animation: bounce-in 0.5s;
}

@keyframes bounce-in {
    0% {
        transform: scale(0.5);
    }

    50% {
        transform: scale(1.25);
    }

    100% {
        transform: scale(1);
    }
}


.slide-fade-enter-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.5, 1);
}

.slide-fade-leave-active {
    transition: all 0.6s cubic-bezier(1, 0.5, 0.5, 1);

}

.slide-fade-enter-from,
.slide-fade-leave-to {
    // transform: translateX(20px);
    opacity: 0;
}


.cover-bt-p {
    position: absolute;
    text-align: center;
    width: 100%;
    height: 60px;
    bottom: 20%;
}

.el-button.is-round {
    font-size: 1.3rem;
    letter-spacing: 10px;
    height: 100%;
    width: 180px;
    border-radius: 8px;
    transition: 0.8s ease;
}

.cover-title-p {
    position: absolute;
    text-align: center;
    width: 100%;
    height: 300px;
    top: 15%;
}
</style>