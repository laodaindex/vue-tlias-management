<script setup>
import { ref, onMounted } from 'vue';
import { queryAllApi, addApi,queryByIdApi,updateApi,deleteByIdApi } from '@/api/dept';
import { ElMessage,ElMessageBox } from 'element-plus';
const deptList = ref([])

// 查询
const search = async() => {
    const result = await queryAllApi();
    if(result.code)
    {
      deptList.value=result.data;
    }
}

//Dialog对话框默认属性
const dialogFormVisible = ref(false);
//formTitle
const formTitle = ref('');
//声明dept
const dept = ref({
  name: ''
})

//声明保存函数
const save = async() =>{

  //校验表单
  if(!deptFormRef.value)
  {
    return;
  }
  deptFormRef.value.validate(async(valid)=>{//校验通过
    if(valid)
    {
      let result;

      if(dept.value.id){//编辑部门
            result = await updateApi(dept.value);
      }else{//新增部门
            result = await addApi(dept.value);
      }
      //提交表单
      
      if(result.code)
      {
        //提示成功
        ElMessage.success('操作成功');
        //关闭对话框
        dialogFormVisible.value = false;
        //再次查询
        search();
      }
      else
      {
        //提示失败
        ElMessage.error(result.msg);
      }
    }
    else{
      ElMessage.error('未按要求填写');
    }
  })


}
//声明新增部门函数
const addDept = () =>{
  dialogFormVisible.value = true;
  formTitle.value = '新增部门';

  //重置规则提示信息
  if(deptFormRef.value)
  {
    deptFormRef.value.resetFields();
  }
}

// 钩子函数
onMounted(() => {
  search();
})
//表单校验规则
const deptFormRef = ref();
const rules = ref(
  {
    name: [
      { required: true, message: '部门名称不能为空', trigger: 'blur' },
      { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ]
  }
)

//编辑
const edit = async (id) =>{
  formTitle.value = '编辑部门';
  //重置规则提示信息
  if(deptFormRef.value)
  {
    deptFormRef.value.resetFields();
  }
  
  const result = await queryByIdApi(id);
  if(result.code){
    dialogFormVisible.value=true;
    dept.value=result.data;
  }
}

//删除
const deleteById = async (id) =>{
  ElMessageBox.confirm('确认删除该部门吗？此过程不可逆!!!', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const result = await deleteByIdApi(id);
    if(result.code){
      ElMessage.success('删除成功');
      search();
    }
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}
</script>

<template>
  <h1>部门管理</h1>
  <div class="button">
    <el-button type="primary" class="custom-button" @click="addDept">新增部门</el-button>
  </div>
  <div class="container">
    <!-- 设置表格高度 -->
    <el-table :data="deptList" style="width: 100% height: 400px" max-height="400px"> 
      <el-table-column type="index" label="序号" width="100" align="center"/>
      <el-table-column prop="name" label="部门名称" width="250" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" align="center" /> 
      <el-table-column label="操作" align="center" >
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)" class="custom-button"><el-icon><Edit /></el-icon>&ensp;编辑  </el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)" class="custom-button01"><el-icon><Delete /></el-icon>&ensp;删除  </el-button>

        </template>
      </el-table-column>
    </el-table>
  </div>


  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" label-width="80px" prop="name">
        <el-input v-model="dept.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="save">Confirm</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
h1 {
  color: #333;
  text-align: center;
  font-family: "Microsoft YaHei", "微软雅黑", "宋体", "Arial", sans-serif;
}

.button {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  padding: 10px;
}

.custom-button {
  background-color: #007BFF;
  border-color: #007BFF;
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  transition: all 0.3s ease;
}
.custom-button01 {
  background-color: #ff0044;
  border-color: #ff0033;
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.custom-button:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: scale(1.05);
}
.custom-button01:hover {
  background-color: #b30000;
  border-color: #b30000;
  transform: scale(1.05);
}

.container {
  background: rgba(255, 255, 255, 0.2); 
  backdrop-filter: blur(10px); 
  border-radius: 10px; 
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3); 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
}
</style>