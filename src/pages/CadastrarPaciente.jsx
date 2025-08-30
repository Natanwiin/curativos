import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./CadastrarPaciente.css";

export default function CadastrarPaciente() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [SUS, setSUS] = useState("");
  const [PSF, setPSF] = useState("");
  const [comorbidades, setComorbidades] = useState([]);
  const [localLesao, setLocalLesao] = useState([]);
  const [loading, setLoading] = useState(false);

  // Notificação
  const [notificacao, setNotificacao] = useState("");
  const [tipoNotificacao, setTipoNotificacao] = useState(""); // "sucesso" ou "erro"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pacienteData = {
        nome,
        dataNascimento,
        SUS,
        PSF,
        comorbidades,
        localLesao,
        createdAt: serverTimestamp(),
        registrosCurativos: []
      };

      await addDoc(collection(db, "Pacientes"), pacienteData);

      // Notificação de sucesso
      setTipoNotificacao("sucesso");
      setNotificacao("Paciente cadastrado com sucesso!");

      setTimeout(() => {
        setNotificacao("");
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error(error);
      setTipoNotificacao("erro");
      setNotificacao("Erro ao cadastrar paciente");
      setTimeout(() => setNotificacao(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Função para selecionar múltiplos valores
  const handleMultiSelect = (e, setState) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setState(options);
  };

  return (
    <div className="form-container">
      <h2>Cadastrar Paciente</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome completo:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Ex: João da Silva"
          />
        </label>

        <label>
          Data de nascimento:
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
          />
        </label>

        <label>
          Cartão SUS:
          <input
            type="text"
            value={SUS}
            onChange={(e) => setSUS(e.target.value)}
            required
            placeholder="Número do SUS"
          />
        </label>

        <label>
          PSF:
          <select value={PSF} onChange={(e) => setPSF(e.target.value)} required>
            <option value="">Selecione o PSF</option>
            <option value="Curtume">Curtume</option>
            <option value="Salinas">Salinas</option>
            <option value="Canavieira">Canavieira</option>
            <option value="Tatuamunha">Tatuamunha</option>
            <option value="Lages">Lages</option>
          </select>
        </label>

        <label>
          Comorbidades (segure Ctrl ou Cmd para selecionar múltiplas):
          <select multiple value={comorbidades} onChange={(e) => handleMultiSelect(e, setComorbidades)}>
            <option value="Diabetes">Diabetes</option>
            <option value="Hipertensão">Hipertensão</option>
            <option value="Doença renal crônica">Doença renal crônica</option>
            <option value="Obesidade">Obesidade</option>
            <option value="Cardiopatia">Cardiopatia</option>
            <option value="Pneumonia Crônica">Pneumonia Crônica</option>
          </select>
        </label>

        <label>
          Local da lesão (segure Ctrl ou Cmd para selecionar múltiplas):
          <select multiple value={localLesao} onChange={(e) => handleMultiSelect(e, setLocalLesao)}>
            <option value="MIE">MIE</option>
            <option value="MID">MID</option>
            <option value="MSD">MSD</option>
            <option value="MSE">MSE</option>
            <option value="Trocanter esquerdo">Trocanter esquerdo</option>
            <option value="Trocanter direito">Trocanter direito</option>
            <option value="Calcâneo esquerdo">Calcâneo esquerdo</option>
            <option value="Calcâneo direito">Calcâneo direito</option>
            <option value="Dorso">Dorso</option>
            <option value="Sacral">Sacral</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Paciente"}
        </button>
      </form>

      {notificacao && (
        <div className={`notificacao ${tipoNotificacao}`}>
          {notificacao}
        </div>
      )}
    </div>
  );
}
