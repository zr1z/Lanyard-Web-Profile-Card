import { useEffect, useState } from 'react';
import { LanyardData } from '../types/LanyardData';

const fetchId = "discordId";

export const useLanyardData = () => {
  const [userData, setUserData] = useState<LanyardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${fetchId}`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching Lanyard data:', error);
      }
    };

    fetchData();
  }, []);

  return userData;
};
