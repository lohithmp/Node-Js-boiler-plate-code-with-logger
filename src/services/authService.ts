import User, { IUser } from '../models/User';
import { generateToken } from '../utils/authValidation';

export class AuthService {
  public async register(username: string, password: string): Promise<{ message: string } | { error: string }> {
    try {
      const user = new User({ username, password });
      await user.save();
      return { message: 'User registered successfully' };
    } catch (error) {
      return { error: 'Registration failed' };
    }
  }

  public async login(username: string, password: string): Promise<{ token?: string; error?: string; user?: IUser }> {
    try {
      const user = await User.findOne({ username });
      console.log({ user });

      if (!user || !(await user.comparePassword(password))) {
        return { error: 'Invalid credentials' };
      }

      const token = generateToken(user._id.toString());
      console.log({ token });

      return { token, user };
    } catch (error) {
      return { error: 'Login failed' };
    }
  }

  public async getUserById(id: string): Promise<{ user?: IUser | null; error?: string; }> {
    try {
      const user = await User.findById(id);
      if (!user) {
        return { error: 'User not found'};
      }
      return { user };
    } catch (error) {
      return { error: 'Failed to Fetch user' }
    }
  }
}

export default new AuthService();
