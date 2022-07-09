## 1 功能点
功能点、页面展示，见后端README

## 2 代码逻辑架构

![image](https://user-images.githubusercontent.com/26532614/174464178-25e9d8b1-6357-4573-a377-375ba2d018a8.png)

## 3 主要功能实现

### 3.1 路由映射
用 Vue.js 的官方路由 Vue Route 实现

    Vue.use(VueRouter)

    const routes = [
    {
        path:'/',
        name:'SignIn',
        component:SignIn
    },
    {
        path:'/sign-up',
        name:'SignUp',
        component:SignUp
    },
    {
        path:'/case',
        name:'Case',
        component:Case
    },
    {
        path:'/task',
        name:'Task',
        component:Task
    },
    {
        path:'/jenkins',
        name:'Jenkins',
        component:Jenkins
    },
    {
        path:'/report',
        name:'Report',
        component:Report
    }
    ]

    const router = new VueRouter({
    routes
    })

    export default router

### 3.2 导航栏
样式借用 Vuetify

    <template>
      <v-tabs :value="2" background-color="primary">
        <v-tab @click="$router.push({ name: 'Case' })">用例管理</v-tab>
        <v-tab @click="$router.push({ name: 'Task' })">任务管理</v-tab>
        <v-tab @click="$router.push({ name: 'Jenkins' })">Jenkins管理</v-tab>
        <v-tab @click="$router.push({ name: 'Report' })">报告管理</v-tab>
        <v-spacer></v-spacer>
        <v-btn text @click="logout()">退出</v-btn>
      </v-tabs>
    </template>

### 3.3 组件
以用例为例，功能有：
- 添加用例
- 编辑用例
- 删除用例
- 生成任务
- 展示
- 分页
  
这里，以添加用例为例
#### 3.3.1 添加用例
**vue组件三大部分： template、script、style**

1，template中添加按钮，并绑定 addDialog 事件，点击时则 addDialog 为true，显示弹框

        <v-btn color="primary" class="btn" @click="addDialog = true"
        >添加用例</v-btn
        >

2，script中，在data()中设定弹窗初始值为false（不可见）

        <script>
        export default {
        data() {
            return {
            addDialog: false,
            editDialog: false,
            ……………………

3，script中，在data()中设定 addItem name、type等默认值，因为是新添加，所以默认值为空

     addItem: {
        name: "",
        type: "",
        data: "",
        file: "",
        remark: "",
      },

4，template 中 addDialog 对话框如下：
 - label : 提示信息
 - v-model：数据绑定，指定绑定字段；数据绑定到 addItem
 - v-if：表达式为true，则渲染

点击确定时，绑定 addCase() 事件


        <v-dialog v-model="addDialog" max-width="500px">
        <v-card>
            <v-card-title> 添加测试用例 </v-card-title>
            <v-card-text>
            <v-container>
                <v-text-field
                label="用例名称"
                v-model="addItem.name"
                ></v-text-field>
                <v-select
                :items="selectItem"
                v-model="addItem.type"
                label="用例类型"
                ></v-select>
                <v-textarea
                label="用例数据"
                v-model="addItem.data"
                v-if="addItem.type == '文本'"
                ></v-textarea>
                <v-file-input
                label="用例数据"
                v-model="addItem.file"
                v-if="addItem.type == '文件'"
                ></v-file-input>
                <v-text-field label="备注" v-model="addItem.remark"></v-text-field>
            </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="addCase()">确定</v-btn>
            <v-btn color="primary" text @click="addDialog = false">取消</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

5，script中，在methods添加函数addCase()

（1）数据从addItem中取

文本类型，则设置参数post_data为 caseData、caseName、remark

文件类型，则设置参数post_data为 caseFile、caseName、remark

（2）调用api

    this.$api.cases.createCaseByXXX(post_data).then((res) => {
            console.log(res);
            });
（3）关闭弹窗
（4）调用一次list接口

    addCase() {
      if (this.addItem.type == "文本") {
        let post_data = {
          caseData: this.addItem.data,
          caseName: this.addItem.name,
          remark: this.addItem.remark,
        };
        this.$api.cases.createCaseByText(post_data).then((res) => {
          console.log(res);
        });
      } else if (this.addItem.type == "文件") {
        let post_data = new FormData();
        post_data.append("caseFile", this.addItem.file);
        post_data.append("remark", this.addItem.remark);
        post_data.append("caseName", this.addItem.name);
        this.$api.cases.createCaseByFile(post_data).then((res) => {
          console.log(res);
        });
      }
      console.log(this.addItem);
      this.addDialog = false;
      let post_data = {
        pageNum: 1,
        pageSize: 10,
      };
      this.$api.cases.getCaseList(post_data).then((res) => {
        console.log(res);
        this.desserts = res.data.data.data;
      });
    },

#### 3.3.2数据展示

1，  template 中设置表格结构：header+items
     items 中的每一个 item ，operate 列都有编辑、删除按钮

        <template>
        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="desserts"
            item-key="id"
            show-select
            class="elevation-1"
        >
            <template v-slot:[`item.operate`]="{ item }">
            <v-btn color="primary" text small @click="editCase(item)">编辑</v-btn>
            <v-btn color="error" text small @click="deleteCase(item)">删除</v-btn>
            </template>
        </v-data-table>
        </template>
    </div>
    </template>


2, 设置header,展示如下字段
- id：取response的id字段
- 用例名称：取response的caseName字段
- 用例数据:取response的caseData字段
- 操作

        headers: [
                {
                text: "id",
                value: "id",
                },
                {
                text: "用例名称",
                value: "caseName",
                },
                {
                text: "用例数据",
                value: "caseData",
                },
                {
                text: "操作",
                value: "operate",
                align: "center",
                },
        ],

3，每次增删改之后，都需要调一次 list，刷新列表

    let post_data = {
            pageNum: 1,
            pageSize: 10,
        };
        this.$api.cases.getCaseList(post_data).then((res) => {
            console.log(res);
            this.desserts = res.data.data.data;
        });

如图，resposne路径如下，解析接口路径 

    this.desserts = res.data.data.data;

  <img width="540" alt="image" src="https://user-images.githubusercontent.com/26532614/174466699-98729b1a-a3fd-4f26-8517-cafede9b05f4.png">

### 3.4 处理token

#### 3.4.1 token 存入 localStorage

调用登录接口，从后端拿到token并存入localStorage

     login(){
                let post_data={
                    name:this.username,
                    pwd:this.password,
                }
                this.$api.user.signIn(post_data).then(res=>{
                    console.log(res)
                    localStorage.setItem('token',res.data.data.token)
                    localStorage.setItem('username',this.username)
                    this.$router.push({name:'Case'})
                })
            }

#### 3.4.2 从 localStorage 中取出 token ，并设置在header中

    instance.interceptors.request.use(config=>{
        if(localStorage.getItem('token')){
            config.headers.common['token']=localStorage.getItem('token')
        }
        return config
    })

### 3.5 响应拦截器

#### 3.5.1 resultCode为1则放行，否则提示操作失败

    instance.interceptors.response.use(res=>{
        if(res.data.resultCode==1){
            console.log('resultCode==1')
            return Promise.resolve(res);
        }else{
            console.log('resultCode!=1')
            if(messageInstance){
                messageInstance.close();
            }
            messageInstance=Message({
                type:'error',
                message:res.data.message,
                center:true
            })
            return Promise.reject(res)
        }
    }

#### 3.5.2 出现错误时给出提示，然后跳转到登录页面，并操作失败
        error=>{
            const {response} = error  // const response = error.response

            if(response.status==401){
                if(messageInstance){
                    messageInstance.close()
                }
                messageInstance=Message({
                    type:'error',
                    message:response.data.message,
                    center:true
                })

                router.replace({
                    path:'/',
                    query:{
                        redirect:router.currentRoute.fullPath
                    }
                })
            }
            return Promise.reject(response)
        })
#### 3.5.3 message 样式使用 element-ui

<img width="381" alt="image" src="https://user-images.githubusercontent.com/26532614/174467086-37358eac-55d8-493f-b312-986edf1f5b2e.png">
