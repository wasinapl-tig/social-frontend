import React, { Component } from 'react'
import {Redirect} from 'react-router-dom';
import {isAuthenticated} from '../auth';
import {remove} from './apiUser';
import {signout} from '../auth';
 class DeleteUser extends Component {

    state={
        redirect:false
    }

        deleteAccount = () =>{
            const token =isAuthenticated().token;
            const userId= this.props.userId;

            remove(userId,token).then(data=>{
                if(data.err){
                    console.log(data.error);
                }
                else{
                    //sign out  user
                        signout(()=>console.log("User is Delete"));
                    //redirect
                        this.setState({redirect:true});
                }
            });

        }


        delteConfirmed = () => {
            let answer = window.confirm("Are you sure you want to delete your account");
                if(answer){
                    this.deleteAccount();
                }
                             }
    render() {
        if(this.state.redirect){
            return <Redirect to={`/`}/>
        }
        return (
        
                <button onClick={this.delteConfirmed} className="btn btn-raised btn-danger">Delete Profile</button>
          
        )
    }
}
export default DeleteUser;