import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importa todos os componentes existentes
import Home from "./pages/Home";
import Register from "./pages/Register";
import CadastrarPaciente from "./pages/CadastrarPaciente";
import Login from "./pages/Login";
import RealizarCurativo from "./pages/RealizarCurativo";
import PacienteDetalhes from "./pages/PacienteDetalhes";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Tela de login */}
        <Route path="/login" element={<Login />} />

        {/* Tela principal */}
        <Route path="/" element={<Home />} />

        {/* Cadastro de paciente */}
        <Route path="/paciente/novo" element={<CadastrarPaciente />} />

        {/* Registrar curativo */}
        <Route path="/curativo/:pacienteId" element={<RealizarCurativo />} />

        {/* Detalhes do paciente */}
        <Route path="/paciente/:pacienteId" element={<PacienteDetalhes />} />

        {/* Tela de cadastro de usuário (Register) */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
