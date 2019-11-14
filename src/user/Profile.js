import React, { Component } from 'react'
import {isAuthenticated} from '../auth';
import {Redirect,Link} from 'react-router-dom';
import {read} from './apiUser';
import DefaultProfile from '../images/avatar.png';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import {listByUser} from '../post/apiPost';
import EditProfile from './EditProfile';


class Profile extends Component {

    constructor(){
        super()
        this.state = {
            user:{ following:[], followers:[] },
            redirectToSignin:false,
            following:false,
            error:"",
            posts:[]
        }
    }

    // check follow

    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower =>{
            //one id has many others ids (followers)
            return follower._id === jwt.user._id;
        });
        return match;
    };

        clickFollowButton = callApi =>{

        const userId = isAuthenticated().user._id;
        const token =  isAuthenticated().token;

        callApi(userId,token,this.state.user._id).then(data=>{
            if(data.error){
                this.setState({error:data.error}); 
            }else{
              
                this.setState({user:data, following: !this.state.following})
            }

        });
         };

    init = userId => {
        const token =isAuthenticated().token;

        read(userId,token).then(data=>{

            if(data.error){
                this.setState({redirectToSignin:true});
            }else{
                let following = this.checkFollow(data);
                this.setState({user:data,following});
                // console.log(data._id);
                this.loadPosts(data._id);
            }
        });

    };

    loadPosts = userId =>{
                const token =isAuthenticated().token;
                listByUser(userId,token).then(data=>{
                    if(data.error){
                        console.log(data.error);   
                    }
                    else{
                        // console.log(data);
                        this.setState({posts:data});
                    }
                });

    };
 

    componentDidMount() {
        
        const userId =  this.props.match.params.userId;
        this.init(userId);
    
    }

        componentWillReceiveProps(props) {
        
        const userId =  this.props.match.params.userId;
        this.init(userId);
    
    }




    render() {
        const{ redirectToSignin,user,posts} = this.state;
        
        if(redirectToSignin){
                return <Redirect to="/signin"/>
        }
          const photoUrl= user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}`:DefaultProfile;
        return (
            <div className="container">
                   <h2 className="mt-5 mb-5">Profile Page</h2>
                    <div className="row">
                                <div className="col-md-4">
                             
                                               <img style={{height:"200px",width:"auto"}} className="img-thumbnail" src={photoUrl}  onError={(i=>(i.target.src=`${DefaultProfile}`))} alt={user.name}/>
                                       
                                </div>

                                   <div className="col-md-8">
                                        <div className="lead mt-2">
                                                    <p>Hello {user.name}</p>
                                                    <p>Email {user.email}</p>
                                                    <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
                                            </div>
                                    {isAuthenticated().user &&isAuthenticated().user._id===user._id?(
                                        
                                          <div className="d-inline-block">

                                              <Link to={`/post/create`} className="btn btn-raised btn-primary mr-5">
                                               Create Post
                                            </Link>
                                            <Link to={`/user/edit/${user._id}`} className="btn btn-raised btn-success mr-5">
                                                Edit Profile
                                            </Link>
                                            <DeleteUser userId={user._id}/>
                                          </div>  
                                     
                                    ):(
                                       <FollowProfileButton 
                                           following={this.state.following} 
                                           onButtonClick={this.clickFollowButton}
                                       />
                                    
                                    )}
                                    <hr/>
                               
                                   </div>

                    </div>

                                    <div className="row">
                                        <div className="col-md-12 mt-5 mb-5">
                                            <hr/>
                                                <p className="lead">{user.about}</p>
                                            <hr/> 
                                                 <ProfileTabs 
                                                 followers={user.followers} 
                                                 following={user.following}
                                                 posts={posts}
                                                 
                                                  />
                                                  
                                        </div>
                                    </div>

                                    <div>
    {isAuthenticated().user &&
        isAuthenticated().user.role == "admin" && (
            <div className="card mt-5">
                <div className="card-body">
                    <h5 className="card-title">
                        Admin
                    </h5>
                    <p className="mb-2 text-danger">
                        Edit/Delete as an Admin
                    </p>
                    <Link
                        className="btn btn-raised btn-success mr-5"
                        to={`/user/edit/${user._id}`}
                    >
                           Edit Profile
                        
                    </Link>

                
                    <DeleteUser userId={user._id} />
                </div>
            </div>
        )}
        {/* {JSON.stringify(isAuthenticated().user._id)} */}
</div>

            </div>

        )
    }
}
export default Profile;
