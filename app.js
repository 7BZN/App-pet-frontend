import React, { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: "", type: "" });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "https://app-pet-backend-osyz.onrender.com";

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setPets(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.type) return;

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", type: "" });
    setEditingId(null);
    loadPets();
  };

  const handleEdit = (pet) => {
    setForm({ name: pet.name, type: pet.type });
    setEditingId(pet._id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadPets();
  };

  return (
    <div className="container">
      <h1>🐾 Pet Manager</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          placeholder="Nome do pet"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="type"
          placeholder="Tipo (gato, cachorro...)"
          value={form.type}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Atualizar" : "Adicionar"}
        </button>
      </form>

      <div className="grid">
        {pets.map((pet) => (
          <div className="card" key={pet._id}>
            <h2>{pet.name}</h2>
            <p>{pet.type}</p>

            <div className="actions">
              <button onClick={() => handleEdit(pet)} className="edit">
                Editar
              </button>
              <button
                onClick={() => handleDelete(pet._id)}
                className="delete"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

