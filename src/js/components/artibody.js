import React from 'react';
import 'antd/dist/antd.css';
import '../../css/artibody.css';
import axios from 'axios';
import ArtiTem from './artitem';
import { Pagination } from 'antd';
export default class ArtiBody extends React.Component{

    //这一部分用来展示所有当前博文的相关信息，包括博文时间，博文标签，部分正文,需要能根据相关的标签提取到制定类的文章
    //具体细化由每个ArtiTem
    constructor() {
        super();
        this.state = {
            artilist : ''
        };
    }
    transTime(timel){
        var reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/i;
        //return timel.substring(0,10);
        return reg.exec(timel)[0];
    };
    componentDidMount(){
        const url  = `https://api.github.com/repos/201585052/201585052.github.io/issues`;
        axios.get(url).then((response) => {
            const data = response.data;
            this.setState({artilist:data})
            //console.log(data);
        }).catch(e => console.log(e));  
    };
    render(){
        //本页的输入应该除了显示的标签（默认是undefined）还有就是当前页数（默认是undefined）
        //而渲染页面的过程应该是给定起点和终点，在范围之内就渲染
            let tagName = this.props.tagName;
            let currentpage = this.props.currentpage;
            const pagearticlenum = 6;
            const artilist = this.state.artilist;
            let articlebegi = pagearticlenum*(currentpage-1)+1;//博文总数不变，选定起点
            let articlecnt = 1;
            const pagetotal = 10*(artilist.length % pagearticlenum ? parseInt(artilist.length/pagearticlenum)+1 : artilist.length/pagearticlenum);
            //console.log(pagetotal);
            const Artilist = artilist.length ?
            artilist.map((article,index) => {
                    const timel = this.transTime(article.created_at);
                    let reg = /[\#\`{3}\*]/g;;
                    let contentBefore = article.body.replace(reg,"");
                    const content = contentBefore.substring(0,200)+"...";
                    const label = article.labels[0].name;
                    //tagName == undefined 的情况是没有选择制定类型，直接从主页进来的
                    if(tagName == label || tagName == undefined){
                        if(articlecnt<=pagearticlenum*currentpage && articlecnt>=articlebegi){
                            articlecnt++;
                            return <ArtiTem key={index} title={article.title} content={content} time={timel} num={article.number} label={label} />
                        }
                        articlecnt++;
                    }            
            }) 
            :
            "加载中";
        return(
                <div className="arti-container">
                    {Artilist}
                    <div className="arti-footer">
                        <Pagination current={currentpage} onChange={this.props.handlePageChange} total={pagetotal} />
                    </div>
                </div>
        );
    }
}