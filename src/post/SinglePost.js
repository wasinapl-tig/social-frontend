import React, { Component } from 'react'
import { singlePost ,remove,like,unlike} from './apiPost';
import DefaultProfile from '../images/moutain.jpg';
import { Link,Redirect } from 'react-router-dom';
import {isAuthenticated} from '../auth';
import Comment from './Comment';

 class SinglePost extends Component {

     state = { 
         post:"",
         RedirectToHome:false,
         RedirectToSigin:false,
         like:false,
         likes:0,
         comments:[]
     }

     componentDidMount = () => {
         const postId =this.props.match.params.postId;

         singlePost(postId).then(data =>
            {
             if(data.error){
                 console.log(data.error);
             }
             else
             {
                  
                 this.setState({
                     post:data,
                    likes:data.likes.length,
                    like:this.checkLike(data.likes),
                    comments:data.comments
                });
             }
            }
         );
     };
     checkLike=(likes)=>{
            const userId=isAuthenticated()&&isAuthenticated().user._id;
            let match =likes.indexOf(userId) !==-1;
            return match;
     };

     updateComments = comments => {
         this.setState({comments});
     }
    likeToggle =()=>{
        if(!isAuthenticated()){
            this.setState({ RedirectToSigin:true});
            return false;
        }
        let callApi = this.state.like ? unlike:like;

        const userId= isAuthenticated().user._id;
        const token= isAuthenticated().token;
        const postId = this.state.post._id;

        callApi(userId,token,postId).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                this.setState({
                    like:!this.state.like,
                    likes:data.likes.length
                })
            }
        })
    }
    deletePost =()=>{
        const postId =this.props.match.params.postId;
        const token =isAuthenticated().token;

        remove(postId,token).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                this.setState({RedirectToHome:true});
              
            }
        });
    }

      delteConfirmed = () => {
            let answer = window.confirm("Are you sure you want to delete your account");
                if(answer){
                    this.deletePost();
                }
                             }
    renderPost=post=>{
          const posterId = post.postedBy ? `/user/${post.postedBy._id}`:""
          const posterName = post.postedBy ? post.postedBy.name:"Unknown"
          const {like,likes}= this.state;
                             return(
                                
                                <div className="card-body">
                                <img  style={{height:"300px",width:"100%",objectFit:"cover"}} 
                                className="img-thumbnail mb-3"
                                 src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                  alt={post.name} 
                                 onError={(i=>(i.target.src=`${DefaultProfile}`))}

                                  />
                                  {like?( <h3 onClick={this.likeToggle}><i className="fa fa-thumbs-up text-success bg-dark" 
                                  style={{padding:'10px'
                                  ,borderRadious:"50%"
                                  }}/> {""}{likes} Like</h3>):(
                                       <h3 onClick={this.likeToggle}>
                                       <i className="fa fa-thumbs-up text-warning bg-dark" 
                                  style={{padding:'10px'
                                  ,borderRadious:"50%"
                                  }}/> {""}
                                       {likes} Like</h3>
                                  )}
                                 
                                {/* <div>
                                    {post.likes.length} Like
                                </div> */}
                                    <p className="card-text">{post.body}</p>
                                    <br/>
                                    <p className="font-italic mark">Posted By{""} <Link to={`${posterId}`}>{posterName}{""}</Link>
                                    on {new Date(post.created).toDateString()}
                                    </p>
                                    <div className="inline-block">
                                      <Link to={`/`} href="#" className="btn btn-raised btn btn-success btn-small mr-5">
                                      Back to Post
                                    </Link>

                                        {isAuthenticated().user &&
                                        isAuthenticated().user._id===post.postedBy._id &&(
                                      <>
                                      
                                         <Link to={`/post/edit/${post._id}`} href="#" className="btn btn-raised btn btn-warning btn-small mr-5">
                                      Update Post
                                    </Link>
                                         <button  onClick={this.delteConfirmed} className="btn btn-raised btn btn-warning btn-small mr-5">
                                            Delete Post
                                        </button>
                                      </>)}
                                 
                                    </div>
                                  
                                    
                                </div>
                           
                                  ); 
    };
    render() {
         
       
        const {post,RedirectToHome,RedirectToSigin,comments} =this.state;
 
          if(RedirectToHome){
            return <Redirect to={`/`}/>
        }else if(RedirectToSigin){
                  return <Redirect to={`/signin`}/>
        }
        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
                   {!post? <div className="jumbotron text-center"> <h2>Loading...</h2> </div>:this.renderPost(post)}    
             
             <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments}/>
            </div>
        );
    }
}
export default SinglePost;