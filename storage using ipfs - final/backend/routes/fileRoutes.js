const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/fileController');
const { getAllFiles } = require('../controllers/fileController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const File = require('../models/File');
router.get('/admin/files', getAllFiles);
router.get('/admin/files', async (req, res) => {
  try {
    const files = await File.find({}, 'name size username createdAt');
    return res.json(files);
  } catch (error) {
    console.error('Error fetching files for admin:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/files/:username', fileController.getFilesByUsername);
router.delete('/admin/files/:fileId', async (req, res) => {
    try {
      const fileId = req.params.fileId;
      console.log('Deleting file with ID:', fileId);  // Log to check the file ID
  
      const deletedFile = await File.findByIdAndDelete(fileId);
  
      if (!deletedFile) {
        return res.status(404).send({ error: 'File not found' });
      }
  
      res.status(200).send({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).send({ error: 'Error deleting file' });
    }
  });
  
module.exports = router;

