const express = require('express');
const protect = require('../middleware/authMiddleware');
const { postProperty, updateProperty, markAsSold, deleteProperty, getAllProperties, getPropertyByType, getPropertyById } = require('../controllers/propertyControllers');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/post', protect, upload.single('image'), postProperty);
router.put('/update/:id', protect, updateProperty);
router.put('/sold/:id', protect, markAsSold);
router.delete('/delete/:id', protect, deleteProperty);
router.get('/all', getAllProperties);
router.get('/type/:type', getPropertyByType);
router.get('/:id', getPropertyById);


module.exports = router;
