import React, { useState } from "react";
import GridContainer from "../../Utils-Comp/GridContainer";
import InternProjectCard from "./InternProjectCard";
import { useSelector } from "react-redux";
import { FaPlus, FaCopy } from "react-icons/fa";
import AddProgDialog from "./AddProjDailog";
import { toast } from "react-toastify"; // Make sure react-toastify is installed

const PortfolioBuilder = () => {
  const { user } = useSelector((state) => state.auth);

  const [activeDialog, setActiveDialogState] = useState(false);
  const [actionState, setActionState] = useState("add"); // "add" or "update"
  const [selectedProject, setSelectedProject] = useState(null);

  const dummyProjects = [
    {
      title: "AI Chatbot",
      img_url: "https://images.unsplash.com/photo-1600267165585-2fdd381d8850?auto=format&fit=crop&w=800&q=80",
      description: "An AI-powered chatbot using React and OpenAI APIs.",
      live_link: "https://example.com/chatbot",
      github_link: "https://github.com/yourname/chatbot",
      techStack: ["React", "Node.js", "OpenAI", "TailwindCSS"],
    },
    {
      title: "E-commerce App",
      img_url: "https://images.unsplash.com/photo-1589561084283-930aa7b1a5d1?auto=format&fit=crop&w=800&q=80",
      description: "A full-stack MERN e-commerce platform with Stripe integration.",
      live_link: "https://example.com/shop",
      github_link: "https://github.com/yourname/ecommerce",
      techStack: ["MongoDB", "Express", "React", "Node.js"],
    },
    {
      title: "Portfolio Website",
      img_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      description: "Personal portfolio built with React and Tailwind CSS.",
      live_link: "https://yourportfolio.com",
      github_link: "https://github.com/yourname/portfolio",
      techStack: ["React", "TailwindCSS", "Vite"],
    },
  ];

  const handleAddProject = () => {
    setActionState("add");
    setSelectedProject(null);
    setActiveDialogState(true);
  };

  const handleUpdateProject = (project) => {
    setActionState("update");
    setSelectedProject(project);
    setActiveDialogState(true);
  };

  const handleCopyPublicUrl = () => {
    const url = `${window.location.origin}/portfolio/${user?._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Public URL copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-700 py-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-bold">My Projects</h2>

        <div className="flex gap-4">
          <button
            onClick={handleCopyPublicUrl}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition"
          >
            <FaCopy /> Copy Public URL
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition"
            onClick={handleAddProject}
          >
            <FaPlus /> Add Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <GridContainer direction="row" className="bg-gray-700 gap-7 w-full">
        {dummyProjects.map((project, index) => (
          <InternProjectCard
            key={index}
            {...project}
            onEdit={() => handleUpdateProject(project)}
          />
        ))}
      </GridContainer>

      {/* Dialog Modal */}
      {activeDialog && (
        <AddProgDialog
          open={activeDialog}
          setOpen={setActiveDialogState}
          action={actionState}
          projectData={selectedProject}
        />
      )}
    </div>
  );
};

export default PortfolioBuilder;
