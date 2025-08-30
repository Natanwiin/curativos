import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import "./PacienteDetalhes.css";

export default function PacienteDetalhes() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [curativos, setCurativos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaciente = async () => {
      try {
        setLoading(true);

        const pacienteDoc = await getDoc(doc(db, "Pacientes", pacienteId));
        if (pacienteDoc.exists()) setPaciente({ id: pacienteDoc.id, ...pacienteDoc.data() });

        const curativosSnap = await getDocs(query(
          collection(db, `Pacientes/${pacienteId}/Curativos`),
          orderBy("data", "desc")
        ));
        const listaCurativos = curativosSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCurativos(listaCurativos);

      } catch (e) {
        console.error(e);
        alert("Erro ao carregar paciente e curativos");
      } finally {
        setLoading(false);
      }
    };

    loadPaciente();
  }, [pacienteId]);

  const formatTS = (ts) => {
    try {
      const d = ts?.toDate ? ts.toDate() : null;
      if (!d) return "—";
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(d);
    } catch {
      return "—";
    }
  };

  return (
    <div className="detalhes-container">
      <button className="button-voltar" onClick={() => navigate("/")}>← Voltar</button>

      {loading ? <p>Carregando...</p> : (
        <>
          {paciente ? (
            <>
              <div className="paciente-header">
                <h2>{paciente.nome}</h2>
                <p><strong>PSF:</strong> {paciente.PSF || "—"}</p>
                <p><strong>SUS:</strong> {paciente.SUS || "—"}</p>
              </div>

              <h3>Curativos</h3>
              {curativos.length === 0 ? (
                <p>Nenhum curativo registrado</p>
              ) : (
                <ul className="curativos-lista">
                  {curativos.map(c => (
                    <li key={c.id} className="curativo-card">
                      <p><strong>Data:</strong> {formatTS(c.data)}</p>
                      <p><strong>Profissional:</strong> {c.profissionalNome}</p>
                      <p><strong>Leito:</strong> {c.leito}</p>
                      <p><strong>Odor fétido:</strong> {c.odor}</p>
                      <p><strong>Sinais de infecção:</strong> {c.sinaisInfeccao}</p>
                      <p><strong>Cobertura:</strong> {c.cobertura}</p>
                      <p><strong>Gazes:</strong> {c.quantGazes}</p>
                      <p><strong>Ataduras:</strong> {c.quantAtaduras}</p>
                      <p><strong>Observações:</strong> {c.observacoes || "—"}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p>Paciente não encontrado</p>
          )}
        </>
      )}
    </div>
  );
}
