import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      const userDoc = await getDoc(doc(db, "Usuarios", currentUser.uid));
      if (userDoc.exists()) setNomeUsuario(userDoc.data().nome);

      loadPacientes();
    });
    return () => unsub();
  }, []);

  const loadPacientes = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "Pacientes"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPacientes(list);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar pacientes");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const formatTS = (ts) => {
    try {
      const d = ts?.toDate ? ts.toDate() : null;
      if (!d) return "—";
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(d);
    } catch {
      return "—";
    }
  };

  const sortedRegistros = (registros = []) => {
    return [...registros].sort((a, b) => {
      const ta = a?.data?.toDate ? a.data.toDate().getTime() : 0;
      const tb = b?.data?.toDate ? b.data.toDate().getTime() : 0;
      return tb - ta;
    });
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="home-user-info">
          <p className="hello">Olá,</p>
          <h2 className="username">{nomeUsuario}</h2>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </header>

      {/* Seção de pacientes */}
      <main className="home-main">
        <div className="section-header">
          <h2 className="section-title">Pacientes</h2>
          <Link to="/paciente/novo" className="add-button">
            + Cadastrar
          </Link>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : pacientes.length === 0 ? (
          <p>Nenhum paciente cadastrado.</p>
        ) : (
          <div className="pacientes-list">
            {pacientes.map((p) => {
              const registros = sortedRegistros(p.registrosCurativos || []);
              const ultimo = registros[0];
              return (
                <div key={p.id} className="paciente-card">
                  <Link to={`/paciente/${p.id}`} className="paciente-info-link">
                    <h3 className="paciente-nome">{p.nome}</h3>
                    <p className="paciente-info">
                      <strong>PSF:</strong> {p.PSF || "—"}
                    </p>
                    <p className="paciente-info">
                      <strong>SUS:</strong> {p.SUS || "—"}
                    </p>
                    <p className="paciente-info">
                      {ultimo
                        ? `Último atendimento em ${formatTS(ultimo.data)} por ${ultimo.profissionalNome || "—"}`
                        : "Nenhum atendimento registrado"}
                    </p>
                  </Link>
                  <Link to={`/curativo/${p.id}`} className="curativo-button">
                    Registrar curativo
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Botão flutuante */}
      <Link to="/paciente/novo" className="fab-button">
        +
      </Link>
    </div>
  );
}
