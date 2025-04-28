import axios from 'axios';

export class AuthService {
  private authServiceUrl: string;

  constructor() {
    this.authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3000/api/v1/auth';
  }

  async getUserById(userId: string, access_token: string): Promise<any> {
    const response = await axios.get(`${this.authServiceUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch user with ID ${userId}`);
    }

    return response.data;
  }
}
