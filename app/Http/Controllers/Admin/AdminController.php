<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\{Country,State,City,User};
use URL,Validator,Redirect,Response,Session;
use Auth,Mail,DateTime;
use App\Mail\SendMailable;

class AdminController extends Controller
{
    
    public function login(Request $request) {
        if (Session::get('id') == 1 ) {
            return redirect('admin/dashboard');
        }
       return view('admin.auth.login');
     }

    public function postAuth(Request $request){

    	$credentials = $request->validate([
            'email' => 'required|string|email|max:255|exists:users,email',
            'password' => 'required|string|between:6,20',
        ]);
         
    	if (auth('user')->attempt($credentials)) {

            $user = auth('user')->user();
            if($user->user_type == 1){
            Session::put(['id' => $user->id]);  
            # Redirect to dashboard
            return redirect()->intended('admin/dashboard');
            }
        }
        return redirect('admin/login')->withInput()->withErrors([
                    'error' => 'Invalid credentials.'
        ]);
    }

    public function dashboard(Request $request){
        return view('admin.layouts.index');
    	// return view('admin.layouts.dashboard');
    }

    public function profile(Request $request){
        if($request->isMethod('post')){
            $validation = Validator::make($request->all(),[
            
            'first_name'    => 'required|regex:/^[\pL\s\-]+$/u',
            'last_name'     => 'required|regex:/^[\pL\s\-]+$/u',
            'email'         => 'required|email|string|max:255|unique:users,email,'.auth()->user()->id,
            'contact_no'    => 'required|numeric|digits:10|unique:users,contact_no,'.auth()->user()->id,
            ]);

            if ($validation->fails()) {
              return Redirect::to("admin/profile")->withErrors($validation)->withInput();
            }else{

                $data = array(  'first_name'    => $request->first_name,
                                'last_name'     => $request->last_name,
                                'email'         => $request->email, 
                                'contact_no'    => $request->contact_no,
                             );
              
                $insert = User::where('id',auth()->user()->id)->update($data);
                if ($insert) {              
                  return Redirect::to("admin/dashboard")->withSuccess('Profile Successfull Updated.');
                }else{
                  return Redirect::to("admin/profile")->withFail('Something went to wrong.');
                  }
            }
        } else {
            $data['title'] = "Profile Update";
            return view('admin.auth.profile',$data);
        }
    }

    //for change the password for admin
    public function changePassword(Request $request){

        if ($request->isMethod('post')) {

            $validation = Validator::make($request->all(),[
            
            'new_password'    => 'required|min:6|max:20',
            'confirm_password'     => 'required|same:new_password|min:6|max:20',
            ]);

            if ($validation->fails()) {
              return Redirect::to("admin/change-password")->withErrors($validation)->withInput();
            }else{

                $data = array(  'password'  => bcrypt($request->new_password),
                            );
              
                $upd = User::where('id',auth()->user()->id)->update($data);
                if ($upd) {              
                  return Redirect::to("admin/dashboard")->withSuccess('Password Successfull Updated.');
                }else{
                  return Redirect::to("admin/change-password")->withFail('Something went to wrong.');
                  }
            }

        } else {
            $data['title'] = "Change Password";
            return view('admin.auth.change_password',$data);
        }
    }


    public function logout() {

        Session()->flush();
        return redirect('login');
    }
    //forgot password
    public function forgotAuth(Request $request){
        return view('admin.auth.forgot_password');
    }

    public function postForgot(Request $request){

        $validation = validator::make($request->all(),[
            
            'email'=> 'required|email',
        ]);
        if ($validation->fails()) {
          
          return Redirect::to("admin/forgot-auth")->withErrors($validation)->withInput();
          
        }else{
            
            $user = User::where(array('email' => $request->email,'user_type' => 1))->first();
            Session::put(['forgot_id'=>$user->id]); 
            
            try{

                if(!empty($user)){
                $email = $user->email;
                //email shut
                $otp =  rand(1000,9999); // otp Generate
                User::where('email',$email)->update(['otp'=>$otp,'otp_time'=>date('Y-m-d H:i')]);
                $mail_data = [
                                'to'        => $email,
                                'subject'   => 'Forgot Password',
                                'meta_data' => [    'username'=> $email,
                                                    'otp' => $otp,
                                                ],
                            ];

                Mail::to($email)->send(new SendMailable($mail_data));
                
                return Redirect::to('admin/otp')->withSuccess("Opt will send your email id.");
            
                } else { //email doesn't found

                    return Redirect::to('admin/forgot-auth')->withFail("Email Does not exists");
                }

            } catch(Exception $e) {

              echo 'Message: ' .$e->getMessage();
            }
        }

    }

