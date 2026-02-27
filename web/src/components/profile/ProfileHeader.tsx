"use client";

import { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Mail, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileHeader() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Profile state - initialized with Firebase user data
    const [profile, setProfile] = useState({
        name: user?.displayName || 'User',
        email: user?.email || 'user@example.com',
        phone: '+91 98765 43210',
        role: 'Senior Farmer',
        location: 'Pune, Maharashtra',
        memberSince: '2022'
    });

    // Update profile when user data changes
    useEffect(() => {
        if (user) {
            setProfile(prev => ({
                ...prev,
                name: user.displayName || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user]);


    // Temporary state for editing
    const [editForm, setEditForm] = useState(profile);

    const handleEditClick = () => {
        setEditForm(profile);
        setIsEditing(true);
    };

    const handleSave = () => {
        setProfile(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm(profile);
        setIsEditing(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl p-8"
            >
                {/* Glow effect */}
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-accent-green/10 blur-[100px] pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center shadow-xl shadow-accent-green/20">
                            <User className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-emerald-500 border-4 border-black flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                                <p className="text-gray-400 text-sm mb-3">{t('profile.subtitle')}</p>
                            </div>

                            {/* Edit Button */}
                            <motion.button
                                onClick={handleEditClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-2.5 rounded-xl bg-accent-green/10 hover:bg-accent-green/20 border border-accent-green/30 text-accent-green text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-accent-green/10"
                            >
                                <User className="w-4 h-4" />
                                {t('profile.edit')}
                            </motion.button>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-300">
                                <User className="w-4 h-4 text-accent-green" />
                                <span>{profile.role}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-300">
                                <MapPin className="w-4 h-4 text-accent-green" />
                                <span>{profile.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-300">
                                <Mail className="w-4 h-4 text-accent-green" />
                                <span>{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-300">
                                <Phone className="w-4 h-4 text-accent-green" />
                                <span>{profile.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-300">
                                <Calendar className="w-4 h-4 text-accent-green" />
                                <span>{t('app.member_since')} {profile.memberSince}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleCancel}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 max-w-md w-full relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleCancel}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent-green/50 transition-colors"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent-green/50 transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent-green/50 transition-colors"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-3 rounded-xl bg-accent-green hover:bg-accent-green/90 text-black font-semibold transition-colors shadow-lg shadow-accent-green/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
