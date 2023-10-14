const CATEGORY = {
  TECHNOLOGY: "technology",
  SCIENCE: "science",
  FINANCE: "finance",
  SOCIETY: "society",
  ENTERTAINMENT: "entertainment",
  HEALTH: "health",
  HISTORY: "history"
}

const CATEGORY_DETAILS = [
  { name: CATEGORY.TECHNOLOGY, color: "#3b82f6" },
  { name: CATEGORY.SCIENCE, color: "#16a34a" },
  { name: CATEGORY.FINANCE, color: "#ef4444" },
  { name: CATEGORY.SOCIETY, color: "#eab308" },
  { name: CATEGORY.ENTERTAINMENT, color: "#db2777" },
  { name: CATEGORY.HEALTH, color: "#14b8a6" },
  { name: CATEGORY.HISTORY, color: "#f97316" }
];

const CATEGORY_LIST = CATEGORY_DETAILS.map(category => category.name);

let factData = [];

// Selecting DOM elements
const btnFactToggle = document.querySelector(".btn-open");
const formContainer = document.querySelector(".form-container");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");
const btnAll = document.querySelector("#btn-all");
const btnPost = document.querySelector("#btn-post");
const categoryButtonList = document.querySelector("#category-btn-list");
const categoryOptionList = document.querySelector("#category-option-list");
const errorMsg = document.querySelector("#form-error-msg");

// Create DOM elements
factsList.innerHTML = "";
categoryButtonList.innerHTML = "";
categoryOptionList.innerHTML = "";
errorMsg.innerHTML = "";

createCategoryButtons();
createCategoryOptions();
// Load data from Supabase
loadFacts();

function createCategoryButtons() {
  const htmlArr = CATEGORY_DETAILS.map(category =>
      `<li class="category">
        <button
            class="btn btn-category"
            style="background-color: ${category.color}"
            id="btn-${category.name}"
        >
          ${category.name.toUpperCase()}
        </button>
      </li>`
  );
  categoryButtonList.innerHTML = htmlArr.join("");
}

function createCategoryOptions() {
  const placeHolder = `<option disabled selected>Choose category:</option>`
  const htmlArr = CATEGORY_LIST.map(category =>
      `<option value="${category}">${convertToSentenceCase(category)}</option>`
  );
  categoryOptionList.innerHTML = placeHolder + htmlArr.join("");
}

function convertToSentenceCase(word) {
  return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
}

async function loadFacts() {
  const res = await fetch(
    "https://hwtkikrqvnsrrpkjrytv.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dGtpa3Jxdm5zcnJwa2pyeXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg3NTk3ODUsImV4cCI6MTk4NDMzNTc4NX0.l_PGJRds8Lmg17Pn7eqNwFqYWH4rST2gVlTeGCfKTjk",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dGtpa3Jxdm5zcnJwa2pyeXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg3NTk3ODUsImV4cCI6MTk4NDMzNTc4NX0.l_PGJRds8Lmg17Pn7eqNwFqYWH4rST2gVlTeGCfKTjk",
      },
    }
  );
  factData = await res.json();

  createFactsList(factData);
}

function createFactsList(dataArray, filterCategory) {
  if(CATEGORY_LIST.includes(filterCategory)) {
    dataArray = dataArray.filter(item => item.category === filterCategory)
  }

  const htmlArr = dataArray.map(
    (fact) => `<li class="fact">
    <p>
    ${fact.text}
      <a
        class="source"
        href="${fact.source}"
        target="_blank"
      >(Source)</a>
    </p>
    <span class="tag" style="background-color: ${
      CATEGORY_DETAILS.find((cat) => cat.name === fact.category).color
    }">${fact.category}</span>
  </li>`
  );
  factsList.innerHTML = htmlArr.join("");
}

function isFormValid(title, link, category) {
  validateForm(title, link, category);
  return errorMsg.innerHTML === ""
}

function validateForm(title, link, category) {
  if(title === "") errorMsg.innerHTML = "Title is empty !"
  else if(title.length > 200) errorMsg.innerHTML = "Title too lengthy !"
  else if(link === "") errorMsg.innerHTML = "Link is empty !"
  else if(!CATEGORY_LIST.includes(category)) errorMsg.innerHTML = "Choose suitable category !"
  else errorMsg.innerHTML = ""
}

// Toggle form visibility
btnFactToggle.addEventListener("click", function () {
  if (formContainer.classList.contains("hidden")) {
    formContainer.classList.remove("hidden");
    btnFactToggle.textContent = "Close";
  } else {
    form.reset();
    formContainer.classList.add("hidden");
    btnFactToggle.textContent = "Share a fact";
  }
});

btnAll.addEventListener("click", function () {
  createFactsList(factData, "all");
})

btnPost.addEventListener("click", function (event) {
  event.preventDefault();

  const title = form.elements['fact-title'].value;
  const link = form.elements['fact-link'].value;
  const category = form.elements['category-option-list'].value;

  if(isFormValid(title, link, category)) {
    const newFact = {
      id: factData.length + 1,
      created_at: new Date(window.performance.timeOrigin).toISOString(),
      text: title,
      source: link,
      category: category,
      votesInteresting: 0,
      votesMindblowing: 0,
      votesFalse: 0
    }

    factData.push(newFact);
    createFactsList(factData);
    form.reset();
  }
})

CATEGORY_LIST.map(category => {
  document.querySelector("#btn-" + category)
      ?.addEventListener("click", function() {
        createFactsList(factData, category);
      });
})