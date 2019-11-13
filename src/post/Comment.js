import React, { Component } from 'react';
import {comment,uncomment} from './apiPost';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import DefaultProfile from '../images/moutain.jpg';


class Comment extends Component {
    state={
        text:"",
        error:""
    }

    handleChange = event =>{
        this.setState({error:""});
        this.setState({text:event.target.value});
    }
    isValid = ()=>{
        const {text} = this.state;
        if(!text.length > 0 || text.length > 150){
            this.setState({error:"Comment should not be empty"})
            return false;
        }
        return true;
    }
    addComment = e =>{
      
        e.preventDefault();
        if(!isAuthenticated()){
            this.setState({error:"Please Signin to leave a comments"});
            return false;
        }
       if(this.isValid()){
        const userId=isAuthenticated().user._id;
        const token= isAuthenticated().token;
        const postId = this.props.postId;
        // const comment = {text:this.state.text};
        

        comment(userId,token,postId,{text:this.state.text}).then(data => {
            if(data.error){
                console.log(data.error);
            }else
            {
                this.setState({text:""});
                //dispatch fresh list of comment parent (Single post)
                this.props.updateComments(data.comments);
            }
        });
       }
    };
    
        deleteComment =(comment)=>{
                    const userId=isAuthenticated().user._id;
                    const token= isAuthenticated().token;
                    const postId = this.props.postId;
        // const comment = {text:this.state.text};
        

        uncomment(userId,token,postId,comment).then(data => {
            if(data.error){
                console.log(data.error);
            }else
            {
                // this.setState({text:""});
                // //dispatch fresh list of comment parent (Single post)
                this.props.updateComments(data.comments);
            }
        });
          
    }

      deleteConfirmed = (comment) => {
            let answer = window.confirm("Are you sure you want to delete your comment");
                if(answer){
                    this.deleteComment(comment);
                }
            };
    render() {
        const {comments} =this.props;
        const {error} =this.state;
    //    console.log("POSTID",this.props.postId);
        return (
            <div>
                <h2 className="mt-5 mb-5">Leave Comment</h2>
                    <div className="form-group">

                           <form onSubmit={this.addComment}> 
                             <input
                              type="text" 
                              onChange={this.handleChange} 
                              value={this.state.text}
                               className="form-control" 
                                   placeholder="Leave a comments"
                               />
                               <button className="btn btn-raised btn-success mt-2">POST</button>
                            </form>
                               <div className="alert alert-danger" style={{display:error ? "":"none"}}>{error}</div>
                    </div>
                    {/* {JSON.stringify(comments)} */}
                <hr/>
                  <div className="col-md-12">
                                <h3 className="text-primary">
                               {comments.length} Comments</h3>
                                <hr />
                                    {comments.map((comment,i)=>(
                                        <div key={i}>
                                            <div >
                                                    <Link to={`/user/${comment.postedBy._id}`}>
                                                        <img    style={{
                                                                 borderRadius: "50%",
                                                                border: "1px solid black"
                                                                      }}
                                                          className="float-left mr-2"
                                            height="30px"
                                            width="30px"

                                             onError={(i=>
                                            (i.target.src=`${DefaultProfile}`))
                                            } 

                                            src={`${
                                                process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`
                                                }  
                                             alt={comment.postedBy.name}/>   
                                             </Link>
                                                    <div>
                                                            <p className="lead"> {comment.text}</p>

                                                        
                                    <p className="font-italic mark">Posted By{""} <Link to={`/user/${comment.postedBy._id}`}>{comment.postedBy.name}{""}</Link>
                                    on {new Date(comment.created).toDateString()}


                                    <span>
                                                  {isAuthenticated().user &&
                                        isAuthenticated().user._id===comment.postedBy._id &&(
                                      <>
                                      
                                  
                                   
                                            <span onClick={()=>this.deleteConfirmed(comment)} className="text-danger float-right mr-1" style={{cursor:"pointer"}}>
                                            Remove
                                         </span>
                                       
                                      </>)}

                                    </span>
                                    </p>
                                                    </div>
                                                 
                                                            {/* <p style={{clear:'both'}}>{comment.text}</p> */}
                                                     
                                            </div>
                                        </div>
                                        ))}
                             </div>
            </div>
        )
    }
}

export default Comment;