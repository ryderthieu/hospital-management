import { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { fetchUserProfile, updateUserProfile } from './services';

export const useAccountInfo = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfile();
        setProfile(data);
        setOriginalProfile(data);
        setError(null);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const updatedProfile = await updateUserProfile(profile);
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
  };

  return {
    profile,
    loading,
    error,
    handleChange,
    handleSave,
    handleCancel
  };
};