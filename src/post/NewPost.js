import React, { Component } from 'react'
import {isAuthenticated} from '../auth';
import {create} from './apiPost';
import {Redirect} from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

 class NewPost extends Component {
     constructor(){
         super()
         this.state={
                 title:"",
                 body:"",
                 photo:"",
                 error:"",
                 user:{},
                 fileSize:0,
                 loading:false,
                 redirectToProfile:false
         };
     }

        componentDidMount() {

        this.postData = new FormData();
        this.setState({user:isAuthenticated().user});
    
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

       const userId=isAuthenticated().user._id;
        const token =isAuthenticated().token;

        create(userId,token,this.postData).then(data=>{
            if(data.error) this.setState({ error:data.error })
            else {
                this.setState({loading:false,title:"",body:"",redirectToProfile:true});
            }
           
            });
           
        }
        }

    

 
 

        newPostForm = (title,body) => (
                            <form>  
                                            <div className="form-group">
                                                <label className="text-muted">Add Photo</label>
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

                                         
                                            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Create Post</button>
                            </form>
    );
    render() {
        const {title,body,photo,user,error,loading,redirectToProfile} =this.state;
        if(redirectToProfile){
            return <Redirect to={`/user/${user._id}`}/>
        }
        //  const photoUrl= id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}`: DefaultProfile;
        return (
            <div className="container">
                      <h2 className="mt-5 mb-5">Create New Post</h2>
                           <div className="alert alert-danger" style={{display:error ? "":"none"}}>{error}</div>
                            {loading ? <div className="jumbotron text-center"> <h2>Loading...</h2> </div>:""}   
                    
                      {/* <img style={{height:"200px",width:"auto"}} className="img-thumbnail" src={photoUrl} onError={(i=>(i.target.src=`${DefaultProfile}`))} alt={name}/> */}
                      {this.newPostForm(title,body)}
            </div>
        )
    }
}
export default NewPost;