import React from "react";
import ResumeBuilderForm from "./ResumeBuilderForm";
import { useGenerateResumeMutation } from "../../../Store/app-api-slice";

const ResumeBuilder = () => {



  const baseUrl = import.meta.env.VITE_BASE_URL

  const resumeFields = [
    {
      name: "name",
      type: "text",
      placeholder: "Enter Your Name",
      required: true,
    },
    {
      name: "title",
      type: "text",
      placeholder: "Enter Your Profession Title",
      required: true,
    },
    {
      name: "email",
      type: "text",
      placeholder: "Enter Your Profession Title",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      placeholder: "Enter Your Contact Number",
      required: true,
    },
    {
      name: "location",
      type: "text",
      placeholder: "Enter Your Address",
      required: true,
    },
    {
      name: "summary",
      type: "textarea",
      placeholder: "Enter Your Address",
      required: true,
    },
    {
      name: "education",
      type: "multi-valued",
      date_type: "object",
      keys: ["degree", "institution", "year"],
    },

    {
      name: "experience",
      date_type: "object",
      type: "multi-valued",
      keys: ["company", "jobTitle", "duration"],
    },

    {
      name: "skills",
      data_type: "array",
      type: "multi-valued",
      keys: ["skills"],
    },
  ];


  const [generateResume] = useGenerateResumeMutation();


  const handleOnSubmit = async (resumeData) => {
    try {
      // Log formData content
      for (const pair of resumeData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      
      const response = await fetch(`${baseUrl}/intern/resume`, {
        method: 'POST',
        body: resumeData, // FormData sent directly
        // NO 'Content-Type' header!
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to download';
        try {
          const errorData = await response.json();
          console.log(errorData);
        } catch {
          // ignore parse errors
        }
        throw new Error(errorMessage);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Resume Downloaded successfully!");
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to Download Resume!");
    }
  };
  
  

  return (
    <>
      <ResumeBuilderForm
        fields={resumeFields}
        handleOnSubmit={handleOnSubmit}
        title={"Resume-Builder"}
        btn={"Download Resume"}
      />
    </>
  );
};

export default ResumeBuilder;
