import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendError, sendSuccess } from '../utils/response.js';

const buildUserResponse = (user) => ({
  user: user.toJSON(),
  token: generateToken(user._id),
});

export const register = async (req, res, next) => {
  try {
    const { name, nome, email, password, passwordHash, gender, age, skinType, tipoPele, goals = [], objetivos = [], idioma, assinatura } =
      req.body;
    const finalName = nome || name;
    const finalPassword = passwordHash || password;
    const finalGoals = objetivos.length ? objetivos : goals;
    const finalSkinType = tipoPele || skinType;
    if (!finalName || !email || !finalPassword) {
      return sendError(res, 400, 'Nome, email e palavra-passe são obrigatórios.');
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 409, 'Já existe uma conta com este email.');
    }

    const hashed = await bcrypt.hash(finalPassword, 10);
    const user = await User.create({
      name: finalName,
      email,
      password: hashed,
      gender,
      age,
      skinType: finalSkinType,
      goals: finalGoals,
      language: idioma,
      subscription: assinatura,
    });

    return sendSuccess(res, buildUserResponse(user), 'Registo concluído com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email e palavra-passe são obrigatórios.');
    }
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401, 'Credenciais inválidas.');
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return sendError(res, 401, 'Credenciais inválidas.');
    }

    return sendSuccess(res, buildUserResponse(user), 'Bem-vinda de volta ao GlowTrack.');
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req, res) => {
  return sendSuccess(res, { success: true }, 'Sessão terminada.');
};
