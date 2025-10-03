import React from 'react'
import { useSelector } from 'react-redux'
import DynamicDialgForm from '../../Utils-Comp/DynamicDialgForm'

const AddProgDialog = ({open,setOpen,handleCancel}) => {


  const user = useSelector((state) => state.auth.user); 
  // const [submitTask] = useSubmitTaskMutation()

  const fields = [

    { name: "title", type: "text", required: true },
    { name: "description", type: "text", required: true },
    { name: "deployed_link", type: "text"},
    { name: "github_link", type: "text"},
    
    
  ]


  const handleOnSubmit = async (data) => {
    // Appending extra form data
    data.append("task_id", taskId);
    data.append("internship_id", user.internship_id);
    data.append("intern_id", user._id);
  
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`); 
    }
  
    try {
      await submitTask(data).unwarap();
      handleCancel(); 
    } catch (err) {
      console.log("Error while adding category:", err);
      handleCancel(); 
    }
  };
  
  

  return (
    <>
    <DynamicDialgForm title={'Add Project'}  handleOnSubmit={handleOnSubmit} handleCancel={handleCancel} open={open} setOpen={setOpen} fields={fields} btn={'Submit Task'}  />
    </>
  )
}

export default AddProgDialog