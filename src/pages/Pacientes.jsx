import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../useAuth";

export default function Pacientes() {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [novoNome, setNovoNome] = useState("");

  // 🔄 Carregar pacientes do Firestore
  async function carregarPacientes() {
    try {
      const querySnapshot = await getDocs(collection(db, "pacientes"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPacientes(lista);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  }

  // ➕ Adicionar paciente
  async function adicionarPaciente() {
    if (!novoNome.trim()) return;
    try {
      await addDoc(collection(db, "pacientes"), {
  nome: novoNome,
  criadoPor: user?.uid || "desconhecido",
});

      setNovoNome("");
      carregarPacientes();
    } catch (error) {
      console.error("Erro ao adicionar paciente:", error);
    }
  }

  // ❌ Deletar paciente
  async function deletarPaciente(id) {
    try {
      await deleteDoc(doc(db, "pacientes", id));
      carregarPacientes();
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
    }
  }

  // 🔁 Carregar na montagem
  useEffect(() => {
    carregarPacientes();
  }, []);

  return (
    <div>
      <h1>Pacientes</h1>

      {/* Formulário para adicionar */}
      <input
        type="text"
        placeholder="Nome do paciente"
        value={novoNome}
        onChange={(e) => setNovoNome(e.target.value)}
      />
      <button onClick={adicionarPaciente}>Adicionar</button>

      {/* Lista de pacientes */}
      <ul>
        {pacientes.map((p) => (
          <li key={p.id}>
            {p.nome}{" "}
            <button onClick={() => deletarPaciente(p.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
