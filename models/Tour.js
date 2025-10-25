const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true },     // e.g., "Batch 1"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

const costPackageSchema = new mongoose.Schema({
    packageName: { type: String, required: true },
    price: { type: Number, required: true },
    kidsDiscount: { type: String, required: false },
    groupDiscount: { type: String, required: false },
});


const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    discount: { type: Number, required: false },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    image: { type: String, required: true },
    integralFaqs: { type: [faqSchema], default: [] },
    infoFaqs: { type: [faqSchema], default: [] },
    mainFaqs: { type: [faqSchema], default: [] },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    batches: { type: [batchSchema], default: [] },
    costPackages: { type: [costPackageSchema], default: [] },
    benefitHighlights: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tour", tourSchema);
