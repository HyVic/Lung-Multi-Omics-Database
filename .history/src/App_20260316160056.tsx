import { Routes, Route } from "react-router-dom";
import Layout, { useUser } from "./components/Layout";
import Index from "./pages/index";
import DataSetsHome from "./pages/datasets/DataSetsHome";
import DataSetsDetail from "./pages/datasets/DataSetsDetail";
import Ontology from "./pages/ontology/Ontology";
import Tools from "./pages/tools/Tools";
import Architecture from "./pages/architecture/Architecture";
import AdminConsole from "./pages/admin/AdminConsole";

export default function App() {
  const { user } = useUser();
  console.log(user);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/datasets" element={<DataSetsHome />} />
        <Route path="/datasets/:id" element={<DataSetsDetail />} />
        <Route path="/ontology" element={<Ontology />} />
        <Route path="/ontology/tools" element={<Tools />} />
        <Route path="/architecture" element={<Architecture />} />
        {/* Admin routes - only accessible to admin role */}
        <Route path="/admin" element={user?.name === "super" ? <AdminConsole /> : <Index />} />
      </Routes>
    </Layout>
  );
}
