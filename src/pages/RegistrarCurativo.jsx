import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function RegistrarCurativo() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");

      const userDoc = await getDoc(doc(db, "Usuarios", user.uid));
      const profissionalNome = userDoc.exists() ? userDoc.data().nome : "—";

      const curativoData = {
        descricao,
        profissionalNome,
        data: serverTimestamp()
      };

      await addDoc(collection(db, `Pacientes/${pacienteId}/Curativos`), curativoData);

      alert("Curativo registrado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar curativo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar Curativo</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Descrição do curativo:
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            placeholder="Ex: Limpeza e troca de curativo"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Curativo"}
        </button>
      </form>
    </div>
  );
}
