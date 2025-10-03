import React, { useState } from 'react'
import DynamicDialgForm from '../Utils-Comp/DynamicDialgForm'
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUserMutation } from '../../Store/auth-api-slice';
import { authActions } from '../../Store/auth-slice';
import { toast } from 'react-toastify';

const UpdatePofDialog = ({open,setOpen,handleCancel}) => {


  const {user} = useSelector((state)=>state.auth);
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useDispatch();


  const handleOnSubmit = async (data) => {
    data.append("id", user._id);
    await updateUser(data);
    try {
      const response = await updateUser(data).unwrap();
      toast.success(response.message);
      dispatch(authActions.updateUser(response.updatedUser));

      handleCancel();
    } catch (err) {
      console.log("Error while adding category:", err);
      handleCancel();
    }
  };


  const fields = [
    { name: "name", type: "text",  required: true },
    { name: "fathername", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "university", type: "text", required: true },
    { name: "contact", type: "text", required: true },
    { name: "address", type: "text", required: true },    
    { name: "program", type: "text", required: true },        
  ];

const initValues = {
  name: user.username || "",
  fathername: user.fathername || "",
  email: user.email || "",
  university: user.university || "",
  contact: user.contact || "",
  program: user.program || "",
  address: user.address || "",  
};

  return (
    <>
    <DynamicDialgForm title={'Update Profile'} update={true} desc={"Please Update Your Profile to Apply for Internship!!"} handleOnSubmit={handleOnSubmit} handleCancel={handleCancel} initValues={initValues}  open={open} setOpen={setOpen} fields={fields} btn={'Update'}  />
    </>
  )
}

export default UpdatePofDialog
