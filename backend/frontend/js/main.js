async function carregarUsuarios() {
    const resp = await fetch("http://localhost:3000/api/usuarios");
    const dados = await resp.json();
    console.log(dados);
}

async function cadastrarUsuario() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
    });

    alert("Usuário cadastrado!");
}

document.addEventListener("DOMContentLoaded", carregarUsuarios);