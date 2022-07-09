import axios from './http'

const project = {
    editJenkins(params){
        return axios.put('/jenkins',params)
    },
    addJenkins(params){
        return axios.post('/jenkins',params)
    },
    getJenkinsList(params){
        return axios.get('/jenkins',{params})
    },
    deleteJenkins(params){
        return axios.delete('/jenkins/'+params.id)
    },
    addTask(params){
        return axios.post('/jenkins',params)
    },
    deleteTask(params){
        return axios.delete('/task/'+ params.id,params)
    },
    getTaskList(params){
        return axios.get('/task/list',{params})
    },
    doTask(params){
        return axios.post('/task/start',params)
    },
    editTask(params){
        return axios.put('/task',params)
    },
    getAllure(params){
        return axios.get('/report/allureReport/'+params.id)
    },
    getCaseCount(params){
        return axios.get('/report/taskByCaseCount/')
    },
    getStatus(params){
        return axios.get('/report/taskByType/')
    },
    updateStatus(params){
        return axios.post('/task/status',params)
    }
}

export default project;
