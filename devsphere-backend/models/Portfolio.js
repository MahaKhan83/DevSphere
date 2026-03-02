const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true, unique: true },

    // store full builder state
    sections: { type: Array, default: [] },
    profile: { type: Object, default: {} },
    theme: { type: Object, default: {} },

    sidebarOpen: { type: Boolean, default: true },
    editMode: { type: Boolean, default: true },

    palettePosition: { type: Object, default: { x: 110, y: 120 } },
    customizationPosition: { type: Object, default: { x: 450, y: 120 } },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", PortfolioSchema);