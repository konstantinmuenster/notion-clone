const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageSchema = new Schema(
  {
    blocks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Block",
        require: true,
      },
    ],
    // creator: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
