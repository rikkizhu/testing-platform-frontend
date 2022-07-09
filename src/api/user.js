import axios from './http'

const user ={
    signIn(params){
        return axios.post('/testUser/login',params)
    },
    signUp(params){
        return axios.post('/testUser/register',params)
    },
    logOut(){
        return axios.delete('/testUser/logout')
    }
}
export default user