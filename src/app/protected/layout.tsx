import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/Header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "sonner";


interface Props {
    children: React.ReactNode;
}

export default function layout({ children }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header />
                <div className="flex flex-col gap-4 p-4 pt-0 h-[calc(100vh-4rem)]">
                    {children}
                </div>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    )
}
