const API_BASE_URL = 'http://localhost:3001/api';

export const chatService = {
  async getMessages() {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async sendMessage(content) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          sender: 'user'
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};