import mongoose from "mongoose";
import Lead from "../models/leadModel.js ";

export const createLeads = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, company, city, state, source, status, score, lead_value,is_qualified } = req.body;

        if (!first_name || !last_name || !email) return res.status(400).json({ error: "first name or lastname or email is missing" });

        const exist = Lead.findOne({ email });
        if (!exist) return res.status(400).json({ message: "Lead Already Exist" });


        const newLead = new Lead({ first_name, last_name, email, phone, company, city, state, source, status, score, lead_value, is_qualified, last_activity_at: new Date() });

        const savedLead = await newLead.save();

        res.status(201).json({
            message: "Lead Creation done",
            lead: savedLead
        })
    }
    catch (err) {
        console.error("Error creating Lead", error);
        res.status(500).json({ error: "Server error while creating lead" });
    }
};




export const getLeads = async (req, res) => {
    try {
        let { page, limit, status, source, created_from, created_to } = req.query;

        page = Number(page) || 1;
        limit = Number(limit) || 20;

        const filter = {};
        if (status) filter.status = status;
        if (source) filter.source = source;

        //  if(created_at) filter.created_at = {$gte : new Date(created_at)};
        //  if(updated_at)filter.updated_at = {$gte : new Date(updated_at)};

        if (created_from || created_to) {
            const range = {};
            if (created_from) {
                const d = new Date(created_from);
                if (!Number.isNaN(d.getTime())) range.$gte = d;
            }
            if (created_to) {
                const d = new Date(created_to);
                if (!Number.isNaN(d.getTime())) range.$lte = d;
            }
            if (Object.keys(range).length) filter.created_at = range;
        }

        const leads = await Lead.find(filter).skip((page - 1) * limit).limit(limit);

        const total = await Lead.countDocuments(filter);

        res.json({
            data: leads,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        });

    }
    catch (error) {
        res.status(500).json({ error: err.message });
    }
}

export const getLeadById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid lead id" });
        }

        const lead = await Lead.findById(id);
        if (!lead) return res.status(404).json({ error: "Lead not found" });

        res.json({ lead });
    } catch (err) {
        console.error("Error getting lead by id", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid lead id" });
        }

        const deleted = await Lead.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ error: "Lead not found" });

        res.json({ message: "Lead deleted", leadId: id });
    } catch (err) {
        console.error("Error deleting lead", err);
        res.status(500).json({ error: "Server error" });
    }
};


export const updateLead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid lead id" });
        }

        const updatable = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "company",
            "city",
            "state",
            "source",
            "status",
            "score",
            "lead_value",
            "is_qualified",
            "last_activity_at",
        ];

        const updateBody = {};
        updatable.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                updateBody[key] = req.body[key];
            }
        });

        const updated = await Lead.findByIdAndUpdate(id, updateBody, {
            new: true,
            runValidators: true,
        });

        if (!updated) return res.status(404).json({ error: "Lead not found" });

        res.json({ message: "Lead updated", lead: updated });
    } catch (err) {
        console.error("Error updating lead", err);
        res.status(500).json({ error: "Server error" });
    }
};