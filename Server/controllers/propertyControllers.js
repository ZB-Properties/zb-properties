const pool = require('../models/propertyModel');
const cloudinary = require('../config/cloudinary');

exports.postProperty = async (req, res) => {
  const { title, description, price, location, type } = req.body;
  const owner_id = req.user.id;
  const imageUrl = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : null;

  try {
    await pool.query(
      'INSERT INTO properties (title, description, price, location, type, image_url, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [title, description, price, location, type, imageUrl, owner_id]
    );
    res.json({ message: "Property posted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message }); 
  }
};

exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, type, status } = req.body;
  const owner_id = req.user.id;

  try {
    const result = await pool.query('SELECT owner_id FROM properties WHERE id = $1', [id]);

    if (!result.rows.length || result.rows[0].owner_id !== owner_id) {
      return res.status(403).json({ message: "Not authorized to update this property" });
    }

    await pool.query(
      'UPDATE properties SET title=$1, description=$2, price=$3, location=$4, type=$5, status=$6 WHERE id=$7',
      [title, description, price, location, type, status, id]
    );

    res.json({ message: "Property updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsSold = async (req, res) => {
  const { id } = req.params;
  const owner_id = req.user.id;

  try {
    const result = await pool.query('SELECT owner_id FROM properties WHERE id = $1', [id]);

    if (!result.rows.length || result.rows[0].owner_id !== owner_id) {
      return res.status(403).json({ message: "Not authorized to mark as sold" });
    }

    await pool.query('UPDATE properties SET status=$1 WHERE id=$2', ['sold', id]);

    res.json({ message: "Property marked as sold" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  const owner_id = req.user.id;

  try {
    const result = await pool.query('SELECT owner_id FROM properties WHERE id = $1', [id]);

    if (!result.rows.length || result.rows[0].owner_id !== owner_id) {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    await pool.query('DELETE FROM properties WHERE id=$1', [id]);

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropertyByType = async (req, res) => {
  const { type } = req.params;

  try {
    const result = await pool.query('SELECT * FROM properties WHERE type = $1', [type]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);

    if (!result.rows.length) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
