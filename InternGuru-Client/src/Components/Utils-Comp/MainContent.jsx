import Header from "../Header";
import Sidebar from "./Sidebar";

const MainContent = ({ children }) => {
  return (
    <>
      <Header />
      <Sidebar />
      {/* Main Content Area */}
      <main className="ml-56 pt-20 px-6 min-h-screen z-10 relative bg-gray-200">
        {children}
      </main>
    </>
  );
};

export default MainContent;
