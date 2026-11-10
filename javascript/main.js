const form = document.getElementById("student-form");
const list = document.getElementById("student-list");
const saveButton = document.getElementById("save-button");

const fields = {
    id: document.getElementById("student-id"),
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    city: document.getElementById("city"),
    state: document.getElementById("state"),
    cep: document.getElementById("cep")
};

let students = [];

async function render() {

    students = await getAlunos();

    console.log(students);

    list.innerHTML = "";

    students.forEach(student => {

        list.innerHTML += `
        <tr>
            <td>${student.nome}</td>
            <td>${student.email}</td>
            <td>${student.celular}</td>
            <td>${student.cidade} / ${student.estado}</td>
            <td>${student.cep}</td>
            <td>

                <button
                    class="action-btn"
                    type="button"
                    data-action="edit"
                    data-id="${student.id}">
                    Editar
                </button>

                <button
                    class="action-btn delete"
                    type="button"
                    data-action="delete"
                    data-id="${student.id}">
                    Excluir
                </button>

            </td>
        </tr>
        `;
    });

}

list.addEventListener("click", async (event) => {

    const button = event.target.closest("button");

    if (!button) return;

    console.log(button.dataset);

    const id = button.dataset.id;

    if (button.dataset.action === "delete") {

        if (confirm("Deseja excluir este aluno?")) {

            await deleteAluno(id);

            render();
        }

    }

    if (button.dataset.action === "edit") {

        const aluno = await getAluno(id);

        console.log(aluno);

        fields.id.value = aluno.id || "";
        fields.name.value = aluno.nome || "";
        fields.email.value = aluno.email || "";
        fields.phone.value = aluno.celular || "";
        fields.city.value = aluno.cidade || "";
        fields.state.value = aluno.estado || "";
        fields.cep.value = aluno.cep || "";

        saveButton.textContent = "Atualizar";
    }

});

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const aluno = {
        id: fields.id.value,
        nome: fields.name.value,
        email: fields.email.value,
        celular: fields.phone.value,
        cidade: fields.city.value,
        estado: fields.state.value,
        cep: fields.cep.value
    };

    try {

        if (aluno.id) {

            await putAluno(aluno);

            alert("Aluno atualizado com sucesso!");

        } else {

            delete aluno.id;

            await postAluno(aluno);

            alert("Aluno cadastrado com sucesso!");
        }

        form.reset();

        fields.id.value = "";

        saveButton.textContent = "Salvar";

        render();

    } catch (error) {

        console.error(error);

        alert("Erro ao salvar aluno.");
    }

});

// ==========================
// PESQUISA
// ==========================

search.addEventListener("input", () => {

    const texto = search.value.toLowerCase().trim();

    const filtrados = students.filter(student => {

        const nome = String(student.nome || "").toLowerCase();
        const email = String(student.email || "").toLowerCase();

        return nome.includes(texto) || email.includes(texto);

    });

    list.innerHTML = "";

    filtrados.forEach(student => {

        list.innerHTML += `
        <tr>
            <td>${student.nome || '-'}</td>
            <td>${student.email || '-'}</td>
            <td>${student.celular || '-'}</td>
            <td>${student.cidade || '-'} / ${student.estado || '-'}</td>
            <td>${student.cep || '-'  }</td>
            <td>

                <button
                    class="action-btn"
                    type="button"
                    data-action="edit"
                    data-id="${student.id}">
                    Editar
                </button>

                <button
                    class="action-btn delete"
                    type="button"
                    data-action="delete"
                    data-id="${student.id}">
                    Excluir
                </button>

            </td>
        </tr>
        `;

    });

});

render ()