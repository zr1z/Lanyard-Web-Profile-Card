import React, { useEffect, useState } from 'react';
import './App.css';
import { useSpotifyProgress } from './hooks/useSpotifyProgress';
import { getStatusColor } from './functions/getStatusColor';
import { useTiltEffect } from './hooks/tiltEffect';
import { convertDiscordMarkdown } from './functions/convertDiscordMarkdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faTiktok, faTelegram, faInstagram, faDropbox } from '@fortawesome/free-brands-svg-icons';

const fetchId = '1143321328405971064';

const App: React.FC = () => {
  const [userData, setUserData] = useState<any | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [viewCount, setViewCount] = useState<number>(() => {
    const storedCount = localStorage.getItem('viewCount');
    return storedCount ? parseInt(storedCount, 10) : 0;
  });
  const { elementRef, handleMouseMove, handleMouseLeave } = useTiltEffect();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setViewCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem('viewCount', newCount.toString());
      return newCount;
    });
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${fetchId}`);
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching Lanyard data:', error);
      }
    };

    const fetchBio = async () => {
      try {
        const response = await fetch(`https://dcdn.dstn.to/profile/${fetchId}`);
        const data = await response.json();
        const rawBio = data.user_profile?.bio || data.user?.bio || null;
        setBio(rawBio ? convertDiscordMarkdown(rawBio) : null);
      } catch (error) {
        console.error('Error fetching bio:', error);
      }
    };

    fetchData();
    fetchBio();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const spotifyActivity = userData?.activities.find((activity: any) => activity.name === 'Spotify') || null;
  const nonSpotifyActivity = userData?.activities.find(
    (activity: any) => activity.name !== 'Spotify' && activity.id !== 'custom'
  ) || null;

  const startTimestamp = spotifyActivity?.timestamps?.start || 0;
  const endTimestamp = spotifyActivity?.timestamps?.end || 0;
  const progress = useSpotifyProgress(startTimestamp, endTimestamp);

  const formatTimestamp = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor(ms / 60000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getActivityImage = (image: string, applicationId: string) => {
    if (image?.startsWith('mp:external')) {
      return `https://media.discordapp.net/${image.replace('mp:', '')}`;
    }
    if (image) {
      return `https://cdn.discordapp.com/app-assets/${applicationId}/${image}.png`;
    }
    return `https://dcdn.dstn.to/app-icons/${applicationId}`;
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const avatarUrl = `https://cdn.discordapp.com/avatars/${userData.discord_user.id}/${userData.discord_user.avatar}.png`;

  return (
    <div className="app">
      <div className="theme-toggle" onClick={toggleTheme}>
        <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
      </div>
      <div className="background">
        <div
          className="profile-card"
          ref={elementRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="status-card">
            <div
              className="status-avatar-wrapper"
              title={`Status: ${userData.discord_status}`}
            >
              <img src={avatarUrl} alt="Status Avatar" className="status-avatar" />
              <span
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(userData.discord_status) }}
              ></span>
            </div>
            <div className="status-details">
              <p className="status-username">
                {userData.discord_user.username} <span className="status-icon"></span>
              </p>
            </div>
          </div>

          {bio && (
            <div className="bio-card">
              <p className="bio-label">Discord Bio:</p>
              <div dangerouslySetInnerHTML={{ __html: bio }}></div>
            </div>
          )}

          {spotifyActivity && (
            <div className="spotify-card">
              <img
                src={`https://i.scdn.co/image/${spotifyActivity.assets?.large_image.split(':')[1]}`}
                alt="Album Art"
                className="spotify-album-art"
              />
              <div className="spotify-details">
                <p className="spotify-song">{spotifyActivity.details}</p>
                <p className="spotify-artist">{spotifyActivity.state}</p>
                <div className="spotify-progress-bar">
                  <div
                    className="spotify-progress"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
                <div className="spotify-timestamps">
                  <span>{formatTimestamp(Date.now() - startTimestamp)}</span>
                  <span>{formatTimestamp(endTimestamp - startTimestamp)}</span>
                </div>
              </div>
            </div>
          )}

          {nonSpotifyActivity && (
            <div className="activity-card">
              <div className="activity-image-wrapper">
                <img
                  src={getActivityImage(
                    nonSpotifyActivity.assets?.large_image,
                    nonSpotifyActivity.application_id
                  )}
                  alt={nonSpotifyActivity.assets?.large_text || nonSpotifyActivity.name}
                  className="activity-large-image"
                />
                {nonSpotifyActivity.assets?.small_image && (
                  <img
                    src={getActivityImage(
                      nonSpotifyActivity.assets?.small_image,
                      nonSpotifyActivity.application_id
                    )}
                    alt={nonSpotifyActivity.assets?.small_text}
                    className="activity-small-image"
                  />
                )}
              </div>
              <div className="activity-details">
                <p className="activity-name">{nonSpotifyActivity.name}</p>
                <p className="activity-state">{nonSpotifyActivity.state}</p>
              </div>
            </div>
          )}

          <div className="social-icons">
            <FontAwesomeIcon icon={faTiktok} className="icon" />
            <FontAwesomeIcon icon={faTelegram} className="icon" />
            <FontAwesomeIcon icon={faDropbox} className="icon" />
            <FontAwesomeIcon icon={faInstagram} className="icon" />
          </div>
          <p className="views">👁️ {viewCount}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
