import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  anonymous: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true
  },
  logo: {
    type: String,
    default: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  coverImage: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    required: [true, 'About description is required']
  },
  website: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    required: [true, 'Industry type is required']
  },
  size: {
    type: String,
    default: '1-10 employees'
  },
  foundedYear: {
    type: Number
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  reviews: [reviewSchema],
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }]
}, { timestamps: true });

// Virtual to calculate average rating
companySchema.virtual('averageRating').get(function () {
  if (this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  return (total / this.reviews.length).toFixed(1);
});

companySchema.set('toJSON', { virtuals: true });
companySchema.set('toObject', { virtuals: true });

const Company = mongoose.model('Company', companySchema);
export default Company;
