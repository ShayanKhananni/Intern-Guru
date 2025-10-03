import React, { useState, useEffect } from "react";
import GridContainer from "../../Utils-Comp/GridContainer";
import ProjectCard from "./ProjectCard";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";

const Portfolio = () => {
  const { user } = useSelector((state) => state.auth);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const {id} = useParams()


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

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/app/getUsername/${id}`
        );
        setUserName(res.data.username || "User");
      } catch (error) {
        console.error("Failed to fetch user name:", error);
        setUserName("User");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserName();
    }
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-slate-700 py-10 px-4">
      {/* Header */}
      <div className="items-center mb-6">
        <h2 className="text-white text-2xl text-center font-bold">
          {loading ? "Loading..." : `${userName}'s Projects`}
        </h2>
      </div>

      {/* Projects Grid */}
      <GridContainer direction="row" className="bg-gray-700 gap-7 w-full">
        {dummyProjects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </GridContainer>
    </div>
  );
};

export default Portfolio;
