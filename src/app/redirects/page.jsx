import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Redirect() {
    const session = await getServerSession(authOptions)    

    const user = session?.user

    const role = user?.role

    switch (role) {
        case "admin":
            redirect("/admin/dasboard")
            break;

        case "siswa":
            redirect("/user/home")
            break;
            
        default:
            redirect("/auth/Login")
            break;
    }

    return null
}