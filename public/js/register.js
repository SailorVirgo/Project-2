const registerFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  console.log("Sending data:", { username, email, password }); // Log data before sending

  if (username && email && password) {
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        document.location.replace("/");
      } else {
        const result = await response.json();
        alert(`Failed to register: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error); // Log any fetch errors
    }
  } else {
    alert("All fields are required.");
  }
};

document
  .querySelector(".register-form")
  .addEventListener("submit", registerFormHandler);
