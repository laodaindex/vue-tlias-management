<script setup>
import { ref,watch,onMounted } from 'vue'; 

import {queryPageApi,addApi,queryInfoApi,updateApi,deleteApi} from '@/api/emp'

import {queryAllApi as queryAllDeptApi} from '@/api/dept'

import {ElMessage, ElMessageBox} from 'element-plus'
//oken
const token = ref('')
//元数据
//职位列表数据
const jobs =ref([{name:'班主任',value:1},{name:'讲师',value:2},{name:'学工主管',value:3},{name:'教研主管',value:4},{name:'咨询师',value:5}])
//性别列表数据
const genders =ref([{name:'男',value:1},{name:'女',value:2}])
//部门列表数据
const depts = ref([])

//查询列表 
const searchEmp =ref({name:'',gender:'',date:[],begin:'',end:''})

//清空
const clear = () =>{
  searchEmp.value={name:'',gender:'',date:[],begin:'',end:''}

  search();
}
//员工列表数据
const empList=ref([])

//watch监听searchEmp的date属性
watch (() => searchEmp.value.date,(newVal,oldVal)  => {
    if(newVal.length==2)
    {
      searchEmp.value.begin=newVal[0];
      searchEmp.value.end=newVal[1];
    }
    else{
      searchEmp.value.begin='';
      searchEmp.value.end='';
    }
})
//条件查询员工列表
const search = async () =>{
  const result = await queryPageApi(
    searchEmp.value.name,
    searchEmp.value.gender,
    searchEmp.value.begin,
    searchEmp.value.end,
    currentPage.value,
    pageSize.value
  )
  if(result.code){
    empList.value=result.data.rows;
    total.value=result.data.total;
  }
} 

//分页
const currentPage = ref(1);
const pageSize = ref(5);
const background = ref(true);
const total = ref(0);//总记录数
//页码变化时触发
const handleSizeChange = (val) => {
  search();
};
const handleCurrentChange = (val) => {
  search();
};
//钩子函数
onMounted(async() => {
  search();//查询所有员工列表数据
  queryAllDepts();//查询所有部门名称
  getToken();//获取token
})
//获取token
const getToken = () => {
  const loginUser = JSON.parse(localStorage.getItem('loginUser'));
  if(loginUser&&loginUser.token)
  {
    token.value = loginUser.token;
  }
}

//新增/修改表单
const employee=ref({
  username:'',
  name:'',
  gender:'',
  phone:'',
  job:'',
  salary:'',
  deptId:'',
  entrydate:'',
  image:'',
  exprList:[]
})

//新增员工
const addEmp=()=>{
  dialogVisible.value=true;
  // 修改为通过 .value 修改 ref 对象的值
  dialogTitle.value = '新增员工';
  employee.value={
    //清空值
    username:'',
    name:'',
    gender:'',
    phone:'',
    job:'',
    salary:'',
    deptId:'',
    entrydate:'',
    image:'',
    exprList:[]
  }
  //重置表单的校验规则--提示信息
  if(empFormRef.value){empFormRef.value.resetFields();}
}
//查询所有部门名称
const queryAllDepts=async()=>{
  const result = await queryAllDeptApi()
  if(result.code){
    depts.value=result.data
  }
}

//控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')

//文件上传
// 图片上传成功后触发
const handleAvatarSuccess = (response,uploadFile) => {
  console.log(response)
  employee.value.image = response.data
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}

//添加工作经历
const addExprItem=()=>{
  employee.value.exprList.push({company:'',job:'',begin:'',end:'',exprDate:[]})
}
//删除工作经历
const delExprItem=(index)=>{
  employee.value.exprList.splice(index,1)
}
//侦听--emPloyee员工对象中的工作经历信息
watch(()=>employee.value.exprList,(newVal,oldVal)=>{
  if(employee.value.exprList&&employee.value.exprList.length>0)
  {
    employee.value.exprList.forEach((expr)=>
    {expr.begin=expr.exprDate[0];expr.end=expr.exprDate[1]}
    )
  }
},{deep:true})//深度侦听

