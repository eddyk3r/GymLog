import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ExercitiiPage from "./pages/ExercitiiPage.jsx";
import ExercitiuDetaliuPage from "./pages/ExercitiuDetaliuPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import DesprePage from "./pages/DesprePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Harta rutelor. Layout înconjoară fiecare pagină.
// Ruta de detaliu folosește resursa din tw.json: /exercitii/:id
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ExercitiiPage />} />
        <Route path="/exercitii/:id" element={<ExercitiuDetaliuPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/despre" element={<DesprePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
