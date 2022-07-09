import axios from './http'

const cases={
    getCaseList(params){
        return axios.get('/case/list',{params})
    },
    createCaseByText(params){
        return axios.post('/case/text',params)
    },
    createCaseByFile(params){
        return axios('/case/file',{
            method:'post',
            data:params,
            headers:{'Content-type':'multipart/form-data'}
        })
    }, 
    deleteCase(params){
        return axios.delete('/case/'+params.caseId,params)
    },
    editCase(params){
        return axios.put('/case/',params)
    },
    createTask(params){
        return axios.post('/task/',params)
    },
    getCase(params){
        return axios.get('/case/list',{params})
    }

}

export default cases