import Work from "../models/Work.js";

export const getAll = async (req, res) => {
    try {
        const work = await Work.find().sort();
        res.status(200).json(work);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOne = async (req, res) => {
    try {
        const work = await Work.findById(req.params.id);
        if (!work) {
            return res.status(404).json({ message: 'Work not found' });
        }
        res.status(200).json(work);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};