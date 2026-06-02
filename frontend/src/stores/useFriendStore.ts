import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFriendStore = create<FriendState>()(
    persist(
        (set, get) => ({
            loading: false,
            searchUserByUsername: async (username) => {
                try {
                    set({ loading: true });
                    const user = await friendService.searchUserByUsername(username);
                    return user;
                } catch (error) {
                    console.error("Error when searchUserByUsername:", error);
                    return null;
                } finally {
                    set({ loading: false });
                }
            },
            addFriend: async (to, message) => {
                try {
                    set({ loading: true });
                    const ResultMessage = await friendService.sendFriendRequest(to, message);
                    return ResultMessage;
                } catch (error) {
                    console.error("Error when addFriend:", error);
                    return "Lỗi khi gửi yêu cần kết bạn";
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'friend-storage',
            partialize: (state) => ({ loading: state.loading }),
        }
    )
)