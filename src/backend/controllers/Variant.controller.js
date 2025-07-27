const variantService = require("../services/Variant.service");

exports.getAllVariants = async (req, res) => {
  try {
    const variants = await variantService.getAllVariants();    
    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVariantById = async (req, res) => {
  const { id } = req.params;
  try {
    const variant = await variantService.getVariantById(id);
    res.status(200).json(variant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
