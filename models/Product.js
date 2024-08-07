import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  categories: {
    type: Array
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  }
});

export default mongoose.model('Product', ProductSchema);
