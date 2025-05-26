import Genres from '../models/Genres.js';

export const getAll = async (req, res) => {
    try {
        const genres = await Genres.find().sort();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOne = async (req, res) => {
    try {
        const genres = await Genres.findById(req.params.id);
        if (!genres) {
            return res.status(404).json({ message: 'Genres not found' });
        }
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};