<template>
    <div class="table-all">
        <div class="table-container">
            <main>
    
            </main>
            <!-- <el-table :data="tableData">
                <el-table-column prop="date" label="Date" width="140" />
                <el-table-column prop="name" label="Name" width="120" />
                <el-table-column prop="address" label="Address" />
            </el-table> -->
            <UserTable></UserTable>

        </div>
        <div class="table-paging">
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Paging from './Paging.vue';
import UserTable from './UserTable.vue';


</script>

<style scoped>
.table-all{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    flex-direction: column;
}
.table-container {
    position: relative;
    height: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.table-paging {
    margin-top: 20px;
    position: relative;
    height: 60px;
}
</style>