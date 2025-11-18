import { create } from "zustand"
import { toast } from 'sonner'
import { authService } from "@/services/authService"
import type { AuthState } from "@/types/store"
export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,
    setAccessToken: (accessToken) => {
        set({ accessToken })
    },
    clearState: () => {
        set({ accessToken: null, user: null, loading: false })
    },
    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true })
            // gọi API
            await authService.signUp(username, password, email, firstName, lastName)
            toast.success("Đăng ký thành công")

        } catch (error) {
            console.log(error);
            toast.error("Đăng ký thất bại")
        } finally {
            set({ loading: false })
        }
    },
    signIn: async (username, password) => {
        try {
            set({ loading: true });
            // gọi API
            const { accessToken } = await authService.signIn(username, password);
            
            get().setAccessToken(accessToken);
            await get().fetchMe();

            toast.success("Đăng nhập thành công 🎇 ")
        } catch (error) {
            console.log(error);
            toast.error("Đăng nhập thất bại")
        } finally {
            set({ loading: false })
        }
    },
    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success("Đăng xuất thành công")
        } catch (error) {
            console.log(error);
            toast.error("Đăng xuất thất bại")
        } finally {
            set({ loading: false })
        }
    },
    fetchMe: async () => {
        try {
            set({ loading: true })
            const user = await authService.fetchMe()
            set({ user })
        } catch (error) {
            console.log(error);
            set({ user: null, accessToken: null });
            toast.error("Lấy thông tin người dùng thất bại")
        } finally {
            set({ loading: false })
        }
    },
    refresh: async () => {
        try {
            set({ loading: true })
            const {user, fetchMe, setAccessToken} = get()
            const accessToken = await authService.refresh()
            setAccessToken(accessToken)
            if(!user){
                await fetchMe()
            }
        } catch (error) {
            console.log(error);
            get().clearState();
            toast.error("Phiên đăng nhập hết hạn vui lòng đăng nhập lại")
        } finally {
            set({ loading: false })
        }
    }
}))