    /*
    *post otp 
    */
    public function postOtp(Request $request){
        
        if($request->isMethod('post')){

            $validation = validator::make($request->all(),[
            
            'otp'=> 'required|numeric',
            ]);
            if ($validation->fails()) {
          
                return Redirect::to("admin/otp")->withErrors($validation)->withInput();
          
            }else{

                $otp = $request->otp;
                $user_id = Session::get('forgot_id');
                $data = User::where('id',$user_id)->first(['otp','otp_time']);

                $date =  new DateTime($data['otp_time']);
                $otp_time = $date->format('H:i'); //when otp was send
                
                $new_time = date('H:i',strtotime('+30 minutes',strtotime($otp_time))); // after 30 minutes
                $current_time = date("H:i");
                
                //if otp and time true
                if( $data['otp'] == $otp && strtotime($current_time) <= strtotime($new_time)){ 
                  return Redirect::to("admin/forgot-password")->withSuccess('Now You can Update the password.');
                } else {

                    return Redirect::to("admin/otp")->withFail('Something went to wrong.');
                }
            } 
        } else {

            return view('admin.auth.login-otp');
        }
    }

    public function forgotPassword(Request $request){ //change password

        if($request->isMethod('post')){

            $validation = Validator::make($request->all(),[
            
            'new_password'    => 'required|min:6|max:20',
            'confirm_password'     => 'required|same:new_password|min:6|max:20',
            ]);

            if ($validation->fails()) {
              return Redirect::to("admin/forgot-password")->withErrors($validation)->withInput();
            }else{

                $data = array(  'password'  => bcrypt($request->new_password),
                            );
              
                $upd = User::where('id',Session::get('forgot_id'))->update($data);
                if ($upd) {   
                
                  return Redirect::to("admin/login")->withSuccess('Password Successfull Updated.');
                }else{
                  return Redirect::to("admin/forgot-password")->withFail('Something went to wrong.');
                  }
            }
        } else {

            return view('admin.auth.chnage_forgot_password');
        }
    }

    /*
    * Name: status_activity
    * Create Date: 18 April 2019
    *purpose : To manage the statu activity for all admin section 
    */
    //status Active & Inactive
    function status_activity($id, $Status, $function, Request $request) {
        $msg = '';

        if($function == 'country') {

            //country  status updated
            $where = array('id' => $id);
            
            if($Status == 'Active'){

                $update['status'] = 'Active';

                Country::where($where)->update($update);

                $msg = "Status has been activated successfully.";
            }
            else{
                
                $update['status'] = 'Inactive';

                Country::where($where)->update($update);

                $msg = "Status has been inactived successfully.";
             }   

            return redirect('admin/country')->withSuccess($msg);
            
        }
        if($function == 'state') {

            //country  status updated
            $where = array('id' => $id);
            
            if($Status == 'Active'){

                $update['status'] = 'Active';

                State::where($where)->update($update);

                $msg = "Status has been activated successfully.";
            }
            else{
                
                $update['status'] = 'Inactive';

                State::where($where)->update($update);

                $msg = "Status has been inactived successfully.";
             }   

            return redirect('admin/state')->withSuccess($msg);
            
        }

        if($function == 'city') {

            //country  status updated
            $where = array('id' => $id);
            
            if($Status == 'Active'){

                $update['status'] = 'Active';

                City::where($where)->update($update);

                $msg = "Status has been activated successfully.";
            }
            else{
                
                $update['status'] = 'Inactive';

                City::where($where)->update($update);

                $msg = "Status has been inactived successfully.";
             }   

            return redirect('admin/city')->withSuccess($msg);
            
        }

    }


    public function block_unblock($id, $Status, $function,Request $request){
        
        $msg = '';
        
        if($function == 'owner') {

            //country  status updated
            $where = array('id' => $id);
            
            if($Status == 'Block'){

                $update['block_unblock'] = 'Block';

                User::where($where)->update($update);

                $msg = "Owner has been Blocked successfully.";
            }
            else{
                
                $update['block_unblock'] = 'Unblock';

                User::where($where)->update($update);

                $msg = "Owner has been Unblocked successfully.";
             }   

            return redirect('admin/owner-list')->withSuccess($msg);
            
        }

        //### Paying Guest #############
        if($function == 'Pg') {
            
            $where = array('id' => $id);
            
            if($Status == 'Block'){

                $update['block_unblock'] = 'Block';

                User::where($where)->update($update);

                $msg = "Paying Guest has been Blocked successfully.";
            }
            else{
                
                $update['block_unblock'] = 'Unblock';

                User::where($where)->update($update);

                $msg = "Paying Guest has been Unblocked successfully.";
             }   

            return redirect('admin/pg-list')->withSuccess($msg);
            
        }


    }
}
