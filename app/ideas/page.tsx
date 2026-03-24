import { redirect } from "next/navigation";

export const metadata = {
  title: "Businesses · C26Hub",
  description: "Redirecting to businesses",
};

export default function IdeasPage() {
  redirect("/businesses");
}
