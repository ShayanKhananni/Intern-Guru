import React from "react";
import GridContainer from "./GridContainer";
import AddButton from "./AddButton";
import { useSelector } from "react-redux";
import AdminControl from "../Admin-Dashboard/AdminControl";
import { useDeleteInternshipCategMutation, useGetInternshipCategQuery } from "../../Store/app-api-slice";
import InternCatCard from "./InternCatCard";

const InternshipsCat = () => {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useGetInternshipCategQuery();

  const [deleteInternshipCategory] = useDeleteInternshipCategMutation();
  const { user } = useSelector((state) => state.auth);

  
  return (
    <>
          {user.role === "admin" && (
        <>
          <AddButton text="Add Category" to={"/admin/add/internship-categ"} />
        </>
      )}

      {/* Internship Cards */}

      <GridContainer direction="row">
        {categories.map((category) => (
          <InternCatCard
            key={category._id}
            title={category.title}
            icon={category.icon}
            img_url={category.image_url}
            catId={category._id}
          >
            {user.role === "admin" ? (
              <AdminControl
                deleteFunction={ () =>{ deleteInternshipCategory(category._id)}}
                updateLink={`/admin/update-category/${category._id}`}
              />
            ) : null}
          </InternCatCard>
        ))}
      </GridContainer>
    </>
  );
};



// {user.role === "admin" ? (
//   <AdminControl
//     deleteFunction={() => {
//       deleteInternshipCategory(category._id);
//     }}
//     updateLink={`/admin/update-category/${category._id}`}
//   />
// ) : null}

export default InternshipsCat;