//保存
const save = async() =>{
  //校验表单
  if(!empFormRef.value)
  {
    return;
  }
  empFormRef.value.validate(async(valid)=>{//校验通过
    if(valid)
    {
      let result;
      if(employee.value.id)
      {
        result = await updateApi(employee.value);
      }
      else{
        result = await addApi(employee.value);
      }
      //提交表单
      if(result.code)
      {
        //提示成功
        ElMessage.success('操作成功');
        //关闭对话框
        dialogVisible.value = false;
        //再次查询
        search();
      }
      else//失败
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
//表单引用
const empFormRef = ref();
// 表单验证规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2到20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/g, message: '请输入有效的手机号', trigger: 'blur' }
  ]
});
//编辑函数
const edit =async(id)=>{
  const result = await queryInfoApi(id);
  if(result.code){
    dialogVisible.value= true;
  dialogTitle.value="编辑员工信息";
  employee.value=result.data;

  //对工作经历处理
  let exprList = employee.value.exprList;
  if(exprList&&exprList.length>0)
  {
    exprList.forEach((expr)=>
    {
      expr.exprDate=[expr.begin,expr.end]
    })
  }
  }
}
//根据id删除员工
const deleteById = async(id) =>{
  ElMessageBox.confirm('操作确认','提示',{
    type:'warning',
    confirmButtonText:'确定',
    cancelButtonText:'取消'
  }).then(async()=>{
    const result = await deleteApi(id);
    if(result.code){
      ElMessage.success('删除成功');
      search();
    }
    else{
      ElMessage.error(result.msg);
    }
  })
}
//记录勾选员工id
const selectedIds = ref([]);
//复选框选中状态改变时触发 val:当前选中的行数据
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id);
}
//删除选中员工
const deleteByIds = async(id) =>{
  if(selectedIds.value.length>0){
  ElMessageBox.confirm('操作确认','提示',{
    type:'warning',
    confirmButtonText:'确定',
    cancelButtonText:'取消'
  }).then(async()=>{
   
    const result = await deleteApi(selectedIds.value);
    if(result.code){
      ElMessage.success('删除成功');
      search();
    }
    else{
      ElMessage.error(result.msg);
    }
  }
  )
  }
    else{
      ElMessage.error('请选择要删除的员工');
    }
}

</script>

<template>
  <h1 align="center">员工管理</h1>
  <div class="container" align="center">
    <!-- {{ searchEmp }} -->
      <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
        <!-- 姓名 -->
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="输入员工姓名"/>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别">
        <el-select
          v-model="searchEmp.gender"
          placeholder="选择性别"
        >
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <!-- 入职日期 -->
      <el-form-item label="入职日期">
        <el-date-picker
          v-model="searchEmp.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="Pick a date"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">Query</el-button>
        <el-button type="info" @click="clear">Clear</el-button>
      </el-form-item>
    </el-form>

  <el-table :data="empList" border style="width: 100%" height="400px" max-height="400px"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column prop="name" label="姓名" width="120" align="center"/>
      <el-table-column prop="gender" label="性别" width="120" align="center">
        <template #default="scope">
          {{ scope.row.gender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="image" label="头像" width="120" align="center">
        <template #default="scope">
          <img :src="scope.row.image" alt="头像" style="width: 50px; height: 50px; border-radius: 50%;">
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" align="center"/>
      <el-table-column prop="job" label="职位" align="center">
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">讲师</span>
          <span v-else-if="scope.row.job == 3">学工主管</span>
          <span v-else-if="scope.row.job == 4">教研主管</span>
          <span v-else-if="scope.row.job == 5">咨询教师</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职时间" align="center"/>
      <el-table-column prop="updateDate" label="最后操作时间" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"><el-icon-edit/>编辑</el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)"><el-icon-delete/>删除</el-button>
        </template>
      </el-table-column>

    </el-table>

  <!-- 功能按钮 -->
  <div class="button">
    <el-button type="primary" class="custom-button" @click="addEmp">+ Add</el-button>
    <el-button type="primary" class="custom-button01" @click="deleteByIds">批量删除</el-button>
  </div>
  </div>
  <!-- 添加员工的弹窗 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form ref="empFormRef" :model="employee" :rules="rules" label-width="80px">
        <!-- 基本信息 -->
        <!-- 第一行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%;">
                <el-option v-for="gender in genders" :key="gender.value" :label="gender.name" :value="gender.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职位">
              <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%;">
                <el-option v-for="job in jobs" :key="job.value" :label="job.name" :value="job.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资">
              <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门">
              <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%;">
                <el-option v-for="dept in depts" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期">
              <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :headers="{'token':token}"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                >
                <img v-if="employee.image" :src="employee.image" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 工作经历 -->
        <!-- 第六行 -->
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="工作经历">
              <el-button type="success" size="small" @click="addExprItem">+ 添加工作经历</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 第七行 ...  工作经历 -->
        <el-row :gutter="3" v-for="(expr,index) in employee.exprList">
          <el-col :span="10">
            <el-form-item size="small" label="时间" label-width="80px">
              <el-date-picker type="daterange" v-model="expr.exprDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" ></el-date-picker>

            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="公司" label-width="60px">
              <el-input placeholder="请输入公司名称" v-model="expr.company"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="职位" label-width="60px">
              <el-input placeholder="请输入职位" v-model="expr.job"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-form-item size="small" label-width="0px">
              <el-button type="danger" @click="delExprItem(index)">- 删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
        <!-- 底部按钮 -->
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </span>
        </template>

    </el-dialog>
      

<!-- 分页条 -->
<el-pagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="total"
  :background="background"
  layout="total, sizes, prev, pager, next, jumper"
  :page-size="pageSize" :page-sizes="[5,10, 20, 30, 50, 75]"
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
/>
</template>

<style scoped>
.container {
  background: rgba(255, 255, 255, 0.2); 
  backdrop-filter: blur(10px); 
  border-radius: 10px; 
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3); 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
}

.button {
  margin: 20px; /* 添加外边距 */
  display: flex; /* 使用 flexbox */
  justify-content: flex-end; /* 靠右对齐 */
}
.avatar {
  height: 40px;
}
.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>
