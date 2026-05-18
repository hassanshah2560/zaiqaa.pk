const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const auth = require('../middleware/auth');

// Get all restaurants with filters
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, rating, minPrice, maxPrice } = req.query;

    let query = supabase
      .from('restaurants')
      .select('*, menu_items(count)');

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (cuisine) {
      query = query.eq('cuisine', cuisine);
    }

    if (rating) {
      query = query.gte('average_rating', parseFloat(rating));
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get restaurant details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (restaurantError) throw restaurantError;

    const { data: menu, error: menuError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', id);

    if (menuError) throw menuError;

    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select('*')
      .eq('restaurant_id', id);

    if (ratingsError) throw ratingsError;

    res.json({
      success: true,
      restaurant,
      menu,
      ratings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create restaurant (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, cuisine, address, phone, image_url, delivery_time } = req.body;

    const { data, error } = await supabase
      .from('restaurants')
      .insert({
        owner_id: req.user.id,
        name,
        description,
        cuisine,
        address,
        phone,
        image_url,
        delivery_time: parseInt(delivery_time),
        average_rating: 0,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update restaurant
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user owns this restaurant
    const { data: restaurant, error: checkError } = await supabase
      .from('restaurants')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (checkError || restaurant.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
