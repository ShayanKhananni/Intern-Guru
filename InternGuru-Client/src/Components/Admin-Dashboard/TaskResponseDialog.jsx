import React from 'react'
import DynamicDialgForm from '../Utils-Comp/DynamicDialgForm'
import { useSubmitTaskMutation, useUpdateFeedbackMutation } from '../../Store/app-api-slice'
import { useSelector } from 'react-redux'

const TaskResponseDialog = ({open,setOpen,handleCancel,subId,customFormStyle,internId}) => {

  const user = useSelector((state) => state.auth.user); 

  const [updateFeedback] = useUpdateFeedbackMutation();

  const fields = [
    { name: "feedback", type: "text", required:true},
  ]

  const handleResponse = async (data) => {
  
    const formData = data || new FormData();
  
    formData.append("id", subId);
    formData.append("intern_id", internId);
  
    if (!data) {
      formData.append("status", "approved");
    } else {
      formData.append("status", "rejected");
    }
  
    await updateFeedback(formData).unwrap();
  
    setOpen(false);
  };
  

  return (
    <>
    <DynamicDialgForm update={true} title={'Task Response'} handleCancel={handleCancel}  handleOnSubmit={handleResponse}  open={open} setOpen={setOpen} fields={fields} btn={'Reject'} customFormStyle={customFormStyle} >

      <button onClick={()=>{handleResponse()}}  className='btn bg-green-600 text-white text-xl hover:bg-green-700 w-2/5 p-4 font-bold rounded-sm mx-auto' >
        Approve
      </button>

    </DynamicDialgForm>
    </>
  )
}

export default TaskResponseDialog
