// server/models/Record.js
const recordSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    payload: { type: Object },
    status: { type: String, default: 'queued' },
  }, { timestamps: true });
  