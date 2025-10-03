import React from "react";
import InternCard from "../Utils-Comp/InternshipCard";
import taskImg from "../../../public/task.jpg";
import appliImg from "../../../public/application.jpg";
import internsImg from "../../../public/interns.jpg";
import { Link } from "react-router-dom";
import GridContainer from "../Utils-Comp/GridContainer";

const Options = ({ internship_id }) => {
  const content = [
    { title: "View Tasks", image_url: taskImg, link: "" },
    { title: "View Interns", image_url: internsImg, link: "" },
    { title: "View Applications", image_url: appliImg, link: "" },
  ];

  return (
    <>
      <GridContainer direction="row">
        {content.map((item) => {
          return (
            <>
              <Link to={item.link}>
                <InternCard img_url={item.image_url} title={item.title} />
              </Link>
            </>
          );
        })}
      </GridContainer>
    </>
  );
};

export default Options;
