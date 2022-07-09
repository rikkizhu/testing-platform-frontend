import axios from 'axios'
import {Message} from 'element-ui'
import router from '../router'

var root = process.env.VUE_APP_URL
var messageInstance = null

var instance = axios.create({
    headers:{
        'Content-Type':'application/json'
    },
    baseURL:root
})

instance.interceptors.request.use(config=>{
    if(localStorage.getItem('token')){
        config.headers.common['token']=localStorage.getItem('token')
    }
    return config
})

//添加响应拦截器
//为1放行，否则提示并操作失败

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
    //出现错误时给出提示，然后跳转到登录页面，并操作失败
},error=>{
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

export default instance
