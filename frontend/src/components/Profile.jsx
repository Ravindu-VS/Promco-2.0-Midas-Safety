import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import './Profile.css';
import { usersApi, formatDateTime } from '../services/api';
import { errorMessage, getCurrentUser, setCurrentUser } from '../services/authService';

const getInitials = (name = '') =>
    name
        .split(/[\s_.-]+/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .join('')
        .slice(0, 2) || 'U';

const EDITABLE = ['username', 'telephone', 'address', 'dateOfBirth'];

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const me = getCurrentUser();
    // Admins/managers can open someone else's profile from User Management (read-only here)
    const viewedId = location.state?.user?.id ?? me?.id;
    const isOwnProfile = String(viewedId) === String(me?.id);

    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [picture, setPicture] = useState(null);
    const [passwords, setPasswords] = useState({ currentPassword: '', password: '', confirm: '' });
    const [status, setStatus] = useState(null);
    const [loadError, setLoadError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setStatus(null);
        usersApi.get(viewedId)
            .then((u) => {
                if (cancelled) return;
                setUser(u);
                setForm(Object.fromEntries(EDITABLE.map((k) => [k, u[k] ?? ''])));
                setPicture(null);
                if (isOwnProfile) setCurrentUser(u);
            })
            .catch((e) => !cancelled && setLoadError(errorMessage(e, 'Could not load the profile')));
        return () => {
            cancelled = true;
        };
    }, [viewedId, isOwnProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setStatus(null);
    };

    const handlePicture = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setStatus({ severity: 'error', message: 'Please choose an image file.' });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setStatus({ severity: 'error', message: 'Please choose an image smaller than 2 MB.' });
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPicture(reader.result);
            setStatus({ severity: 'info', message: 'Picture selected – click "Save Changes" to upload it.' });
        };
        reader.readAsDataURL(file);
    };

    const save = async () => {
        if (!form.username?.trim()) {
            setStatus({ severity: 'error', message: 'Username cannot be empty.' });
            return;
        }
        if (passwords.password && passwords.password !== passwords.confirm) {
            setStatus({ severity: 'error', message: 'The new passwords do not match.' });
            return;
        }
        const payload = { ...form };
        if (picture) payload.profilePicture = picture;
        if (passwords.password) {
            payload.password = passwords.password;
            payload.currentPassword = passwords.currentPassword;
        }
        setSaving(true);
        try {
            const saved = await usersApi.update(user.id, payload);
            setUser(saved);
            setCurrentUser(saved);
            setPicture(null);
            setPasswords({ currentPassword: '', password: '', confirm: '' });
            setStatus({ severity: 'success', message: 'Profile saved.' });
        } catch (e) {
            setStatus({ severity: 'error', message: errorMessage(e, 'Could not save the profile') });
        } finally {
            setSaving(false);
        }
    };

    const removePicture = async () => {
        try {
            const saved = await usersApi.update(user.id, { profilePicture: '' });
            setUser(saved);
            setCurrentUser(saved);
            setPicture(null);
            setStatus({ severity: 'success', message: 'Profile picture removed.' });
        } catch (e) {
            setStatus({ severity: 'error', message: errorMessage(e, 'Could not remove the picture') });
        }
    };

    if (loadError) {
        return (
            <div className="profile-container">
                <h2 className="page-title">User Profile</h2>
                <Alert severity="error">{loadError}</Alert>
            </div>
        );
    }
    if (!user) {
        return <div className="profile-container"><h2 className="page-title">User Profile</h2><p className="text-center">Loading…</p></div>;
    }

    const shownPicture = picture || user.profilePicture;
    const row = (label, name, { type = 'text', editable = isOwnProfile } = {}) => (
        <tr key={name}>
            <td>{label}</td>
            <td>
                {editable ? (
                    <input type={type} name={name} value={form[name] ?? ''} onChange={handleInputChange} className="profile-input" />
                ) : (
                    <span className="profile-value">{(EDITABLE.includes(name) ? form[name] : user[name]) || '—'}</span>
                )}
            </td>
        </tr>
    );

    return (
        <div className="profile-container">
            <h2 className="page-title">{isOwnProfile ? 'My Profile' : 'User Profile'}</h2>

            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-picture-section">
                        {shownPicture ? (
                            <img src={shownPicture} alt="User profile" className="profile-picture" />
                        ) : (
                            <div className="profile-picture profile-initials-large" aria-label="No profile picture">
                                {getInitials(user.username)}
                            </div>
                        )}
                        {isOwnProfile && (
                            <div className="upload-section">
                                <label className="upload-label" htmlFor="profile-picture">Change Picture</label>
                                <input type="file" id="profile-picture" accept="image/*" onChange={handlePicture} className="upload-input" />
                                {user.profilePicture && !picture && (
                                    <button type="button" className="link-button" onClick={removePicture}>Remove picture</button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="profile-name-section">
                        <h3>{user.username}</h3>
                        <p className="capitalize">{user.role}</p>
                    </div>
                </div>

                <div className="profile-form">
                    <table>
                        <tbody>
                            {row('User ID', 'id', { editable: false })}
                            {row('Username', 'username')}
                            {row('Email', 'email', { editable: false })}
                            {row('Role', 'role', { editable: false })}
                            {row('Telephone', 'telephone', { type: 'tel' })}
                            {row('Address', 'address')}
                            {row('Date of Birth', 'dateOfBirth', { type: 'date' })}
                            <tr>
                                <td>Member since</td>
                                <td><span className="profile-value">{formatDateTime(user.createdAt)}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {isOwnProfile && (
                    <div className="profile-form">
                        <h4 className="profile-subheading">Change password (optional)</h4>
                        <table>
                            <tbody>
                                {[['Current password', 'currentPassword'], ['New password', 'password'], ['Confirm new password', 'confirm']].map(([label, name]) => (
                                    <tr key={name}>
                                        <td>{label}</td>
                                        <td>
                                            <input type="password" className="profile-input" value={passwords[name]}
                                                autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
                                                onChange={(e) => setPasswords((prev) => ({ ...prev, [name]: e.target.value }))} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {status && <Alert severity={status.severity} sx={{ mt: 2 }}>{status.message}</Alert>}

                {isOwnProfile ? (
                    <button onClick={save} className="save-button" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                ) : (
                    <button onClick={() => navigate(-1)} className="save-button">Back</button>
                )}
            </div>
        </div>
    );
};

export default Profile;
