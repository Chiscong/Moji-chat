import api from "@/lib/axios";
export const friendService = {
  async searchUserByUsername(username: string) {
    const res = await api.get(`/users/search?username=${username}`);
    return res.data.user;
  },
  async sendFriendRequest(to: string, message: string) {
    const res = await api.post("/friends/requests", { to, message });
    return res.data.message;
  },
  async getFriendRequest() {
    const res = await api.get("/friends/requests");
    return res.data.sent, res.data.received;
  },
  async getFriends() {
    const res = await api.get("/friends");
    return res.data.friends;
  }
}