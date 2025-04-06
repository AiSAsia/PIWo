"use strict";

const lists = {
    "Mało pilne": [],
    "Pilne": [],
    "Na wczoraj": []
};

let lastDeleted = null;
let selectedList = "Mało pilne";

document.addEventListener("DOMContentLoaded", () => {
    const listSelector = document.getElementById("listSelector");
    const listsContainer = document.getElementById("listsContainer");
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const searchInput = document.getElementById("searchInput");
    const caseInsensitive = document.getElementById("caseInsensitive");
    const toggleDarkMode = document.getElementById("toggleDarkMode");

    // Renderowanie list
    function renderLists() {
        listSelector.innerHTML = "";
        listsContainer.innerHTML = "";

        for (const listName in lists) {
            const option = document.createElement("option");
            option.value = listName;
            option.textContent = listName;
            if (listName === selectedList) option.selected = true;
            listSelector.appendChild(option);

            const listDiv = document.createElement("div");
            listDiv.className = "list";

            const header = document.createElement("h2");
            header.textContent = listName;

            const ul = document.createElement("ul");
            ul.dataset.listName = listName;

            header.addEventListener("click", () => {
                ul.classList.toggle("hidden");
            });

            lists[listName].forEach((task, index) => {
                if (matchesSearch(task.text)) {
                    ul.appendChild(createTaskElement(task, listName, index));
                }
            });

            listDiv.appendChild(header);
            listDiv.appendChild(ul);
            listsContainer.appendChild(listDiv);
        }
    }

    function matchesSearch(text) {
        const search = searchInput.value;
        if (!search) return true;
        return caseInsensitive.checked
            ? text.toLowerCase().includes(search.toLowerCase())
            : text.includes(search);
    }

    function createTaskElement(task, listName, index) {
        const li = document.createElement("li");
        li.className = "task" + (task.done ? " done" : "");

        // Tekst zadania
        const textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = task.text;

        // Prawa strona (data + X)
        const rightSide = document.createElement("div");
        rightSide.className = "task-right";

        if (task.done) {
            const dateSpan = document.createElement("span");
            dateSpan.className = "date";
            dateSpan.textContent = task.date;
            rightSide.appendChild(dateSpan);
        }

        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.className = "delete";
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showModal(task.text, () => {
                lastDeleted = { ...task, listName, index };
                lists[listName].splice(index, 1);
                renderLists();
            });
        });

        rightSide.appendChild(delBtn);

        li.appendChild(textSpan);
        li.appendChild(rightSide);

        li.addEventListener("click", () => {
            task.done = !task.done;
            task.date = task.done ? new Date().toLocaleString() : "";
            renderLists();
        });

        return li;
    }

    function showModal(text, onConfirm) {
        const modal = document.getElementById("modal");
        const modalText = document.getElementById("modalText");
        const confirmBtn = document.getElementById("confirmDelete");
        const cancelBtn = document.getElementById("cancelDelete");

        modalText.textContent = `Czy na pewno chcesz usunąć zadanie o treści: "${text}"?`;
        modal.style.display = "flex";

        confirmBtn.onclick = () => {
            modal.style.display = "none";
            onConfirm();
        };
        cancelBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    addTaskBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        if (!text) return;

        selectedList = listSelector.value;
        lists[selectedList].push({ text, done: false, date: "" });
        taskInput.value = "";
        renderLists();
    });

    listSelector.addEventListener("change", (e) => {
        selectedList = e.target.value;
    });

    searchInput.addEventListener("input", renderLists);
    caseInsensitive.addEventListener("change", renderLists);

    // Cofanie usunięcia (Ctrl+Z)
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
          if (lastDeleted) {
            e.preventDefault(); // zapobiega cofaniu w inputach
      
            const { listName, index, ...taskData } = lastDeleted;
            lists[listName].splice(index, 0, {
              text: taskData.text,
              done: taskData.done,
              date: taskData.date
            });
      
            lastDeleted = null;
            renderLists();
          }
        }
      });
      

    // Dark mode przełącznik
    toggleDarkMode.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        updateDarkModeIcon();
    });

    function updateDarkModeIcon() {
        const isDark = document.body.classList.contains("dark");
        toggleDarkMode.textContent = isDark ? "☀️" : "🌙";
    }

    // Auto dark mode z systemu
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark");
    }

    updateDarkModeIcon();
    renderLists();
});
