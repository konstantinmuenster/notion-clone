const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockSchema = new Schema(
  {
    tag: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    // creator: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Block", blockSchema);
