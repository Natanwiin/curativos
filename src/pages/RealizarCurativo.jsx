import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import Select from "react-select";
import "./RealizarCurativo.css";

export default function RealizarCurativo() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  const [leito, setLeito] = useState("");
  const [odor, setOdor] = useState("");
  const [sinaisInfeccao, setSinaisInfeccao] = useState("");
  const [cobertura, setCobertura] = useState("");
  const [quantGazes, setQuantGazes] = useState(1);
  const [quantAtaduras, setQuantAtaduras] = useState(1);
  const [observacoes, setObservacoes] = useState("");
  const [notification, setNotification] = useState("");

  const coberturaOptions = [
    { value: "Gaze de Rayon", label: "Gaze de Rayon" },
    { value: "Hidrogel com alginato", label: "Hidrogel com alginato" },
    { value: "Hidrogel com phmb", label: "Hidrogel com phmb" },
    { value: "Hidrogel com cálcio", label: "Hidrogel com cálcio" },
    { value: "Hidrogel com age", label: "Hidrogel com age" },
    { value: "Hidrogel", label: "Hidrogel" },
    { value: "Espuma PHMB", label: "Espuma PHMB" },
    { value: "Sulfadiazina de prata", label: "Sulfadiazina de prata" },
    { value: "Papaína 2%", label: "Papaína 2%" },
    { value: "Papaína 4%", label: "Papaína 4%" },
    { value: "Papaína 6%", label: "Papaína 6%" },
    { value: "Papaína 8%", label: "Papaína 8%" },
    { value: "Papaína 10%", label: "Papaína 10%" },
    { value: "Colagenase", label: "Colagenase" },
    { value: "Colagenase com clorafenicol", label: "Colagenase com clorafenicol" },
    { value: "Neomicina", label: "Neomicina" },
    { value: "Espuma com phmb", label: "Espuma com phmb" },
    { value: "Placa alginato", label: "Placa alginato" },
    { value: "Placa alginato com prata", label: "Placa alginato com prata" }
  ];

  const handleVoltar = () => navigate("/");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leito || !odor || !sinaisInfeccao || !cobertura) {
      setNotification("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");

      const userDoc = await getDoc(doc(db, "Usuarios", user.uid));
      const profissionalNome = userDoc.exists() ? userDoc.data().nome : "—";

      // Cria o curativo
      const curativoData = {
        leito,
        odor,
        sinaisInfeccao,
        cobertura,
        quantGazes,
        quantAtaduras,
        observacoes,
        profissionalNome,
        data: new Date() // salva data real
      };

      // Salva na subcoleção de curativos
      await addDoc(collection(db, `Pacientes/${pacienteId}/Curativos`), curativoData);

      // Atualiza o paciente para manter registro do último atendimento
      const pacienteRef = doc(db, "Pacientes", pacienteId);
      const pacienteSnap = await getDoc(pacienteRef);
      const registrosAtuais = pacienteSnap.exists() && pacienteSnap.data().registrosCurativos
        ? pacienteSnap.data().registrosCurativos
        : [];
      await updateDoc(pacienteRef, {
        registrosCurativos: [...registrosAtuais, curativoData]
      });

      setNotification("Curativo registrado com sucesso!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error(error);
      setNotification("Erro ao registrar curativo!");
    }
  };

  return (
    <div className="form-container">
      <button type="button" onClick={handleVoltar} className="button-voltar">
        ← Voltar
      </button>
      <h2>Realizar Curativo</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Leito da ferida:
          <select value={leito} onChange={(e) => setLeito(e.target.value)} required>
            <option value="">Selecione</option>
            <option value="tecido de granulação">Tecido de granulação</option>
            <option value="tecido necrótico">Tecido necrótico</option>
            <option value="tecido de esfacelo">Tecido de esfacelo</option>
          </select>
        </label>

        <label>
          Odor fétido:
          <select value={odor} onChange={(e) => setOdor(e.target.value)} required>
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label>
          Sinais de infecção:
          <select value={sinaisInfeccao} onChange={(e) => setSinaisInfeccao(e.target.value)} required>
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label>
          Cobertura utilizada:
          <Select
            options={coberturaOptions}
            value={coberturaOptions.find(opt => opt.value === cobertura)}
            onChange={(selectedOption) => setCobertura(selectedOption.value)}
            placeholder="Selecione"
            isSearchable
            menuPlacement="auto"
            styles={{
              menu: (provided) => ({
                ...provided,
                maxHeight: 150,
                overflowY: "auto",
                zIndex: 9999
              })
            }}
          />
        </label>

        <label>
          Quantidade de gazes utilizadas:
          <input
            type="number"
            min="1"
            max="30"
            value={quantGazes}
            onChange={(e) => setQuantGazes(Math.max(1, Math.min(30, Number(e.target.value))))}
            required
          />
        </label>

        <label>
          Quantidade de ataduras utilizadas:
          <input
            type="number"
            min="1"
            max="6"
            value={quantAtaduras}
            onChange={(e) => setQuantAtaduras(Math.max(1, Math.min(6, Number(e.target.value))))}
            required
          />
        </label>

        <label>
          Observações:
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Espaço para observações"
          />
        </label>

        <button type="submit" className="button-submit">Registrar Curativo</button>
      </form>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}
