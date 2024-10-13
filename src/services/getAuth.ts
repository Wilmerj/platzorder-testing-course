const host = "http://localhost:3000";
const path = "/auth/";

export const getAuth = async (email: string, password: string) => {
  try {
    const response = await fetch(
      `${host}${path}?email=${email}&password=${password}`
    );
    const data = await response.json();
    if(data?.length === 0) {
        throw new Error("Invalid username or password");
    }
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
