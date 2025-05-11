import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        const user = await registerUser(email, password, name);
        res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
        res.status(400).json({ error: "Registration failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const { token, user } = await loginUser(email, password);
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(401).json({ error: "Invalid credentials" });
    }
};
