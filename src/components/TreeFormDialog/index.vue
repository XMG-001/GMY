<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    @close="handleClose"
    draggable
    center
    style="border-radius: 10px"
  >
    <el-tree
      :id="uuid"
      ref="treeRef"
      :data="data"
      show-checkbox
      empty-text="暂无数据"
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
      :default-checked-keys="defaultCheckedKeys"
      @check="getCheckedKeys"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
        :disabled="!submitDisabled"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { compile, computed, onMounted, ref, toRefs, watch } from "vue";
import { ElTree } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
import { generateUUID } from "@/utils";

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

const props = defineProps({
  dialogTitle: {
    type: String,
    default: "编辑",
  },
  treeDefineProps: {
    type: Object,
    default: () => ({
      children: "children",
      label: "label",
      id: "id",
    }),
  },
  treeAllData: {
    type: Array,
    default: () => [],
  },
  treeDefaultData: {
    type: Array,
    default: () => [],
  },
  treeVisiable: {
    type: Boolean,
    default: false,
  },
  submitDisabled: {
    type: Boolean,
    default: false,
  },
});

const uuid = ref("id-" + generateUUID());

const dialogVisible = ref(props.treeVisiable);

watch(
  () => props.treeVisiable,
  (newVal) => {
    dialogVisible.value = newVal;
  }
);

watch(dialogVisible, (newVal) => {
  if (!newVal) {
    emit("update:treeVisiable", false);
  }
});

const emit = defineEmits(["update:treeVisiable", "change", "submit"]);

// const { treeDefineProps, treeAllData, treeDefaultData } = toRefs(props); //解构
// const defaultProps = ref(treeDefineProps.value);
// const data = ref(treeAllData.value);
// const defaultCheckedKeys = ref(treeDefaultData.value);

const submitDisabled = computed(() => props.submitDisabled);

const data = computed(() => props.treeAllData);
const defaultProps = computed(() => props.treeDefineProps);

const treeRef = ref<InstanceType<typeof ElTree>>();

// :default-checked-keys="defaultCheckedKeys"
const defaultCheckedKeys = computed(() =>
  setHalfCheckedNodes(data.value, props.treeDefaultData)
);
const setHalfCheckedNodes = (tree, checkedKeys) => {
  const nodesToRemove = []; // 存储需要从 defaultCheckedKeys 中移除的 node.id
  const findHalfCheckedNodes = (tree, checkedKeys) => {
    for (let i = 0; i < tree.length; i++) {
      let node = tree[i];
      if (node.children) {
        const checkedChildren = node.children.filter((child) =>
          checkedKeys.includes(child.id)
        );
        if (
          checkedChildren.length > 0 &&
          checkedChildren.length < node.children.length
        ) {
        //   console.log("node.id", node.id);
          nodesToRemove.push(node.id); // 将半选状态的 node.id 加入待移除列表
        }
        findHalfCheckedNodes(node.children, checkedKeys); // 递归处理子节点
      }
    }
  };
  findHalfCheckedNodes(tree, checkedKeys);
  // 更新 defaultCheckedKeys.value，移除 nodesToRemove 中的 id
  checkedKeys = checkedKeys.filter((id) => !nodesToRemove.includes(id));
  return checkedKeys;
};

//获取所有已选中node对象 true包括半选中，false反之
const getCheckedNodes = () => {
  // console.log(treeRef.value!.getHalfCheckedNodes());
  // console.log(treeRef.value!.getCheckedNodes(false, false));
  //   console.log([
  //     ...treeRef.value!.getHalfCheckedNodes(),
  //     ...treeRef.value!.getCheckedNodes(false, false),
  //   ]);
};
const res = ref();
//获取所有已选中key数组 true包括半选中，false反之
const getCheckedKeys = () => {
  //   console.log(treeRef.value!.getHalfCheckedKeys()); //这是所有半选框的数组
  //   console.log(treeRef.value!.getCheckedKeys(false));//这是所有已全选的数组
  res.value = [
    ...treeRef.value!.getHalfCheckedKeys(),
    ...treeRef.value!.getCheckedKeys(false),
  ];
  console.log("res.value", res.value);
  console.log("defaultCheckedKeys", defaultCheckedKeys);
  emit("change", res.value);
};
//清空已选
const resetChecked = () => {
  res.value = [];
  treeRef.value!.setCheckedKeys([], false);
};

const handleClose = () => {
  //当关闭选框时清空状态
  resetChecked();
  // defaultCheckedKeys.value = [];
  dialogVisible.value = false;
};

const handleSubmit = async () => {
  emit("submit", res.value);
  handleClose();
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* 树的整体样式 */
.el-tree {
  background-color: #f9f9f9;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 节点样式 */
.el-tree-node__content {
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s, transform 0.3s;
  cursor: pointer;
}

/* 节点 hover 状态 */
.el-tree-node__content:hover {
  background-color: #e6f7ff;
  transform: translateX(5px);
}

/* 选中节点的高亮样式 */
.el-tree-node.is-current .el-tree-node__content {
  background-color: #bae7ff;
  color: #1890ff;
  font-weight: bold;
}

/* 连接线样式 */
.el-tree-node__children::before {
  content: "";
  position: absolute;
  top: 0;
  left: 14px;
  border-left: 1px solid #dcdcdc;
  height: 100%;
}

.el-tree-node__children {
  padding-left: 20px;
  margin-left: 8px;
  border-left: 1px solid #dcdcdc;
}

/* 树节点的展开/收起箭头样式 */
.el-tree-node__expand-icon {
  margin-right: 6px;
  transition: transform 0.3s;
}

.el-tree-node__expand-icon.is-leaf {
  opacity: 0;
  pointer-events: none;
}

.el-tree-node__expand-icon.is-expanded {
  transform: rotate(90deg);
}

/* 树节点的图标样式 */
.el-tree-node__label {
  margin-left: 4px;
  font-size: 14px;
  font-family: "Arial", sans-serif;
}

/* 复选框的样式 */
.el-checkbox {
  margin-right: 8px;
}

.el-checkbox__input {
  transition: all 0.3s;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #52c41a;
  border-color: #52c41a;
}

.el-checkbox__inner {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}
</style>
