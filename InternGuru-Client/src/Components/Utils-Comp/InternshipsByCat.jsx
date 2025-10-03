import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  useDeleteInternshipMutation,
  useGetInternshipQuery,
} from "../../Store/app-api-slice";

import AddButton from "./AddButton";
import GridContainer from "./GridContainer";
import AdminControl from "../Admin-Dashboard/AdminControl";
import ConfimiModal from "./ConfimiModal";
import Control from "./Control";
import InternshipCard from "./InternshipCard";

const InternshipsByCat = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const {
    data: internships = [],
    isLoading,
    error,
  } = useGetInternshipQuery(id);

  const [deleteIntership] = useDeleteInternshipMutation();

  const [selectedId, setSelectedId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirmModal(true);
  };
  const confirmDelete = async (id) => {
    try {
      deleteIntership(id);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete internship");
    } finally {
      setShowConfirmModal(false);
      setSelectedId(null);
    }
  };

  return (
    <>
      {user.role === "admin" && (
        <>
          <AddButton text="Add Internship" to={`/admin/add/internship/${id}`} />
        </>
      )}

      {error && error.status === 404 ? (
        <h1 className="text-center">{error.data.message}</h1>
      ) : (
        <GridContainer direction="row">
          {internships.map((internship) => (
            <InternshipCard
              key={internship._id}
              internshipId={internship._id}
              title={internship.title}
              img_url={internship.image_url}
              duration={
                internship.duration.value + " " + internship.duration.unit
              }
            >
              <AdminControl
                deleteFunction={() =>
                  handleDeleteClick({
                    id: internship._id,
                    cat_id: internship.cat_id,
                  })
                }
                updateLink={`/admin/update-internship/${internship._id}/${internship.cat_id}`}
              />

              <Control application={true} internshipId={internship._id} />
              
            </InternshipCard>
          ))}
        </GridContainer>
      )}

      <ConfimiModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        confirmFunction={confirmDelete}
        internshipId={selectedId}
      />
    </>
  );
};

export default InternshipsByCat;
