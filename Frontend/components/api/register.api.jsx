// api.js
export const registerUser = async (formData) => {
    const dataToSend = new FormData();
    for (const key in formData) {
      dataToSend.append(key, formData[key]);
    }
  
    try {
      const response = await fetch("/api/v1/user/register", {
        method: "POST",
        body: dataToSend,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, message: data.message || "Failed registration" };
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return { success: false, message: "Error occurred during registration" };
    }
  };
  