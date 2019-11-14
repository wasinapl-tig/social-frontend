import React from 'react';
import { Route , Switch } from 'react-router-dom';


import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Menu from './core/Menu';
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import Users from './user/Users';
import FindPeople from './user/FindPeople';
import NewPost from './post/NewPost';
import SinglePost from './post/SinglePost';
import EditPost from './post/EditPost';
import PrivateRoute from './auth/PrivateRoute';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Admin from './admin/Admin';


const MainRouter = ()=>(
    <div>
        <Menu/>
            <Switch>
                     <Route path="/" exact component={Home}></Route>
                     <PrivateRoute path="/post/create" exact component={NewPost} />
                     <Route path="/post/:postId" exact component={SinglePost}></Route>
                     <PrivateRoute path="/post/edit/:postId" exact component={EditPost} />
                     <Route path="/signup" exact component={Signup}></Route>
                     <Route path="/signin" exact component={Signin}></Route>
                     <Route path="/user/:userId" exact component={Profile}></Route>
                     <PrivateRoute path="/user/edit/:userId" exact component={EditProfile} />
                     <PrivateRoute path="/users" exact component={Users} />
                    <PrivateRoute path="/findpeople" exact component={FindPeople} />
                    <Route exact path="/forgot-password" component={ForgotPassword} />
                    <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword}/>
                    <PrivateRoute exact path="/admin" component={Admin} />
                    {/* <PrivateRoute path="/post/create" exact component={NewPost} /> */}
            </Switch>
    </div>
);

export default MainRouter;


