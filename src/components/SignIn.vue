<template>
    <div class="login-form">
        <h1>登录</h1>
            <v-text-field v-model="username" label="用户名"></v-text-field>
            <v-text-field v-model="password" label="密码" type="password"></v-text-field>
            <v-btn color="primary" @click="login()">登录</v-btn>
            <v-btn color="primary" text @click="signUp()">注册</v-btn>
    </div>
</template>

<script>
export default{
    data(){
        return{
            username:'',
            password:''
        }
    },
    methods: {
        signUp(){
            this.$router.push({name:'SignUp'})
        },
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
    },
}
</script>

<style scoped>
    .login-form{
        width:500px;
        margin:0 auto;
        text-align: center;
    }
</style>