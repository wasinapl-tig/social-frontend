import React, { Component } from 'react'
import {singlePost,update} from './apiPost';
import {isAuthenticated} from '../auth';
import { Link,Redirect } from 'react-router-dom';
import DefaultProfile from '../images/moutain.jpg';
class EditPost extends Component {
    constructor(){
        super()
        this.state={
            id:"",
            title:"",
            body:"",
            redirectToProfile:false,
            error:"",
            fileSize:0,
            loading:false
        }
    }

          init = (postId) => {


        singlePost(postId).then(data=>{
            if(data.error){
                this.setState({redirectToSignin:true});
            }
            else{
                this.setState({
                    id:data._id,
                    title:data.title,
                    body:data.body,
                    error:""
                });
            }
        })

    }

           isValid=()=>{
        const {title,body,fileSize }= this.state;

          if(fileSize > 100000){
            this.setState({error:"File Size should be less than 100kb",loading:false});
            return false;
        }
        if(title.length ===0 || body.length ===0){
            this.setState({error:"ALL fields are required",loading:false});
            return false;
        }
         
        return true;
    }


       handleChange = name => event =>{
        this.setState({error:""})
        const value = name ==='photo' ? event.target.files[0]:event.target.value;

        const fileSize = name ==='photo' ? event.target.files[0].size:0;

        this.postData.set(name,value);
        this.setState({ [name]:value,fileSize});
    };

    clickSubmit = event => {

         event.preventDefault();
         this.setState({loading:true});
        if(this.isValid())
        {
        // const {name,email,password} =this.state;

       const postId=this.state.id;
        const token =isAuthenticated().token;

        update(postId,token,this.postData).then(data=>{
            if(data.error) this.setState({ error:data.error })
            else {
                this.setState({loading:false,title:"",body:"",redirectToProfile:true});
            }
           
            });
           
        }
        }
       editPostForm = (title,body) => (
                            <form>  
                                            <div className="form-group">
                                                <label className="text-muted">Post Photo</label>
                                                <input onChange={this.handleChange("photo")} className="form-control" type="file" accept="image/*"/>
                                            </div>

                                            <div className="form-group">
                                                <label className="text-muted">Title</label>
                                                <input onChange={this.handleChange("title")} className="form-control" type="text" value={title}/>
                                            </div>

                                              <div className="form-group">
                                                <label className="text-muted">Body</label>
                                                <textarea onChange={this.handleChange("body")} className="form-control" type="text" value={body}/>
                                            </div>

                                         
                                            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update Post</button>
                            </form>
    );
    componentDidMount() {
        this.postData = new FormData();
        const postId =  this.props.match.params.postId;
        this.init(postId);
    
    }
    render() {
       
        const {id,title,body,redirectToProfile,error,loading}=this.state;
  
           if(redirectToProfile){
            return <Redirect to={`/user/${isAuthenticated().user._id}`}/>
        }
        return (
            <div className="container">
                    <h2 className="mt-5 mb-5">{title}</h2>

                        <div className="alert alert-danger" style={{display:error ? "":"none"}}>{error}</div>
                            {loading ? <div className="jumbotron text-center"> <h2>Loading...</h2> </div>:""}  

                       <img style={{height:"200px",width:"auto"}} className="img-thumbnail" src={`${process.env.REACT_APP_API_URL}/post/photo/${id}`} onError={(i=>(i.target.src=`${DefaultProfile}`))} alt={title}/>
                    {/* {this.editPostForm(title,body)} */}

                    {isAuthenticated().user.role === "admin" ||
    (isAuthenticated().user._id === id &&
        this.editPostForm(title, body))}
            </div>
        )
    }
}
export default EditPost;
