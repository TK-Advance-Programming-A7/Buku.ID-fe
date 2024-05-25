import { cookies } from "next/headers";

export default async function getUserLogin() {
  const cookieStore = cookies();

  if (cookieStore.get("token")) {
    const response = await fetch("http://localhost:8080/api/user/me")
    const user = await response.json();
    return user;
  } else {
    return null;
  }
}