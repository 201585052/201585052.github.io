import React from 'react';
import axios from 'axios';
import marked from 'marked';
import hljs from 'highlight.js';
import {Link} from 'react-router-dom';
import {Col,Row} from 'antd';
import Header from './header';
import Footer from './footer';
import Review from './review';
import '../../css/content.css';

export default class Content extends React.Component{
    //这一部分我们称之为正文。。嗯
    constructor(){
        super();
        this.state ={
            content:"",
            comments:""
        };
    };
    transTime(timel){
        if(timel == undefined)
            return;
        const allmonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        let realtime = new Date(timel);
        let month = allmonths[realtime.getMonth()];
        let day = realtime.getDate();
        let year = realtime.getFullYear();
        return 'From Jackson on ' + month + ' ' + day + ', ' + year;
    };
    componentDidMount(){
        const url = `https://api.github.com/repos/Jackson-p/Jackson-p.github.io/issues/
        ${this.props.match.params.num}`;
        axios.get(url).then((response) => {
            const data = response.data;
            this.setState({content:data});
            //console.log(data);
        }).catch(e => console.log(e));
        const url2 = `https://api.github.com/repos/Jackson-p/Jackson-p.github.io/issues/
        ${this.props.match.params.num}/comments`;
        axios.get(url2).then((response) => {
            const data2 = response.data;
            this.setState({comments:data2});
        }).catch(e => console.log(e));
    }
    render(){
        let content = this.state.content;
        let time = this.transTime(content.created_at);
        let labelName = content.labels ? content.labels[0].name:"";
        let title = content.title;
        let bodyInput = content.body;
        let bodyOutput;
        let comments = this.state.comments;
        let Comments = comments.length?
        comments.map((comment,index) => {
            return <Review key={index} name={comment.user.login} commcont={comment.body} time={comment.created_at} />
        })
        :
        <div className="cometoreview">暂无评论，欢迎评论</div>;
        marked.setOptions({
            highlight: code => hljs.highlightAuto(code).value,
        });
        if(bodyInput){
            bodyOutput = marked(bodyInput);
        }else{
            bodyOutput = "加载中...";
        }
        
        return(
            <div>
                <Header selectedhead={2} />
                <Col span={24} className="content-container">
                    <Row type="flex" justify="center">
                        <Col span={16} className="content-header">
                            <div className="tag"><Link to={`/learntags/${labelName}`}>{labelName}</Link></div>
                            <h1>{title}</h1>
                            <h2>{time}</h2>
                            <hr />
                        </Col>
                        <Col span={16} className="content-body" dangerouslySetInnerHTML={{ __html: bodyOutput }}></Col>
                        <Col span={16} className="content-review">
                            <div className="review-title">
                                <h3>评 论</h3>
                            </div>
                            <div className="review-hr"></div>
                            <div className="review-subtitle-deco"></div>
                            <div className="review-subtitle">最新</div>
                            {Comments}
                            <div className="content-block"><a href={`https://github.com/Jackson-p/Jackson-p.github.io/issues/${this.props.match.params.num}`} target="_blank" ><button>去评论</button></a></div>
                        </Col>
                    </Row>
                </Col>
                <Footer />
            </div>
        );
    }
}