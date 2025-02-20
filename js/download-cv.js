let language = "en";

const messages = {
    en: {
        enterPassword: "<b style='color: red;'>Please, enter the password</b>",
        incorrectPassword: "<b style='color: red;'>Incorrect password</b>",
        errorLoading: "<b style='color: red;'>Error in the validation process</b>"
    },
    es: {
        enterPassword: "<b style='color: red;'>Por favor, ingrese la contraseña</b>",
        incorrectPassword: "<b style='color: red;'>Contraseña incorrecta</b>",
        errorLoading: "<b style='color: red;'>Error en el proceso de validación</b>"
    }
};

const cvPath = {
    en: {
        path: "docs/Juan_Mercado-en-cv.pdf"
    },
    es: {
        path: "../docs/Juan_Mercado-es-cv.pdf"
    }
};

$(document).ready(function () {
     // Se ajusta el idioma según la URL
     language = window.location.pathname.includes("/es/") ? "es" : "en";
});


// Función para mostrar el formulario flotante y bloquear el scroll
function showPasswordForm() {
    document.getElementById("overlay").style.display = "flex";
    document.body.style.overflow = "hidden"; // Bloquea el scroll
}

// Función para ocultar el formulario flotante y restaurar el scroll
function closePasswordForm() {
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = "auto"; // Restaura el scroll
    cleanMessages();
}

// Función para obtener el hash SHA-256
async function getHash(texto) {
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Función para limpiar los mensajes de error
function cleanMessages() {
    document.getElementById("mensaje-error").innerText = "";
    document.getElementById("password").value = "";
}

// Función para cargar el hash almacenado en config.json
async function getSavedHash() {    

    try {
        const response = await fetch("/config/settings.json");        
        const data = await response.json();
        return data.passwordHash;
    } catch (error) {
        console.error("Error loading settings.json:", error);
        return null;
    }
}

// Función para validar la contraseña y descargar el CV correcto
async function validatePassword() {
    const passwordEntered = document.getElementById("password").value;
    const errorMessage = document.getElementById("mensaje-error");

    cleanMessages(); // Borra mensajes previos

    if (!passwordEntered) {
        errorMessage.innerHTML = messages[language].enterPassword;
        return;
    }

    const enteredHash = await getHash(passwordEntered);
    const savedHash = await getSavedHash();

    if (!savedHash) {
        errorMessage.innerHTML = messages[language].errorLoading;
        return;
    }

    if (enteredHash === savedHash) {
        window.open(cvPath[language].path, "_blank");
    } else {
        errorMessage.innerHTML = messages[language].incorrectPassword;
    }
}

