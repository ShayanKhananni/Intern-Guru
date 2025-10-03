import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authActions } from "./auth-slice";
import { toast } from "react-toastify";

// Define the base query with fetchBaseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include", // Ensures cookies are included in the request
  prepareHeaders: (headers) => {
    if (!headers.get("X-Is-FormData")) {
      headers.set("Content-Type", "application/json");
    } else {
      headers.delete("X-Is-FormData"); // clean up custom flag
    }
    return headers;
  }

});

// Base query with auth check for handling authentication
const baseQueryWithAuthCheck = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    switch (result.error.status) {
      case 401:
        api.dispatch(authActions.signOut()); // Sign out if the user is unauthorized
        break;

      // case 404:
      //   const refreshResult = await api.dispatch(
      //     appApi.endpoints.refresh.initiate({}) // Attempt to refresh the token
      //   );

        if (refreshResult.error) {
          api.dispatch(authActions.signOut()); // If refresh fails, sign out the user
          return;
        }

        // Retry the original request after successful refresh
        result = await baseQuery(args, api, extraOptions);
        break;
    }
  }

  return result;
};

// Define the internship API slice
export const appApi = createApi({
  reducerPath: "appApi", // Unique name for the API reducer
  baseQuery: baseQueryWithAuthCheck, // Use the base query with auth check
  tagTypes: ["Internships", "Categories", "Tasks", 'Intern Tasks'],

  endpoints: (builder) => ({

    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        credentials: "include", 
      }),
    }),


    /// Internship Categories Endpoints

    getInternshipCateg: builder.query({
      query: () => `/app/internship-categories`,
      providesTags: ["Categories"]

    }),

    addInternshipCateg: builder.mutation({
      query: (category) => ({
        url: "/admin/internship-categories",
        method: "POST",
        body: category,
        headers: {
          "X-Is-FormData": "true",
        },
      }),

      // Invalidate after success to refetch the category list
      invalidatesTags: ["Categories"],


      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Internship category added successfully!");
        } catch (error) {
          console.error("Failed to add internship category", error);
          toast.error("Failed to add internship category!");
        }
      },
    }),

    deleteInternshipCateg: builder.mutation({
      query: (id) => ({
        url: `/admin/internship-categories/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ["Categories"],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          
          toast.success("Successfully Deleted Internship Category");
        } catch (errObject) {
          console.error(errObject.error?.data?.message || 'Error deleting category');
          toast.error(errObject.error?.data?.message || 'Failed to delete category');
        }
      },
    }),

    updateInternshipCateg: builder.mutation({
      query: (updateData) => {
        return {
          url: "/admin/internship-categories",
          method: "PUT",
          body: updateData,
          headers: {
            "X-Is-FormData": "true", // Custom flag to prevent Content-Type override
          },
        };
      },

      invalidatesTags: ["Categories"],

      async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
        try {

          const { data: updatedCategory } = await queryFulfilled;

          toast.success("Category Updated successfully!");
          // dispatch(
          //   appApi.util.updateQueryData(
          //     "getInternshipCategories",
          //     undefined,
          //     (draft) => {
          //       const index = draft.findIndex(
          //         (item) => item._id === updatedCategory._id
          //       );
          //       if (index !== -1) {
          //         draft[index] = {
          //           ...draft[index],
          //           ...updatedCategory,
          //         };
          //       }
          //     }
          //   )
          // );
        } catch (error) {
          console.error("Failed to update internship category", error);
          toast.error("Failed to update internship category!!");
        }
      },
    }),



    /// Internship Endpoints
    getInternship: builder.query({
      query: (catId) => `/app/internship/${catId}`,
      providesTags: (result, error, catId) => [{ type: "Internships", id: catId }],
    }),

    getAllInternship: builder.query({
      query: () => `/app/all/internship`,
      providesTags: (result, error, catId) => [{ type: "All-Internships" }],
    }),

    addInternship: builder.mutation({
      query: (internship) => ({
        url: "/admin/internship",
        method: "POST",
        body: internship,
        headers: {
          "X-Is-FormData": "true",
        },
      }),

      invalidatesTags: (result, error, internship) => [
        { type: "Internships", id: internship.get('cat_id') },
        { type: "All-Internships", },
      ],



      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {

          await queryFulfilled;

          toast.success("Internship added successfully!");
        } catch (error) {
          console.error("Failed to add internship", error);
          toast.error("Failed to add internship!");
        }
      },
    }),

    deleteInternship: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/internship/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, id, cat_id) => [
        { type: "All-Internships", },
      ],

      async onQueryStarted({ id, cat_id }, { dispatch, queryFulfilled }) {

        try {
          await queryFulfilled;

          dispatch(
            appApi.util.updateQueryData("getInternship", cat_id, (draft) => {
              return draft.filter((internship) => internship._id !== id);
            })
          );

          toast.success("Successfully Deleted Internship");
        } catch (err) {
          console.error("Error deleting internship", err);
          toast.error(err.error.data.message);
        }
      },
    }),

    updateInternship: builder.mutation({
      query: (updateData) => {

        for (let [key, value] of updateData.entries()) {
          console.log(`${key}:`, value);
        }

        return {
          url: "/admin/internship",
          method: "PUT",
          body: updateData,
          headers: {
            "X-Is-FormData": "true",
          },
        };
      },


      invalidatesTags: (result, error, updatedInternship) => [
        { type: "Internships", id: updatedInternship.get('cat_id') },
        { type: "All-Internships", },
      ],


      async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
        try {

          await queryFulfilled;
          toast.success("Category Updated successfully!");

        } catch (error) {
          console.error("Failed to update internship", error);
          toast.error("Failed to update internship!!");
        }
      },
    }),

    /// Tasks Endpints 
    getTasksByInternship: builder.query({
      query: (internshipId) => `/admin/task/${internshipId}`,
      providesTags: (result, error, internshipId) => [{ type: "Tasks", id: internshipId }],
    }),

    addTask: builder.mutation({
      query: (task) => {
        // Log FormData entries
        

        return {
          url: "/admin/task",
          method: "POST",
          body: task, // Send the FormData object directly as body
          headers: {
            // Do not set Content-Type manually, let FormData handle it
            "X-Is-FormData": "true",
          },
        };
      },

      invalidatesTags: (result, error, task) => [
        { type: "Tasks", id: task.get('internship_id') },
      ],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Task added successfully!");
        } catch (error) {
          console.error("Failed to add Task", error);
          toast.error("Failed to add Task!");
        }
      },
    }),

    deleteTask: builder.mutation({
      query: ({ id, internship_id }) => ({
        url: `/admin/task/${id}`,
        method: "DELETE",
      }),

      async onQueryStarted({ id, internship_id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          console.log(internship_id);

          dispatch(
            appApi.util.updateQueryData("getTasksByInternship", internship_id, (draft) => {
              return draft.filter((task) => task._id !== id);
            })
          );
          

          toast.success("Successfully Deleted Task");
        } catch (err) {
          console.error("Error deleting Task", err);
          toast.error("Failed to delete Task");
        }
      },
    }),

    updateTask: builder.mutation({
      query: (task) => {

        for (let [key, value] of task.entries()) {
          console.log(`${key}:`, value);
        }

        return {
          url: "/admin/task",
          method: "PUT",
          body: task, // Send the FormData object directly as body
          headers: {
            // Do not set Content-Type manually, let FormData handle it
            "X-Is-FormData": "true",
          },
        };
      },

      invalidatesTags: (result, error, task) => [
        { type: "Tasks", id: task.get('internship_id') },
      ],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Task updated successfully!");
        } catch (error) {
          toast.error("Failed to update Task!");
        }
      },
    }),



    /// Admin End-points


    getApplications: builder.query({
      query: (id) => `/admin/application/${id}`,
      providesTags: ["Applications"]
    }),

    updateApplication: builder.mutation({
      query: (application) => {

        return {
          url: "/admin/application",
          method: "PUT",
          body: application,
        };
      },

      invalidatesTags: (result, error, application) => [
        { type: "Applications", id: application.internship_id },
      ],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Applicaiton Updated successfully!");
        } catch (error) {
          console.error("Failed to Updated Applicaiton", error);
          toast.error(error.error.data.message);
        }
      },
    }),

    getInterns: builder.query({
      query: (id) => `/admin/intern/${id}`,
    }),
    
    updateFeedback: builder.mutation({
      query: (feedback) => {
        return {
          url: "/admin/intern/task",
          method: "PUT",
          body: feedback,
          headers: {
            "X-Is-FormData": "true",
          },
        };
      },

      invalidatesTags: (result, error, feedback) => [
        { type: "Intern Tasks",  id: feedback?.get('intern_id') }, 
      ],

      async onQueryStarted(arg,{dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Task Updated successfully!");
        } catch (error) {
          console.error("Failed to Updated Applicaiton", error);
          toast.error(error.error.data.message);
        }
      },
    }),




    /// Admin-Courses Endpoints
  
    getAdminCourses: builder.query({
      query: (internshipId) => `/admin/course/${internshipId}`,
      providesTags: (result, error, internshipId) => [{ type: "Courses", id: internshipId }],
    }),

    addCourse: builder.mutation({
      query: (course) => {
        return {
          url: "/admin/course",
          method: "POST",
          body: course, 
          headers: {
            // Do not set Content-Type manually, let FormData handle it
            "X-Is-FormData": "true",
          },
        };
      },

      invalidatesTags: (result, error, course) => [
        { type: "Courses", id: course.get('internship_id') },
      ],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Course Added successfully!");
        } catch (error) {
          console.error("Failed to add Task", error);
          toast.error("Failed to Add Course!");
        }
      },
    }),

    updateCourse: builder.mutation({
      query: (updateData) => {

        for (let [key, value] of updateData.entries()) {
          console.log(`${key}:`, value);
        }

        return {
          url: "/admin/course",
          method: "PUT",
          body: updateData,
          headers: {
            "X-Is-FormData": "true",
          },
        };
      },

      invalidatesTags: (result, error, updateData) => [
        { type: "Courses", id: updateData.get('internship_id') },
      ],

      async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
        try {

          await queryFulfilled;
          toast.success("Course Updated successfully!");

        } catch (error) {
          console.error("Failed to update internship", error);
          toast.error("Failed to Update Course!!");
        }
      },
    }),

    deleteCourse: builder.mutation({
      query: ({id}) => ({
        url: `/admin/course/${id}`,
        method: "DELETE",
      }),

      async onQueryStarted({ id, internship_id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(
            appApi.util.updateQueryData("getAdminCourses", internship_id, (draft) => {
              return draft.filter((course) => course._id !== id);
            })
          );

          toast.success("Successfully Deleted Course");
        } catch (err) {
          console.error("Error deleting Task", err);
          toast.error(err.error.data.message);  
        }
      },
    }),







    // Applications Endpoints

    getInternshipDuration: builder.query({
      query: (id) => `/app/internship/duration/${id}`,
      providesTags: (result, error, undefined) => [{ type: "Intern Tasks", }],
    }),


    // Intern Endpoint




    applyForInternship: builder.mutation({
      query: (application) => {

        return {
          url: "/intern/application",
          method: "POST",
          body: application, // Send the FormData object directly as body
        };
      },

      invalidatesTags: (result, error, application) => [
        { type: "Application", id: application.intern_id },
      ],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Applied Successfully!");
        } catch (error) {
          console.error("Failed to add Task", error);
          toast.error(error.error.data.message);
        }
      },
    }),

    getInternTasks: builder.query({
      query: ({ intern_id, internship_id }) => `/intern/task/${internship_id}/${intern_id}`,
      providesTags: (result, error, { intern_id }) => [{ type: "Intern Tasks", id: intern_id }],
    }),

    submitTask: builder.mutation({
      query: (task) => ({
        url: "/intern/task", // Assuming you have an endpoint for submitting tasks
        method: "POST",
        body: task,
        headers: {
          // Do not set Content-Type manually, let FormData handle it
          "X-Is-FormData": "true",
        },
      }),

      invalidatesTags: (result, error, task) => [
        { type: "Intern Tasks", },
      ],

      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        try {
          // Assuming the backend returns the updated task details after submission
          await queryFulfilled;
          toast.success("Task submitted successfully!");
        } catch (error) {
          console.error("Failed to submit task:", error);
          toast.error(error?.error?.data?.message || "Something went wrong");
        }
      },
    }),

    updateTaskSubmission: builder.mutation({
      query: (task) => ({
        url: "/intern/task",
        method: "PUT",
        body: task, 
        headers: {
          // Do not set Content-Type manually, let FormData handle it
          "X-Is-FormData": "true",
        },
      }),
      
      invalidatesTags: (result, error, task) => [
        { type: "Intern Tasks",  id: task.get("intern_id") }, 
      ],

    }),

    getInternCourses: builder.query({
      query: ({ intern_id, internship_id }) => `/intern/course/${internship_id}/${intern_id}`,
      providesTags: (result, error,) => [{ type: "Intern Courses" }],
    }),
  
    purchaseCourse: builder.mutation({
      query: (purchase) => ({
        url: "/intern/course/purchase", // Assuming you have an endpoint for submitting tasks
        method: "POST",
        body: purchase,

      }),
      // invalidatesTags: (result, error, task) => [
      //   { type: "Intern Tasks", },
      // ],

      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Task submitted successfully!");
        } catch (error) {
          console.error("Failed to submit task:", error);
          toast.error(error?.error?.data?.message || "Something went wrong");
        }
      },
    }),
    
    enrollIntern: builder.mutation({
      query: (courseDetails) => ({
        url: "/intern/enroll", 
        method: "POST",
        body: courseDetails,

      }),

      invalidatesTags: (result, error, task) => [
        { type: "Intern Courses"},
      ],

      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        try {
          // Assuming the backend returns the updated task details after submission
          await queryFulfilled;
          toast.success("Course Purchased Successfully!");
        } catch (error) {
          console.error("Failed to submit task:", error);
          
          toast.error(error?.error?.data?.message || "Something went wrong");
        }
      },
    }),

    getCollabrativeTasks: builder.query({
      query: (id) => `/intern/collab/${id}`,
      providesTags: (result, error,) => [{ type: "Collab" }],
    }),



    generateResume: builder.mutation({
      query: (resumeData) => {
        return {
          url: "/intern/resume",
          method: "POST",
          body: resumeData, 
          headers: {
            "X-Is-FormData": "true",
          },
        };
      },

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Resume Downloaded successfully!");
        } catch (error) {
          console.error("Failed to add Task", error);
          toast.error("Failed to Download Course!");
        }
      },
    }),
  }),
  
});




// Export hooks for the queries and mutations
export const {


  /// Admin Mutataions
  useGetInternshipCategQuery,
  useAddInternshipCategMutation,
  useDeleteInternshipCategMutation,
  useUpdateInternshipCategMutation,

  useGetInternshipQuery,
  useGetAllInternshipQuery,
  useAddInternshipMutation,
  useDeleteInternshipMutation,
  useUpdateInternshipMutation,

  useGetTasksByInternshipQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,

  useApplyForInternshipMutation,
  useUpdateTaskSubmissionMutation,

  useSubmitTaskMutation,
  useGetInternsQuery,
  useGetInternshipDurationQuery,
  useUpdateFeedbackMutation,


  useGetAdminCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,

  /// Intern Mutataions

  useGetApplicationsQuery,
  useUpdateApplicationMutation,
  useGetInternTasksQuery,
  useGetInternCoursesQuery,
  usePurchaseCourseMutation,
  useEnrollInternMutation,
  useGetCollabrativeTasksQuery,
  useGetKanbanTasksQuery,
  useAddKanbanTaskMutation,
  useGenerateResumeMutation,

} = appApi;


