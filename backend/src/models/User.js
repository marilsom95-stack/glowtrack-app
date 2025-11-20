import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, alias: 'nome' },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, alias: 'passwordHash' },
    gender: { type: String },
    age: { type: Number },
    skinType: { type: String, default: 'normal', alias: 'tipoPele' },
    goals: [{ type: String, alias: 'objetivos' }],
    language: { type: String, default: 'pt', alias: 'idioma' },
    subscription: { type: String, default: 'free', alias: 'assinatura' },
    createdAtApp: { type: Date, default: Date.now, alias: 'dataCriacao' },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default model('User', userSchema);
