
// import '@babel/polyfill'
// 暴力方式 体积大
import './src/style/index.css'
import './src/less/index.less'


import jquery from 'jquery';
console.log(jquery)
// import pdf from './src/static/VueorReact.pdf'
// import {sum} from './src/js/text'
// const pdf = require('./src/static/VueorReact.pdf')
// window.location.href = pdf.default
// console.log(pdf)
const add =(a,b)=>{
    return a + b
}
// const promise = new Promise((resolve)=>{
//     setTimeout(()=>{
//         console.log('执行完了')
//         resolve();
//     },1000)
// })
// console.log(promise);
console.log(add(22,34))
// import(/* webpackChunkName:'text' */'./src/js/text').then(({sum})=>{
//     console.log(sum(2,4))
// }).catch(err=>{

// })
document.getElementById('btn').onclick=function(){
    import(/* webpackChunkName:'text',webpackPrefetch:true */'./src/js/text').then(({sum})=>{
        console.log(sum(2,4))
    }).catch(err=>{

    })
}
console.log('文件被加载了index')

if('serviceWorker' in navigator){
   navigator.serviceWorker.register('/service-worker.js').then(()=>{
    console.log('succcess')
   }).catch(()=>{
    console.log('feld')
   })

}




