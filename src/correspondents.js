import {
  validateEmail,
  removeAllOptions,
  addFirstOption,
  removeAccents,
  configureOnlyNumbersInput,
} from "./shared/utils.js";

import { inputEvent } from "./shared/date-format.js";
import { getDepartments, getCities } from "./services/location.service.js";

const inputPhoneNumber = document.getElementById("phone_number");
const inputTransactionDate = document.getElementById("transaction_date");
const selectDepartment = document.getElementById("department");
const selectCity = document.getElementById("city");
const inputEmail = document.getElementById("email");
const inputDocumentNumber = document.getElementById("document_number");
const inputCorrespondentCode = document.getElementById("correspondent_code");
const inputChargedAmount = document.getElementById("charged_amount");
const inputTransactionAmount = document.getElementById("transaction_amount");
const inputTextFields = document.querySelectorAll(".input_text");

/**
 * Normaliza textos eliminando tildes, ñ y comas.
 *
 * @param {Event} event
 * @returns {void}
 */
const handleNormalizeInput = (event) => {
  event.target.value = removeAccents(event.target.value);
};

/**
 * Configura validaciones de inputs del formulario.
 *
 * @returns {void}
 */
const validateInputs = () => {
  configureOnlyNumbersInput({
    input: inputPhoneNumber,
    maxLength: 10,
  });

  configureOnlyNumbersInput({
    input: inputDocumentNumber,
    maxLength: 15,
  });

  configureOnlyNumbersInput({
    input: inputCorrespondentCode,
    maxLength: 6,
  });

  configureOnlyNumbersInput({
    input: inputChargedAmount,
    maxLength: 4,
  });

  configureOnlyNumbersInput({
    input: inputTransactionAmount,
    maxLength: 100,
  });

  if (inputTransactionDate) {
    inputTransactionDate.oninput = inputEvent;
  }

  if (inputEmail) {
    inputEmail.oninput = validateEmail;
  }
};

/**
 * Configura normalización de campos de texto.
 *
 * @returns {void}
 */
const normalizeTextInputs = () => {
  inputTextFields.forEach((input) => {
    input.addEventListener("input", handleNormalizeInput);
  });
};

/**
 * Carga departamentos en el select.
 *
 * @returns {Promise<void>}
 */
const loadDepartments = async () => {
  if (!selectDepartment) return;

  const { deparments } = await getDepartments();

  addFirstOption("Seleccione el departamento", selectDepartment);

  deparments.forEach((department) => {
    const option = document.createElement("option");

    option.value = department.id;
    option.setAttribute("key", department.key);
    option.innerHTML = department.label;

    selectDepartment.appendChild(option);
  });
};

/**
 * Carga ciudades según el departamento seleccionado.
 *
 * @param {string} departmentKey
 * @returns {Promise<void>}
 */
const loadCities = async (departmentKey) => {
  if (!selectCity || !departmentKey) return;

  removeAllOptions(selectCity);
  addFirstOption("Seleccione la ciudad", selectCity);

  const cities = await getCities(departmentKey);

  cities.forEach((city) => {
    const option = document.createElement("option");

    option.value = city.id;
    option.innerHTML = city.label;

    selectCity.appendChild(option);
  });
};

/**
 * Maneja el cambio de departamento.
 *
 * @returns {Promise<void>}
 */
const handleChangeDepartment = async () => {
  if (!selectDepartment) return;

  const selectedOption = selectDepartment.options[selectDepartment.selectedIndex];
  const departmentKey = selectedOption?.getAttribute("key");

  await loadCities(departmentKey);
};

/**
 * Inicializa el formulario.
 *
 * @returns {Promise<void>}
 */
const main = async () => {
  validateInputs();
  normalizeTextInputs();

  await loadDepartments();

  if (selectCity) {
    addFirstOption("Seleccione la ciudad", selectCity);
  }

  selectDepartment?.addEventListener("change", handleChangeDepartment);
};

main();